# Development Documentation

Documentation for developers contributing to the OpenL Tablets MCP Server.

## Available Guides

- **[Contributing Guide](CONTRIBUTING.md)** - How to contribute to the project
- **[Architecture](ARCHITECTURE.md)** - System architecture and design
- **[Testing Guide](TESTING.md)** - Testing strategy and how to run tests
- **[Code Standards](CODE_STANDARDS.md)** - Best practices and coding standards
- **[Tool Review](TOOL_REVIEW.md)** - Technical review of MCP tools vs OpenL API

## Quick Start for Developers

1. **Read the Contributing Guide**: [CONTRIBUTING.md](CONTRIBUTING.md)
2. **Understand the Architecture**: [ARCHITECTURE.md](ARCHITECTURE.md)
3. **Set up Development Environment**: See [Contributing Guide - Development Setup](CONTRIBUTING.md#development-setup)
4. **Run Tests**: See [Testing Guide](TESTING.md)

## Development Workflow

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Run tests
npm test

# Run linter
npm run lint

# Development mode with auto-rebuild
npm run watch
```

## Code Structure

- `src/` - Source code (TypeScript)
- `tests/` - Jest test suites
- `prompts/` - AI assistant guidance templates
- `docs/` - Documentation

## Related Documentation

- [Main Documentation Index](../README.md)
- [Usage Guides](../guides/)
- [Reference Materials](../reference/)
