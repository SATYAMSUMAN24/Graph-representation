# Chart Builder Application

## Overview

This is a full-stack chart building application that allows users to create, configure, and visualize data charts. Built with React frontend, Express backend, and PostgreSQL database using Drizzle ORM. The application features a modern UI with shadcn/ui components and ECharts for chart rendering.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for fast development and building
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Chart Library**: ECharts (loaded via CDN) for interactive chart rendering

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **API Design**: RESTful API with JSON responses
- **Development**: Hot module replacement with Vite integration

### Build System
- **Monorepo Structure**: Shared schemas between client and server
- **Development**: Single command starts both frontend and backend
- **Production**: Separate build processes for client and server
- **TypeScript**: Strict type checking across the entire codebase

## Key Components

### Database Schema (`shared/schema.ts`)
- **Users Table**: Basic user authentication structure
- **Charts Table**: Stores chart configuration including:
  - Chart metadata (title, type, axis labels)
  - Chart data (JSON format)
  - Styling options (color themes, chart options)
  - Timestamps for audit trails

### Frontend Components
- **Dashboard**: Main application interface
- **ChartDisplay**: ECharts integration for chart rendering
- **ChartConfigurationPanel**: Chart type and styling controls
- **DataInputPanel**: Data entry and sample dataset loading
- **UI Components**: Comprehensive shadcn/ui component library

### Backend Services
- **Storage Layer**: Abstracted storage interface with in-memory implementation
- **API Routes**: CRUD operations for charts
- **Data Validation**: Zod schemas for request validation
- **Error Handling**: Centralized error handling middleware

## Data Flow

1. **Chart Creation**:
   - User inputs data via DataInputPanel
   - Configuration set through ChartConfigurationPanel
   - Data validated against Zod schemas
   - Chart saved to database via REST API

2. **Chart Rendering**:
   - Chart data fetched from API
   - ECharts options generated based on chart type and configuration
   - Real-time updates through TanStack Query

3. **Data Management**:
   - Sample datasets provided for quick testing
   - Manual data entry with validation
   - Support for multiple chart types (bar, line, pie, scatter, radar, area)

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL connection for serverless environments
- **drizzle-orm**: Type-safe database operations
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI primitives
- **echarts**: Chart rendering (loaded via CDN)
- **wouter**: Lightweight routing

### Development Tools
- **drizzle-kit**: Database migrations and schema management
- **@replit/vite-plugin-***: Replit-specific development enhancements
- **tsx**: TypeScript execution for development server

## Deployment Strategy

### Development
- Single command (`npm run dev`) starts both frontend and backend
- Vite dev server with HMR for frontend
- tsx for TypeScript execution on backend
- Database migrations via `npm run db:push`

### Production
- **Build Process**: 
  - Frontend built with Vite to static assets
  - Backend bundled with esbuild for Node.js execution
- **Environment Variables**: DATABASE_URL required for database connection
- **Static Serving**: Express serves built frontend assets in production

### Database Management
- Drizzle migrations stored in `./migrations`
- Schema definitions in shared directory for type safety
- PostgreSQL dialect with connection pooling support

## Changelog

```
Changelog:
- July 07, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```