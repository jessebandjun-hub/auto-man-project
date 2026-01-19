# Project Context

## Purpose
A full-stack Monorepo application managing both a modern React frontend and a robust NestJS backend.
- **Frontend**: User interface built with React and Ant Design.
- **Backend**: API server built with NestJS and Prisma.
- **Goal**: To provide a scalable, type-safe development environment with shared resources.

## Tech Stack
- **Monorepo Management**: Turborepo, pnpm
- **Languages**: TypeScript, Node.js
- **Frontend**:
  - Vite
  - React 19
  - Ant Design 6
- **Backend**:
  - NestJS 11
  - Prisma ORM
  - SQLite (Database)
- **Shared Packages**:
  - `@repo/ui`: Shared React components
  - `@repo/typescript-config`: Shared TS configuration

## Project Conventions

### Code Style
- **Formatting**: Prettier
- **Linting**: ESLint
- **Type Safety**: Strict TypeScript configuration (shared configs)

### Architecture Patterns
- **Backend**: NestJS Module-based architecture (Controllers, Services, Modules).
- **Frontend**: React Functional Components with Hooks.
- **Monorepo**:
  - `apps/`: Application entry points (web, backend)
  - `packages/`: Shared libraries (ui, tsconfig)

### Testing Strategy
- **Backend**: Jest (Unit & E2E)
- **Frontend**: Ready for Vitest/Jest (Standard Vite setup)

### Git Workflow
- Standard feature-branch workflow.
- Commit messages should follow semantic conventions (though not strictly enforced yet).

## Domain Context
- **Web**: Main user interface.
- **Backend**: Provides RESTful APIs and manages data persistence via Prisma.

## Important Constraints
- Ensure strict type checking across the monorepo.
- Use `pnpm` for package management.
- Use `turbo` for build pipelines.

## External Dependencies
- **Database**: SQLite (Local file-based for development).
