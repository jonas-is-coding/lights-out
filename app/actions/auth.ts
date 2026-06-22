"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { pool } from "@/db";

// ---------------------------------------------------------------------------
// Return shape used by useActionState:
//   { error: string }  — on validation / DB / auth failure
//   never returns normally on success — calls redirect("/dashboard")
// ---------------------------------------------------------------------------

export type AuthActionState =
  | { error: string }
  | null;

export async function registerUser(
  prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  // 1. Extract fields
  const firstName = (formData.get("firstName") as string | null)?.trim() ?? "";
  const lastName = (formData.get("lastName") as string | null)?.trim() ?? "";
  const email = (formData.get("email") as string | null)?.trim() ?? "";
  const country = (formData.get("country") as string | null)?.trim() ?? "";
  const password = (formData.get("password") as string | null) ?? "";
  const terms = formData.get("terms");

  // 2. Server-side validation
  if (!firstName || !lastName) {
    return { error: "First name and last name are required." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return { error: "A valid email address is required." };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  if (!terms) {
    return { error: "You must accept the terms and conditions." };
  }

  if (!country) {
    return { error: "Country is required." };
  }

  // 3. Check email uniqueness
  try {
    const existing = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );
    if (existing.rows.length > 0) {
      return { error: "An account with this email already exists." };
    }
  } catch {
    return { error: "Database error. Please try again." };
  }

  // 4. Hash password and insert user
  let userId: number;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const name = `${firstName} ${lastName}`.trim();

    const userResult = await pool.query(
      `INSERT INTO users (name, email, password, country)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [name, email, hashedPassword, country]
    );
    userId = userResult.rows[0].id;
  } catch {
    return { error: "Failed to create account. Please try again." };
  }

  // 5. Seed wallet, bonus, and loyalty rows
  try {
    await pool.query(
      `INSERT INTO wallet ("userId", balance, currency)
       VALUES ($1, 0, 'EUR')
       ON CONFLICT ("userId") DO NOTHING`,
      [userId]
    );

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    await pool.query(
      `INSERT INTO bonuses ("userId", type, label, amount, status, expires_at)
       VALUES ($1, 'free_bet', 'Welcome Free Bet', 20, 'active', $2)`,
      [userId, expiresAt.toISOString()]
    );

    await pool.query(
      `INSERT INTO loyalty ("userId", points, tier)
       VALUES ($1, 0, 'Starter Grid')
       ON CONFLICT ("userId") DO NOTHING`,
      [userId]
    );
  } catch {
    // Seeding failed — user account exists, non-fatal; continue to sign in
  }

  // 6. Sign in with credentials (redirect:false to avoid thrown redirect)
  try {
    await signIn("credentials", { email, password, redirect: false });
  } catch (err) {
    if (err instanceof AuthError) {
      return { error: "Account created but sign-in failed. Please log in manually." };
    }
    // Re-throw NEXT_REDIRECT if it surfaces here (should not with redirect:false)
    throw err;
  }

  // 7. redirect() throws NEXT_REDIRECT — must be outside try/catch
  redirect("/dashboard");
}

export async function logout(): Promise<void> {
  "use server";
  await signOut({ redirectTo: "/" });
}
