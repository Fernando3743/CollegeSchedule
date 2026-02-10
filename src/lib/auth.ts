import "server-only";

import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const SESSION_COOKIE_NAME = "college_schedule_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 14;
const SESSION_SCOPE = "college-schedule-session-v1";

function safeEqualString(a: string, b: string) {
  const aHash = crypto.createHash("sha256").update(a).digest();
  const bHash = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(aHash, bHash);
}

function getAuthConfig() {
  const password = process.env.APP_PASSWORD;
  const secret = process.env.APP_SESSION_SECRET;

  return {
    password,
    secret,
    isConfigured: Boolean(password && secret),
  };
}

function buildSessionValue(secret: string) {
  return crypto.createHmac("sha256", secret).update(SESSION_SCOPE).digest("hex");
}

export function isAuthConfigured() {
  return getAuthConfig().isConfigured;
}

export async function isAuthenticated() {
  const { secret, isConfigured } = getAuthConfig();
  if (!isConfigured || !secret) {
    return process.env.NODE_ENV !== "production";
  }

  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!session) return false;

  const expected = buildSessionValue(secret);
  return safeEqualString(session, expected);
}

export async function requireAuthenticatedPage() {
  if (!(await isAuthenticated())) {
    redirect("/login");
  }
}

export async function assertAuthenticated() {
  if (!(await isAuthenticated())) {
    throw new Error("Unauthorized");
  }
}

export async function signIn(passwordAttempt: string) {
  const { password, secret, isConfigured } = getAuthConfig();
  if (!isConfigured || !password || !secret) {
    throw new Error("APP_PASSWORD and APP_SESSION_SECRET must be configured");
  }

  if (!safeEqualString(passwordAttempt, password)) {
    return false;
  }

  const cookieStore = await cookies();
  cookieStore.set({
    name: SESSION_COOKIE_NAME,
    value: buildSessionValue(secret),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  return true;
}

export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
