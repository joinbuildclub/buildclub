# Build Club - Community Platform for AI Builders

A modern web platform connecting AI enthusiasts, product makers, designers, and engineers through real-life events and meetups in Providence, RI.

## Quick Start

### Using Docker (Recommended)

1. **Clone and setup environment:**
   ```bash
   git clone <repository-url>
   cd buildclub
   cp .env.example .env
   ```

2. **Configure environment variables in `.env`:**
   ```
   DATABASE_URL=postgresql://buildclub:buildclub@db:5432/buildclub
   SENDGRID_API_KEY=your_sendgrid_api_key
   ADMIN_EMAIL=your_admin_email
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

3. **Start with Docker Compose:**
   ```bash
   docker-compose up --build
   ```

4. **Access the application:**
   - Frontend & Backend: http://localhost:5000
   - PostgreSQL: localhost:5432

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development servers:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

## Features

- **Event Management**: Create and manage AI-focused workshops, meetups, hackathons, and conferences
- **User Authentication**: Email/password and Google OAuth with role-based access
- **Hub System**: Geographic organization for multi-location events
- **AI Idea Generator**: Personalized prototype suggestions for 2-3 hour projects
- **Email Integration**: SendGrid-powered notifications and confirmations
- **Admin Dashboard**: Comprehensive management tools for organizers

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Passport.js with session management
- **Email**: SendGrid integration
- **Build Tools**: Vite, ESBuild

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `SENDGRID_API_KEY` | SendGrid API key for emails | Yes |
| `ADMIN_EMAIL` | Admin email for notifications | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Yes |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Yes |

## Docker Commands

```bash
# Build and start services
docker-compose up --build

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Reset database
docker-compose down -v
docker-compose up --build
```

## Database Management

```bash
# Push schema changes
npm run db:push

# Access database in Docker
docker-compose exec db psql -U buildclub -d buildclub
```

## License

MIT