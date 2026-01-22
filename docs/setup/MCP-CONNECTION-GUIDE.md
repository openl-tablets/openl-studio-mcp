# 🔌 Complete Guide to MCP Server Connection Setup

This is a detailed step-by-step guide for setting up connections to the OpenL Tablets MCP server for various usage scenarios.

## Quick Start

Choose your setup scenario:
- **Remote MCP Server** → [Scenario 1 (Cursor)](#scenario-1-connecting-to-remote-mcp-using-cursor) or [Scenario 3 (Claude Desktop)](#scenario-3-connecting-to-remote-mcp-using-claude-desktop)
- **Docker MCP Server** → [Scenario 2 (Cursor)](#scenario-2-connecting-to-mcp-in-docker-using-cursor) or [Scenario 4 (Claude Desktop)](#scenario-4-connecting-to-mcp-in-docker-using-claude-desktop)

**Before you start:** Make sure you have created a [Personal Access Token](#step-1-creating-a-personal-access-token-pat) in OpenL Tablets UI.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Step 1: Creating a Personal Access Token (PAT)](#step-1-creating-a-personal-access-token-pat)
- [Scenario 1: Connecting to Remote MCP using Cursor](#scenario-1-connecting-to-remote-mcp-using-cursor)
- [Scenario 2: Connecting to MCP in Docker using Cursor](#scenario-2-connecting-to-mcp-in-docker-using-cursor)
- [Scenario 3: Connecting to Remote MCP using Claude Desktop](#scenario-3-connecting-to-remote-mcp-using-claude-desktop)
- [Scenario 4: Connecting to MCP in Docker using Claude Desktop](#scenario-4-connecting-to-mcp-in-docker-using-claude-desktop)
- [Verifying Connection](#verifying-connection)
- [Troubleshooting](#troubleshooting)
- [Complete Configuration Examples](#complete-configuration-examples)

---

## Prerequisites

Before starting the setup, ensure you have the following installed:

### 1. Node.js version 24 or higher

**Check version:**
```bash
node --version
# Should be: v24.x.x or higher
```

**Installation:**

**macOS (via Homebrew):**
```bash
brew install node@24
```

**macOS (via nvm - recommended):**
```bash
# Install nvm (if not already installed)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart terminal or run:
source ~/.zshrc  # for zsh
# or
source ~/.bash_profile  # for bash

# Install Node.js 24
nvm install 24
nvm use 24
nvm alias default 24
```

**Windows:**
1. Download installer from [nodejs.org](https://nodejs.org/)
2. Select version 24.x LTS
3. Run installer and follow instructions

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. mcp-remote utility (for remote connections)

`mcp-remote` is a command-line utility for connecting to remote MCP servers via SSE (Server-Sent Events).

**Install via npm:**
```bash
npm install -g mcp-remote
```

**Verify installation:**
```bash
which mcp-remote
# Should show path, e.g.: /Users/username/.nvm/versions/node/v24.0.0/bin/mcp-remote

mcp-remote --version
# Should show utility version
```

**Note:** If `mcp-remote` is not found after installation, ensure the npm global packages path is added to PATH:
```bash
# Check npm global packages path
npm config get prefix
# Add this path to PATH if it's not there
```

### 3. Cursor IDE or Claude Desktop

**Cursor IDE:**
- Download from [cursor.com](https://cursor.com)
- Install and launch the application

**Claude Desktop:**
- Download from [claude.ai/download](https://claude.ai/download)
- Install and launch the application
- Sign in to your Anthropic account

---

## Step 1: Creating a Personal Access Token (PAT)

Personal Access Token (PAT) is a secure way to authenticate without using a password. The token is created in the OpenL Tablets interface and used for API access.

### Step-by-Step Instructions

1. **Open OpenL Tablets Studio in your browser**
   - Navigate to your OpenL server address
   - Log in using your corporate SSO or authentication method

2. **Navigate to user settings**
   - Click on the profile icon in the top right corner
   - Select **"User Settings"**

3. **Open Personal Access Tokens section**
   - In the settings menu, find the **"Personal Access Tokens"** section
   - Click on it

4. **Create a new token**
   - Click the **"Create Token"** button
   - Enter a descriptive token name:
     - For Cursor: `Cursor MCP Server`
     - For Claude Desktop: `Claude Desktop MCP`
     - For Docker: `Docker MCP Server`
   - (Optional) Set token expiration date
     - Recommended: 90 days

5. **Copy the token immediately**
   - ⚠️ **IMPORTANT**: The token is shown only once when created!
   - Copy the entire token completely
   - Token format: `openl_pat_<publicId>.<secret>`
   - Save the token in a secure location (password manager, encrypted file)

6. **Verify token creation**
   - A new token with the specified name should appear in the token list
   - You can see creation and expiration dates, but not the token itself (it's no longer displayed)

### Token Security

- ✅ **Store tokens securely** - use a password manager
- ✅ **Don't commit tokens to Git** - add configuration files to `.gitignore`
- ✅ **Use different tokens** for different environments (dev/staging/production)
- ✅ **Rotate tokens regularly** - delete unused tokens
- ✅ **Delete tokens if leaked** - immediately delete the token in UI and create a new one

---

## Scenario 1: Connecting to Remote MCP using Cursor

There are two methods to connect Cursor IDE to a remote MCP server:

1. **Via mcp-remote utility** (recommended) - Uses command/args format
2. **Direct HTTP connection** - Uses url/transport format (if remote server provides HTTP SSE endpoint)

### Method A: Via mcp-remote Utility (Recommended)

This method uses the `mcp-remote` command-line utility to connect to remote MCP servers. This is the standard approach for remote connections.

#### Step 1.1: Finding Node.js and mcp-remote Paths

**macOS/Linux:**
```bash
# Find Node.js path
which node
# Example output: /Users/username/.nvm/versions/node/v24.0.0/bin/node

# Find mcp-remote path
which mcp-remote
# Example output: /Users/username/.nvm/versions/node/v24.0.0/bin/mcp-remote
```

**Windows:**
```powershell
# Find Node.js path
where.exe node
# Example output: C:\Program Files\nodejs\node.exe

# Find mcp-remote path
where.exe mcp-remote
# Example output: C:\Users\username\AppData\Roaming\npm\mcp-remote.cmd
```

**If mcp-remote is not found:**
```bash
# Install globally
npm install -g mcp-remote

# Check npm global packages path
npm config get prefix
# Add this path to PATH if it's not there
```

#### Step 1.2: Configuration in Cursor IDE

#### Via Cursor UI (Recommended)

1. Open Cursor IDE
2. Press `Cmd + ,` (macOS) or `Ctrl + ,` (Windows/Linux) to open settings
   - Or via menu: `File` → `Preferences` → `Settings`
3. In settings search, type: `MCP` or `Model Context Protocol`
4. Find the **"Tools & MCP"** section
5. Click **"Add Custom MCP Server"** or the **"+"** button
6. Paste the following configuration (replace paths and token):

```json
{
  "command": "/Users/username/.nvm/versions/node/v24.0.0/bin/node",
  "args": [
    "/Users/username/.nvm/versions/node/v24.0.0/bin/mcp-remote",
    "https://<your-openl-server>/mcp/sse",
    "--header",
    "Authorization: Token <your-pat-token>"
  ]
}
```

**Important:** Replace:
- `/Users/username/.nvm/versions/node/v24.0.0/bin/node` → your Node.js path
- `/Users/username/.nvm/versions/node/v24.0.0/bin/mcp-remote` → your mcp-remote path
- `https://<your-openl-server>/mcp/sse` → your OpenL server URL with `/mcp/sse` path
- Replace `<your-pat-token>` with your Personal Access Token

**Via Configuration File**

1. Open Cursor configuration file:

**macOS:**
```bash
open ~/Library/Application\ Support/Cursor/User/settings.json
```

**Windows:**
```powershell
notepad %APPDATA%\Cursor\User\settings.json
```

**Linux:**
```bash
nano ~/.config/Cursor/User/settings.json
```

2. Find or create the `mcpServers` section and add:

```json
{
  "mcpServers": {
    "openl-mcp-server-remote": {
      "command": "/Users/username/.nvm/versions/node/v24.0.0/bin/node",
      "args": [
        "/Users/username/.nvm/versions/node/v24.0.0/bin/mcp-remote",
        "https://<your-openl-server>/mcp/sse",
        "--header",
        "Authorization: Token <your-pat-token>"
      ]
    }
  }
}
```

3. Save the file (ensure JSON is valid - no trailing commas)

#### Step 1.3: Restart Cursor

1. Completely close Cursor IDE
2. Open Cursor again
3. Check connection status in MCP settings

### Method B: Direct HTTP Connection (Alternative)

If the remote MCP server provides a direct HTTP SSE endpoint (similar to Docker setup), you can connect directly using `url` and `transport` format. This method doesn't require `mcp-remote` utility.

**Configuration:**

```json
{
  "url": "https://<your-openl-server>/mcp/sse",
  "transport": "sse",
  "headers": {
    "Authorization": "Token <your-pat-token>"
  }
}
```

**Or using StreamableHTTP transport (more reliable for HTTPS):**

```json
{
  "url": "https://<your-openl-server>/mcp/sse",
  "transport": "streamablehttp",
  "headers": {
    "Authorization": "Token <your-pat-token>"
  }
}
```

**Important:** 
- Replace `https://<your-openl-server>/mcp/sse` with your OpenL server URL
- Replace `<your-pat-token>` with your Personal Access Token
- Use `transport: "sse"` for SSE (Server-Sent Events) - standard for most cases
- Use `transport: "streamablehttp"` for StreamableHTTP - more reliable for HTTPS, uses POST requests instead of GET

**Note:** This method works if the remote server exposes an HTTP endpoint for MCP. If you're unsure, use Method A (mcp-remote) which is more universally supported.

---

## Scenario 2: Connecting to MCP in Docker using Cursor

This method connects Cursor IDE to an MCP server running in a Docker container. The MCP server runs as an HTTP server with SSE transport.

### Step 2.1: Verifying Docker Container Availability

**Local Docker:**

```bash
# Check that container is running
docker ps | grep mcp-server
# Should show running container

# Check health endpoint
curl http://localhost:3000/health
# Should return: {"status":"ok",...}
```

**Remote Docker:**

```bash
# Replace <docker-host> with your Docker server IP or domain
curl http://<docker-host>:3000/health
# Should return: {"status":"ok",...}
```

**If container is not running:**

```bash
# Navigate to project directory
cd /path/to/openl-studio-mcp

# Start container
docker compose up -d mcp-server

# Check logs
docker compose logs mcp-server
```

### Step 2.2: Configuration in Cursor IDE

#### Method 1: Via Cursor UI (Recommended)

1. Open Cursor IDE
2. Press `Cmd + ,` (macOS) or `Ctrl + ,` (Windows/Linux)
3. Find the **"MCP Servers"** section
4. Click **"Add New Global MCP Server"** or **"+"**
5. Enter name: `openl-mcp-server-docker`
6. Paste configuration:

**For local Docker:**
```json
{
  "url": "http://localhost:3000/mcp/sse",
  "transport": "sse",
  "headers": {
    "Authorization": "Token <your-pat-token>"
  }
}
```

**For remote Docker:**
```json
{
  "url": "http://<docker-host>:3000/mcp/sse",
  "transport": "sse",
  "headers": {
    "Authorization": "Token <your-pat-token>"
  }
}
```

**Important:** Replace:
- `http://localhost:3000` → your Docker container URL (for remote: `http://<docker-host>:3000`)
- Replace `<your-pat-token>` with your Personal Access Token

**Method 2: Via Configuration File**

1. Open Cursor configuration file (see Scenario 1, Method 2)
2. Add to the `mcpServers` section:

```json
{
  "mcpServers": {
    "openl-mcp-server-docker": {
      "url": "http://localhost:3000/mcp/sse",
      "transport": "sse",
      "headers": {
        "Authorization": "Token <your-pat-token>"
      }
    }
  }
}
```

3. Save the file

### Step 2.3: Restart Cursor

1. Completely close Cursor IDE
2. Open Cursor again
3. Check connection status

---

## Scenario 3: Connecting to Remote MCP using Claude Desktop

This method connects Claude Desktop directly to a remote MCP server via SSE transport.

### Step 3.1: Finding Node.js and mcp-remote Paths

Follow the same steps as in [Scenario 1, Step 1.1](#step-11-finding-nodejs-and-mcp-remote-paths).

### Step 3.2: Claude Desktop Configuration

1. **Find Claude Desktop configuration file:**

**macOS:**
```bash
open ~/Library/Application\ Support/Claude/claude_desktop_config.json
# Or alternative path:
open ~/Library/Application\ Support/Claude/config.json
```

**Windows:**
```powershell
notepad %APPDATA%\Claude\claude_desktop_config.json
```

**Linux:**
```bash
nano ~/.config/Claude/claude_desktop_config.json
```

2. **If file doesn't exist, create it** with the following content:

```json
{
  "mcpServers": {
    "openl-mcp-server-remote": {
      "command": "/Users/username/.nvm/versions/node/v24.0.0/bin/node",
      "args": [
        "/Users/username/.nvm/versions/node/v24.0.0/bin/mcp-remote",
        "https://<your-openl-server>/mcp/sse",
        "--header",
        "Authorization: Token <your-pat-token>"
      ]
    }
  }
}
```

3. **If file already exists**, add the `mcpServers` section or update existing:

```json
{
  "mcpServers": {
    "openl-mcp-server-remote": {
      "command": "/Users/username/.nvm/versions/node/v24.0.0/bin/node",
      "args": [
        "/Users/username/.nvm/versions/node/v24.0.0/bin/mcp-remote",
        "https://<your-openl-server>/mcp/sse",
        "--header",
        "Authorization: Token <your-pat-token>"
      ]
    }
  }
}
```

**Important:** Replace:
- `/Users/username/.nvm/versions/node/v24.0.0/bin/node` → your Node.js path
- `/Users/username/.nvm/versions/node/v24.0.0/bin/mcp-remote` → your mcp-remote path
- `https://<your-openl-server>/mcp/sse` → your OpenL server URL
- Replace `<your-pat-token>` with your Personal Access Token

4. **Save the file** (ensure JSON is valid)

### Step 3.3: Restart Claude Desktop

1. Completely close Claude Desktop (Quit from menu or `Cmd + Q`)
2. Open Claude Desktop again
3. Check connection in settings (⚙️ or `Cmd + ,`)

---

## Scenario 4: Connecting to MCP in Docker using Claude Desktop

This method connects Claude Desktop to an MCP server running in a Docker container.

### Step 4.1: Verifying Docker Container Availability

Follow the same steps as in [Scenario 2, Step 2.1](#step-21-verifying-docker-container-availability).

### Step 4.2: Claude Desktop Configuration

1. **Open Claude Desktop configuration file** (see [Scenario 3, Step 3.2](#step-32-claude-desktop-configuration))

2. **Add or update configuration:**

**For local Docker:**
```json
{
  "mcpServers": {
    "openl-mcp-server-docker": {
      "url": "http://localhost:3000/mcp/sse",
      "transport": "sse",
      "headers": {
        "Authorization": "Token <your-pat-token>"
      }
    }
  }
}
```

**For remote Docker:**
```json
{
  "mcpServers": {
    "openl-mcp-server-docker": {
      "url": "http://<docker-host>:3000/mcp/sse",
      "transport": "sse",
      "headers": {
        "Authorization": "Token <your-pat-token>"
      }
    }
  }
}
```

**Important:** Replace:
- `http://localhost:3000` → your Docker container URL
- Replace `<your-pat-token>` with your Personal Access Token

3. **Save the file**

### Step 4.3: Restart Claude Desktop

1. Completely close Claude Desktop
2. Open Claude Desktop again
3. Check connection

---

## Verifying Connection

After configuring any of the scenarios, perform verification:

### In Cursor IDE

1. **Check status in settings:**
   - Open settings (`Cmd + ,` / `Ctrl + ,`)
   - Find MCP Servers section
   - Status should be: ✅ **"Connected"** or green indicator

2. **Test in chat:**
   - Open chat in Cursor
   - Enter request:
     ```text
     List repositories in OpenL Tablets
     ```
   - Or:
     ```text
     Show projects in the design repository
     ```
   - Cursor should use MCP tools and show results

### In Claude Desktop

1. **Check status in settings:**
   - Open Claude Desktop
   - Click settings icon (⚙️) or `Cmd + ,`
   - Find "MCP Servers" or "Model Context Protocol" section
   - Status should be: ✅ **"Connected"** or green indicator

2. **Test in chat:**
   - Start a new conversation
   - Enter request:
     ```text
     What OpenL Tablets tools are available?
     ```
   - Or:
     ```text
     List repositories in OpenL Tablets
     ```
   - Claude should use MCP tools and show results

---

## Troubleshooting

### Issue: MCP Server Not Connecting

**Symptoms:**
- Status shows "Disconnected" or red indicator
- Errors in logs

**Solutions:**

1. **Check Node.js and mcp-remote paths:**
   ```bash
   which node
   which mcp-remote
   ```
   Ensure paths in configuration exactly match command outputs.

2. **Check JSON format:**
   - Ensure there are no trailing commas
   - Use JSON validator: [jsonlint.com](https://jsonlint.com/)

3. **Check token:**
   - Ensure token is copied completely
   - Check that token hasn't expired (if expiration date was set)
   - Ensure token wasn't deleted in OpenL Tablets UI

4. **Check network availability (for remote connections):**
   ```bash
   # DNS check
   nslookup <your-openl-server>
   
   # Availability check
   curl -v https://<your-openl-server>/mcp/sse
   ```

5. **Check logs:**
   
   **Cursor:**
   ```bash
   tail -f ~/Library/Logs/Cursor/*.log
   ```
   
   **Claude Desktop:**
   ```bash
   tail -f ~/Library/Logs/Claude/*.log
   ```

### Issue: "ENOTFOUND" or "getaddrinfo ENOTFOUND" Error

**Symptoms:**
- DNS error when connecting to remote server
- Cannot resolve domain name

**Solutions:**

1. **Check DNS:**
   ```bash
   nslookup <your-openl-server>
   dig <your-openl-server>
   ```

2. **Check VPN/proxy:**
   - Ensure VPN is connected (if required)
   - Check proxy settings

3. **Check firewall:**
   - Ensure ports are not blocked
   - Check security rules

### Issue: 401 Unauthorized Error

**Symptoms:**
- Authentication error when connecting
- "Authentication failed" in logs

**Solutions:**

1. **Check token format:**
   - Token should start with `openl_pat_`
   - Ensure token is copied completely (including dot and secret part)

2. **Check Authorization header format:**
   - Should be: `Authorization: Token <your-token>`
   - Note the space after "Token"

3. **Check token expiration:**
   - Go to OpenL Tablets UI
   - Check token list
   - Ensure token hasn't expired

4. **Create new token:**
   - Delete old token in UI
   - Create new token
   - Update configuration

### Issue: Docker Container Not Available

**Symptoms:**
- Cannot connect to `http://localhost:3000`
- "Connection refused" error

**Solutions:**

1. **Check that container is running:**
   ```bash
   docker ps | grep mcp-server
   ```

2. **Check container logs:**
   ```bash
   docker compose logs mcp-server
   ```

3. **Check port:**
   ```bash
   # Check that port is open
   lsof -i :3000
   # or
   netstat -an | grep 3000
   ```

4. **Restart container:**
   ```bash
   docker compose restart mcp-server
   ```

### Issue: mcp-remote Not Found

**Symptoms:**
- Error "command not found: mcp-remote"
- Incorrect mcp-remote path

**Solutions:**

1. **Install mcp-remote:**
   ```bash
   npm install -g mcp-remote
   ```

2. **Find path:**
   ```bash
   which mcp-remote
   # If not found, check npm global packages path:
   npm config get prefix
   ```

3. **Add path to PATH (if necessary):**
   
   **macOS/Linux:**
   ```bash
   # Add to ~/.zshrc or ~/.bash_profile
   export PATH="$(npm config get prefix)/bin:$PATH"
   ```

### Issue: Incorrect Node.js Version

**Symptoms:**
- Errors when running mcp-remote
- Requires Node.js 24+

**Solutions:**

1. **Check version:**
   ```bash
   node --version
   # Should be: v24.x.x or higher
   ```

2. **Update Node.js:**
   ```bash
   # Via nvm
   nvm install 24
   nvm use 24
   
   # Or via Homebrew (macOS)
   brew upgrade node@24
   ```

3. **Update paths in configuration:**
   - After updating Node.js, paths may change
   - Run `which node` and `which mcp-remote` again
   - Update configuration with new paths

---

## Additional Resources

- [Authentication Guide](../guides/AUTHENTICATION.md) - Detailed authentication information (Basic Auth, PAT)
- [Troubleshooting Guide](../guides/TROUBLESHOOTING.md) - Common issues and solutions
- [Quick Start Guide](../getting-started/QUICK-START.md) - Quick start guide
- [Docker Setup](./DOCKER.md) - Running MCP server in Docker
- [Cursor Docker Setup](./CURSOR-DOCKER.md) - Detailed Docker connection guide (alternative reference)

---

## Complete Configuration Examples

### Cursor: Remote Connection (via mcp-remote)

```json
{
  "mcpServers": {
    "openl-mcp-server-remote": {
      "command": "/Users/username/.nvm/versions/node/v24.0.0/bin/node",
      "args": [
        "/Users/username/.nvm/versions/node/v24.0.0/bin/mcp-remote",
        "https://<your-openl-server>/mcp/sse",
        "--header",
        "Authorization: Token <your-pat-token>"
      ]
    }
  }
}
```

### Cursor: Remote Connection (Direct HTTP - when server provides SSE endpoint)

```json
{
  "mcpServers": {
    "openl-mcp-server-remote": {
      "url": "https://<your-openl-server>/mcp/sse",
      "transport": "sse",
      "headers": {
        "Authorization": "Token <your-pat-token>"
      }
    }
  }
}
```

**Note:** Use this format when the remote server provides a direct HTTP SSE endpoint. This is simpler than using `mcp-remote` and doesn't require Node.js paths.

### Cursor: Docker Connection

```json
{
  "mcpServers": {
    "openl-mcp-server-docker": {
      "url": "http://localhost:3000/mcp/sse",
      "transport": "sse",
      "headers": {
        "Authorization": "Token <your-pat-token>"
      }
    }
  }
}
```

### Claude Desktop: Remote Connection

```json
{
  "mcpServers": {
    "openl-mcp-server-remote": {
      "command": "/Users/username/.nvm/versions/node/v24.0.0/bin/node",
      "args": [
        "/Users/username/.nvm/versions/node/v24.0.0/bin/mcp-remote",
        "https://<your-openl-server>/mcp/sse",
        "--header",
        "Authorization: Token <your-pat-token>"
      ]
    }
  }
}
```

### Claude Desktop: Docker Connection

```json
{
  "mcpServers": {
    "openl-mcp-server-docker": {
      "url": "http://localhost:3000/mcp/sse",
      "transport": "sse",
      "headers": {
        "Authorization": "Token <your-pat-token>"
      }
    }
  }
}
```

---

**Note:** In all examples, replace:
- Node.js and mcp-remote paths with your actual paths
- OpenL server URL with your server
- Personal Access Token with your token
