# Connect OpenL Studio MCP to VS Code and GitHub Copilot

This guide explains how to connect the OpenL Studio MCP server to **Visual Studio Code** and **GitHub Copilot Chat** using Docker and an environment file for credentials (base URL and Personal Access Token).

## Overview

- **MCP config**: VS Code uses `mcp.json` (workspace: `.vscode/mcp.json`, or user profile via **MCP: Open User Configuration**).
- **Transport**: Copilot uses **stdio** for this setup: VS Code runs `docker run ...` and talks to the MCP server over stdin/stdout.
- **Credentials**: Stored in an env file (e.g. `~/.mcp/.env`) with `OPENL_BASE_URL` and `OPENL_PERSONAL_ACCESS_TOKEN`. Never put secrets in `mcp.json`.

## Prerequisites

- **VS Code** 1.99 or later (1.102+ recommended for MCP).
- **GitHub Copilot** (Copilot Chat in VS Code).
- **Docker** installed and running (`docker run` must work).
- **OpenL Studio** reachable from your machine (or from the host that Docker uses).
- A **Personal Access Token (PAT)** from OpenL Studio (see [Creating a PAT](#step-1-create-a-personal-access-token-pat)).

If your organization uses **GitHub Copilot Business/Enterprise**, the **“MCP servers in Copilot”** policy must be **enabled**.

---

## Step 1: Create a Personal Access Token (PAT)

1. Open OpenL Studio in your browser and sign in.
2. Go to **User Settings** → **Personal Access Tokens**.
3. Click **Create Token**, name it (e.g. `VS Code Copilot MCP`), set an optional expiration.
4. Copy the token immediately (it is shown only once). Format: `openl_pat_<publicId>.<secret>`.
5. Store it somewhere safe (e.g. password manager); you will put it in the env file in the next step.

---

## Step 2: Create the environment file

Create a directory and file for MCP credentials (for example under your home directory):

**macOS / Linux:**

```bash
mkdir -p ~/.mcp
```

Create or edit `~/.mcp/.env` (or `/Users/<your-username>/.mcp/.env`):

```bash
# OpenL Studio REST API base URL (required)
# MCP runs in Docker, so to reach OpenL on the same machine use host.docker.internal (macOS/Windows):
OPENL_BASE_URL=http://host.docker.internal:8080/rest
# For remote server, use: https://your-openl-server.example.com/rest
# (If you run MCP on the host, not in Docker, use http://localhost:8080/rest for local OpenL.)

# Personal Access Token from OpenL Studio (required for this setup)
OPENL_PERSONAL_ACCESS_TOKEN=openl_pat_xxxxxxxxxxxx.yyyyyyyyyyyyyyyy
```

**Windows (PowerShell):**

```powershell
New-Item -ItemType Directory -Force -Path $env:USERPROFILE\.mcp
```

Then create or edit `%USERPROFILE%\.mcp\.env` with the same two lines (use your real base URL and PAT).

- MCP runs in Docker, so to reach OpenL Studio on the same machine (host or in another container with port 8080 published) use `http://host.docker.internal:8080/rest` (macOS/Windows; on Linux you may need `--add-host=host.docker.internal:host-gateway`). For a remote server use your base URL (e.g. `https://your-openl-server.example.com/rest`).
- Replace the token value with your actual PAT.
- Restrict file permissions so only you can read it, e.g. `chmod 600 ~/.mcp/.env` on macOS/Linux.

Do **not** commit this file or share it. Add `.mcp/` or `.env` to `.gitignore` if the path is inside a repo.

---

## Step 3: Pull the OpenL Studio MCP Docker image

From a terminal:

```bash
docker pull ghcr.io/openl-tablets/openl-studio-mcp:latest
```

Use `latest` for the current build, or a specific tag from the registry (e.g. `1.0.0-abc1234` from [GitHub Packages](https://github.com/orgs/openl-tablets/packages)); keep the same tag in your MCP config.

---

## Step 4: Configure MCP in VS Code

VS Code and Copilot use **stdio** for this server: they run Docker with `-i` (stdin open), and the container must run the **stdio** MCP entrypoint (`node dist/index.js`), not the default HTTP server.

You can configure the server **per workspace** or **for your user**.

### Option A: Workspace (project) configuration

1. In your project root, create `.vscode/mcp.json` if it does not exist.
2. Add the OpenL server to the `servers` object.

Example `.vscode/mcp.json`:

```json
{
  "servers": {
    "openl": {
      "type": "stdio",
      "command": "docker",
      "args": [
        "run",
        "--rm",
        "-i",
        "--pull=always",
        "--env-file",
        "/Users/<username>/.mcp/.env",
        "ghcr.io/openl-tablets/openl-studio-mcp:latest",
        "node",
        "dist/index.js"
      ]
    }
  }
}
```

- Replace `/Users/<username>/.mcp/.env` with the **absolute path** to your env file (e.g. `C:\Users\<username>\.mcp\.env` on Windows, using forward slashes or escaped backslashes as required by JSON).
- Keep `"node", "dist/index.js"` so the container runs the stdio MCP server.

### Option B: User (global) configuration

1. Run **MCP: Open User Configuration** from the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`).
2. In the opened `mcp.json`, add the same `openl` server block under `servers` as above, again with your real `--env-file` path.

If you already have other servers, add the `openl` entry inside the existing `"servers": { ... }` and ensure the JSON is still valid (no trailing commas).

### Using a local image (for development/testing)

To test changes without pulling from the registry:

1. Build the image in the project root:
   ```bash
   cd /path/to/openl-studio-mcp
   docker build -t openl-studio-mcp:local .
   ```

2. In `mcp.json`, use the local image name and **remove** `--pull=always` so Docker uses your build:
   ```json
   {
     "servers": {
       "openl": {
         "type": "stdio",
         "command": "docker",
         "args": [
           "run",
           "--rm",
           "-i",
           "--env-file",
           "/Users/<username>/.mcp/.env",
           "openl-studio-mcp:local",
           "node",
           "dist/index.js"
         ]
       }
     }
   }
   ```

   Replace `/Users/<username>/.mcp/.env` with your env file path. After pulling from registry again, add `--pull=always` back and switch the image to `ghcr.io/openl-tablets/openl-studio-mcp:latest` (or a specific tag).

---

## Step 5: Trust and start the MCP server

1. Save `mcp.json`.
2. When VS Code first starts this MCP server, it will ask you to **trust** it. Review the command (Docker + image + your env file path) and confirm if you trust it.
3. Start the server:
   - From **MCP: List Servers**, select the OpenL server and start it, or
   - Use the **Start** action in the `mcp.json` editor.
4. Check that the server shows as running (e.g. “Running” in the MCP servers list or in Chat).

---

## Step 6: Use OpenL tools in Copilot Chat

1. Open **Copilot Chat** (e.g. from the sidebar or title bar).
2. Switch to **Agent** mode.
3. Open the **tools** picker and ensure the OpenL MCP server (and the tools you need) are enabled.
4. Ask Copilot to use OpenL, for example:
   - “List OpenL design repositories.”
   - “Show projects in OpenL Studio.”
   - “Get details for project <project-id>.”

Copilot will call the OpenL MCP tools; confirm tool use when prompted.

---

## Configuration reference

### Minimal `mcp.json` (stdio + Docker + env file)

```json
{
  "servers": {
    "openl": {
      "type": "stdio",
      "command": "docker",
      "args": [
        "run",
        "--rm",
        "-i",
        "--pull=always",
        "--env-file",
        "/path/to/your/.mcp/.env",
        "ghcr.io/openl-tablets/openl-studio-mcp:latest",
        "node",
        "dist/index.js"
      ]
    }
  }
}
```

### Env file contents

| Variable                       | Required | Description |
|--------------------------------|----------|-------------|
| `OPENL_BASE_URL`               | Yes      | OpenL Studio REST API base URL (e.g. `https://openl.example.com/rest`). |
| `OPENL_PERSONAL_ACCESS_TOKEN`  | Yes      | PAT from OpenL Studio (format `openl_pat_<id>.<secret>`). |

Optional (can be in the same file): `OPENL_TIMEOUT`. See [Authentication Guide](../guides/authentication.md).

### Docker image

- **Image:** `ghcr.io/openl-tablets/openl-studio-mcp:latest` (or a specific tag, e.g. `1.0.0-<commit>` from the registry)
- **Pull:** `docker pull ghcr.io/openl-tablets/openl-studio-mcp:latest`
- **Override for stdio:** The default image runs the HTTP server. For VS Code/Copilot you **must** override the command with `node dist/index.js` so the server uses stdio.

---

## Troubleshooting

### "Tool error" in Copilot Chat (openl_list_repositories, openl_list_projects, etc.)

If you see `[ERROR] Tool error: openl_list_repositories` or similar in the MCP server output:

1. **Check the error line** – The log now includes status and message, e.g. `Tool error: openl_list_repositories (401) Unauthorized` or `Tool error: openl_list_repositories connect ECONNREFUSED`.

2. **If you see (401) or Unauthorized:**
   - Confirm `OPENL_PERSONAL_ACCESS_TOKEN` in your env file is the full PAT (starts with `openl_pat_`) with no extra spaces or line breaks.
   - Verify the token has not expired and was not revoked in OpenL Studio (User Settings → Personal Access Tokens).
   - Ensure `OPENL_BASE_URL` in the env file is the REST base URL (e.g. `https://host/rest`), not the UI URL.

3. **If you see ECONNREFUSED, timeout, or network error:**
   - When using Docker, the container cannot use `localhost` to reach OpenL Studio on your machine. In your env file set:
     - **macOS / Windows:** `OPENL_BASE_URL=http://host.docker.internal:8080/rest` (use the correct port if different).
     - **Linux:** Add `--add-host=host.docker.internal:host-gateway` to the `args` in `mcp.json` and use `OPENL_BASE_URL=http://host.docker.internal:8080/rest` in the env file.
   - Ensure OpenL Studio is running and reachable from the host (e.g. `curl http://localhost:8080/rest/repos` with your PAT in the header).

4. **Enable debug auth** (optional): In the env file add `DEBUG_AUTH=true`, then restart the MCP server and check the output for detailed auth and request logs.

**Note:** Warnings like `OPENL_USERNAME is not set` / `OPENL_PASSWORD is not set` are normal when using PAT only; you can ignore them.

### Copilot says "MCP server uses Bearer / wrong auth format"

The OpenL Studio MCP server **already uses** `Authorization: Token <PAT>` for PAT (see `[Auth]` log line: `Header: Authorization: Token <PAT>`). It does **not** use Bearer. If Copilot suggests changing to "Token" from "Bearer", that is a mistaken inference from the tool failure.

The real cause is usually one of:
- **Docker + OpenL on host:** In your env file set `OPENL_BASE_URL=http://host.docker.internal:8080/rest` (not `http://localhost:8080/rest`), so the container can reach OpenL on your machine.
- **401:** Token expired, revoked, or wrong; or `OPENL_BASE_URL` is not the REST base URL (e.g. use `/rest`, not the UI URL).

After fixing `OPENL_BASE_URL` (and token if needed), rebuild the image if you use a local build and restart the MCP server.

### MCP server does not start

- Ensure **Docker** is running and `docker run ... ghcr.io/openl-tablets/openl-studio-mcp:latest node dist/index.js` works in a terminal.
- Do **not** use `-d` (detach); the container must run in the foreground for stdio.
- Check **MCP** output in VS Code: **MCP: List Servers** → select OpenL → **Show Output**.

### 401 Unauthorized or authentication errors

- Confirm the env file path in `args` is **absolute** and correct.
- Ensure `OPENL_PERSONAL_ACCESS_TOKEN` in the env file is the full PAT (starts with `openl_pat_`) and has no extra spaces or line breaks.
- Verify `OPENL_BASE_URL` is the REST base URL (e.g. `https://host/rest`), not the UI URL.

### OpenL Studio not reachable from Docker

- If OpenL runs on the host: use `http://host.docker.internal:8080/rest` (or the correct port) in `OPENL_BASE_URL` inside the env file (macOS/Windows Docker).
- On Linux you may need `--add-host=host.docker.internal:host-gateway` in the `args` array and then use `http://host.docker.internal:8080/rest`.

### Path to env file on Windows

- Use an absolute path in `args`, e.g. `C:/Users/<you>/.mcp/.env` (forward slashes are fine in JSON).
- Ensure the file exists and contains `OPENL_BASE_URL` and `OPENL_PERSONAL_ACCESS_TOKEN`.

---

## Security notes

- **Never** put `OPENL_BASE_URL` or `OPENL_PERSONAL_ACCESS_TOKEN` directly in `mcp.json` or any file under version control.
- Keep the env file only on your machine and restrict permissions (e.g. `chmod 600 ~/.mcp/.env`).
- Use a dedicated PAT for Copilot MCP with a reasonable expiration and revoke it if it is ever exposed.

---

## See also

- [MCP Connection Guide](mcp-connection-guide.md) – Cursor and Claude Desktop (remote/Docker)
- [Authentication Guide](../guides/authentication.md) – PAT and Basic Auth
- [Docker Setup](docker.md) – Running the MCP server in Docker
- [Use MCP servers in VS Code](https://code.visualstudio.com/docs/copilot/customization/mcp-servers) – Official VS Code docs
