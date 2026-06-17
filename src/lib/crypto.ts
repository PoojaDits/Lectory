/**
 * Password hashing using the Web Crypto API (PBKDF2 + SHA-256).
 *
 * No third-party dependency, and plaintext passwords are never persisted.
 * Stored format:  `pbkdf2$<iterations>$<saltBase64>$<hashBase64>`
 *
 * Works in any secure context (https or localhost), which covers dev/preview.
 */

const ITERATIONS = 100_000;
const HASH_ALGO = "SHA-256";
const KEY_LENGTH = 32; // 256-bit derived key
const SALT_LENGTH = 16; // 128-bit salt
const PREFIX = "pbkdf2";

const encoder = new TextEncoder();

function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToBytes(base64: string) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function deriveKey(
  password: string,
  salt: BufferSource,
  iterations: number
): Promise<ArrayBuffer> {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );
  return crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations, hash: HASH_ALGO },
    keyMaterial,
    KEY_LENGTH * 8
  );
}

/** Hash a password for storage. */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  const derived = await deriveKey(password, salt, ITERATIONS);
  return `${PREFIX}$${ITERATIONS}$${bufferToBase64(salt.buffer)}$${bufferToBase64(derived)}`;
}

/**
 * Verify a password against a stored hash. Returns `false` when `stored` is not
 * a recognisable hash — callers handle legacy plaintext separately.
 */
export async function verifyPassword(
  password: string,
  stored: string
): Promise<boolean> {
  const parts = stored.split("$");
  if (parts.length !== 4 || parts[0] !== PREFIX) return false;

  const parsedIterations = Number(parts[1]);
  const iterations = Number.isFinite(parsedIterations)
    ? parsedIterations
    : ITERATIONS;
  const salt = base64ToBytes(parts[2]);
  const expected = base64ToBytes(parts[3]);

  const derived = new Uint8Array(await deriveKey(password, salt, iterations));

  // Constant-time comparison to avoid timing leaks.
  if (derived.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= derived[i] ^ expected[i];
  }
  return diff === 0;
}

/** True when a stored value is a PBKDF2 hash (vs. legacy plaintext). */
export function isHashedPassword(stored: string): boolean {
  return typeof stored === "string" && stored.startsWith(`${PREFIX}$`);
}
