# Replit.md - Quiz Application

## Overview

This is a full-stack quiz application built with React, TypeScript, Express.js, and designed for PostgreSQL with Drizzle ORM. The application features a modern UI using shadcn/ui components and provides an interactive quiz experience with session tracking and scoring capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack React Query for server state management
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Build Tool**: Vite with custom configuration for development and production

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM configured for PostgreSQL
- **Session Storage**: In-memory storage implementation with interface for future database integration
- **API Design**: RESTful endpoints with proper error handling

### Database Schema
- **quiz_questions**: Stores quiz questions with choices, correct answers, type, and category
- **quiz_sessions**: Tracks user quiz sessions with scores, timing, and user answers
- **Migration Support**: Drizzle Kit for schema migrations

## Key Components

### Frontend Components
1. **Quiz Management**: 
   - QuizHeader: Application branding and navigation
   - ProgressIndicator: Visual progress tracking
   - QuestionCard: Interactive question display with answer selection
   - NavigationControls: Previous/next question navigation
   - QuizResults: Score display and completion summary
   - StatsSidebar: Real-time quiz statistics

2. **UI Infrastructure**:
   - Comprehensive shadcn/ui component library
   - Toast notifications for user feedback
   - Responsive design with mobile considerations
   - Dark/light theme support

### Backend Components
1. **Storage Layer**: 
   - IStorage interface for data persistence
   - MemStorage implementation for development
   - Prepared for PostgreSQL integration via Drizzle

2. **API Routes**:
   - GET /api/questions - Retrieve all quiz questions
   - GET /api/questions/:category - Filter questions by category
   - POST /api/sessions - Create new quiz session
   - PATCH /api/sessions/:id - Update quiz session progress

3. **Development Tools**:
   - Vite integration for hot module replacement
   - Request logging middleware
   - Error handling with proper HTTP status codes

## Data Flow

1. **Quiz Initialization**: User starts quiz, creating a new session via POST /api/sessions
2. **Question Retrieval**: Frontend fetches questions from GET /api/questions
3. **Answer Tracking**: User selections stored in React state and periodically synced to backend
4. **Progress Updates**: Session updates sent via PATCH /api/sessions/:id
5. **Score Calculation**: Final scoring computed and stored when quiz completes

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database driver optimized for serverless environments
- **drizzle-orm & drizzle-zod**: Type-safe database operations and schema validation
- **@tanstack/react-query**: Server state management and caching
- **@radix-ui/***: Headless UI components for accessibility
- **wouter**: Lightweight client-side routing

### Development Dependencies
- **tsx**: TypeScript execution for development server
- **esbuild**: Fast bundling for production builds
- **@replit/vite-plugin-***: Replit-specific development tools

## Deployment Strategy

### Development Mode
- Vite dev server with hot module replacement
- Express server with request logging
- In-memory storage for rapid development
- TypeScript compilation on-the-fly

### Production Build
- Vite builds optimized React bundle to `dist/public`
- esbuild bundles Express server to `dist/index.js`
- Static file serving for production deployment
- Environment-based configuration

### Database Setup
- Drizzle Kit manages PostgreSQL schema migrations
- Environment variable `DATABASE_URL` required for database connection
- Schema definitions in `shared/schema.ts` for type safety across frontend/backend
- Ready for Neon Database or other PostgreSQL providers

### Considerations
- Application expects PostgreSQL database provisioning
- Session storage will migrate from in-memory to database persistence
- Environment variables needed for production database connectivity
- Build process separates client and server bundles for optimal deployment