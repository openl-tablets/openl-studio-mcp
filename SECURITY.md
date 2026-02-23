# Security Policy

## Supported Versions

We release patches for security vulnerabilities for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.0   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

If you discover a security vulnerability in the OpenL Studio MCP Server, please report it by emailing:

**security@openl-tablets.org**

### What to Include

Please include the following information in your report:

- **Description**: Clear description of the vulnerability
- **Impact**: What an attacker could do with this vulnerability
- **Steps to Reproduce**: Detailed steps to reproduce the issue
- **Affected Versions**: Which versions are affected
- **Environment**: OS, Node.js version, OpenL Studio version
- **Proof of Concept**: Code or commands demonstrating the issue (if applicable)
- **Suggested Fix**: If you have ideas on how to fix it (optional)

### Response Timeline

- **Initial Response**: We aim to respond within 3 business days
- **Status Updates**: We aim to provide updates every 5 business days until resolved
- **Resolution**: We aim to release a fix within 30 days for critical vulnerabilities

### Disclosure Policy

- We will confirm receipt of your vulnerability report
- We will investigate and provide regular updates on our progress
- We will notify you when the vulnerability is fixed
- We will publicly disclose the vulnerability after a fix is released
- We will credit you in the security advisory (unless you prefer to remain anonymous)

## Security Best Practices

### For Users

1. **Use Personal Access Tokens (PAT)** instead of Basic Auth in production
2. **Always use HTTPS/TLS** when connecting to OpenL Studio in production
3. **Never commit credentials** to version control
4. **Rotate tokens regularly** and revoke unused tokens immediately
5. **Keep dependencies updated**: Run `npm audit` and `npm update` regularly
6. **Use environment variables** for all sensitive configuration
7. **Enable audit logging** via `OPENL_CLIENT_DOCUMENT_ID` for tracking requests

### For Developers

1. **Never log sensitive data**: Passwords, tokens, or API keys
2. **Validate all inputs**: Use Zod schemas for runtime validation
3. **Sanitize error messages**: Redact credentials from error outputs
4. **Use strict TypeScript**: Enable strict mode and fix all type errors
5. **Review dependencies**: Check for known vulnerabilities before adding new packages
6. **Test security features**: Write tests for authentication and authorization logic

## Known Security Considerations

### Authentication

- **Basic Auth**: Credentials are Base64-encoded (not encrypted). Always use HTTPS in production.
- **Personal Access Token (PAT)**: Recommended for production. Tokens should be treated as passwords.
- **Token Storage**: Never hardcode tokens in source code. Use environment variables or secure vaults.

### Network Security

- **HTTPS Required**: Production deployments must use HTTPS to encrypt credentials in transit
- **CORS**: HTTP server mode includes CORS support for cross-origin requests
- **Authentication Headers**: Authentication via HTTP headers is recommended; query parameters are supported but discouraged (may be logged by proxies and appear in server logs)

### Input Validation

- All tool parameters are validated using Zod schemas
- Invalid inputs are rejected before processing
- Error messages are sanitized to prevent information leakage

### Credential Redaction

The server redacts sensitive data from error messages, logs, and API responses to prevent credential leakage. This includes tokens, passwords, API keys, and authorization headers.

## Security Updates

Security updates will be released as patch versions (e.g., 1.0.1, 1.0.2) and announced via:

- [GitHub Security Advisories](https://github.com/openl-tablets/openl-studio-mcp/security/advisories)
- [GitHub Releases](https://github.com/openl-tablets/openl-studio-mcp/releases)
- CHANGELOG.md with a `### Security` section

Subscribe to repository notifications to receive security updates.

## Scope

This security policy applies to:

- Source code in this repository
- Published releases (npm packages and Docker images, if/when published)

This policy does **not** cover:

- OpenL Studio/OpenL Tablets server itself (report to OpenL Tablets project)
- Third-party dependencies (report to respective maintainers)
- Deployment infrastructure (cloud providers, Kubernetes, etc.)

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [npm Security Best Practices](https://docs.npmjs.com/security-best-practices)

## Questions?

For security-related questions that are not vulnerabilities, please use:
- [GitHub Discussions](https://github.com/openl-tablets/openl-studio-mcp/discussions)

For vulnerability reports, email: **security@openl-tablets.org**
