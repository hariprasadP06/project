# Second Brain - AI-Powered Memory Assistant

A full-stack application that helps you store, organize, and retrieve personal knowledge using AI-powered semantic search.

## 🌟 Features

- **Memory Management**: Store and organize notes, ideas, and knowledge
- **AI-Powered Search**: Ask natural language questions and get intelligent answers
- **Smart Tagging**: Organize memories with tags and categories
- **Dark/Light Mode**: Responsive design with theme support
- **Guest Mode**: Try the app without creating an account
- **Secure Authentication**: JWT-based authentication system
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Router** for navigation
- **TanStack Query** for data fetching
- **React Hook Form** for form handling
- **Zustand** for state management

### Backend
- **Node.js** with Express
- **PostgreSQL** with Prisma ORM
- **JWT** for authentication
- **bcrypt** for password hashing
- **Zod** for validation

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials and JWT secret
```

4. Set up the database:
```bash
npm run db:generate
npm run db:migrate
```

5. Start the backend server:
```bash
npm run dev
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components
│   ├── Header.tsx      # Navigation header
│   ├── Layout.tsx      # App layout wrapper
│   └── ...
├── contexts/           # React contexts
│   ├── AuthContext.tsx # Authentication state
│   └── ThemeContext.tsx# Theme management
├── pages/              # Page components
│   ├── HomePage.tsx    # Landing page
│   ├── LoginPage.tsx   # Authentication
│   ├── SignupPage.tsx  # User registration
│   └── DashboardPage.tsx# Main app interface
├── services/           # API service layer
│   ├── authService.ts  # Authentication API
│   └── memoryService.ts# Memory management API
└── App.tsx            # Root component

backend/
├── routes/            # API route handlers
├── middleware/        # Express middleware
├── prisma/           # Database schema and migrations
└── server.js         # Express server setup
```

## 🔐 Authentication

The app supports both authenticated users and guest mode:

- **Signup/Login**: Create an account with email and password
- **Guest Mode**: Try the app with limited features using localStorage
- **JWT Tokens**: Secure authentication with 7-day expiration
- **Protected Routes**: Dashboard requires authentication or guest mode

## 💾 Data Storage

- **Production**: PostgreSQL with Prisma ORM
- **Demo Mode**: localStorage for guest users and development
- **Memory Structure**: Title, content, tags, timestamps
- **User Isolation**: Each user's memories are private and secure

## 🔍 AI Search Features

The semantic search system provides:

- **Natural Language Queries**: Ask questions in plain English
- **Contextual Answers**: AI-generated responses based on your memories
- **Reference Citations**: See which memories were used for each answer
- **Tag-based Filtering**: Search by tags and categories

## 🎨 Design System

- **Color Palette**: Primary blue, secondary indigo, accent emerald
- **Typography**: Google Sans font family
- **Spacing**: 8px grid system
- **Animations**: Smooth transitions and micro-interactions
- **Responsive**: Mobile-first design with tailored breakpoints

## 🚀 Deployment

### Frontend (Vercel)
```bash
npm run build
# Deploy the `dist` folder to Vercel
```

### Backend (Railway/Heroku)
```bash
# Set environment variables
# Deploy with your preferred platform
```

## 🔧 Environment Variables

### Frontend
```env
VITE_API_URL=http://localhost:3001
```

### Backend
```env
DATABASE_URL=postgresql://username:password@localhost:5432/second_brain
JWT_SECRET=your-super-secret-jwt-key
PORT=3001
NODE_ENV=production
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Sign in
- `GET /api/auth/session` - Get current user

### Memories
- `GET /api/memories` - List all memories
- `POST /api/memories` - Create memory
- `PUT /api/memories/:id` - Update memory
- `DELETE /api/memories/:id` - Delete memory

### AI Search
- `POST /api/ai/search` - Semantic search with AI responses

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with modern React and Node.js best practices
- Inspired by the "Second Brain" methodology
- Uses AI for enhanced search and discovery
- Designed for productivity and knowledge management