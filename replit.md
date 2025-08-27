# VECTIS Energy Consumption Calculator

## Overview

VECTIS is a web-based energy consumption calculator that helps users estimate their household appliance power usage and associated costs. The application allows users to input various appliances with their specifications (wattage, usage hours, frequency) and calculates daily, weekly, and monthly energy consumption along with cost projections. The system is designed to help Nigerian households optimize their energy usage and reduce electricity bills.

**Deployment Status**: Ready for Vercel deployment with Neon PostgreSQL database. Customer information collection and database integration completed.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: shadcn/ui components built on Radix UI primitives for consistent, accessible design
- **Styling**: Tailwind CSS with custom CSS variables for theming and dark mode support
- **State Management**: React hooks for local state, TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation for type-safe form management

### Backend Architecture
- **Framework**: Express.js with TypeScript for the REST API
- **Storage**: In-memory storage implementation with interface for future database integration
- **API Design**: RESTful endpoints for CRUD operations on energy calculations
- **Validation**: Zod schemas for request/response validation shared between frontend and backend
- **Error Handling**: Centralized error handling middleware with structured error responses

### Data Storage Solutions
- **Production**: Neon PostgreSQL serverless database with customer information fields
- **Development**: In-memory storage (MemStorage class) for local testing
- **Schema**: PostgreSQL calculations table with appliance data (JSONB) and customer contact fields
- **API**: Vercel serverless functions for database operations (api/calculations.js)
- **Migration**: Drizzle Kit configured for PostgreSQL migrations

### Authentication and Authorization
- **Current State**: No authentication implemented (calculator operates without user accounts)
- **Architecture**: Session-based authentication infrastructure prepared (express-session with PostgreSQL store)
- **Future Ready**: Can be extended to support user accounts and saved calculations

### Core Business Logic
- **Calculation Engine**: Pure functions for energy consumption calculations
- **Appliance Management**: CRUD operations for appliance configurations
- **Cost Projection**: Multi-timeframe calculations (daily/weekly/monthly/annual)
- **Export Functionality**: JSON export of calculation results and configurations

## External Dependencies

### Database
- **Neon Database**: Serverless PostgreSQL database configured via DATABASE_URL environment variable
- **Connection**: @neondatabase/serverless for edge-compatible database connections
- **ORM**: Drizzle ORM for type-safe database operations and schema management

### UI Framework
- **Radix UI**: Comprehensive set of accessible, unstyled UI primitives
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Lucide React**: Modern icon library with consistent design language

### Development Tools
- **Vite**: Fast build tool with HMR and development server
- **TypeScript**: Type safety across the entire application stack
- **ESBuild**: Fast bundler for production builds
- **Replit Integration**: Development environment optimization with runtime error overlays

### Third-party Services
- **Google Fonts**: Inter font family loaded via CDN
- **Replit Banner**: Development mode banner for external access
- **PostCSS**: CSS processing with Tailwind and Autoprefixer plugins

### Runtime Environment
- **Node.js**: ES Modules configuration for modern JavaScript features
- **Environment Variables**: DATABASE_URL for database connection configuration
- **Build Process**: Separate client and server build pipelines optimized for deployment

## Deployment Configuration

### Vercel Deployment Ready
- **Database**: Neon PostgreSQL serverless database with customer fields
- **API Routes**: Vercel serverless functions in `api/` folder
- **Frontend**: Static build optimized for Vercel CDN
- **Environment**: DATABASE_URL configuration for Neon connection
- **Documentation**: Step-by-step Vercel deployment guide created
- **Build Process**: `vite build` creates optimized static files
- **Global Performance**: Edge functions for worldwide low latency

### Previous cPanel Attempt (Deprecated)
- MySQL setup attempted but incompatible with modern serverless architecture
- Traditional server requirements don't match current serverless best practices
- Migrated to Vercel for better scalability and developer experience