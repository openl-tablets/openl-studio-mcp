# 🔐 Setting up Claude Desktop with MCP Server using Personal Access Token (PAT)

This guide shows how to configure Claude Desktop to connect to the OpenL Tablets MCP Server using Personal Access Token (PAT) authentication.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Creating a Personal Access Token](#creating-a-personal-access-token)
- [Configuration Methods](#configuration-methods)
  - [Method 1: Remote Server via HTTPS (Recommended)](#method-1-remote-server-via-https-recommended)
  - [Method 2: Local Server via stdio](#method-2-local-server-via-stdio)
- [Configuration File Location](#configuration-file-location)
- [Verification](#verification)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

- Claude Desktop installed and running
- Personal Access Token created in OpenL Tablets UI
- (For remote connection) MCP server accessible via HTTPS
- (For local connection) Node.js installed and MCP server built

---

## Creating a Personal Access Token

1. **Log in to OpenL Tablets Studio**
   - Open your browser and navigate to OpenL Tablets Studio
   - Log in with your credentials

2. **Navigate to Personal Access Tokens**
   - Go to **User Settings** → **Personal Access Tokens**
   - Or navigate to: `https://<your-openl-server>/studio/#/settings/tokens`

3. **Create a New Token**
   - Click **Create Token** or **New Token**
   - Enter a descriptive name (e.g., "Claude Desktop MCP")
   - Optionally set an expiration date (or leave blank for no expiration)
   - Click **Create**

4. **Copy the Token**
   - ⚠️ **IMPORTANT**: Copy the token immediately - it's shown only once!
   - Store it securely (password manager recommended)
   - Format: `openl_pat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

---

## Configuration Methods

There are two ways to connect to OpenL Tablets MCP Server:

### Method 1: Remote MCP Server via SSE (Recommended for Remote Access)

This method connects directly to a remote MCP server running on OpenL infrastructure using SSE transport via `mcp-remote`. This is the simplest way to connect to a remote OpenL instance.

**Configuration:**

```json
{
  "mcpServers": {
    "openl-remote": {
      "command": "/path/to/node",
      "args": [
        "/path/to/mcp-remote",
        "https://<your-openl-server>/mcp/sse",
        "--header",
        "Authorization: Token your-pat-token-here"
      ]
    }
  }
}
```

**Example with nvm:**

```json
{
  "mcpServers": {
    "openl-remote": {
      "command": "/Users/username/.nvm/versions/node/v22.16.0/bin/node",
      "args": [
        "/Users/username/.nvm/versions/node/v22.16.0/bin/mcp-remote",
        "https://<your-openl-server>/mcp/sse",
        "--header",
        "Authorization: Token <your-pat-token>"
      ]
    }
  }
}
```

**Finding Node.js and mcp-remote paths:**

```bash
# Find Node.js path
which node
# Example output: /Users/username/.nvm/versions/node/v22.16.0/bin/node

# Find mcp-remote path (usually in the same directory as node)
which mcp-remote
# Or if not in PATH, it's usually: <node-directory>/mcp-remote
```

**Important:** 
- Replace `/path/to/node` with your Node.js executable path
- Replace `/path/to/mcp-remote` with your `mcp-remote` executable path
- Replace `your-pat-token-here` with your actual Personal Access Token from OpenL Tablets UI

**Advantages:**
- ✅ No local setup required (no need to build MCP server locally)
- ✅ Always uses latest server version
- ✅ Simple configuration
- ✅ Secure token transmission via Authorization header

**Requirements:**
- Node.js installed
- `mcp-remote` installed (usually comes with Node.js or can be installed via `npm install -g mcp-remote`)
- Network access to `https://<your-openl-server>`
- Personal Access Token from OpenL Tablets UI

**Note:** If you get `ENOTFOUND` errors, check your network connection, DNS settings, or VPN configuration.

### Method 2: Local MCP Server via stdio (Recommended for Local Development)

This method runs the MCP server locally via stdio, but connects to a remote OpenL backend via HTTPS. Requires Node.js and MCP server to be built locally.

**Note:** Replace `<path-to-project>` with the actual path to your `openl-studio-mcp` project directory (e.g., `/Users/yourname/projects/openl-studio-mcp` or `~/projects/openl-studio-mcp`).

#### macOS/Linux Configuration

```json
{
  "mcpServers": {
    "openl-mcp-server-remote": {
      "command": "node",
      "args": [
        "<path-to-project>/dist/index.js"
      ],
      "env": {
        "OPENL_BASE_URL": "https://<your-openl-server>/studio/rest",
        "OPENL_PERSONAL_ACCESS_TOKEN": "<your-pat-token>",
        "OPENL_CLIENT_DOCUMENT_ID": "claude-desktop-remote"
      }
    }
  }
}
```

#### Windows Configuration

```json
{
  "mcpServers": {
    "openl-mcp-server-remote": {
      "command": "node",
      "args": [
        "<path-to-project>\\dist\\index.js"
      ],
      "env": {
        "OPENL_BASE_URL": "https://<your-openl-server>/studio/rest",
        "OPENL_PERSONAL_ACCESS_TOKEN": "<your-pat-token>",
        "OPENL_CLIENT_DOCUMENT_ID": "claude-desktop-remote"
      }
    }
  }
}
```

**Advantages:**
- ✅ Works with remote OpenL backends via HTTPS
- ✅ Secure token storage in environment variables
- ✅ Full control over MCP server process
- ✅ Can debug locally

---

### Method 3: Local OpenL Backend

This method runs both MCP server and OpenL locally. Requires Node.js, MCP server built, and local OpenL running.

**Note:** Replace `<path-to-project>` with the actual path to your `openl-studio-mcp` project directory.

#### macOS/Linux Configuration

```json
{
  "mcpServers": {
    "openl-mcp-server-local": {
      "command": "node",
      "args": [
        "<path-to-project>/dist/index.js"
      ],
      "env": {
        "OPENL_BASE_URL": "http://localhost:8080/rest",
        "OPENL_PERSONAL_ACCESS_TOKEN": "<your-pat-token>",
        "OPENL_CLIENT_DOCUMENT_ID": "claude-desktop-local"
      }
    }
  }
}
```

**Advantages:**
- ✅ Full control over server process
- ✅ Can debug locally
- ✅ No network dependency (except for OpenL backend)

**Requirements:**
- Node.js 24+ installed
- MCP server built (`npm run build` in project root directory)

---

## Configuration File Location

### macOS

```
~/Library/Application Support/Claude/claude_desktop_config.json
```

Or:

```
~/Library/Application Support/Claude/config.json
```

### Windows

```
%APPDATA%\Claude\claude_desktop_config.json
```

### Linux

```
~/.config/Claude/claude_desktop_config.json
```

---

## Verification

1. **Save the configuration file**
   - Make sure JSON is valid (no trailing commas, proper quotes)
   - Save the file

2. **Restart Claude Desktop**
   - Quit Claude Desktop completely
   - Reopen Claude Desktop

3. **Check MCP Connection**
   - Open Claude Desktop settings (⚙️ or `Cmd + ,` / `Ctrl + ,`)
   - Look for "MCP Servers" or "Model Context Protocol" section
   - Verify `openl-mcp-server-remote` (or your server name) is listed
   - Check connection status (should show "Connected" or green indicator)

4. **Test MCP Tools**
   - Start a new conversation in Claude Desktop
   - Ask Claude to list available OpenL tools:
     ```text
     What OpenL Tablets tools are available?
     ```
   - Claude should be able to use MCP tools like `openl_list_repositories`, `openl_list_projects`, etc.

---

## Troubleshooting

### Connection Issues

**Problem**: MCP server shows as disconnected or not found

**Solutions**:
1. Verify the configuration file path is correct
2. Check JSON syntax (use a JSON validator)
3. Ensure PAT token is correct (no extra spaces, complete token)
4. For remote connection: Verify server is accessible:
   ```bash
   curl https://<your-openl-server>/mcp/health
   ```
5. For local connection: Verify Node.js path and MCP server is built:
   ```bash
   node --version  # Should be 24+
   ls <path-to-project>/dist/index.js  # File should exist
   ```

### DNS/Network Issues (ENOTFOUND)

**Problem**: `npm ERR! code ENOTFOUND` or `getaddrinfo ENOTFOUND <your-openl-server>`

This error indicates that your system cannot resolve the domain name `<your-openl-server>`. This is a network/DNS issue, not a configuration problem.

**Solutions**:

1. **Check DNS Resolution**:
   ```bash
   nslookup <your-openl-server>
   # or
   dig <your-openl-server>
   ```

2. **Check Network Connectivity**:
   ```bash
   ping <your-openl-server>
   curl -v https://<your-openl-server>/mcp/sse
   ```

3. **VPN/Proxy Issues**:
   - If you're behind a corporate VPN, ensure it's connected
   - Check if you need to configure proxy settings:
     ```bash
     npm config set proxy http://proxy.company.com:8080
     npm config set https-proxy http://proxy.company.com:8080
     ```

4. **Firewall/Security Software**:
   - Check if firewall is blocking connections
   - Temporarily disable security software to test

5. **Alternative: Use Local MCP Server**:
   If the remote server is not accessible, use Method 2 (local stdio) instead:
   ```json
   {
     "mcpServers": {
       "openl-mcp-server": {
         "command": "node",
         "args": ["<path-to-project>/dist/index.js"],
         "env": {
           "OPENL_BASE_URL": "https://<your-openl-server>/studio/rest",
           "OPENL_PERSONAL_ACCESS_TOKEN": "your-token-here"
         }
       }
     }
   }
   ```

### Authentication Issues

**Problem**: "Authentication failed" or "Unauthorized" errors

**Solutions**:
1. Verify PAT token is valid and not expired
2. Check token format: Should start with `openl_pat_`
3. Ensure token has required permissions in OpenL Tablets
4. Try creating a new token and updating configuration

### Transport Issues

**Problem**: SSE connection fails, falls back to StreamableHTTP

**Solutions**:
1. For HTTPS, prefer `streamablehttp` transport (more reliable)
2. Check server logs for connection errors
3. Verify CORS headers are set correctly on server
4. Check firewall/network settings

### Path Issues (Local stdio)

**Problem**: "Command not found" or "File not found" errors

**Solutions**:
1. Use absolute paths (not relative)
2. Verify Node.js is in PATH or use full path:
   ```json
   "command": "/usr/local/bin/node"  // macOS
   "command": "C:\\Program Files\\nodejs\\node.exe"  // Windows
   ```
3. Verify MCP server is built:
   ```bash
   cd <path-to-project>
   npm run build
   ```

---

## Security Best Practices

1. **Token Storage**
   - ✅ Store PAT tokens securely (password manager)
   - ✅ Never commit tokens to version control
   - ✅ Use different tokens for different environments
   - ✅ Rotate tokens regularly

2. **Token Permissions**
   - ✅ Use tokens with minimal required permissions
   - ✅ Set expiration dates when possible
   - ✅ Revoke unused tokens immediately

3. **Configuration File**
   - ✅ Set appropriate file permissions (chmod 600 on Unix)
   - ✅ Don't share configuration files
   - ✅ Use environment variables when possible (for local development)

---

## Example: Complete Configuration

Here's a complete example with all connection methods:

```json
{
  "mcpServers": {
    "openl-remote": {
      "comment": "Remote MCP Server via SSE (recommended for remote access)",
      "command": "/Users/username/.nvm/versions/node/v22.16.0/bin/node",
      "args": [
        "/Users/username/.nvm/versions/node/v22.16.0/bin/mcp-remote",
        "https://<your-openl-server>/mcp/sse",
        "--header",
        "Authorization: Token <your-pat-token>"
      ]
    },
    "openl-local-production": {
      "comment": "Local MCP Server connecting to remote OpenL via HTTPS",
      "command": "/Users/username/.nvm/versions/node/v22.16.0/bin/node",
      "args": [
        "<path-to-project>/dist/index.js"
      ],
      "env": {
        "OPENL_BASE_URL": "https://<your-openl-server>/studio/rest",
        "OPENL_PERSONAL_ACCESS_TOKEN": "<your-pat-token>",
        "OPENL_CLIENT_DOCUMENT_ID": "claude-desktop-production"
      }
    },
    "openl-local-dev": {
      "comment": "Local development: MCP server connects to local OpenL",
      "command": "/Users/username/.nvm/versions/node/v22.16.0/bin/node",
      "args": [
        "<path-to-project>/dist/index.js"
      ],
      "env": {
        "OPENL_BASE_URL": "http://localhost:8080/rest",
        "OPENL_PERSONAL_ACCESS_TOKEN": "<your-pat-token>",
        "OPENL_CLIENT_DOCUMENT_ID": "claude-desktop-local"
      }
    }
  }
}
```

---

## Additional Resources

- [Authentication Guide](../../guides/AUTHENTICATION.md) - Detailed authentication documentation
- [Quick Start Guide](../getting-started/QUICK-START.md) - Getting started with MCP server
- [Troubleshooting Guide](../../guides/TROUBLESHOOTING.md) - Common issues and solutions
