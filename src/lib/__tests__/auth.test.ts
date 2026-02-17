import { describe, it, expect, vi, beforeEach } from 'vitest';

// Helper to create a mock Request with optional JWT header
function mockRequest(jwt?: string): Request {
  const headers = new Headers();
  if (jwt) {
    headers.set('cf-access-jwt-assertion', jwt);
  }
  return new Request('https://dcln.me/private', { headers });
}

// Helper to base64url encode
function base64urlEncode(data: string): string {
  const bytes = new TextEncoder().encode(data);
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// Helper to create a properly signed JWT for integration tests
async function createSignedJWT(
  payload: Record<string, unknown>,
  keyPair: CryptoKeyPair,
  kid: string,
) {
  const header = base64urlEncode(JSON.stringify({ alg: 'RS256', kid }));
  const body = base64urlEncode(JSON.stringify(payload));
  const signedData = new TextEncoder().encode(`${header}.${body}`);

  const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', keyPair.privateKey, signedData);

  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  return `${header}.${body}.${sigB64}`;
}

describe('auth', () => {
  let verifyJWT: typeof import('../auth').verifyJWT;
  let verifyAccessJWT: typeof import('../auth').verifyAccessJWT;
  let getAccessEmail: typeof import('../auth').getAccessEmail;
  let getAccessSession: typeof import('../auth').getAccessSession;

  beforeEach(async () => {
    vi.restoreAllMocks();
    // Reset module to clear cached keys between tests
    vi.resetModules();
    const mod = await import('../auth');
    verifyJWT = mod.verifyJWT;
    verifyAccessJWT = mod.verifyAccessJWT;
    getAccessEmail = mod.getAccessEmail;
    getAccessSession = mod.getAccessSession;
  });

  describe('verifyJWT', () => {
    it('returns null for malformed tokens', async () => {
      expect(await verifyJWT('')).toBeNull();
      expect(await verifyJWT('only.two')).toBeNull();
      expect(await verifyJWT('too.many.parts.here')).toBeNull();
    });

    it('returns null when key ID does not match', async () => {
      // Mock JWKS with empty keys
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
        new Response(JSON.stringify({ keys: [] }), { status: 200 }),
      );

      const header = base64urlEncode(JSON.stringify({ alg: 'RS256', kid: 'nonexistent' }));
      const payload = base64urlEncode(JSON.stringify({ email: 'test@test.com' }));
      const token = `${header}.${payload}.fake-signature`;

      expect(await verifyJWT(token)).toBeNull();
    });

    it('verifies a valid JWT with real crypto', async () => {
      const kid = 'test-key-1';

      // Generate RSA key pair
      const keyPair = await crypto.subtle.generateKey(
        {
          name: 'RSASSA-PKCS1-v1_5',
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: 'SHA-256',
        },
        true,
        ['sign', 'verify'],
      );

      // Export public key as JWK for JWKS response
      const publicJwk = await crypto.subtle.exportKey('jwk', keyPair.publicKey);

      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
        new Response(JSON.stringify({ keys: [{ ...publicJwk, kid }] }), { status: 200 }),
      );

      const now = Math.floor(Date.now() / 1000);
      const token = await createSignedJWT(
        {
          email: 'user@dcln.me',
          exp: now + 3600,
          iat: now,
          nbf: now,
          sub: '1',
          iss: 'test',
          aud: ['test'],
        },
        keyPair,
        kid,
      );

      const result = await verifyJWT(token);
      expect(result).not.toBeNull();
      expect(result?.email).toBe('user@dcln.me');
    });

    it('returns null for expired tokens', async () => {
      const kid = 'test-key-2';

      const keyPair = await crypto.subtle.generateKey(
        {
          name: 'RSASSA-PKCS1-v1_5',
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: 'SHA-256',
        },
        true,
        ['sign', 'verify'],
      );

      const publicJwk = await crypto.subtle.exportKey('jwk', keyPair.publicKey);

      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
        new Response(JSON.stringify({ keys: [{ ...publicJwk, kid }] }), { status: 200 }),
      );

      const now = Math.floor(Date.now() / 1000);
      const token = await createSignedJWT(
        {
          email: 'user@dcln.me',
          exp: now - 100,
          iat: now - 200,
          nbf: now - 200,
          sub: '1',
          iss: 'test',
          aud: ['test'],
        },
        keyPair,
        kid,
      );

      expect(await verifyJWT(token)).toBeNull();
    });
  });

  describe('verifyAccessJWT', () => {
    it('returns false when JWT header is missing', async () => {
      expect(await verifyAccessJWT(mockRequest())).toBe(false);
    });

    it('returns false for invalid JWT', async () => {
      expect(await verifyAccessJWT(mockRequest('invalid'))).toBe(false);
    });
  });

  describe('getAccessEmail', () => {
    it('returns null when JWT header is missing', async () => {
      expect(await getAccessEmail(mockRequest())).toBeNull();
    });

    it('returns null for invalid JWT', async () => {
      expect(await getAccessEmail(mockRequest('invalid'))).toBeNull();
    });
  });

  describe('getAccessSession', () => {
    it('returns null when JWT header is missing', async () => {
      expect(await getAccessSession(mockRequest())).toBeNull();
    });

    it('returns full session from valid JWT', async () => {
      const kid = 'test-key-3';

      const keyPair = await crypto.subtle.generateKey(
        {
          name: 'RSASSA-PKCS1-v1_5',
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: 'SHA-256',
        },
        true,
        ['sign', 'verify'],
      );

      const publicJwk = await crypto.subtle.exportKey('jwk', keyPair.publicKey);

      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
        new Response(JSON.stringify({ keys: [{ ...publicJwk, kid }] }), { status: 200 }),
      );

      const now = Math.floor(Date.now() / 1000);
      const token = await createSignedJWT(
        {
          email: 'user@dcln.me',
          picture: 'https://example.com/avatar.jpg',
          exp: now + 3600,
          iat: now,
          nbf: now,
          sub: '1',
          iss: 'test',
          aud: ['test'],
        },
        keyPair,
        kid,
      );

      const session = await getAccessSession(mockRequest(token));

      expect(session).not.toBeNull();
      expect(session?.email).toBe('user@dcln.me');
      expect(session?.picture).toBe('https://example.com/avatar.jpg');
      expect(session?.issuedAt).toBeInstanceOf(Date);
      expect(session?.expiresAt).toBeInstanceOf(Date);
    });
  });
});
