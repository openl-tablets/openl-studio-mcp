# Troubleshooting Remote SSE Connection Issues

## Problem: Connection Issues with Remote SSE

If you're experiencing:
- `Request timed out` errors
- Connection issues with remote SSE transport
- Authentication failures

## Root Cause

Possible causes:
1. Incorrect Node.js or `mcp-remote` paths
2. Network connectivity issues
3. Invalid or expired PAT token
4. Remote SSE endpoint may not be responding correctly

## Solution: Use Local MCP Server with Remote OpenL Backend

Instead of connecting to remote MCP server via SSE, run the MCP server locally and connect it to the remote OpenL backend via REST API.

### Configuration

**macOS/Linux:**

```json
{
  "mcpServers": {
    "openl": {
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

**Note:** Replace `<path-to-project>` with the actual path to your `openl-studio-mcp` project directory (e.g., `/Users/yourname/projects/openl-studio-mcp` or `~/projects/openl-studio-mcp`).

### Prerequisites

1. **Build the MCP server:**
   ```bash
   cd <path-to-project>
   npm install
   npm run build
   ```

2. **Verify the build:**
   ```bash
   ls -la dist/index.js
   # Should exist and be executable
   ```

3. **Test the connection:**
   ```bash
   OPENL_BASE_URL="https://<your-openl-server>/studio/rest" \
   OPENL_PERSONAL_ACCESS_TOKEN="your-token-here" \
   node dist/index.js
   ```

### Advantages

- ✅ Reliable stdio transport (no network issues)
- ✅ Full control over authentication
- ✅ Better error messages and debugging
- ✅ Works even if remote SSE endpoint has issues
- ✅ No dependency on `mcp-remote` package

### Alternative: Verify Remote SSE Configuration

Make sure you're using the correct format with `--header` flag:

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

**Important:** Use absolute paths for both `command` and the first `args` element (mcp-remote path).

## Why This Works Better

1. **stdio transport** is more reliable than SSE for MCP
2. **Local process** gives better error visibility
3. **REST API** connection to OpenL is well-tested and stable
4. **No npm package dependencies** - just Node.js and your built MCP server

## Verification

After updating the configuration:

1. **Restart Claude Desktop completely**
2. **Check MCP server status** in settings (should show "Connected")
3. **Test with a simple query:**
   ```
   List repositories in OpenL Tablets
   ```

If you still see timeouts, check:
- Network connectivity to `https://<your-openl-server>`
- PAT token validity
- MCP server build status
