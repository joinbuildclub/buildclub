# Build Club

A platform for AI enthusiasts to connect, collaborate, and build together in real life.

## 🚀 About

Build Club is a community of product makers, designers, and engineers collaborating to build impactful AI solutions in real life. Our platform facilitates event organization, registration, and community building.

## 📋 Tech Stack

- **Frontend**: React (TypeScript), Tailwind CSS, Shadcn UI
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Passport.js, JWT
- **Email**: SendGrid

## 🔧 Getting Started

### Prerequisites

- Node.js LTS/Hydrogen (v18.x) - We use nvm for Node.js version management
- PostgreSQL database
- pnpm package manager

### Environment Setup

1. **Clone the repository**

```bash
git clone https://github.com/joinbuildclub/buildclub.git
cd buildclub
```

2. **Use the correct Node.js version**

```bash
nvm use
```

3. **Install dependencies**

```bash
pnpm install
```

4. **Create a .env file in the root directory with the following variables:**

```
# Database Configuration
DATABASE_URL=postgresql://postgres:password@localhost:5432/buildclub

# Authentication
SESSION_SECRET=your-secret-key-here

# Environment
NODE_ENV=development

# SendGrid (Optional)
SENDGRID_API_KEY=your-sendgrid-api-key
ADMIN_EMAIL=admin@buildclub.co

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Running the Development Server

```bash
pnpm dev
```

This will start the development server at http://localhost:5000.

## 📊 Database Migrations

We use Drizzle ORM for database management.

### Create and apply migrations

```bash
pnpm db:push
```

## 📁 Project Structure

```
buildclub/
├── client/             # Frontend React application
│   ├── src/
│   │   ├── components/ # Reusable React components
│   │   ├── pages/      # Page components
│   │   ├── hooks/      # Custom React hooks
│   │   └── lib/        # Utility functions and configuration
├── server/             # Backend Express.js application
│   ├── index.ts        # Main server entry point
│   ├── routes.ts       # API routes
│   ├── auth.ts         # Authentication setup
│   └── db.ts           # Database connection
├── shared/             # Shared code between client and server
│   └── schema.ts       # Database schema definitions
└── migrations/         # Database migration files
```

## 🔑 Available Scripts

- `pnpm dev` - Start the development server
- `pnpm build` - Build the production application
- `pnpm start` - Start the production server
- `pnpm db:push` - Apply database schema changes

## 🤝 Contributing

We welcome contributions to the Build Club platform! Please feel free to submit issues and pull requests.

## 📫 Contact

- Website: [buildclub.co](https://buildclub.co)
- Email: [join@buildclub.co](mailto:join@buildclub.co)

## 📄 License

This project is licensed under the MIT License.
