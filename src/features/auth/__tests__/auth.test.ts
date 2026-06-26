// @vitest-environment node
import { describe, it, expect } from "vitest";
import { signSession, verifySession, type SessionPayload } from "../token";
import { loginSchema, changePasswordSchema } from "../schemas";

describe("session token", () => {
  const payload: SessionPayload = {
    userId: 42,
    role: "admin",
    mustChangePassword: true,
  };

  it("round-trip : signe puis vérifie le même payload", async () => {
    const token = await signSession(payload);
    const decoded = await verifySession(token);
    expect(decoded).toMatchObject(payload);
  });

  it("rejette un token invalide", async () => {
    expect(await verifySession("pas-un-vrai-token")).toBeNull();
  });
});

describe("schemas", () => {
  it("loginSchema exige un email valide", () => {
    expect(loginSchema.safeParse({ email: "x", password: "y" }).success).toBe(
      false,
    );
    expect(
      loginSchema.safeParse({ email: "a@b.fr", password: "y" }).success,
    ).toBe(true);
  });

  it("changePasswordSchema exige 8+ caractères et une confirmation identique", () => {
    expect(
      changePasswordSchema.safeParse({ newPassword: "court", confirm: "court" })
        .success,
    ).toBe(false);
    expect(
      changePasswordSchema.safeParse({
        newPassword: "assezlong",
        confirm: "different",
      }).success,
    ).toBe(false);
    expect(
      changePasswordSchema.safeParse({
        newPassword: "assezlong",
        confirm: "assezlong",
      }).success,
    ).toBe(true);
  });
});
