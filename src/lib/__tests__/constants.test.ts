import { describe, it, expect } from 'vitest';
import { SITE, JWKS_CACHE_DURATION_MS, JWT_NBF_TOLERANCE_S } from '../constants';

describe('SITE', () => {
  it('has required string properties', () => {
    expect(SITE.name).toBe('dcln.me');
    expect(SITE.title).toBe('dcln.me — Declan');
    expect(SITE.author).toBe('Declan');
    expect(SITE.email).toBe('contact@dcln.me');
    expect(SITE.github).toBe('https://github.com/beelzer');
  });

  it('has correct featured projects limit', () => {
    expect(SITE.featuredProjectsLimit).toBe(3);
  });

  it('has version and commit hash from build defines', () => {
    expect(typeof SITE.version).toBe('string');
    expect(typeof SITE.commitHash).toBe('string');
  });

  it('has cloudflare access team domain', () => {
    expect(SITE.cfAccessTeamDomain).toMatch(/^https:\/\//);
  });
});

describe('JWT constants', () => {
  it('caches JWKS for 1 hour', () => {
    expect(JWKS_CACHE_DURATION_MS).toBe(60 * 60 * 1000);
  });

  it('has 60 second NBF tolerance', () => {
    expect(JWT_NBF_TOLERANCE_S).toBe(60);
  });
});
