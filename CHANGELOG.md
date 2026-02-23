# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2026-02-23

### Added

- Initial public release of OpenL Studio MCP Server
- 27 production-ready MCP tools organized into 5 categories: Repository Management (4), Project Management (14), Rules & Tables Management (6), Version Control (3), Deployment (4)
- Support for multiple transport modes: stdio, HTTP SSE, and streamablehttp
- Support for multiple AI clients: Claude Desktop, Cursor IDE, and VS Code Copilot
- Authentication via Basic Auth (with HTTPS requirement for production) and Personal Access Token (PAT)
- Four response formats: json, markdown, markdown_concise, markdown_detailed
- 14 AI guidance prompts for complex workflows (table creation, testing, deployment, version control)
- 8 MCP resources for read-only access to OpenL data via URI patterns
- Docker support with official image and Docker Compose examples
- Comprehensive documentation: 19+ guides organized into Getting Started, Setup, Usage, and Development sections
- Type-safe implementation with Zod v4.3.5 schemas and TypeScript 5.7.2 strict mode
- Automatic credential redaction in logs and error messages
- Request tracking via Client Document ID (OPENL_CLIENT_DOCUMENT_ID) for audit trails
- Comprehensive test suite with 11 test files covering unit, integration, and E2E testing
- Input validation for all tool parameters preventing injection attacks
- Support for OpenL Studio dual versioning: Git-based (temporal) and Dimension Properties (business context)
- Health check endpoint for Docker container orchestration
- Multi-architecture Docker images (AMD64 and ARM64)

### Security

- Automatic credential redaction protects sensitive data in error messages and logs
- Environment variable-based credential storage prevents code exposure
- HTTPS/TLS support for encrypted connections in production environments

### Compatibility

- Node.js: ≥24.0.0 (tested on Node.js 24)
- OpenL Studio: 6.0.0+ (tested with OpenL Tablets 5.26.x and 6.x)
- MCP SDK: @modelcontextprotocol/sdk v1.26.0
- TypeScript: 5.7.2
- Supported transports: stdio, HTTP SSE, streamablehttp
- Supported authentication: Basic Auth (requires HTTPS in production), Personal Access Token (PAT)

[Unreleased]: https://github.com/openl-tablets/openl-studio-mcp/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/openl-tablets/openl-studio-mcp/releases/tag/v1.0.0
