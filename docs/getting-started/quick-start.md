# 🚀 Quick Start: Running Everything Together

This guide will help you start OpenL Studio and MCP server for working with Claude Desktop / Cursor IDE / Copilot.

**Note**: This guide uses `$PROJECT_ROOT` to refer to the `openl-studio-mcp` directory. Set it before running commands:

```bash
export PROJECT_ROOT="<path-to-project>"
```

Or replace `$PROJECT_ROOT` with your actual project path in all commands below.

## 📋 What Needs to Be Started

1. **OpenL Studio** - Rules server (port 8080)
2. **MCP Server** - Bridge between AI clients and OpenL (runs automatically)
3. **AI Client** - Claude Desktop / Cursor IDE or similar

---

## 🎯 Method 1: Docker Compose (Recommended)

The easiest way is to run everything through Docker.

### Step 1: Start OpenL Studio + MCP Server

You only need a local copy of `compose.studio.yaml`.

```bash
docker compose -f compose.studio.yaml up -d
```

This will start:
- OpenL Studio image from GitHub Container Registry: `ghcr.io/openl-tablets/webstudio:x`
- MCP server image from GitHub Container Registry: `ghcr.io/openl-tablets/openl-studio-mcp:latest`
- OpenL Studio UI at `http://localhost:8080`
- MCP server at `http://localhost:3000`

**Wait 1-2 minutes** for everything to start. You'll see readiness messages in the logs.

### Step 2: Verify OpenL is Working

Open in browser: http://localhost:8080

### Step 3: Configure MCP Server

For `compose.studio.yaml`, OpenL Studio runs in single-user mode, so no authentication is required.

For all agents that support direct HTTP/SSE MCP connection (for example Cursor, VS Code, and similar clients), use a named MCP server config like this:

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

For Claude Desktop, use `mcp-remote` (stdio proxy):

```json
{
  "mcpServers": {
    "openl-mcp-server-docker": {
      "command": "<your path to node>",
      "args": [
        "<your path to mcp-remote>",
        "http://localhost:3000/mcp/sse"
      ]
    }
  }
}
```

For client-specific config format, see [MCP Connection Guide](../setup/mcp-connection-guide.md).

### Step 4: Test Connection

In your AI client chat, try:

```
List repositories in OpenL Studio
```

The AI should use MCP tools and show the list of repositories.

---

## 🎯 Method 2: Local Run (without Docker)

If you don't have Docker or want to run locally.

### Step 1: Build OpenL Studio

```bash
cd $PROJECT_ROOT
mvn clean install -DskipTests
```

This will take 10-30 minutes on first run.

### Step 2: Start OpenL via DEMO Script

```bash
cd DEMO
chmod +x start
./start
```

The script will automatically:
- Download Java (if needed)
- Download Jetty server
- Start OpenL Studio at `http://localhost:8080`

### Step 3: Verify It Works

Open: http://localhost:8080


### Step 4: Configure MCP Server

Follow the setup guide for your AI client (same as Step 3 in Method 1).

---

## 🎯 Method 3: Docker + Personal Access Token (PAT)

Quick setup for Cursor IDE connecting to MCP server in Docker using Personal Access Token.

### Prerequisites

- Docker and Docker Compose installed
- Personal Access Token created in OpenL Studio UI
- Cursor IDE installed

### Step 1: Configure Docker Container

**IMPORTANT**: Authentication credentials should NOT be set in Docker configuration. They must be provided via MCP client configuration.

The Docker configuration should only include the base URL:

```yaml
mcp-server:
  environment:
    PORT: 3000
    OPENL_BASE_URL: http://studio:8080
    NODE_ENV: production
    # Authentication is NOT set here!
```

Start the container:
```bash
docker compose up -d mcp-server
```

### Step 2: Verify Availability

```bash
curl http://localhost:3000/health
```

Should return `{"status":"ok",...}`

### Step 3: Configure Cursor

**Option A: PAT via HTTP Headers (Recommended)**

1. Open Cursor Settings (`Cmd + ,`)
2. Find the **"MCP"** or **"Model Context Protocol"** section
3. Click **"Add New Global MCP Server"**
4. Enter name: `openl-mcp-server-docker`
5. Paste JSON configuration:

```json
{
  "url": "http://localhost:3000/mcp/sse",
  "transport": "sse",
  "headers": {
    "Authorization": "Token <your-pat-token>"
  }
}
```

**Option B: PAT via Query Parameters**

If Cursor doesn't support headers:

```json
{
  "url": "http://localhost:3000/mcp/sse?OPENL_PERSONAL_ACCESS_TOKEN=<your-pat-token>",
  "transport": "sse"
}
```

**Note:** Base URL (`OPENL_BASE_URL`) must be configured in Docker container environment variables. Only authentication token is passed from client.

### Step 4: Test

In Cursor chat:
```text
List repositories in OpenL Studio
```

### For Remote Docker

If Docker container is on a remote server:

1. Replace `localhost` with server IP or domain name
2. Make sure port 3000 is open in firewall
3. Base URL must be configured in Docker container environment variables on the server

For complete setup instructions, see [MCP Connection Guide](../setup/mcp-connection-guide.md#scenario-2-connecting-to-mcp-in-docker-using-cursor).

---

## 🔍 Health Check

### Automatic Check

```bash
cd $PROJECT_ROOT
export OPENL_BASE_URL="http://localhost:8080"
export OPENL_USERNAME="admin"
export OPENL_PASSWORD="admin"
./check-health.sh
```

### Manual Check

1. **Is OpenL accessible?**
   ```bash
   curl http://localhost:8080/rest/projects
   ```
   Should return JSON or authentication error (not "connection refused")

2. **Is MCP server configured?**
   - Check configuration file for your AI client
   - See [Setup Guides](../setup/) for details

3. **Does AI client see the server?**
   - Open AI client settings
   - Find "MCP Servers" section
   - Should see `openl-mcp-server` with "Connected" status

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to OpenL API"

**Solution:**
1. Ensure OpenL is running:
   ```bash
   curl http://localhost:8080/rest/projects
   ```
2. If Docker Compose:
   ```bash
   docker compose -f compose.studio.yaml ps  # Check container status
   docker compose -f compose.studio.yaml logs studio  # View logs
   ```
3. If local run - check that Jetty process is running

### Issue: MCP Server doesn't appear in AI client

**Solution:**
1. Check path in configuration (must be absolute)
2. Ensure project is built:
   ```bash
   cd $PROJECT_ROOT
   npm run build
   ls -la dist/index.js  # Should exist
   ```
3. Completely restart your AI client

### Issue: "Authentication failed"

**Solution:**
1. Check credentials in configuration
2. Try logging into OpenL via browser with the same credentials
3. Check URL - it should point to the OpenL server base URL (for example, `http://localhost:8080`)

### Issue: Docker containers don't start

**Solution:**
1. Check that Docker is running:
   ```bash
   docker ps
   ```
2. Check ports (8080, 5432 should not be occupied):
   ```bash
   lsof -i :8080
   lsof -i :5432
   ```
3. View logs:
   ```bash
   docker compose logs
   ```

For more detailed troubleshooting, see [Troubleshooting Guide](../guides/troubleshooting.md).

---

## 📊 Startup Order (Brief Version)

```bash
# Terminal 1: Start OpenL Studio
cd $PROJECT_ROOT
docker compose -f compose.studio.yaml up

# Wait 1-2 minutes for everything to start

# Terminal 2: Check (optional)
cd $PROJECT_ROOT
export OPENL_BASE_URL="http://localhost:8080"
export OPENL_USERNAME="admin"
export OPENL_PASSWORD="admin"
./check-health.sh

# Then:
# 1. Open http://localhost:8080 in browser
# 2. Login (admin/admin)
# 3. Configure MCP server (see Setup Guides)
# 4. Restart AI client
# 5. Check MCP server in settings
# 6. Try in AI client: "List repositories in OpenL Studio"
```

---

## ✅ Readiness Checklist

- [ ] OpenL Studio is running and accessible at [http://localhost:8080](http://localhost:8080)
- [ ] Can log into OpenL Studio via browser (admin/admin)
- [ ] MCP server is configured in AI client configuration
- [ ] AI client restarted after configuration
- [ ] MCP server is visible in AI client settings
- [ ] AI client can execute command "List repositories"

---

## 📚 Next Steps

- [Setup Guides](../setup/) - Client-specific setup instructions
- [Authentication Guide](../guides/authentication.md) - Detailed configuration options
- [Usage Examples](../guides/examples.md) - Learn how to use MCP tools
- [Troubleshooting](../guides/troubleshooting.md) - Common issues and solutions

---

## 💡 Useful Commands

```bash
# Stop Docker containers
docker compose -f compose.studio.yaml down

# View OpenL logs
docker compose -f compose.studio.yaml logs -f studio

# Rebuild MCP server
cd $PROJECT_ROOT
npm run build

# Check status of everything
cd $PROJECT_ROOT
./check-health.sh
```

