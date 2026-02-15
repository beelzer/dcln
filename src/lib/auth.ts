/**
 * Cloudflare Access JWT verification.
 *
 * Verifies the JWT signature against Cloudflare's public keys (JWKS)
 * to ensure the request genuinely passed through Cloudflare Access.
 *
 * Reference: https://developers.cloudflare.com/cloudflare-one/identity/authorization-cookie/validating-json/
 */

import { SITE, JWKS_CACHE_DURATION_MS, JWT_NBF_TOLERANCE_S } from './constants';

const CERTS_URL = `${SITE.cfAccessTeamDomain}/cdn-cgi/access/certs`;

interface JWTHeader {
  kid: string;
  alg: string;
}

interface JWTPayload {
  iss: string;
  sub: string;
  aud: string[];
  email: string;
  exp: number;
  iat: number;
  nbf: number;
}

interface JWK extends JsonWebKey {
  kid?: string;
  kty?: string;
}

interface JWKS {
  keys: JWK[];
}

let cachedKeys: Map<string, CryptoKey> | null = null;
let cacheExpiry = 0;

/** Fetch and cache Cloudflare Access public keys. */
async function getPublicKeys(): Promise<Map<string, CryptoKey>> {
  const now = Date.now();
  if (cachedKeys && now < cacheExpiry) {
    return cachedKeys;
  }

  const response = await fetch(CERTS_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch Cloudflare Access certs: ${response.status}`);
  }

  const jwks: JWKS = await response.json();
  const keys = new Map<string, CryptoKey>();

  for (const jwk of jwks.keys) {
    if (jwk.kty === 'RSA' && jwk.kid) {
      const key = await crypto.subtle.importKey(
        'jwk',
        jwk,
        { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
        false,
        ['verify'],
      );
      keys.set(jwk.kid!, key);
    }
  }

  cachedKeys = keys;
  cacheExpiry = now + JWKS_CACHE_DURATION_MS;

  return keys;
}

/** Base64url decode to Uint8Array. */
function base64urlDecode(str: string): Uint8Array {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(base64 + padding);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Verify a Cloudflare Access JWT.
 * Returns the decoded payload if valid, null otherwise.
 */
export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [headerB64, payloadB64, signatureB64] = parts;

    // Decode header to get key ID
    const header: JWTHeader = JSON.parse(new TextDecoder().decode(base64urlDecode(headerB64)));

    // Fetch public keys and find matching key
    const keys = await getPublicKeys();
    const key = keys.get(header.kid);
    if (!key) return null;

    // Verify signature
    const signedData = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
    const signature = base64urlDecode(signatureB64);

    const valid = await crypto.subtle.verify(
      'RSASSA-PKCS1-v1_5',
      key,
      signature.buffer as ArrayBuffer,
      signedData,
    );

    if (!valid) return null;

    // Decode and validate payload
    const payload: JWTPayload = JSON.parse(new TextDecoder().decode(base64urlDecode(payloadB64)));

    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) return null;

    // Check not-before
    if (payload.nbf && payload.nbf > now + JWT_NBF_TOLERANCE_S) return null;

    return payload;
  } catch {
    return null;
  }
}

/**
 * Verify a request came through Cloudflare Access.
 * Returns true if the JWT is valid, false otherwise.
 */
export async function verifyAccessJWT(request: Request): Promise<boolean> {
  const jwt = request.headers.get('cf-access-jwt-assertion');
  if (!jwt) return false;

  const payload = await verifyJWT(jwt);
  return payload !== null;
}

/**
 * Get the authenticated user's email from Cloudflare Access JWT.
 * Returns the email if the JWT is valid, null otherwise.
 */
export async function getAccessEmail(request: Request): Promise<string | null> {
  const jwt = request.headers.get('cf-access-jwt-assertion');
  if (!jwt) return null;

  const payload = await verifyJWT(jwt);
  return payload?.email ?? null;
}
