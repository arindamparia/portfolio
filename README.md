# Portfolio Website

Modern portfolio with React + Vite, dual themes, interactive backgrounds, and PostgreSQL database.

## Tech Stack

- React 18 + Vite
- Neon PostgreSQL
- Netlify Functions
- Framer Motion
- Cloudinary CDN

## Quick Start

```bash
npm install
cp .env.example .env  # Add DATABASE_URL
npm run init-db       # Initialize database
npm run dev           # Start frontend (localhost:5173)
npm run server        # Start API (localhost:3001)
```

## Features

- Dual themes (Modern/IDE)
- Interactive backgrounds
- Contact form with database
- Real-time clock
- SEO optimized
- Fully responsive

## Documentation

- [DATABASE_SETUP.md](./DATABASE_SETUP.md) - Database & API
- [NETLIFY_DEPLOYMENT.md](./NETLIFY_DEPLOYMENT.md) - Deployment
- [CORS-SECURITY.md](./CORS-SECURITY.md) - CORS config
- [CLOUDINARY_SETUP.md](./CLOUDINARY_SETUP.md) - Image hosting
- [GOOGLE_SEARCH_CONSOLE_GUIDE.md](./GOOGLE_SEARCH_CONSOLE_GUIDE.md) - SEO

## Environment Variables

```env
DATABASE_URL=postgresql://...
ALLOWED_ORIGINS=http://localhost:5173
```

## Configuration Files

- `src/constants/` - All constants (timing, thresholds)
- `src/data/` - Projects, skills, experience
- `src/constants/personalInfo.js` - Personal details
