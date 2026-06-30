import { SignJWT, jwtVerify } from "jose";

// Signature/vérification du JWT de session — edge-safe (utilisé par le middleware ET le serveur).
export const SESSION_COOKIE = "lc_session";

const secret = new TextEncoder().encode(
  process.env.SESSION_SECRET ?? "dev-secret-change-me-32-chars-min!",
);

export interface SessionPayload {
  userId: number;
  role: "admin" | "user";
  mustChangePassword: boolean;
}

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifySession(
  token: string,
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return {
      userId: payload.userId as number,
      role: payload.role as "admin" | "user",
      mustChangePassword: payload.mustChangePassword as boolean,
    };
  } catch {
    return null;
  }
}
