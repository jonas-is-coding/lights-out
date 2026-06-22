"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, useGLTF } from "@react-three/drei";
import { Suspense, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const MODEL_CAR = "/models/f1-2022.glb";

useGLTF.preload(MODEL_CAR);

// Target world-space length of the car after normalization
const TARGET_LENGTH = 4.2;

function makeSpeedlinePositions() {
  const arr = new Float32Array(900 * 3);
  for (let i = 0; i < 900; i++) {
    arr[i * 3] = (Math.random() - 0.5) * 16;
    arr[i * 3 + 1] = Math.random() * 4 + 0.05;
    arr[i * 3 + 2] = (Math.random() - 0.5) * 22;
  }
  return arr;
}

function NormalizedCar() {
  const gltf = useGLTF(MODEL_CAR);

  const orient = useMemo(() => {
    const inner = gltf.scene.clone(true) as THREE.Group;

    inner.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });

    inner.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(inner);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    const longest = Math.max(size.x, size.z);
    const scale = TARGET_LENGTH / longest;

    const outer = new THREE.Group();
    outer.add(inner);
    outer.scale.setScalar(scale);
    outer.position.set(-center.x * scale, -box.min.y * scale, -center.z * scale);

    // Wrap so length axis runs along Z (forward)
    const lengthAxis: "x" | "z" = size.x > size.z ? "x" : "z";
    const wrap = new THREE.Group();
    if (lengthAxis === "x") {
      wrap.rotation.y = Math.PI / 2;
    }
    wrap.add(outer);
    return wrap;
  }, [gltf.scene]);

  return <primitive object={orient} />;
}

function CarRig() {
  const rigRef = useRef<THREE.Group>(null);
  const wheelPivotsRef = useRef<THREE.Group[] | null>(null);

  useFrame((_, dt) => {
    if (!rigRef.current) return;

    // Lazy-find wheels once the GLTF Suspense has resolved and meshes
    // are actually in the rig hierarchy. useEffect would only fire on
    // mount — before the model is in the tree — so we retry every frame
    // until something matches, then lock the result in.
    if (!wheelPivotsRef.current) {
      const wheelNamePattern = /(wheel|tire|tyre|rim|pneu|rad|reifen)/i;
      const materialPattern = /(tyres?|rims?|wheel)/i;
      const found: THREE.Mesh[] = [];
      const matchedAncestors = new WeakSet<THREE.Object3D>();

      rigRef.current.traverse((child) => {
        const mesh = child as THREE.Mesh;
        if (!mesh.isMesh) return;

        // Skip descendants of an already-matched ancestor.
        let p: THREE.Object3D | null = child.parent;
        while (p) {
          if (matchedAncestors.has(p)) return;
          p = p.parent;
        }

        const material = mesh.material as THREE.Material | THREE.Material[] | undefined;
        const materialNames = Array.isArray(material)
          ? material.map((m) => m?.name ?? "").join(" ")
          : material?.name ?? "";

        const byName = wheelNamePattern.test(child.name);
        const byMaterial = materialPattern.test(materialNames);

        if (byName || byMaterial) {
          found.push(mesh);
          matchedAncestors.add(child);
        }
      });

      if (found.length === 0) return;

      // The wheel meshes in this GLTF have their geometry origins at the
      // car's center rather than at each hub. Wrap each single-wheel mesh
      // in a pivot Group placed at its world-space center so rotation rolls
      // instead of swinging in an arc.
      const pivots: THREE.Group[] = [];
      const worldCenter = new THREE.Vector3();
      const localCenter = new THREE.Vector3();
      const sizeVec = new THREE.Vector3();
      const box = new THREE.Box3();

      const wrap = (target: THREE.Object3D, parent: THREE.Object3D) => {
        parent.updateMatrixWorld(true);
        box.setFromObject(target);
        box.getCenter(worldCenter);
        parent.worldToLocal(localCenter.copy(worldCenter));

        const pivot = new THREE.Group();
        pivot.position.copy(localCenter);
        parent.add(pivot);
        // attach() reparents while preserving the wheel's world transform,
        // so it stays visually in place but is now offset inside pivot's
        // local space — pivot's origin sits at the wheel's center.
        pivot.attach(target);
        pivots.push(pivot);
      };

      for (const wheel of found) {
        const parent = wheel.parent;
        if (!parent) continue;

        parent.updateMatrixWorld(true);
        box.setFromObject(wheel);
        box.getSize(sizeVec);

        // Heuristic: a single wheel stays under this span in normalized model.
        // If a mesh is wider, it likely represents multiple rims in one mesh;
        // rotating it would still produce artifacts, so we skip it.
        const isCombined = sizeVec.x > 1.2 || sizeVec.z > 1.2;
        if (isCombined) continue;

        wrap(wheel, parent);
      }

      wheelPivotsRef.current = pivots;
    }

    const spin = dt * 14;
    for (const pivot of wheelPivotsRef.current) {
      pivot.rotateX(spin);
    }
  });

  return (
    <group ref={rigRef} position={[0.9, 0, 0]} rotation={[0, -0.9, 0]}>
      <Suspense fallback={null}>
        <NormalizedCar />
      </Suspense>
    </group>
  );
}

function Speedlines() {
  const ref = useRef<THREE.Points>(null);
  const [positions] = useState(() => makeSpeedlinePositions());

  useFrame((_, dt) => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;
    for (let i = 0; i < arr.length; i += 3) {
      arr[i + 2] += dt * 10;
      if (arr[i + 2] > 11) arr[i + 2] = -11;
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#ffffff" size={0.018} sizeAttenuation transparent opacity={0.32} />
    </points>
  );
}

export default function F1Car3D() {
  return (
    <Canvas
      shadows
      camera={{ position: [4.4, 1.7, 5.6], fov: 30 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      dpr={[1, 2]}
    >
      <fog attach="fog" args={["#000000", 9, 26]} />

      <ambientLight intensity={0.32} />
      <directionalLight
        position={[5, 9, 5]}
        intensity={2.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
      />
      <directionalLight position={[-5, 4, -2]} intensity={0.6} color="#ff3a3a" />
      <spotLight
        position={[0, 8, 3]}
        intensity={70}
        angle={0.5}
        penumbra={0.65}
        color="#ffffff"
        castShadow
      />
      <pointLight position={[-3.5, 1.2, -3]} intensity={9} color="#e10600" distance={8} />
      <pointLight position={[3.5, 1.2, 3]} intensity={4} color="#ffffff" distance={6} />

      <Suspense fallback={null}>
        <Environment preset="night" />
        <CarRig />
        <Speedlines />
        <ContactShadows
          position={[0, 0.005, 0]}
          opacity={0.9}
          scale={14}
          blur={2.4}
          far={5}
          color="#000000"
        />
      </Suspense>
    </Canvas>
  );
}
