"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { GATE_COOKIE, gateToken } from "@/lib/gate";

export async function enterSite(formData: FormData) {
  const password = String(formData.get("password") || "");
  const expected = process.env.SITE_PASSWORD || "";

  if (expected && password === expected) {
    const token = await gateToken(expected);
    cookies().set(GATE_COOKIE, token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    redirect("/");
  }

  redirect("/enter?error=1");
}
