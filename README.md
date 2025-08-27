# Recruitment App

A full-stack recruitment application built with Next.js frontend and Express.js backend.

## Project Structure

```
recruitment-app/
├── frontend/          # Next.js frontend application
├── backend/           # Express.js backend API
├── package.json       # Root package.json for managing both apps
└── README.md         # This file
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1. Install all dependencies:
```bash
npm run install:all
```

### Development

To run both frontend and backend in development mode:

```bash
npm run dev
```

This will start:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### Individual Development

To run only the frontend:
```bash
npm run dev:frontend
```

To run only the backend:
```bash
npm run dev:backend
```

### Building for Production

To build both applications:

```bash
npm run build
```

### Starting in Production

To start both applications in production mode:

```bash
npm start
```

## API Endpoints

- `GET /` - Welcome message
- `GET /health` - Health check endpoint

## Technologies Used

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- React

### Backend
- Express.js
- TypeScript
- CORS
- dotenv

## Development Scripts

- `npm run dev` - Start both frontend and backend in development
- `npm run build` - Build both applications
- `npm start` - Start both applications in production
- `npm run install:all` - Install dependencies for all packages 