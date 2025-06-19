# Build Club - Community Platform for AI Builders

## Overview

Build Club is a modern web platform designed to connect AI enthusiasts, product makers, designers, and engineers in real-life events and meetups. The platform facilitates event organization, registration, and community building for AI-focused activities including workshops, meetups, hackathons, and conferences.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript for type safety
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **UI Components**: Shadcn UI component library built on Radix UI primitives
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Forms**: React Hook Form with Zod validation
- **Fonts**: Outfit font family for consistent typography

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Session Management**: Express sessions with PostgreSQL store (connect-pg-simple)
- **Authentication**: Passport.js with local and Google OAuth strategies
- **API Design**: RESTful API with JSON responses

### Data Storage Solutions
- **Primary Database**: PostgreSQL with UUID primary keys
- **Schema Management**: Drizzle ORM with migration support
- **Session Storage**: PostgreSQL-backed session store for scalability
- **File Storage**: Static assets served through Vite/Express

## Key Components

### Authentication System
- **Multi-provider**: Local email/password and Google OAuth
- **Email Verification**: Account confirmation via SendGrid with JWT tokens
- **Role-based Access**: Admin, Ambassador, and Member roles
- **Guest Registration**: Support for non-authenticated event registration
- **Password Security**: bcrypt hashing for password storage

### Event Management
- **Event Types**: Workshop, Meetup, Hackathon, Conference
- **Focus Areas**: Product, Design, Engineering, General
- **Time Handling**: UTC storage with local time display conversion
- **Registration System**: Both authenticated user and guest registration
- **Capacity Management**: Event-specific capacity limits
- **Publication Control**: Draft/published states for events

### Hub System
- **Geographic Organization**: City/state/country-based hub locations
- **Multi-hub Events**: Events can be associated with multiple hubs
- **Hub-specific Capacity**: Override global event capacity per hub

### User Management
- **Profile System**: Bio, social links (Twitter, LinkedIn, GitHub)
- **Onboarding Flow**: Required profile completion for new users
- **Interest Tracking**: User interest areas and AI focus preferences
- **Guest Account Conversion**: Convert guest registrations to full accounts

## Data Flow

### Registration Flow
1. User selects event from public listings
2. Authentication check (login required or guest option)
3. Registration form submission with validation
4. Database transaction creates registration record
5. Email confirmation sent via SendGrid
6. Admin notification for new registrations

### Event Creation Flow
1. Admin/Ambassador creates event through dashboard
2. Form validation with Zod schemas
3. Database insertion with UUID generation
4. Hub association and capacity management
5. Publication status controls public visibility

### Authentication Flow
1. User submits credentials or initiates OAuth
2. Passport.js strategy validation
3. Session creation in PostgreSQL store
4. JWT token generation for API access
5. Role-based authorization checks

## External Dependencies

### Email Services
- **SendGrid**: Transactional emails for verification, notifications, and confirmations
- **Configuration**: API key and admin email required
- **Fallback**: Graceful degradation when SendGrid unavailable

### OAuth Integration
- **Google OAuth 2.0**: Social login with profile information
- **Configuration**: Client ID and secret required
- **Account Linking**: Automatic profile completion from Google data

### Development Tools
- **Vite**: Frontend build tool with HMR
- **ESBuild**: Backend bundling for production
- **TypeScript**: Compile-time type checking
- **Drizzle Kit**: Database migrations and schema management

## Deployment Strategy

### Environment Configuration
- **Development**: Local PostgreSQL with Vite dev server
- **Production**: Autoscale deployment with built assets
- **Environment Variables**: Secure configuration for API keys and database URLs
- **Session Security**: Production-ready session configuration with secure cookies

### Database Management
- **Migrations**: Version-controlled schema changes via Drizzle
- **UUID Strategy**: Future-proof identification system
- **Connection Pooling**: PostgreSQL connection pool for scalability
- **Backup Strategy**: Regular automated backups recommended

### Build Process
- **Frontend**: Vite builds optimized React bundle
- **Backend**: ESBuild creates production Node.js bundle
- **Asset Management**: Static file serving with proper caching headers
- **Type Safety**: Full TypeScript compilation before deployment

## Changelog

- June 19, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.