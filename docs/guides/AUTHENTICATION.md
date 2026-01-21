# Authentication Guide

This guide covers all authentication methods supported by the OpenL Tablets MCP Server, including Personal Access Token (PAT) and Basic Authentication.

## Table of Contents
- [Authentication Methods](#authentication-methods)
- [Basic Authentication](#basic-authentication)
- [Personal Access Token Authentication](#personal-access-token-authentication)
- [Client Document ID](#client-document-id)
- [Security Best Practices](#security-best-practices)
- [Troubleshooting](#troubleshooting)

## Authentication Methods

The MCP server supports two authentication methods:

1. **Basic Authentication** - Username and password
2. **Personal Access Token (PAT)** - User-generated tokens for programmatic access

Choose the method that best fits your security requirements and infrastructure.

## Basic Authentication

Basic Authentication uses HTTP Basic Auth with username and password.

### Configuration

**Environment Variables:**
```bash
OPENL_BASE_URL=http://localhost:8080/rest
OPENL_USERNAME=admin
OPENL_PASSWORD=admin
```

**Claude Desktop Config:**
```json
{
  "mcpServers": {
    "openl-tablets": {
      "command": "node",
      "args": ["/path/to/dist/index.js"],
      "env": {
        "OPENL_BASE_URL": "http://localhost:8080/rest",
        "OPENL_USERNAME": "admin",
        "OPENL_PASSWORD": "admin"
      }
    }
  }
}
```

### Use Cases
- Development and testing environments
- Internal networks with network-level security
- Quick setup and prototyping

### Security Considerations
- ❌ Credentials sent with every request
- ❌ Password stored in configuration
- ✅ Use HTTPS in production
- ✅ Rotate passwords regularly

## Personal Access Token Authentication

Personal Access Token (PAT) authentication uses user-generated tokens created in the OpenL Tablets UI. PATs provide a secure way to authenticate API requests without using passwords.

### Features

- ✅ **User-Generated** - Created and managed in OpenL Tablets UI
- ✅ **Token Format** - `openl_pat_<publicId>.<secret>`
- ✅ **Expiration Support** - Optional expiration dates for enhanced security
- ✅ **User Isolation** - Each user manages their own tokens
- ✅ **OAuth2/SAML Only** - Available only when OpenL Tablets is configured for OAuth2 or SAML authentication

### Prerequisites

- OpenL Tablets must be configured with OAuth2 or SAML authentication mode
- You must have a valid OAuth2/SAML session to create PATs
- PATs cannot be used to manage other PATs (enforced by security)

### Creating a Personal Access Token

1. Log in to OpenL Tablets Studio
2. Navigate to **User Settings** → **Personal Access Tokens**
3. Click **Create Token**
4. Provide a name and optional expiration date
5. Copy the token immediately (it's shown only once)

**Token Format:**
```
<your-pat-token>
```

### Configuration

**Environment Variables:**
```bash
OPENL_BASE_URL=https://openl.example.com/rest
OPENL_PERSONAL_ACCESS_TOKEN=<your-pat-token>
```

**Claude Desktop / Cursor Config:**
```json
{
  "mcpServers": {
    "openl-tablets": {
      "command": "node",
      "args": ["<path-to-project>/dist/index.js"],
      "env": {
        "OPENL_BASE_URL": "https://openl.example.com/rest",
        "OPENL_PERSONAL_ACCESS_TOKEN": "<your-pat-token>",
        "OPENL_CLIENT_DOCUMENT_ID": "cursor-mcp-1"
      }
    }
  }
}
```

### Use Cases

- **MCP Server Integration** - Perfect for Cursor/Claude Desktop MCP servers
- **CI/CD Pipelines** - Automated deployments and testing
- **API Scripts** - Command-line tools and automation
- **Service-to-Service** - Microservice communication
- **Development** - Local development

### Security Considerations

- ✅ **More Secure Than Passwords** - Tokens can be revoked without password changes
- ✅ **Expiration Support** - Optional expiration dates
- ✅ **User-Scoped** - Tokens are tied to the user who created them
- ✅ **Revocable** - Can be deleted from UI at any time
- ⚠️ **Token Storage** - Store tokens securely (environment variables, secret managers)
- ⚠️ **Token Exposure** - Never commit tokens to version control
- ✅ **Use HTTPS Always** - Required for production

### Token Management

- **View Tokens**: List all your PATs in the UI
- **Delete Tokens**: Revoke access by deleting tokens
- **Expiration**: Check token expiration dates
- **Usage**: Use `Authorization: Token <token>` header format

**Important**: The full token value is shown only once when created. Store it securely - it cannot be retrieved later.

## Client Document ID

The Client Document ID is a tracking identifier included in all API requests.

### Purpose

- **Request Correlation**: Track requests across systems
- **Debugging**: Identify requests from specific MCP instances
- **Auditing**: Trace actions back to source
- **Load Balancing**: Identify client instances

### Configuration

**Environment Variable:**
```bash
OPENL_CLIENT_DOCUMENT_ID=mcp-server-instance-1
```

**Claude Desktop Config:**
```json
{
  "env": {
    "OPENL_CLIENT_DOCUMENT_ID": "claude-desktop-user123"
  }
}
```

### Best Practices

- Use a unique ID per MCP server instance
- Include environment indicator: `mcp-prod-1`, `mcp-dev-1`
- Keep IDs short and descriptive
- Don't include sensitive information

### Header Format

The client document ID is sent as:
```
X-Client-Document-ID: mcp-server-instance-1
```

## Security Best Practices

### General

1. **Always Use HTTPS** - Never send credentials over HTTP
2. **Rotate Credentials** - Regularly rotate passwords, API keys, and client secrets
3. **Least Privilege** - Use minimum required scopes/permissions
4. **Separate Environments** - Different credentials for dev/staging/production
5. **Monitor Access** - Log and monitor authentication attempts

### Configuration Management

1. **Environment Variables**
   ```bash
   # Good: Use env files
   cp .env.example .env
   # Edit .env with actual values
   ```

2. **Secret Managers**
   ```bash
   # Good: Fetch from secret manager
   export OPENL_PERSONAL_ACCESS_TOKEN=$(vault read secret/openl/pat)
   ```

3. **Version Control**
   ```gitignore
   # .gitignore
   .env
   .env.local
   .env.*.local
   ```

## Troubleshooting

### Basic Auth Issues

#### Authentication Failed

**Symptoms:**
```
OpenL Tablets API error (401): Authentication required
```

**Solutions:**
1. Verify username and password are correct
2. Check user account is not locked
3. Ensure user has required permissions
4. Verify OpenL Tablets is configured for basic auth

### General Issues

#### Connection Timeout

**Symptoms:**
```
Error: timeout of 30000ms exceeded
```

**Solutions:**
1. Increase timeout: `OPENL_TIMEOUT=60000`
2. Check network connectivity
3. Verify OpenL Tablets is running
4. Check firewall rules

#### OAuth2 Token Endpoint 404 Error

**Symptoms:**
```
Failed to obtain OAuth 2.1 token: Request failed with status code 404
```

**Solutions:**
1. Check the token endpoint URL is correct for your OAuth provider:
   - **Ping Identity**: Use `/as/token.oauth2` (e.g., `https://auth.example.com/as/token.oauth2`)
   - **Spring Security OAuth2**: Use `/oauth/token` (e.g., `https://auth.example.com/oauth/token`)
   - **Standard OAuth2**: Use `/token` (e.g., `https://auth.example.com/token`)
2. If using `OPENL_OAUTH2_ISSUER_URI`, override with explicit `OPENL_OAUTH2_TOKEN_URL`
3. Verify the issuer URI is correct (no trailing slash)
4. Check OAuth provider documentation for the correct token endpoint path
5. Enable debug logging to see the exact URL being used

**Example for Ping Identity:**
```bash
# Instead of issuer-uri (which defaults to /token)
OPENL_OAUTH2_ISSUER_URI=https://your-oauth-server.example.com

# Use explicit token-url
OPENL_OAUTH2_TOKEN_URL=https://your-oauth-server.example.com/as/token.oauth2
```

#### OAuth2 Token Endpoint 400 Error

**Symptoms:**
```
Failed to obtain OAuth 2.1 token: Request failed with status code 400
```

**Solutions:**
1. **Try Basic Auth**: Some OAuth providers (like Ping Identity) require Basic Authentication header instead of credentials in the request body:
   ```bash
   OPENL_OAUTH2_USE_BASIC_AUTH=true
   ```

2. **Check request format**: Verify the Content-Type header is correct (`application/x-www-form-urlencoded`)

3. **Verify grant type**: Ensure `OPENL_OAUTH2_GRANT_TYPE` matches what your OAuth provider expects

4. **Check required parameters**: Some providers require additional parameters:
   - **Audience**: Some providers (like Auth0, Ping Identity) require an `audience` parameter:
     ```bash
     OPENL_OAUTH2_AUDIENCE=https://api.example.com
     ```
   - **Resource**: Some providers require a `resource` parameter:
     ```bash
     OPENL_OAUTH2_RESOURCE=https://api.example.com
     ```
   - **Scope**: Ensure required scopes are specified:
     ```bash
     OPENL_OAUTH2_SCOPE=openl:read openl:write
     ```

5. **Review error response**: Check logs for the actual error message from the OAuth provider

**Common Error Codes:**
- `unauthorized_client`: 
  - Client not authorized for this grant type (check OAuth provider configuration)
  - Missing required parameters (e.g., `audience`, `scope`)
  - Client not configured to use `client_credentials` grant type
  - **Solution**: Verify client configuration in OAuth provider admin console
- `invalid_client`: Invalid client credentials (check client_id and client_secret)
- `invalid_scope`: Invalid or missing scope (verify required scopes in OAuth provider)
- `invalid_grant`: Invalid grant type or grant expired (check grant type configuration)

**Example for Ping Identity with Basic Auth:**
```bash
OPENL_OAUTH2_CLIENT_ID=your-client-id
OPENL_OAUTH2_CLIENT_SECRET=your-client-secret
OPENL_OAUTH2_TOKEN_URL=https://your-oauth-server.example.com/as/token.oauth2
OPENL_OAUTH2_GRANT_TYPE=client_credentials
OPENL_OAUTH2_USE_BASIC_AUTH=true
# If required by your Ping Identity configuration:
OPENL_OAUTH2_AUDIENCE=https://api.example.com
OPENL_OAUTH2_SCOPE=openl:read openl:write
```

#### SSL/TLS Errors

**Symptoms:**
```
Error: unable to verify the first certificate
```

**Solutions:**
1. Ensure valid SSL certificate
2. Update CA certificates
3. Check certificate chain
4. For development only: Configure to accept self-signed certs

## Environment Variable Reference

### Common
```bash
OPENL_BASE_URL          # OpenL Tablets API base URL
OPENL_CLIENT_DOCUMENT_ID # Client tracking identifier
OPENL_TIMEOUT           # Request timeout in milliseconds
```

### Basic Auth
```bash
OPENL_USERNAME          # Username for basic authentication
OPENL_PASSWORD          # Password for basic authentication
```

### Personal Access Token
```bash
OPENL_PERSONAL_ACCESS_TOKEN  # Personal Access Token (format: openl_pat_<publicId>.<secret>)
```

### OAuth 2.1
```bash
OPENL_OAUTH2_CLIENT_ID           # OAuth client ID
OPENL_OAUTH2_CLIENT_SECRET       # OAuth client secret
OPENL_OAUTH2_TOKEN_URL           # Token endpoint URL (required if issuer-uri not provided)
OPENL_OAUTH2_ISSUER_URI         # OAuth issuer URI (alternative to token-url, auto-appends /token)
OPENL_OAUTH2_AUTHORIZATION_URL   # Authorization endpoint (optional)
OPENL_OAUTH2_SCOPE               # Space-separated scopes
OPENL_OAUTH2_GRANT_TYPE          # Grant type (client_credentials, authorization_code, refresh_token)
OPENL_OAUTH2_REFRESH_TOKEN       # Refresh token (if using refresh grant)
OPENL_OAUTH2_USE_BASIC_AUTH      # Use Basic Auth header instead of form data (true/false, default: false)
OPENL_OAUTH2_AUDIENCE            # OAuth2 audience parameter (required by some providers)
OPENL_OAUTH2_RESOURCE            # OAuth2 resource parameter (required by some providers)
# PKCE parameters (for authorization_code grant)
OPENL_OAUTH2_CODE_VERIFIER       # PKCE code verifier (43-128 chars, URL-safe, required for PKCE)
OPENL_OAUTH2_CODE_CHALLENGE      # PKCE code challenge (auto-generated from code_verifier if not provided)
OPENL_OAUTH2_CODE_CHALLENGE_METHOD # PKCE method (S256 or plain, default: S256)
OPENL_OAUTH2_AUTHORIZATION_CODE  # Authorization code from authorization endpoint
OPENL_OAUTH2_REDIRECT_URI        # Redirect URI registered with OAuth provider
```

## Examples

### Local Development with Basic Auth
```bash
export OPENL_BASE_URL=http://localhost:8080/rest
export OPENL_USERNAME=admin
export OPENL_PASSWORD=admin
export OPENL_CLIENT_DOCUMENT_ID=dev-laptop
npm start
```

### Production with OAuth 2.1
```bash
export OPENL_BASE_URL=https://openl-prod.example.com/rest
export OPENL_OAUTH2_CLIENT_ID=mcp-server-prod
export OPENL_OAUTH2_CLIENT_SECRET=$(vault read -field=secret secret/openl/prod/client-secret)
export OPENL_OAUTH2_TOKEN_URL=https://auth.example.com/oauth/token
export OPENL_OAUTH2_SCOPE="openl:read openl:write"
export OPENL_CLIENT_DOCUMENT_ID=mcp-prod-instance-1
export OPENL_TIMEOUT=60000
npm start
```

## Resources

- [OAuth 2.1 Specification](https://oauth.net/2.1/)
- [OpenL Tablets Documentation](https://openl-tablets.org/)
- [MCP Server README](../../README.md)
- [Testing Guide](../development/TESTING.md)
