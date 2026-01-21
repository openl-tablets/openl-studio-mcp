# 🐳 Connecting Cursor to MCP Server in Docker

## Overview

This document describes how to connect Cursor IDE to MCP Server running in a Docker container.

## Architecture

```text
┌─────────────┐
│   Cursor    │  ← Cursor IDE
└──────┬──────┘
       │ MCP Protocol (SSE/HTTP)
       │ Direct HTTP connection
       │
       ▼
┌─────────────┐
│ MCP Server  │  ← Docker container (port 3000)
│  (Docker)   │     Express HTTP API with SSE transport
└──────┬──────┘
       │ HTTP REST API
       │
       ▼
┌─────────────┐
│ OpenL Studio│  ← OpenL Tablets (port 8080)
│  (Docker)   │
└─────────────┘
```

**Key advantage:** No local proxy needed! Cursor connects directly to Docker container via HTTP.

## Quick Setup

### Step 1: Start Docker Containers

**Note:** Replace `<project-root>` with the absolute path to your local OpenL Tablets project directory. You can find this by running `pwd` from the project root directory.

```bash
cd <project-root>
docker compose up mcp-server
```

Or the entire stack:

```bash
docker compose up
```

### Step 2: Check HTTP API Availability

```bash
curl http://localhost:3000/health
```

Should return:
```json
{
  "status": "ok",
  "timestamp": "...",
  "service": "openl-mcp-server",
  "version": "1.0.0"
}
```

### Step 3: Configure Cursor for Direct HTTP Connection

**No local proxy needed!** Cursor connects directly to the Docker container via HTTP.

1. Open Cursor settings (`Cmd + ,`)
2. Find "MCP" or "Model Context Protocol" section
3. Click "Add New Global MCP Server"
4. Enter name: `openl-mcp-server-docker`
5. Configure:
   - **Type:** Select `sse` or `streamablehttp`
   - **URL:** `http://localhost:3000/mcp/sse`

   Or use JSON configuration:
   ```json
   {
     "url": "http://localhost:3000/mcp/sse",
     "transport": "sse"
   }
   ```

6. Save and check connection status

**Note:** This method doesn't require Node.js or any local files on the client machine. Cursor connects directly to the Docker container via HTTP.

## Configuration

### Direct HTTP Connection

Cursor connects directly to the Docker container via HTTP SSE transport:

```json
{
  "mcpServers": {
    "openl-mcp-server-docker": {
      "url": "http://localhost:3000/mcp/sse",
      "transport": "sse"
    }
  }
}
```

### Authentication Configuration

The MCP server in Docker supports multiple authentication methods. **Important:** The examples below show environment variables in `compose.yaml` for **local development and testing only**. For production deployments, see [Security Best Practices](#security-considerations) below and refer to the [Authentication Guide](../guides/AUTHENTICATION.md) for secure alternatives.

#### Personal Access Token (PAT) - Recommended for Docker

Personal Access Token is the recommended authentication method for Docker deployments. It's simple and secure:

**⚠️ Security Warning:** The following examples use environment variables (`OPENL_PERSONAL_ACCESS_TOKEN`, `OPENL_USERNAME`, `OPENL_PASSWORD`) in `compose.yaml`. These are **ONLY for local development and testing**. **MUST NOT be used in production.** See [Security Considerations](#security-considerations) below for production alternatives.

**For Local Development/Testing:**

```yaml
mcp-server:
  environment:
    OPENL_BASE_URL: http://studio:8080/rest
    OPENL_PERSONAL_ACCESS_TOKEN: <your-pat-token>
    OPENL_CLIENT_DOCUMENT_ID: docker-compose-1
```

**To use PAT:**

1. **Create a PAT in OpenL Tablets UI:**
   - Log in to OpenL Tablets Studio
   - Go to **User Settings** → **Personal Access Tokens**
   - Click **Create Token**
   - Copy the token (shown only once!)

2. **Set environment variable (local development only):**
   ```bash
   export OPENL_PERSONAL_ACCESS_TOKEN=<your-pat-token>
   ```

3. **Update compose.yaml (local development only):**
   ```yaml
   mcp-server:
     environment:
       OPENL_PERSONAL_ACCESS_TOKEN: ${OPENL_PERSONAL_ACCESS_TOKEN}
   ```

4. **Restart container:**
   ```bash
   docker compose up -d mcp-server
   ```

**Benefits:**
- ✅ Simple to set up and rotate
- ✅ User-scoped tokens
- ✅ Optional expiration dates
- ✅ Can be revoked from UI

#### Basic Authentication

**⚠️ For Local Development/Testing Only:** The following example shows Basic Authentication with `OPENL_USERNAME` and `OPENL_PASSWORD` environment variables. **MUST NOT be used in production.** See [Security Considerations](#security-considerations) below.

```yaml
mcp-server:
  environment:
    OPENL_BASE_URL: http://studio:8080/rest
    OPENL_USERNAME: admin
    OPENL_PASSWORD: admin
    OPENL_CLIENT_DOCUMENT_ID: docker-compose-1
```

### Security Considerations

**⚠️ IMPORTANT:** The authentication examples above show environment variables (`OPENL_PERSONAL_ACCESS_TOKEN`, `OPENL_USERNAME`, `OPENL_PASSWORD`, etc.) configured directly in `compose.yaml`. 

**These examples are ONLY for local development and testing environments.** 

**The environment variables `OPENL_PERSONAL_ACCESS_TOKEN`, `OPENL_USERNAME`, and `OPENL_PASSWORD` MUST NOT be used in production.** For production deployments, use secure alternatives such as Docker secrets, external secret managers, or volume-mounted configuration files as described below. 

**For production deployments, you MUST:**

1. **Never commit credentials to version control** - Never hardcode `OPENL_PERSONAL_ACCESS_TOKEN`, `OPENL_USERNAME`, or `OPENL_PASSWORD` in `compose.yaml` files that are committed to Git.

2. **Use Docker secrets or secret managers** - For production, use one of these secure alternatives:
   - **Docker Secrets** (Docker Swarm):
     ```yaml
     mcp-server:
       secrets:
         - openl_pat_token
       environment:
         OPENL_PERSONAL_ACCESS_TOKEN_FILE: /run/secrets/openl_pat_token
     ```
   - **External secret managers** (HashiCorp Vault, AWS Secrets Manager, etc.):
     ```yaml
     mcp-server:
       environment:
         OPENL_PERSONAL_ACCESS_TOKEN: ${OPENL_PAT_TOKEN}  # From secret manager
     ```
   - **Volume-mounted config files** (with proper permissions):
     ```yaml
     mcp-server:
       volumes:
         - ./secrets:/secrets:ro
       environment:
         OPENL_PERSONAL_ACCESS_TOKEN_FILE: /secrets/pat_token
     ```

3. **Use per-session authentication** - For MCP clients (Cursor/Claude Desktop), prefer passing authentication via HTTP headers or query parameters instead of server-side environment variables. See [Authentication Guide](../guides/AUTHENTICATION.md) for details.

4. **Follow security best practices**:
   - Use HTTPS for all production connections
   - Rotate credentials regularly
   - Use least-privilege tokens (minimum required scopes)
   - Monitor and audit authentication attempts
   - Separate credentials for dev/staging/production environments

**For detailed security guidelines and production authentication setup, see the [Authentication Guide](../guides/AUTHENTICATION.md).**

### Changing URL

If Docker container is accessible at a different address:

```json
{
  "url": "http://your-docker-host:3000/mcp/sse",
  "transport": "sse"
}
```

Or if using Nginx proxy:

```json
{
  "url": "http://localhost/mcp/sse",
  "transport": "sse"
}
```

### Available Endpoints

- **SSE Endpoint:** `GET http://localhost:3000/mcp/sse` - Establishes SSE connection for MCP protocol
- **Messages Endpoint:** `POST http://localhost:3000/mcp/messages?sessionId=xxx` - Sends MCP messages
- **REST API:** `GET http://localhost:3000/tools` - List tools (for debugging)
- **Health Check:** `GET http://localhost:3000/health` - Server health status

## Verification

### 1. Check Status in Cursor

- Open Cursor settings
- Find MCP section
- Ensure `openl-mcp-server-docker` is connected (green dot)

### 2. Test in Cursor Chat

In Cursor chat, try:

```text
List repositories in OpenL Tablets
```

or

```text
Show projects in the design repository
```

### 3. Check Logs

If something doesn't work, check proxy logs:

```bash
# Proxy outputs logs to stderr
# They should be visible in Cursor logs
```

## Troubleshooting

### Issue: "Failed to connect to MCP HTTP API"

**Solution:**
1. Ensure Docker container is running:
   ```bash
   docker compose ps mcp-server
   ```

2. Check HTTP API availability:
   ```bash
   curl http://localhost:3000/health
   ```

3. Check that port 3000 is not occupied by another process:
   ```bash
   lsof -i :3000
   ```

### Issue: "Cannot connect to SSE endpoint"

**Solution:**
1. Ensure Docker container is running:
   ```bash
   docker compose ps mcp-server
   ```

2. Check SSE endpoint is accessible:
   ```bash
   curl http://localhost:3000/mcp/sse
   ```
   Should return SSE stream headers

3. Verify URL in Cursor configuration is correct:
   ```text
   http://localhost:3000/mcp/sse
   ```

### Issue: Connection fails

**Solution:**
1. Check URL in Cursor configuration (should be `http://localhost:3000/mcp/sse`)
2. Verify transport type is set to `sse`
3. Check Cursor logs for errors
4. Ensure Docker container is accessible from your machine

### Issue: Tools don't work

**Solution:**
1. Check that Docker container is running:
   ```bash
   docker compose logs mcp-server
   ```

2. Check OpenL Studio availability:
   ```bash
   curl http://localhost:8080/rest/projects
   ```

3. Ensure SSE endpoint is accessible:
   ```bash
   curl -N http://localhost:3000/mcp/sse
   ```
   Should start SSE stream

## Benefits of Using Docker

✅ **Isolation**: MCP Server runs in an isolated environment  
✅ **Scalability**: Easy to scale via Docker Compose  
✅ **Consistency**: Same environment on all machines  
✅ **Management**: Easy to update and restart  
✅ **Monitoring**: Built-in logs and health checks  

## Alternative: Using Local Proxy

If you prefer to use a local proxy instead of direct HTTP connection:

1. **Get the configuration:**
   See [MCP Connection Guide](./MCP-CONNECTION-GUIDE.md#scenario-2-connecting-to-mcp-in-docker-using-cursor) for complete configuration examples.

2. **Replace placeholders** in the configuration:
   - Replace `<your-pat-token>` with your Personal Access Token
   - Replace `http://localhost:3000` with your Docker container URL (if remote)
   - See the [MCP Connection Guide](./MCP-CONNECTION-GUIDE.md#scenario-2-connecting-to-mcp-in-docker-using-cursor) for detailed instructions

3. **Add the configuration** to Cursor IDE settings (see the guide above)

**Note:** This method requires Node.js on the client machine. The proxy runs locally and connects to Docker via HTTP.

However, **direct HTTP connection is recommended** as it doesn't require any local setup.

## Additional Information

- [MCP Connection Guide](MCP-CONNECTION-GUIDE.md) - Complete setup guide for Claude Desktop and Cursor (all scenarios)
- [Docker Setup](DOCKER.md) - Docker deployment information
- [Main README](../../README.md) - Complete MCP server documentation
