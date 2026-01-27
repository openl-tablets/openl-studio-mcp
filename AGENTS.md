# OpenL Tablets MCP Server - Agent Description

## Overview

The OpenL Tablets MCP Server is a Model Context Protocol (MCP) server that provides AI coding agents with seamless access to the OpenL Tablets Business Rules Management System (BRMS). It acts as a bridge between AI assistants (like Claude Desktop, Cursor IDE) and the OpenL Tablets REST API, enabling natural language interaction with business rules management.

## Purpose

This MCP server enables AI agents to:
- **Discover** repositories, projects, and rules in OpenL Tablets
- **Read** project structures, table definitions, and rule logic
- **Modify** rules, tables, and project configurations
- **Execute** rules with test data for validation
- **Deploy** projects to production environments
- **Manage** version control and Git-based history

## Architecture

```text
┌─────────────────┐
│ AI Assistant    │  ← Claude Desktop, Cursor IDE, etc.
│ (MCP Client)    │
└────────┬────────┘
         │ MCP Protocol
         │ (stdio / HTTP SSE / StreamableHTTP)
         ▼
┌─────────────────┐
│  MCP Server     │  ← This Agent (Node.js/TypeScript)
│  (openl-mcp)    │
└────────┬────────┘
         │ HTTP REST API
         │ (JSON, Basic Auth / PAT)
         ▼
┌─────────────────┐
│ OpenL Tablets   │  ← Business Rules Server
│  (Java/Jetty)   │     (port 8080)
└─────────────────┘
```

## Capabilities

### 1. Repository Management
- List design repositories
- List deployment repositories
- List Git branches
- Get repository features
- View project revision history

### 2. Project Lifecycle
- List projects with filtering (repository, status, tags)
- Get comprehensive project details
- Open/close projects
- Save project changes
- Create project branches
- View local change history
- Restore previous versions

### 3. Rules & Tables Management
- List all tables/rules in a project
- Get detailed table structure and data
- Update entire tables (modify, delete, reorder rows)
- Append rows/fields to tables (additive changes)
- Create new tables programmatically
- Upload Excel files containing rules
- Download Excel files (current or historical versions)

### 4. Version Control
- View Git commit history for projects
- View Git commit history for specific files
- Revert to previous Git commits
- Compare versions (planned)

### 5. Testing & Validation
- Run project tests (all or specific tables)
- Execute individual rules with test data
- Get project errors and validation results (planned)

### 6. Deployment
- List active deployments
- Deploy projects to production
- Redeploy with new versions

## Tools (25 Total)

All tools are prefixed with `openl_` and versioned (v1.0.0+).

### Repository Tools (5)
- `openl_list_repositories` - List all design repositories
- `openl_list_branches` - List Git branches in a repository
- `openl_list_repository_features` - Get repository capabilities
- `openl_repository_project_revisions` - Get project revision history
- `openl_list_deploy_repositories` - List deployment repositories

### Project Tools (7)
- `openl_list_projects` - List projects with filters
- `openl_get_project` - Get project details
- `openl_update_project_status` - Open/close/save projects
- `openl_create_project_branch` - Create new branch
- `openl_list_project_local_changes` - View workspace history
- `openl_restore_project_local_change` - Restore previous version
- `openl_run_project_tests` - Execute project tests

### File Management (2)
- `openl_upload_file` - Upload Excel files
- `openl_download_file` - Download Excel files

### Rules/Tables Tools (5)
- `openl_list_tables` - List all tables in project
- `openl_get_table` - Get table structure and data
- `openl_update_table` - Replace entire table
- `openl_append_table` - Add rows/fields to table
- `openl_create_project_table` - Create new table

### Version Control (3)
- `openl_get_project_history` - Git commit history for project
- `openl_get_file_history` - Git commit history for file
- `openl_revert_version` - Revert to previous commit

### Deployment (3)
- `openl_list_deployments` - List active deployments
- `openl_deploy_project` - Deploy to production
- `openl_redeploy_project` - Redeploy with new version

### Execution (1)
- `openl_execute_rule` - Execute rule with test data

## Prompts (12 Total)

Expert guidance templates for complex OpenL workflows:

1. **create_rule** - Guide for creating OpenL tables
2. **create_test** - Guide for creating test tables
3. **update_test** - Guide for modifying tests
4. **run_test** - Test execution workflow
5. **execute_rule** - Rule execution guide
6. **append_table** - Incremental table updates
7. **datatype_vocabulary** - Data structure definitions
8. **dimension_properties** - Context-based rule selection
9. **deploy_project** - Deployment workflow
10. **get_project_errors** - Error analysis workflow
11. **file_history** - File version history
12. **project_history** - Project audit trail

## Resources

MCP resources provide read-only access to OpenL data:

- `openl://repositories` - All design repositories
- `openl://projects` - All projects
- `openl://projects/{projectId}` - Specific project details
- `openl://projects/{projectId}/tables` - Project tables
- `openl://projects/{projectId}/tables/{tableId}` - Specific table
- `openl://projects/{projectId}/history` - Project Git history
- `openl://projects/{projectId}/files/{filePath}` - Download file
- `openl://deployments` - All deployments

## Authentication Methods

The agent supports two authentication methods:

### 1. Basic Authentication
```env
OPENL_USERNAME=admin
OPENL_PASSWORD=admin
```

### 2. Personal Access Token (PAT)
```env
OPENL_PERSONAL_ACCESS_TOKEN=your-token
```

## Configuration

### Environment Variables

**Required:**
- `OPENL_BASE_URL` - OpenL REST API base URL (e.g., `http://localhost:8080/rest`)

**Authentication (one required):**
- `OPENL_USERNAME` + `OPENL_PASSWORD` (Basic Auth)
- `OPENL_PERSONAL_ACCESS_TOKEN` (PAT)

**Optional:**
- `OPENL_CLIENT_DOCUMENT_ID` - Client identifier for request tracking
- `OPENL_TIMEOUT` - Request timeout in milliseconds (default: 30000)

### Transport Modes

1. **stdio** - Standard input/output (for Claude Desktop)
2. **HTTP SSE** - Server-Sent Events (for Cursor IDE via Docker)
3. **StreamableHTTP** - HTTP streaming (for Cursor IDE)

## Key Features

### Type Safety
- Zod schemas for input validation
- TypeScript types for all API responses
- Compile-time type checking

### Error Handling
- Detailed error messages with context
- Actionable suggestions for fixes
- Automatic credential redaction in logs

### Response Formatting
- Multiple formats: `json`, `markdown`, `markdown_concise`, `markdown_detailed`
- Automatic truncation for large responses (25K character limit)
- Pagination support with metadata

### Security
- Credentials never logged
- Request tracking via Client Document ID

## Security Best Practices for AI Agents

### Critical Rule: Never Write Sensitive Data in Code

When writing code, configuration files, or examples as an AI agent:

**❌ NEVER DO THIS:**
- Hardcode passwords, tokens, or API keys in source code
- Commit files with real credentials to Git
- Use real values in examples or documentation

**✅ ALWAYS DO THIS:**
- Use environment variables: `process.env.VARIABLE_NAME`
- Use placeholders in examples: `<your-token>`, `<your-password>`
- Create `.env.example` files with placeholders
- Add `.env` to `.gitignore`

### Examples

**Wrong:**
```typescript
const token = "openl_pat_abc123.xyz789"; // ❌ Real token in code
const password = "mySecretPassword123"; // ❌ Real password in code
```

**Correct:**
```typescript
const token = process.env.OPENL_PERSONAL_ACCESS_TOKEN; // ✅ From environment
const password = process.env.OPENL_PASSWORD; // ✅ From environment

if (!token) {
  throw new Error("OPENL_PERSONAL_ACCESS_TOKEN is required");
}
```

### When Creating Configuration Examples

Always use placeholders:
```json
{
  "OPENL_BASE_URL": "http://localhost:8080/rest",
  "OPENL_PERSONAL_ACCESS_TOKEN": "<your-token>",
  "OPENL_USERNAME": "<your-username>",
  "OPENL_PASSWORD": "<your-password>"
}
```

### Environment Variables Best Practices

1. **For local development:**
   - Use `.env` files (never commit these)
   - Create `.env.example` with placeholders
   - Add `.env` to `.gitignore`

2. **For production:**
   - Use secure vaults or secret management systems
   - Never hardcode credentials in deployment configs
   - Rotate credentials regularly

3. **When writing code:**
   - Always read from `process.env`
   - Validate that required variables are set
   - Provide clear error messages if variables are missing

**Remember:** Never use real values, even in examples or test code. Always use placeholders or environment variables.

### OpenL-Specific Features
- Dual versioning (Git commits + dimension properties)
- Table type awareness (Rules, Spreadsheet, Datatype, etc.)
- Project ID format handling (base64, colon, dash formats)
- Excel file upload/download support

## Usage Examples

### List Repositories
```json
{
  "tool": "openl_list_repositories",
  "arguments": {
    "response_format": "markdown"
  }
}
```

### Get Project Details
```json
{
  "tool": "openl_get_project",
  "arguments": {
    "projectId": "ZGVzaWduOlByb2plY3Q=",
    "response_format": "json"
  }
}
```

### Execute Rule
```json
{
  "tool": "openl_execute_rule",
  "arguments": {
    "projectId": "ZGVzaWduOlByb2plY3Q=",
    "tableId": "calculatePremium",
    "inputData": {
      "age": 35,
      "coverage": 100000
    }
  }
}
```

## Technical Stack

- **Language**: TypeScript (ES2020+)
- **Runtime**: Node.js 24+
- **MCP SDK**: @modelcontextprotocol/sdk v1.25.1
- **HTTP Client**: axios
- **Validation**: Zod
- **Testing**: Jest
- **Build**: TypeScript Compiler

## Project Structure

```text
openl-studio-mcp/
├── src/                    # Source code
│   ├── index.ts           # Main entry (stdio transport)
│   ├── server.ts          # HTTP server (SSE/StreamableHTTP)
│   ├── client.ts          # OpenL API client
│   ├── tools.ts           # Tool definitions
│   ├── tool-handlers.ts   # Tool execution logic
│   ├── auth.ts            # Authentication (Basic/PAT)
│   ├── schemas.ts         # Zod validation schemas
│   ├── prompts.ts         # Prompt definitions
│   └── ...
├── tests/                  # Test suites
├── prompts/               # Prompt templates (markdown)
├── docs/                  # Documentation
└── dist/                  # Compiled output
```

## Development

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Run tests
npm test

# Run in development mode
npm run watch
```

## Deployment

### Docker
```bash
docker build -t openl-mcp-server .
docker run -e OPENL_BASE_URL=http://openl:8080/rest \
           -e OPENL_USERNAME=admin \
           -e OPENL_PASSWORD=admin \
           openl-mcp-server
```

### Docker Compose
```yaml
services:
  mcp-server:
    image: ghcr.io/openl-tablets/mcp-server:x
    environment:
      OPENL_BASE_URL: https://openl.example.com/studio/rest
```

## Version

**Current Version**: 1.0.0  
**MCP SDK**: 1.25.1  
**Node.js**: 24+  
**OpenL Tablets**: 6.0.0+

## License

LGPL-3.0 (follows OpenL Tablets project license)

## External Resources

- [OpenL Tablets](https://github.com/openl-tablets/openl-tablets)
- [OpenL Documentation](https://openl-tablets.org/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
