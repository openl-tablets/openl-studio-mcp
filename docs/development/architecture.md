# 🏗️ Architecture: How Everything Works Together

## Interaction Diagram

```text
┌─────────────────┐
│ Claude Desktop  │  ← You are here (AI assistant)
│   (Application) │
└────────┬────────┘
         │ MCP Protocol (stdio)
         │
         ▼
┌─────────────────┐
│   MCP Server    │  ← Standalone repository
│  (Node.js/TS)   │
└────────┬────────┘
         │ HTTP API
         │ (JSON)
         ▼
┌─────────────────┐
│  OpenL Studio  │  ← Rules server
│   (Java/Jetty)  │     (port 8080)
└─────────────────┘
```

## Components

### 1. Claude Desktop
- **What it is:** Application with Claude AI assistant
- **Where:** Installed on your Mac
- **Role:** Interface for communicating with AI

### 2. MCP Server
- **What it is:** Bridge between Claude and OpenL
- **Where:** Standalone repository (separate from OpenL Studio project)
- **Role:** 
  - Converts Claude commands to API requests to OpenL
  - Provides 25 tools for working with OpenL
  - Manages authentication

### 3. OpenL Studio
- **What it is:** Server for managing business rules
- **Where:** Running via Docker or locally
- **Role:** Stores and executes rules, projects, tables

## Data Flow

```text
1. You write in Claude: "List repositories"
   │
2. Claude → MCP Server: calls tool openl_list_repositories
   │
3. MCP Server → OpenL API: GET /repos
   │
4. OpenL → MCP Server: returns JSON with repositories
   │
5. MCP Server → Claude: formats response as markdown
   │
6. Claude → You: shows list of repositories
```

## Configuration Files

### Claude Desktop
```text
~/Library/Application Support/Claude/config.json
```
Contains MCP server settings (path, environment variables)

### MCP Server
```text
dist/index.js          # Compiled server
src/                   # Source code
docs/setup/mcp-connection-guide.md  # Complete configuration guide with examples
```

### OpenL Studio
```text
compose.yaml                       # Docker Compose configuration
DEMO/start                         # Local startup script
```

## Startup Process

### Option 1: Docker (recommended)
```bash
# Terminal 1: Start OpenL
docker compose up

# Claude Desktop starts separately (application)
# MCP Server starts automatically by Claude Desktop
```

### Option 2: Locally
```bash
# Terminal 1: Start OpenL
cd DEMO && ./start

# Claude Desktop starts separately
# MCP Server starts automatically by Claude Desktop
```

## Authentication

MCP Server uses one of two methods:

1. **Basic Auth** (default)
   ```env
   OPENL_USERNAME=<your-username>
   OPENL_PASSWORD=<your-password>
   ```

2. **Personal Access Token**
   ```env
   OPENL_PERSONAL_ACCESS_TOKEN=<your-token>
   ```

## Health Check

### Level 1: Is OpenL accessible?
```bash
curl http://localhost:8080/rest/repos
```

### Level 2: Is MCP Server configured?
```bash
cat ~/Library/Application\ Support/Claude/config.json | grep openl-mcp-server
```

### Level 3: Does Claude see the server?
- Open Claude Desktop settings
- Check MCP server status

### Level 4: Does everything work?
In Claude: "List repositories in OpenL Studio"

## Common Issues

### Issue: Claude doesn't see MCP server
**Cause:** Incorrect path in configuration or server not built
**Solution:** Check `config.json` and run `npm run build` in the MCP Server repository

### Issue: "Cannot connect to OpenL API"
**Cause:** OpenL not running or inaccessible
**Solution:** Start `docker compose up` or `DEMO/start`

### Issue: "Authentication failed"
**Cause:** Incorrect credentials
**Solution:** Check `OPENL_USERNAME` and `OPENL_PASSWORD` in configuration

## Useful Commands

### MCP Server Commands
```bash
# Navigate to MCP Server repository
cd <path-to-mcp-server-repo>

# Build TypeScript
npm run build

# Run the server
npm start

# Run in development mode
npm run dev

# Run tests
npm test

# Run linting
npm run lint
```

### OpenL Studio Commands
```bash
# View OpenL logs (Docker)
docker compose logs -f studio

# Start OpenL via Docker
docker compose up

# Start OpenL locally (in OpenL Studio repository)
cd DEMO && ./start
```
