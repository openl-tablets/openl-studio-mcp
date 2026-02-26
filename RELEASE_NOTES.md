# Release Notes - OpenL Studio MCP Server

Introducing the OpenL Studio MCP Server, bringing AI-powered automation to business rules management through the Model Context Protocol.

For technical documentation, see the [GitHub repository](https://github.com/openl-tablets/openl-studio-mcp).

---

## February 23, 2026

### Initial Release - v1.0.0

We're excited to announce the **first official release** of the OpenL Studio MCP Server, enabling Claude, Cursor, and VS Code Copilot to interact programmatically with OpenL Studio through 27 production-ready tools.

#### 🌟 Highlights

- **27 Active MCP Tools** organized into five functional categories
- **14 Expert Guidance Prompts** with contextual AI assistance for complex workflows
- **Multiple AI Client Support**: Claude Desktop, Cursor IDE, and VS Code Copilot
- **Flexible Authentication**: Basic Auth and Personal Access Token (PAT)
- **Multiple Transport Modes**: stdio, HTTP SSE, and streamablehttp
- **Type-Safe Implementation**: Zod v4.3.5 schemas with TypeScript validation
- **Comprehensive Documentation**: 19+ documentation files with practical examples
- **Production-Ready**: Docker support, comprehensive test suite, and security best practices

---

## 🚀 Core Features

### MCP Tools (27 Tools)

**27 production-ready tools** organized into five categories:

#### Repository Management (4 tools)
*Manage design repositories and version control*

- **`openl_list_repositories`** - List all design repositories with metadata
- `openl_list_branches` - List Git branches in a repository
- `openl_list_repository_features` - Get repository capabilities and features
- `openl_repository_project_revisions` - Get project revision history with pagination

#### Project Management (14 tools)
*Handle project lifecycle, files, and testing*

- `openl_list_projects` - List projects with filtering and pagination
- `openl_get_project` - Get comprehensive project details
- `openl_open_project` - Open project for editing (supports branch/revision switching)
- `openl_save_project` - Save project changes to Git with validation
- `openl_close_project` - Close project with save/discard safety checks
- `openl_create_project_branch` - Create new branch from specific revision
- `openl_list_project_local_changes` - View workspace history
- `openl_restore_project_local_change` - Restore previous workspace version
- `openl_upload_file` - Upload Excel files containing rules
- `openl_download_file` - Download Excel files (current or historical)
- `openl_start_project_tests` - Start project test execution
- `openl_get_test_results_summary` - Get brief test execution summary
- `openl_get_test_results` - Get full test results with pagination
- `openl_get_test_results_by_table` - Get test results filtered by table ID

#### Rules & Tables Management (6 tools)
*Create, read, update decision tables and spreadsheets*

- `openl_list_tables` - List all tables/rules in a project with filtering
- `openl_get_table` - Get complete table structure and data
- `openl_update_table` - Replace or modify entire table
- `openl_append_table` - Add fields/rows to tables efficiently
- `openl_create_project_table` - Create new tables programmatically (BETA)
- `openl_execute_rule` - Execute rule with test data for validation

#### Version Control (3 tools)
*Manage Git history and reversions*

- `openl_get_project_history` - Git commit history for entire project
- `openl_get_file_history` - Git commit history for specific file
- `openl_revert_version` - Revert project to previous Git commit

#### Deployment (4 tools)
*Deploy projects to production environments*

- `openl_list_deploy_repositories` - List deployment repositories
- `openl_list_deployments` - List active deployments with status
- `openl_deploy_project` - Deploy project to production
- `openl_redeploy_project` - Redeploy with new version

---

### AI Guidance Prompts (14 Templates)

Expert guidance templates providing contextual assistance directly in your AI assistant:

#### Table Creation & Management

- **create_rule** - Comprehensive guide for creating OpenL tables (Decision Tables, Spreadsheets, Lookups)
- **create_rule_decision_tables** - Detailed guide for Rules, SimpleRules, SmartRules, SimpleLookup, SmartLookup
- **create_rule_spreadsheet** - Complete guide for Spreadsheet tables with formula syntax
- **datatype_vocabulary** - Guide for defining custom datatypes and vocabularies
- **append_table** - Guide for appending fields/rows to tables efficiently

#### Testing & Validation

- **create_test** - Step-by-step guide for creating test tables with proper structure
- **update_test** - Guide for modifying existing tests and test cases
- **run_test** - Test selection logic and execution workflow
- **execute_rule** - Guide for executing rules with test data

#### Advanced Features

- **dimension_properties** - Explanation of dimension properties and context-based rule versioning
- **file_history** - Guide for viewing file version history in Git
- **project_history** - Guide for viewing project-wide Git history

#### Deployment & Quality

- **deploy_project** - Deployment workflow and validation requirements
- **get_project_errors** - Error analysis and systematic resolution

**Using Prompts:**

In Claude Desktop:
```
"Use the create_rule prompt"
"Show me the deploy_project prompt"
```

With arguments:
```
"Use create_test prompt with tableName=calculatePremium"
```

Each prompt includes a concise summary section highlighting the most common use cases and critical requirements.

---

### MCP Resources

Read-only access to OpenL data via MCP resource URIs:

- `openl://repositories` - All design repositories with metadata
- `openl://projects` - All projects with status and details
- `openl://projects/{projectId}` - Specific project comprehensive details
- `openl://projects/{projectId}/tables` - All tables in a project
- `openl://projects/{projectId}/tables/{tableId}` - Specific table structure and data
- `openl://projects/{projectId}/history` - Project Git commit history
- `openl://projects/{projectId}/files/{filePath}` - Download specific file
- `openl://deployments` - All active deployments

---

### Client Support & Integration

The MCP server works seamlessly with multiple AI clients:

#### Claude Desktop
- **Transport**: stdio (standard input/output)
- **Remote Access**: Via `mcp-remote` stdio proxy
- **Docker Access**: Via `mcp-remote` stdio proxy
- **Setup**: [MCP Connection Guide - Claude Desktop](docs/setup/mcp-connection-guide.md#scenario-3-connecting-to-remote-mcp-using-claude-desktop)

#### Cursor IDE
- **Transport**: stdio, HTTP SSE, streamablehttp
- **Remote Access**: Via `mcp-remote` utility or direct HTTP SSE
- **Docker Access**: Direct HTTP SSE connection
- **Setup**: [MCP Connection Guide - Cursor](docs/setup/mcp-connection-guide.md#scenario-1-connecting-to-remote-mcp-using-cursor)

#### VS Code Copilot
- **Transport**: HTTP
- **Remote Access**: Direct HTTP with header or query parameter authentication
- **Docker Access**: Direct HTTP connection
- **Setup**: [MCP Connection Guide - VS Code](docs/setup/mcp-connection-guide.md#scenario-5-connecting-to-remote-mcp-using-vs-code)

#### MCP Inspector
- **Transport**: stdio, HTTP SSE
- **Purpose**: Development and debugging tool
- **Features**: Tool testing, response inspection, schema validation

See our comprehensive [MCP Connection Guide](docs/setup/mcp-connection-guide.md) for detailed setup instructions covering 6 scenarios.

---

### Authentication & Security

Flexible authentication supporting different deployment scenarios:

#### Authentication Methods

1. **Basic Authentication** (requires HTTPS/TLS in production)
   - Username and password credentials
   - Suitable for development and trusted internal environments
   - Header format: `Authorization: Basic <base64(username:password)>` (Basic Auth only)
   - ⚠️ **Warning**: Always use HTTPS in production to prevent credential exposure

2. **Personal Access Token (PAT)** ⭐ Recommended
   - User-generated tokens for secure programmatic access
   - Recommended for production environments
   - Token format: `openl_pat_<publicId>.<secret>`
   - Header format: `Authorization: Token <pat-token>`

#### Security Features

- **Automatic Credential Redaction** - Sensitive data protection in error messages and logs
- **Request Tracking** - Client Document ID (OPENL_CLIENT_DOCUMENT_ID) for audit trails and debugging
- **Input Validation** - Zod v4.3.5 schemas validate all tool inputs with strict type checking
- **Type Safety** - Full TypeScript type checking throughout the codebase
- **Secure Token Storage** - Environment variable-based configuration prevents credential leakage

Learn more in our [Authentication Guide](docs/guides/authentication.md).

---

### Response Formats

All tools support **four output formats** for maximum flexibility:

- **`json`** - Structured data for programmatic processing and integration (raw API response)
- **`markdown`** - Human-readable formatted output with tables and sections (default format)
- **`markdown_concise`** - Brief 1-2 paragraph summaries focusing on key information
- **`markdown_detailed`** - Comprehensive details with full context, metadata, and explanations

Format selection via `response_format` parameter in tool arguments.

---

### Transport Modes

Three transport modes for different deployment scenarios:

1. **stdio** (Standard Input/Output)
   - For Claude Desktop native integration
   - Process-based communication
   - Best for local installations

2. **HTTP SSE** (Server-Sent Events)
   - For Cursor IDE and VS Code Copilot via Docker
   - GET-based streaming protocol
   - Supports remote deployments

3. **streamablehttp** 
   - Alternative HTTP transport for Cursor IDE
   - POST-based streaming
   - Benefits certain network configurations (proxies, firewalls)

---

## 📚 Comprehensive Documentation

Documentation organized into 4 main sections with 19+ guides:

### [Getting Started](docs/getting-started/)
- **[Quick Start Guide](docs/getting-started/quick-start.md)** - Get up and running in 5 minutes with step-by-step instructions

### [Setup Guides](docs/setup/)
- **[MCP Connection Guide](docs/setup/mcp-connection-guide.md)** - Complete guide for Cursor, Claude Desktop, and VS Code (6 detailed scenarios)
- **[Docker Setup](docs/setup/docker.md)** - Running MCP server in Docker with containerized deployment
- **[VS Code Copilot MCP](docs/setup/vscode-copilot-mcp.md)** - VS Code Copilot integration specifics

### [Usage Guides](docs/guides/)
- **[Usage Examples](docs/guides/examples.md)** - Practical examples and common workflows for all tools
- **[Authentication Guide](docs/guides/authentication.md)** - All authentication methods (Basic Auth, PAT) with examples
- **[Troubleshooting Guide](docs/guides/troubleshooting.md)** - Common issues, error messages, and solutions
- **[Debug PAT](docs/guides/debug-pat.md)** - Personal Access Token debugging and validation

### [Development](docs/development/)
- **[Contributing Guide](docs/development/contributing.md)** - Development setup, workflow, and pull request process
- **[Architecture](docs/development/architecture.md)** - System design, components, and technical decisions
- **[Testing Guide](docs/development/testing.md)** - Test strategy, execution, and coverage reporting
- **[Code Standards](docs/development/code-standards.md)** - Best practices, linting rules, and conventions
- **[Tool Review](docs/development/tool-review.md)** - Technical analysis of MCP tools vs OpenL API

---

## 🛠️ Technical Stack

Built with modern TypeScript tooling and enterprise-grade libraries:

- **Language**: TypeScript 5.7.2 (ES2020+ target) with strict type checking
- **Runtime**: Node.js ≥24.0.0 (tested on Node.js 24)
- **MCP SDK**: @modelcontextprotocol/sdk v1.26.0 (Model Context Protocol)
- **HTTP Client**: axios v1.13.5 with interceptors and retry logic
- **Validation**: Zod v4.3.5 with runtime schema validation and TypeScript inference
- **HTTP Server**: Express v5.2.1 for HTTP SSE and streamablehttp transports
- **Testing**: Jest v30.2.0 with coverage reporting and ES modules support
- **Build**: TypeScript Compiler with source maps and declaration files

### Why These Technologies?

- **TypeScript + Zod**: Runtime validation + compile-time type safety = zero type errors
- **Node.js 24**: Latest LTS with native ES modules, improved performance, and security updates
- **MCP SDK 1.26.0**: Latest protocol version with stdio, HTTP SSE, and streamablehttp support
- **axios**: Proven HTTP client with automatic retries, interceptors, and request/response transformation
- **Express 5**: Modern HTTP server with async/await support and middleware ecosystem

---

## 🧪 Testing & Quality

Comprehensive test suite ensuring reliability and correctness:

### Test Coverage

**11 test files** covering core functionality:

- **Unit Tests**: Core business logic, validators, utilities, formatters
- **Integration Tests**: Live OpenL server testing with real API calls
- **API Mocks**: Isolated testing with axios-mock-adapter
- **E2E Tests**: Full workflow testing from client to OpenL server

### Test Files

- `validators.test.ts` - Schema validation and input checking
- `utils.test.ts` - Utility functions and helpers
- `auth.test.ts` - Authentication methods (Basic Auth, PAT)
- `client.test.ts` - OpenL API client functionality
- `formatters.test.ts` - Response formatting (JSON, Markdown variants)
- `prompts.test.ts` - Prompt template loading and rendering
- `mcp-server.test.ts` - MCP server integration
- `openl-client.test.ts` - OpenL client integration
- `integration/openl-live.test.ts` - Live OpenL server testing
- `integration/resources.test.ts` - MCP resources testing
- `integration/tool-handlers.test.ts` - Tool execution testing

### Running Tests

```bash
npm test                   # All tests
npm run test:unit          # Unit tests only (excludes integration)
npm run test:integration   # Integration tests (requires OpenL server)
npm run test:watch         # Watch mode for development
npm run test:coverage      # Coverage report with detailed metrics
```

### Quality Assurance

- **Linting**: ESLint v9.17.0 with TypeScript parser and strict rules
- **Type Checking**: TypeScript compiler with --strict mode enabled
- **Code Formatting**: Consistent code style across all files
- **Continuous Testing**: Watch mode for development iterations

---

## 🏗️ Architecture & OpenL Integration

### OpenL Studio Dual Versioning System

OpenL Studio uses a unique **dual versioning approach** that the MCP server fully supports:

1. **Git-Based Versioning (Temporal)**
   - Every `save_project` creates an automatic Git commit
   - Full commit history with author, timestamp, and message
   - Tools: `get_project_history`, `get_file_history`, `revert_version`
   - Use case: Track changes over time, audit trails, rollbacks

2. **Dimension Properties (Business Context)**
   - Multiple rule versions coexist in same project
   - Runtime selection based on properties: `state`, `lob`, `effectiveDate`, `usregion`, etc.
   - Each rule can have different logic for different business contexts
   - Use case: Multi-state insurance, regional variations, effective dates

**Example**: Insurance premium calculation can have different rules for California vs Texas, selected at runtime based on `state` dimension property.

### Supported Table Types

The MCP server supports all OpenL Studio table types:

#### Decision Tables (Conditional Logic)
- **Rules** - Standard decision table with explicit conditions and actions
- **SimpleRules** - Simplified syntax with automatic column matching
- **SmartRules** - Parameter-based matching with smart column detection
- **SimpleLookup** - Key-value mapping tables
- **SmartLookup** - Multi-key lookup with smart matching

#### Computational Tables
- **Spreadsheet** - Multi-step calculations with cell references and formulas
- **Method** - Java-like method definitions
- **TBasic** - Legacy BASIC-style procedural code

#### Supporting Tables
- **Data** - Reference data and lookup tables
- **Datatype** - Custom data structure definitions
- **Test** - Test tables for validation and regression testing
- **Run** - Test execution configuration
- **Properties** - Table-level configuration
- **Configuration** - Project-level settings

---

## 📦 Installation & Quick Start

### Installation

Choose your preferred installation method:

**Via npm (Global Installation):**
```bash
npm install -g openl-mcp-server
```

**Via Docker (Recommended for Production):**
```bash
docker pull ghcr.io/openl-tablets/openl-studio-mcp:1.0.0
```

**From Source (Development):**
```bash
git clone https://github.com/openl-tablets/openl-studio-mcp.git
cd openl-studio-mcp
npm install
npm run build
```

---

### Quick Start

#### 1. Configuration

Set environment variables:

```bash
# Required
export OPENL_BASE_URL="http://localhost:8080"

# Authentication Method 1: Basic Auth (Development)
export OPENL_USERNAME="admin"
export OPENL_PASSWORD="admin"

# Authentication Method 2: Personal Access Token (Production) ⭐
export OPENL_PERSONAL_ACCESS_TOKEN="openl_pat_..."

# Optional
export OPENL_TIMEOUT=60000
export OPENL_CLIENT_DOCUMENT_ID="my-mcp-client"
```

#### 2. Running the Server

**Standalone (stdio transport):**
```bash
npm start
```

**HTTP Server (SSE/streamablehttp transports):**
```bash
npm run start:http
```

**Docker Compose:**
```yaml
services:
  mcp-server:
    image: ghcr.io/openl-tablets/openl-studio-mcp:1.0.0
    ports:
      - "3000:3000"
    environment:
      OPENL_BASE_URL: http://openl:8080
      OPENL_PERSONAL_ACCESS_TOKEN: ${OPENL_PAT}
```

```bash
docker compose up -d
```

For detailed setup instructions, see the [Quick Start Guide](docs/getting-started/quick-start.md).

---

### Connecting AI Assistants

#### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "openl-studio": {
      "command": "node",
      "args": ["/path/to/openl-studio-mcp/dist/index.js"],
      "env": {
        "OPENL_BASE_URL": "http://localhost:8080",
        "OPENL_PERSONAL_ACCESS_TOKEN": "<your-token>"
      }
    }
  }
}
```

#### VS Code Copilot

Add to VS Code `settings.json`:

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

#### Cursor IDE

Add to Cursor MCP settings or configuration file:

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

See the [MCP Connection Guide](docs/setup/mcp-connection-guide.md) for complete setup instructions covering 6 scenarios (remote/docker × Cursor/Claude/VS Code).

---

## 🔒 Security & Best Practices

### Security Features

- **Credential Protection**: Automatic redaction of passwords and tokens in logs and error messages
- **Token Security**: Personal Access Token (PAT) support for secure, revocable authentication
- **Request Tracking**: Client Document ID (OPENL_CLIENT_DOCUMENT_ID) for comprehensive audit trails
- **Input Validation**: Zod schemas validate all tool inputs preventing injection attacks
- **Type Safety**: Full TypeScript type checking eliminates runtime type errors
- **Environment Variables**: Credential storage via environment variables prevents code exposure
- **HTTPS Support**: Full support for SSL/TLS encrypted connections

### Best Practices

✅ **Use Personal Access Tokens** for production deployments instead of Basic Auth  
✅ **Rotate tokens regularly** and delete unused tokens immediately  
✅ **Never commit credentials** to version control (use `.env` files in `.gitignore`)  
✅ **Enable HTTPS** for all production deployments to encrypt credentials in transit  
✅ **Use Docker secrets** or environment management tools for container deployments  
✅ **Monitor audit logs** using OPENL_CLIENT_DOCUMENT_ID to track API usage  
✅ **Set appropriate timeouts** based on your network and OpenL server performance  

---

## 🐳 Docker Support

### Quick Start with Docker Compose

```yaml
version: '3.8'

services:
  mcp-server:
    image: ghcr.io/openl-tablets/openl-studio-mcp:1.0.0
    ports:
      - "3000:3000"
    environment:
      OPENL_BASE_URL: http://openl:8080
      OPENL_PERSONAL_ACCESS_TOKEN: ${OPENL_PAT}
      OPENL_TIMEOUT: 60000
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

```bash
# Set your PAT
export OPENL_PAT="your-token-here"

# Start the server
docker compose up -d

# Check logs
docker compose logs -f mcp-server

# Check health
curl http://localhost:3000/health
```

### Docker Features

- **Health Checks**: Built-in `/health` endpoint for container orchestration
- **Multi-arch Support**: AMD64 and ARM64 images available
- **Minimal Image**: Based on Node.js 24 Alpine for small footprint
- **Environment Config**: All configuration via environment variables
- **Hot Reload**: Mount source code for development with `--watch`

See the [Docker Setup Guide](docs/setup/docker.md) for advanced configuration.

---

## 🔍 Known Limitations

- **Node.js 24+ Required**: Earlier versions not supported (use nvm to install Node.js 24)
- **Claude Desktop Transport**: Only supports stdio (requires `mcp-remote` for remote servers)
- **Large Responses**: Automatic truncation at 25,000 characters with pagination guidance
- **Session Management**: Some endpoints require project to be opened first

---

## 🔄 Migration & Upgrading

### From Beta/Pre-release

This is the **initial stable release (v1.0.0)**, no migration required.

If you were using development/beta versions:

1. **Update dependencies**: `npm install` to get latest versions
2. **Check environment variables**: Ensure `OPENL_BASE_URL` is set correctly
3. **Update client configs**: Follow [MCP Connection Guide](docs/setup/mcp-connection-guide.md)

### Breaking Changes

None. This is the first stable release.

---

## 📝 What's Next

### Planned Features (v1.1.0+)

#### Tool Enhancements
- ✨ Enhanced error messages with specific line numbers and actionable auto-fix suggestions
- ✨ Batch operations (update multiple tables, bulk deployments)
- ✨ Streaming support for large file downloads
- ✨ Advanced validation and error detection tools

#### Authentication & Security
- 🔐 OAuth 2.0 support for enterprise SSO integration
- 🔐 API key rotation automation
- 🔐 Role-based access control (RBAC) integration
- 🔐 Audit log export in structured formats (JSON, CSV)

#### Performance & Scalability
- ⚡ Response caching for frequently accessed data
- ⚡ Connection pooling for improved throughput
- ⚡ Parallel request batching
- ⚡ Performance optimizations for large projects (1000+ tables)

#### Testing & Quality
- 🧪 Improved test coverage targeting 80%+ across all modules
- 🧪 End-to-end workflow testing
- 🧪 Performance benchmarking suite
- 🧪 Integration tests for all table types

#### Client Support
- 💻 IntelliJ IDEA plugin
- 💻 Eclipse IDE integration
- 💻 Standalone GUI client
- 💻 Web-based MCP Inspector enhancement

#### Developer Experience
- 📖 Interactive tutorials and guided workflows
- 📖 Video documentation and screencasts
- 📖 More real-world examples and use cases
- 📖 API playground for testing tools

---

## 🙏 Acknowledgments

This project was made possible thanks to:

- **OpenL Tablets Team** - For creating and maintaining the excellent OpenL Tablets BRMS platform
- **Anthropic** - For developing the Model Context Protocol specification and SDK
- **MCP Community** - For tools, utilities, and feedback (special thanks to `mcp-remote` contributors)
- **Early Adopters** - For testing, bug reports, and feature suggestions
- **Contributors** - For code contributions, documentation improvements, and community support

---

## 📄 License

**LGPL-3.0** - GNU Lesser General Public License v3.0

This project follows the OpenL Tablets project license (LGPL-3.0). See the [LICENSE](LICENSE) file for full details.

For more information about LGPL-3.0, visit: https://www.gnu.org/licenses/lgpl-3.0.html

---

## 🔗 Resources & Links

### Project Resources
- **[GitHub Repository](https://github.com/openl-tablets/openl-studio-mcp)** - Source code, issues, and releases
- **[Documentation](docs/README.md)** - Complete documentation index
- **[Quick Start Guide](docs/getting-started/quick-start.md)** - Get started in 5 minutes
- **[Troubleshooting Guide](docs/guides/troubleshooting.md)** - Common issues and solutions
- **[Contributing Guide](docs/development/contributing.md)** - How to contribute

### OpenL Tablets
- **[OpenL Tablets GitHub](https://github.com/openl-tablets/openl-tablets)** - OpenL Tablets BRMS platform
- **[OpenL Documentation](https://openl-tablets.org/)** - Official OpenL Tablets documentation
- **[OpenL User Guide](https://openl-tablets.org/docs)** - Comprehensive user guide

### Model Context Protocol
- **[MCP Website](https://modelcontextprotocol.io/)** - Official MCP specification
- **[MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)** - SDK used by this server
- **[MCP Specification](https://spec.modelcontextprotocol.io/)** - Protocol specification

### Community & Support
- **[GitHub Discussions](https://github.com/openl-tablets/openl-studio-mcp/discussions)** - Ask questions, share ideas
- **[GitHub Issues](https://github.com/openl-tablets/openl-studio-mcp/issues)** - Report bugs, request features
- **[OpenL Forum](https://openl-tablets.org/forum)** - OpenL Tablets community forum

---

## 📞 Support & Contact

### Getting Help

**For MCP Server Issues:**
1. Check [Troubleshooting Guide](docs/guides/troubleshooting.md)
2. Search [existing issues](https://github.com/openl-tablets/openl-studio-mcp/issues)
3. Ask in [GitHub Discussions](https://github.com/openl-tablets/openl-studio-mcp/discussions)
4. Create [new issue](https://github.com/openl-tablets/openl-studio-mcp/issues/new) with details

**For OpenL Tablets Questions:**
- Visit [OpenL Documentation](https://openl-tablets.org/)
- Post in [OpenL Forum](https://openl-tablets.org/forum)
- Check [OpenL GitHub Issues](https://github.com/openl-tablets/openl-tablets/issues)

### Contributing

We welcome contributions! See [Contributing Guide](docs/development/contributing.md) for:
- Development setup and workflow
- Code standards and best practices  
- Testing requirements
- Pull request process

### Reporting Security Issues

For security vulnerabilities, please email security@openl-tablets.org instead of creating public issues.

---

## 📊 Release Information

**Released**: February 23, 2026  
**Version**: 1.0.0  
**MCP Protocol**: 1.26.0+  
**Node.js**: ≥24.0.0  
**License**: LGPL-3.0  

---

## About OpenL Studio MCP Server

The **OpenL Studio MCP Server** bridges AI assistants like Claude, Cursor, and VS Code Copilot with enterprise business rules management, enabling natural language interaction with complex rule systems. Built by the OpenL Tablets community to bring AI-powered automation to business rules development, testing, and deployment.

**Transform how you work with business rules** - Let AI assistants help you create, test, and deploy rules faster and more accurately than ever before.

---

*For the latest updates, follow the [GitHub repository](https://github.com/openl-tablets/openl-studio-mcp).*
