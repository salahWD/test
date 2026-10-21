/**
 * Owner-only admin auth — server only.
 * Single password from `ADMIN_PASSWORD`; session is an HMAC-signed expiry
 * cookie (no accounts, no database — per the site's no-backend rule, the
 * CMS is the one owner-facing exception and touches nothing public).
 */

import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const COOKIE = "ws_admin";
const SESSION_DAYS = 7;

export function cmsEnabled(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

function secret(): string {
  return process.env.ADMIN_SECRET ?? process.env.ADMIN_PASSWORD ?? "";
}

function sign(value: string): string {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

export function checkPassword(password: string): boolean {
  const real = process.env.ADMIN_PASSWORD;
  return Boolean(real) && safeEqual(password, real!);
}

export async function createSession(): Promise<void> {
  const expires = Date.now() + SESSION_DAYS * 86_400_000;
  (await cookies()).set(COOKIE, `${expires}.${sign(String(expires))}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 86_400,
  });
}

export async function destroySession(): Promise<void> {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin(): Promise<boolean> {
  if (!cmsEnabled()) return false;
  const value = (await cookies()).get(COOKIE)?.value;
  if (!value) return false;
  const dot = value.indexOf(".");
  if (dot < 1) return false;
  const expires = value.slice(0, dot);
  const sig = value.slice(dot + 1);
  if (!/^\d+$/.test(expires) || Number(expires) < Date.now()) return false;
  return safeEqual(sig, sign(expires));
}
