# 🔌 Complete Guide to MCP Server Connection Setup

This is a detailed step-by-step guide for setting up connections to the OpenL Studio MCP server for various usage scenarios.

## Quick Start

Choose your setup scenario:
- **Remote MCP Server** → [Scenario 1 (Cursor)](#scenario-1-connecting-to-remote-mcp-using-cursor), [Scenario 3 (Claude Desktop)](#scenario-3-connecting-to-remote-mcp-using-claude-desktop), or [Scenario 5 (VS Code)](#scenario-5-connecting-to-remote-mcp-using-vs-code)
- **Docker MCP Server** → [Scenario 2 (Cursor)](#scenario-2-connecting-to-mcp-in-docker-using-cursor), [Scenario 4 (Claude Desktop)](#scenario-4-connecting-to-mcp-in-docker-using-claude-desktop), or [Scenario 6 (VS Code)](#scenario-6-connecting-to-mcp-in-docker-using-vs-code)

**Before you start:** Make sure you have created a [Personal Access Token](#step-1-creating-a-personal-access-token-pat) in OpenL Studio UI.

## Quick Jump

**I want to connect...**
- **Cursor to Remote MCP** → [Scenario 1](#scenario-1-connecting-to-remote-mcp-using-cursor)
- **Cursor to Docker MCP** → [Scenario 2](#scenario-2-connecting-to-mcp-in-docker-using-cursor)
- **Claude Desktop to Remote MCP** → [Scenario 3](#scenario-3-connecting-to-remote-mcp-using-claude-desktop)
- **Claude Desktop to Docker MCP** → [Scenario 4](#scenario-4-connecting-to-mcp-in-docker-using-claude-desktop)
- **VS Code to Remote MCP** → [Scenario 5](#scenario-5-connecting-to-remote-mcp-using-vs-code)
- **VS Code to Docker MCP** → [Scenario 6](#scenario-6-connecting-to-mcp-in-docker-using-vs-code)

**I need help with...**
- **Creating a PAT** → [Step 1: Creating a Personal Access Token](#step-1-creating-a-personal-access-token-pat)
- **Verifying connection** → [Verifying Connection](#verifying-connection)
- **Troubleshooting** → [Troubleshooting](#troubleshooting)
- **Configuration examples** → [Complete Configuration Examples](#complete-configuration-examples)

## Table of Contents

### Quick Navigation
- [Quick Start](#quick-start) - Choose your setup scenario
- [Prerequisites](#prerequisites) - Required software and tools
- [Creating a Personal Access Token](#step-1-creating-a-personal-access-token-pat) - PAT setup

### Setup Scenarios
- [Scenario 1: Remote MCP with Cursor](#scenario-1-connecting-to-remote-mcp-using-cursor)
  - [Method A: Via mcp-remote Utility](#method-a-via-mcp-remote-utility-recommended)
  - [Method B: Direct HTTP Connection](#method-b-direct-http-connection-alternative)
- [Scenario 2: Docker MCP with Cursor](#scenario-2-connecting-to-mcp-in-docker-using-cursor)
- [Scenario 3: Remote MCP with Claude Desktop](#scenario-3-connecting-to-remote-mcp-using-claude-desktop)
- [Scenario 4: Docker MCP with Claude Desktop](#scenario-4-connecting-to-mcp-in-docker-using-claude-desktop)
- [Scenario 5: Remote MCP with VS Code](#scenario-5-connecting-to-remote-mcp-using-vs-code)
- [Scenario 6: Docker MCP with VS Code](#scenario-6-connecting-to-mcp-in-docker-using-vs-code)

### Verification & Troubleshooting
- [Verifying Connection](#verifying-connection) - Test your setup
- [Troubleshooting](#troubleshooting) - Common issues and solutions
  - [MCP Server Not Connecting](#issue-mcp-server-not-connecting)
  - [ENOTFOUND Errors](#issue-enotfound-or-getaddrinfo-enotfound-error)
  - [401 Unauthorized Error](#issue-401-unauthorized-error)
  - [Docker Container Not Available](#issue-docker-container-not-available)
  - [mcp-remote Not Found](#issue-mcp-remote-not-found)
  - [Incorrect Node.js Version](#issue-incorrect-nodejs-version)

### Reference
- [Complete Configuration Examples](#complete-configuration-examples) - Ready-to-use configs
- [Additional Resources](#additional-resources) - Related documentation

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

Personal Access Token (PAT) is a secure way to authenticate without using a password. The token is created in the OpenL Studio interface and used for API access.

### Step-by-Step Instructions

1. **Open OpenL Studio in your browser**
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
- `https://<your-openl-server>/mcp/sse` → your OpenL MCP server URL (including the `/mcp/sse` endpoint path)
  - Example: `https://openl.example.com/mcp/sse` or `https://openl.example.com:8080/mcp/sse`
- `<your-pat-token>` → your Personal Access Token

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

**Or using streamablehttp transport:**

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
- Use `transport: "sse"` for SSE (Server-Sent Events) - uses GET requests, standard for most cases
- Use `transport: "streamablehttp"` for streamable HTTP transport - uses POST requests instead of GET, which can have practical benefits in certain network scenarios (e.g., proxy configurations, firewall rules)

**Note:** This method is for **Cursor IDE integration specifically**. Claude Desktop MCP client does not support HTTP/SSE transports at all (only stdio)—it requires a local stdio proxy bridge (like `mcp-remote`) for remote servers. If you're unsure, use Method A (mcp-remote) which is more universally supported.

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

**Important:** Claude Desktop MCP client does not support HTTP/SSE transports directly—it only supports stdio transport. To connect to a remote MCP server, you must use `mcp-remote` as a stdio proxy bridge.

This method connects Claude Desktop to a remote MCP server via `mcp-remote` stdio proxy.

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

2. **Add or update configuration:**

If the file doesn't exist, create it. If it already exists, add the `mcpServers` section or update the existing one:

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

3. **Save the file** (ensure JSON is valid)

### Step 3.3: Restart Claude Desktop

1. Completely close Claude Desktop (Quit from menu or `Cmd + Q`)
2. Open Claude Desktop again
3. Check connection in settings (⚙️ or `Cmd + ,`)

---

## Scenario 4: Connecting to MCP in Docker using Claude Desktop

**Important:** Claude Desktop MCP client does not support HTTP/SSE transports directly—it only supports stdio transport. To connect to a Docker MCP server, you must use `mcp-remote` as a stdio proxy bridge, similar to Scenario 3.

This method connects Claude Desktop to an MCP server running in a Docker container via `mcp-remote` stdio proxy.

### Step 4.1: Verifying Docker Container Availability

Follow the same steps as in [Scenario 2, Step 2.1](#step-21-verifying-docker-container-availability).

### Step 4.2: Finding Node.js and mcp-remote Paths

Follow the same steps as in [Scenario 1, Step 1.1](#step-11-finding-nodejs-and-mcp-remote-paths).

### Step 4.3: Claude Desktop Configuration

1. **Open Claude Desktop configuration file** (see [Scenario 3, Step 3.2](#step-32-claude-desktop-configuration))

2. **Add or update configuration:**

**For local Docker:**
```json
{
  "mcpServers": {
    "openl-mcp-server-docker": {
      "command": "/Users/username/.nvm/versions/node/v24.0.0/bin/node",
      "args": [
        "/Users/username/.nvm/versions/node/v24.0.0/bin/mcp-remote",
        "http://localhost:3000/mcp/sse",
        "--header",
        "Authorization: Token <your-pat-token>"
      ]
    }
  }
}
```

**For remote Docker:**
```json
{
  "mcpServers": {
    "openl-mcp-server-docker": {
      "command": "/Users/username/.nvm/versions/node/v24.0.0/bin/node",
      "args": [
        "/Users/username/.nvm/versions/node/v24.0.0/bin/mcp-remote",
        "http://<docker-host>:3000/mcp/sse",
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
- `http://localhost:3000` → your Docker container URL (for remote: `http://<docker-host>:3000`)
- Replace `<your-pat-token>` with your Personal Access Token

3. **Save the file**

### Step 4.4: Restart Claude Desktop

1. Completely close Claude Desktop
2. Open Claude Desktop again
3. Check connection

---

## Scenario 5: Connecting to Remote MCP using VS Code

This method connects VS Code Copilot to a remote MCP server. VS Code uses HTTP-based transport and supports both query parameter and header-based authentication.

### Step 5.1: Prerequisites

Ensure you have:
- **VS Code 1.108.1** or later installed (version with Copilot support)
- **GitHub Copilot** extension installed and activated
- **Copilot Agent Mode enabled** - MCP servers only work in Agent mode
  - Open Command Palette (`Cmd/Ctrl + Shift + P`)
  - Search for: `GitHub Copilot: Enable Agent Mode`
  - Or check settings: `github.copilot.chat.agentMode` should be `true`
- **Personal Access Token** created in OpenL Studio

### Step 5.2: Configuration

1. **Open VS Code Settings:**
   - Press `Cmd + ,` (macOS) or `Ctrl + ,` (Windows/Linux)
   - Or via menu: `Code` → `Preferences` → `Settings`

2. **Search for MCP settings:**
   - In settings search, type: `mcp` or `Model Context Protocol`
   - Find the **"GitHub Copilot > MCP: Servers"** section

3. **Edit settings.json:**
   - Click **"Edit in settings.json"** link
   - Or open Command Palette (`Cmd/Ctrl + Shift + P`) and select: `Preferences: Open User Settings (JSON)`

4. **Add MCP server configuration:**

**Method 1: Using Query Parameters (Simple)**

```json
{
  "github.copilot.chat.mcp.servers": {
    "openl-mcp-server-remote": {
      "type": "http",
      "url": "https://<your-openl-server>/mcp/sse?OPENL_PERSONAL_ACCESS_TOKEN=<your-pat-token>"
    }
  }
}
```

**Method 2: Using Headers (Recommended for Production)**

```json
{
  "github.copilot.chat.mcp.servers": {
    "openl-mcp-server-remote": {
      "type": "http",
      "url": "https://<your-openl-server>/mcp/sse",
      "headers": {
        "Authorization": "Token <your-pat-token>"
      }
    }
  }
}
```

**Method 3: Using Basic Auth (Alternative)**

```json
{
  "github.copilot.chat.mcp.servers": {
    "openl-mcp-server-remote": {
      "type": "http",
      "url": "https://<your-openl-server>/mcp/sse?OPENL_USERNAME=<username>&OPENL_PASSWORD=<password>"
    }
  }
}
```

**Important:** Replace:
- `https://<your-openl-server>/mcp/sse` → your OpenL MCP server URL
  - Example: `https://openl.example.com/mcp/sse` or `https://openl.example.com:8080/mcp/sse`
- `<your-pat-token>` → your Personal Access Token
- `<username>` and `<password>` → your OpenL credentials (only for dev/testing)

**Security Note:** For production environments, use Personal Access Token (PAT) with header-based authentication (Method 2) instead of embedding credentials in URL.

5. **Save settings.json**

### Step 5.3: Verify Configuration

1. Reload VS Code window:
   - Open Command Palette (`Cmd/Ctrl + Shift + P`)
   - Select: `Developer: Reload Window`

2. Check GitHub Copilot Chat:
   - Open Copilot Chat panel
   - Look for MCP server status indicator
   - Should show "Connected" or green status

3. Test in Copilot Chat:
   ```text
   @workspace List repositories in OpenL Studio
   ```

---

## Scenario 6: Connecting to MCP in Docker using VS Code

This method connects VS Code Copilot to an MCP server running in a Docker container.

**Prerequisites:** See [Scenario 5, Step 5.1](#step-51-prerequisites) - ensure VS Code Copilot is in **Agent mode** (required for MCP support).

### Step 6.1: Verifying Docker Container Availability

Follow the same steps as in [Scenario 2, Step 2.1](#step-21-verifying-docker-container-availability).

### Step 6.2: Configuration

1. **Open VS Code Settings** (see [Scenario 5, Step 5.2](#step-52-configuration))

2. **Add MCP server configuration:**

**Method 1: Using Query Parameters (Development)**

**For local Docker:**
```json
{
  "github.copilot.chat.mcp.servers": {
    "openl-mcp-server-docker": {
      "type": "http",
      "url": "http://localhost:3000/mcp/sse?OPENL_PERSONAL_ACCESS_TOKEN=<your-pat-token>"
    }
  }
}
```

**For remote Docker:**
```json
{
  "github.copilot.chat.mcp.servers": {
    "openl-mcp-server-docker": {
      "type": "http",
      "url": "http://<docker-host>:3000/mcp/sse?OPENL_PERSONAL_ACCESS_TOKEN=<your-pat-token>"
    }
  }
}
```

**Method 2: Using Headers (Recommended)**

**For local Docker:**
```json
{
  "github.copilot.chat.mcp.servers": {
    "openl-mcp-server-docker": {
      "type": "http",
      "url": "http://localhost:3000/mcp/sse",
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
  "github.copilot.chat.mcp.servers": {
    "openl-mcp-server-docker": {
      "type": "http",
      "url": "http://<docker-host>:3000/mcp/sse",
      "headers": {
        "Authorization": "Token <your-pat-token>"
      }
    }
  }
}
```

**Method 3: Using Basic Auth (Development/Testing Only)**

```json
{
  "github.copilot.chat.mcp.servers": {
    "openl-mcp-server-docker": {
      "type": "http",
      "url": "http://localhost:3000/mcp/sse?OPENL_USERNAME=<your-username>&OPENL_PASSWORD=<your-password>"
    }
  }
}
```

**Important:** Replace:
- `http://localhost:3000` → your Docker container URL
- For remote Docker: use `http://<docker-host>:3000`
- `<your-pat-token>` → your Personal Access Token

**Security Note:** Never commit credentials to version control. Use environment variables or secure vaults in production.

3. **Save settings.json**

### Step 6.3: Verify Configuration

Follow the same verification steps as in [Scenario 5, Step 5.3](#step-53-verify-configuration).

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
     List repositories in OpenL Studio
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
     What OpenL Studio tools are available?
     ```
   - Or:
     ```text
     List repositories in OpenL Studio
     ```
   - Claude should use MCP tools and show results

### In VS Code

1. **Verify Agent mode is enabled:**
   - Open Command Palette (`Cmd/Ctrl + Shift + P`)
   - Search for: `GitHub Copilot: Show Settings`
   - Ensure **Agent Mode** is enabled
   - Or check in settings.json: `"github.copilot.chat.agentMode": true`

2. **Check MCP server status:**
   - Open VS Code settings (`Cmd/Ctrl + ,`)
   - Search for: `github.copilot.chat.mcp.servers`
   - Verify your server configuration is present
   - Check Output panel for any connection errors:
     - View → Output
     - Select "GitHub Copilot Chat" from dropdown

3. **Test in Copilot Chat:**
   - Open Copilot Chat panel (usually on the left sidebar)
   - Or use `Cmd/Ctrl + Shift + I` to open chat
   - Enter request:
     ```text
     @workspace What OpenL Studio MCP tools are available?
     ```
   - Or:
     ```text
     @workspace List repositories in OpenL Studio
     ```
   - VS Code Copilot should recognize and use the MCP server

3. **Check for errors:**
   - If connection fails, check:
     - Settings JSON syntax is valid
     - URL is correct and accessible
     - Authentication credentials are valid
     - Docker container is running (for Docker scenarios)
   - View logs in Output panel: `GitHub Copilot Chat`

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
   - Ensure token wasn't deleted in OpenL Studio UI

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
   - Go to OpenL Studio UI
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

- [Authentication Guide](../guides/authentication.md) - Detailed authentication information (Basic Auth, PAT)
- [Troubleshooting Guide](../guides/troubleshooting.md) - Common issues and solutions
- [Quick Start Guide](../getting-started/quick-start.md) - Quick start guide
- [Docker Setup](./docker.md) - Running MCP server in Docker (technical details)

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

**Note:** Claude Desktop only supports stdio transport, so it requires `mcp-remote` as a proxy bridge even for Docker connections.

```json
{
  "mcpServers": {
    "openl-mcp-server-docker": {
      "command": "/Users/username/.nvm/versions/node/v24.0.0/bin/node",
      "args": [
        "/Users/username/.nvm/versions/node/v24.0.0/bin/mcp-remote",
        "http://localhost:3000/mcp/sse",
        "--header",
        "Authorization: Token <your-pat-token>"
      ]
    }
  }
}
```

### VS Code: Remote Connection

**Method 1: Using Headers (Recommended)**

```json
{
  "github.copilot.chat.mcp.servers": {
    "openl-mcp-server-remote": {
      "type": "http",
      "url": "https://<your-openl-server>/mcp/sse",
      "headers": {
        "Authorization": "Token <your-pat-token>"
      }
    }
  }
}
```

**Method 2: Using Query Parameters**

```json
{
  "github.copilot.chat.mcp.servers": {
    "openl-mcp-server-remote": {
      "type": "http",
      "url": "https://<your-openl-server>/mcp/sse?OPENL_PERSONAL_ACCESS_TOKEN=<your-pat-token>"
    }
  }
}
```

### VS Code: Docker Connection

**Method 1: Using Headers (Recommended)**

```json
{
  "github.copilot.chat.mcp.servers": {
    "openl-mcp-server-docker": {
      "type": "http",
      "url": "http://localhost:3000/mcp/sse",
      "headers": {
        "Authorization": "Token <your-pat-token>"
      }
    }
  }
}
```

**Method 2: Using Query Parameters**

```json
{
  "github.copilot.chat.mcp.servers": {
    "openl-mcp-server-docker": {
      "type": "http",
      "url": "http://localhost:3000/mcp/sse?OPENL_PERSONAL_ACCESS_TOKEN=<your-pat-token>"
    }
  }
}
```

**Method 3: Using Basic Auth (Development Only)**

```json
{
  "github.copilot.chat.mcp.servers": {
    "openl-mcp-server-docker": {
      "type": "http",
      "url": "http://localhost:3000/mcp/sse?OPENL_USERNAME=<your-username>&OPENL_PASSWORD=<your-password>"
    }
  }
}
```

---

**Note:** In all examples, replace:
- Node.js and mcp-remote paths with your actual paths
- OpenL server URL with your server
- Personal Access Token with your token
- For production: use header-based authentication instead of query parameters
