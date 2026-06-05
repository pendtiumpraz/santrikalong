"use server";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { signIn, signOut } from "@/auth";
import { prisma } from "@/lib/db";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  try {
    await signIn("credentials", { email, password, redirectTo: "/dashboard" });
  } catch (error) {
    if (error instanceof AuthError) redirect("/auth?error=kredensial");
    throw error; // redirect signIn (NEXT_REDIRECT) harus diteruskan
  }
}

export async function registerAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!name || !email || password.length < 8) redirect("/auth?tab=register&error=form");

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) redirect("/auth?tab=register&error=terdaftar");

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { name, email, phone: phone || null, passwordHash } });
  const santri = await prisma.role.findUnique({ where: { name: "santri" } });
  if (santri) await prisma.userRole.create({ data: { userId: user.id, roleId: santri.id } });

  try {
    await signIn("credentials", { email, password, redirectTo: "/onboarding-otp" });
  } catch (error) {
    if (error instanceof AuthError) redirect("/auth?error=kredensial");
    throw error;
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}
