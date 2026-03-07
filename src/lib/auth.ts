import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "lumin-art-admin-secret-change-in-production"
);
const JWT_ISSUER = "lumin-art-admin";
const JWT_AUDIENCE = "lumin-art-admin";
const JWT_EXPIRY = "7d";

export type AdminPayload = {
  sub: string; // email
  iat: number;
  exp: number;
};

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function signToken(email: string): Promise<string> {
  return new SignJWT({ sub: email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer(JWT_ISSUER)
    .setAudience(JWT_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRY)
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<AdminPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    });
    return payload as unknown as AdminPayload;
  } catch {
    return null;
  }
}

export type AdminCredentials =
  | { email: string; passwordHash: string; plainPassword?: never }
  | { email: string; plainPassword: string; passwordHash?: never };

export function getAdminCredentials(): AdminCredentials | null {
  const email = process.env.ADMIN_EMAIL;
  if (!email) return null;

  const hash = process.env.ADMIN_PASSWORD_HASH;
  const plain = process.env.ADMIN_PASSWORD;

  // Prefer plain password for dev (simpler, no hash generation)
  if (plain && typeof plain === "string") {
    return { email, plainPassword: plain.trim() };
  }
  if (hash && typeof hash === "string") {
    return { email, passwordHash: hash.trim() };
  }
  return null;
}
