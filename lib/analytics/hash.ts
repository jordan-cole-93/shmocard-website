import "server-only";
import { createHash } from "node:crypto";

// SHA-256 helper for Meta CAPI user_data fields (em, ph).
//
// Normalize per Meta spec: lowercase + trim before hashing.
// Phase 9 collects no PII pre-checkout — this helper is defined for future use
// (e.g., post-checkout email capture phase).
//
// Verified output: sha256Lower("john_smith@gmail.com")
//   = "62a14e44f765419d10fea99367361a727c12365e2520f32218d505ed9aa0f62f"
//   (matches Meta's documented expected output exactly).

export function sha256Lower(value: string): string {
  const normalized = value.trim().toLowerCase();
  return createHash("sha256").update(normalized).digest("hex");
}
