# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly via email:

**gh@dcln.me**

Do not open a public issue for security vulnerabilities.

You can expect an initial response within 72 hours.

## Scope

This site (dcln.me) is a personal portfolio deployed on Cloudflare Pages.

### In scope

- Cross-site scripting (XSS)
- Content injection
- Security header misconfigurations
- Exposed secrets or credentials
- Server-side request forgery (SSRF)

### Out of scope

- Routes under `/private/*` return 403 by design — they are protected by
  [Cloudflare Access](https://developers.cloudflare.com/cloudflare-one/applications/)
  and require authenticated sessions
- Denial of service (DoS/DDoS)
- Social engineering
- Issues in third-party dependencies with no demonstrated exploit

## Security Architecture

- **Hosting**: Cloudflare Pages (static + SSR via Cloudflare Workers)
- **Authentication**: Cloudflare Access JWT verification for private routes
- **Security headers**: CSP, HSTS, X-Frame-Options, and others enforced via `public/_headers`
- **Dependencies**: Monitored weekly via Dependabot
