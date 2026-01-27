# OpenL Tablets MCP Server

Model Context Protocol server for [OpenL Tablets](https://github.com/openl-tablets/openl-tablets) Business Rules Management System.

Built with MCP SDK v1.25.1 featuring type-safe validation (Zod) and comprehensive OpenL Tablets integration.

## Quick Links

- 🚀 [Quick Start](docs/getting-started/QUICK-START.md) - Get up and running in 5 minutes
- ⚙️ [Setup Guides](docs/setup/) - Configure Claude Desktop, Cursor, or Docker
- 📖 [Usage Examples](docs/guides/EXAMPLES.md) - Learn how to use MCP tools
- 🔐 [Authentication](docs/guides/AUTHENTICATION.md) - Authentication setup
- 🐛 [Troubleshooting](docs/guides/TROUBLESHOOTING.md) - Common issues and solutions
- 👨‍💻 [Contributing](docs/development/CONTRIBUTING.md) - Development guide

## Quick Start

```bash
npm install
npm run build

# Configure
export OPENL_BASE_URL="http://localhost:8080/rest"
export OPENL_USERNAME="admin"
export OPENL_PASSWORD="admin"

# Run
npm start
```

For detailed setup instructions, see [Quick Start Guide](docs/getting-started/QUICK-START.md).

## Documentation Structure

### Getting Started
- [Quick Start](docs/getting-started/QUICK-START.md) - Get up and running quickly

### Setup Guides
- [MCP Connection Guide](docs/setup/MCP-CONNECTION-GUIDE.md) - Complete guide for connecting Cursor and Claude Desktop to MCP server (Remote and Docker)
- [Docker Setup](docs/setup/DOCKER.md) - Running MCP server in Docker (technical details)

### Guides
- [Usage Examples](docs/guides/EXAMPLES.md) - Practical examples of using MCP tools
- [Authentication Guide](docs/guides/AUTHENTICATION.md) - All authentication methods (Basic Auth, Personal Access Token)
- [Troubleshooting Guide](docs/guides/TROUBLESHOOTING.md) - Common issues, debugging, and solutions

### Development
- [Contributing Guide](docs/development/CONTRIBUTING.md) - How to contribute to the project
- [Architecture](docs/development/ARCHITECTURE.md) - System architecture and design
- [Testing Guide](docs/development/TESTING.md) - Testing strategy and how to run tests
- [Code Standards](docs/development/CODE_STANDARDS.md) - Best practices and coding standards
- [Tool Review](docs/development/TOOL_REVIEW.md) - Technical review of MCP tools vs OpenL API

### Reference
- [MCP Comparison](docs/reference/MCP_COMPARISON.md) - TypeScript vs Java MCP server comparison
- [Enable Disabled Tools](docs/reference/ENABLE_DISABLED_TOOLS.md) - How to enable temporarily disabled tools

## OpenL Tablets Concepts

OpenL Tablets uses **dual versioning**: Git-based commits (temporal) and dimension properties (business context). Supports multiple table types: Decision Tables (Rules, SimpleRules, SmartRules, Lookups), Spreadsheet Tables, and others (Method, Datatype, Test, etc.).

See [prompts/create_rule.md](./prompts/create_rule.md) for detailed table type guidance.

## Tools

The MCP server provides 20 active tools for managing OpenL Tablets repositories, projects, rules, and deployments. All tools are prefixed with `openl_` and versioned (v1.0.0+).

**Categories:**
- **Repository Management** (5 tools) - List repositories, branches, features
- **Project Management** (7 tools) - List, open, save, branch projects
- **Rules & Tables** (5 tools) - List, get, update, append, create tables
- **Deployment** (3 tools) - List, deploy, redeploy projects

6 additional tools are temporarily disabled pending implementation fixes.

See [Usage Examples](docs/guides/EXAMPLES.md) for detailed tool usage and [Reference Documentation](docs/reference/) for complete tool reference.

## Prompts

12 expert guidance templates for complex OpenL Tablets workflows. Prompts provide contextual assistance, best practices, and step-by-step instructions directly in Claude Desktop or MCP Inspector.

**Available prompts:** create_rule, create_test, update_test, run_test, execute_rule, append_table, datatype_vocabulary, dimension_properties, deploy_project, get_project_errors, file_history, project_history.

**Usage:** Request prompts in Claude Desktop (e.g., "Use the create_rule prompt") or access via MCP Inspector. See [prompts/](./prompts/) directory for detailed content.

## Configuration

### Environment Variables

```bash
# Required
OPENL_BASE_URL=http://localhost:8080/rest

# Auth Method 1: Basic Auth
OPENL_USERNAME=admin
OPENL_PASSWORD=admin

# Auth Method 2: Personal Access Token
OPENL_PERSONAL_ACCESS_TOKEN=<your-pat-token>

# Optional
OPENL_CLIENT_DOCUMENT_ID=mcp-server-1
OPENL_TIMEOUT=60000
```

See [Authentication Guide](docs/guides/AUTHENTICATION.md) for detailed auth setup.

### Claude Desktop / Cursor Configuration

See [Setup Guides](docs/setup/) for client-specific configuration instructions.

## Key Features

- **Type-Safe**: Zod schemas with strict validation and TypeScript inference
- **Multiple Auth Methods**: Basic Auth and Personal Access Token (PAT)
- **4 Response Formats**: json, markdown, markdown_concise, markdown_detailed
- **Pagination Support**: Metadata for all list operations
- **AI Prompts**: 12 expert guidance templates
- **Comprehensive Tests**: 393 tests covering core functionality

## Development

```bash
npm run build          # Build TypeScript
npm test               # Run tests (393 total, 35% coverage)
npm run lint           # Check code quality
npm run watch          # Dev mode with auto-rebuild
```

**Test Coverage** (35.22% overall):
- validators.ts: 96.15%
- utils.ts: 97.95%
- auth.ts: 63.01%
- client.ts: 45.32%
- formatters.ts: 44.19%

See [Contributing Guide](docs/development/CONTRIBUTING.md) for development guidelines and [Testing Guide](docs/development/TESTING.md) for test suites.

## Project Structure

```
mcp-server/
├── src/                    # Source code (TypeScript)
├── tests/                  # Jest test suites
├── prompts/                # AI assistant guidance (OpenL-specific)
├── dist/                   # Compiled output
├── docs/                   # Documentation
│   ├── getting-started/    # Quick start and installation
│   ├── setup/              # Client setup guides
│   ├── guides/             # Usage guides and examples
│   ├── development/        # Developer documentation
│   └── reference/          # Reference materials
└── README.md               # This file
```

## Related Documentation

- [Documentation Index](docs/README.md) - Complete documentation navigation
- [Quick Start Guide](docs/getting-started/QUICK-START.md) - Get started quickly
- [MCP Connection Guide](docs/setup/MCP-CONNECTION-GUIDE.md) - Connect Cursor or Claude Desktop
- [Usage Examples](docs/guides/EXAMPLES.md) - Learn how to use MCP tools
- [Authentication Guide](docs/guides/AUTHENTICATION.md) - Authentication setup
- [Troubleshooting Guide](docs/guides/TROUBLESHOOTING.md) - Common issues and solutions

## Resources

- [OpenL Tablets](https://github.com/openl-tablets/openl-tablets)
- [OpenL Documentation](https://openl-tablets.org/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)

## License

Follows OpenL Tablets project license.
