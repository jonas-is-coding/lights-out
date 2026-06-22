import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Sidebar from "./Sidebar";
import styles from "./Dashboard.module.css";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className={`${styles.shell} lightApp`}>
      <Sidebar
        userName={session.user.name ?? "Racer"}
        userEmail={session.user.email ?? ""}
      />
      <div className={styles.contentWrap}>{children}</div>
    </div>
  );
}
