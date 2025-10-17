# Repository Guidelines

## Project Structure
- **Framework**: Next.js 14 using the App Router under `src/app`
- **Routing**: Nested segments follow the `(group)` convention for shared layouts
- **Shared UI**: Components live in `src/components` and `src/components/ui`
- **Libraries & Utilities**: Shared hooks, helpers, and lib functions under `src/hooks`, `src/helpers`, and `src/lib`
- **Schemas & Types**: Zod schemas in `src/schemas`, domain types in `src/types`

## Tech Stack
- **Language**: TypeScript
- **Database ORM**: Prisma
- **Database**: MongoDB
- **UI Toolkit**: ShadCN UI built on Radix
- **Styling**: Tailwind CSS with project-specific config

## Coding Conventions
1. **Client Components**: Include `'use client'` at the top whenever a component depends on hooks or browser-only APIs
2. **Server Components**: Prefer server components for pure data fetching or static rendering
3. **Error Handling**: Wrap async operations with `try/catch`, return typed errors, and surface user-friendly messages via toast or inline feedback
4. **Type Safety**: Ensure all functions and components have explicit types when inference is unclear

## File Naming
- **Files & Folders**: Use `kebab-case` (e.g., `add-school-form.tsx`)
- **React Components**: Export components using `PascalCase` names
- **Schemas & Utilities**: Suffix files to reflect purpose (e.g., `school-schema.ts`, `format-date.ts`)

## API Route Structure
- **Pathing**: Place handlers in `src/app/api/[resource]/route.ts`
- **Method Exports**: Implement HTTP methods (`GET`, `POST`, etc.) as named exports
- **Validation**: Parse and validate incoming data before persistence
- **Responses**: Return JSON with typed payloads and appropriate HTTP status codes

## Database Conventions
- **Schema Source**: Define models exclusively in `prisma/schema.prisma`
- **Migrations**: Use Prisma migrate to keep schema and database in sync
- **Enums & Defaults**: Centralize shared enums and default values inside the Prisma schema for consistency
- **Relations**: Prefer explicit relation names and backreferences for clarity

## Form Handling Patterns
1. **Validation**: Define Zod schemas for each form in `src/schemas`
2. **React Hook Form**: Use `react-hook-form` with the Zod resolver for type-safe forms
3. **UI Integration**: Compose ShadCN form primitives with RHF controllers for consistent styling
4. **Submission**: Handle form submission with async functions, display loading states, and provide success/error feedback via toast notifications