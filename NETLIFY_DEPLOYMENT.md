# Netlify Deployment Guide

This guide will help you deploy your portfolio website with database integration to Netlify.

## What's Been Set Up

✅ **Netlify Serverless Functions** - Your Express API has been converted to Netlify-compatible serverless functions
✅ **Dynamic API URLs** - Frontend automatically uses correct API endpoints in dev and production
✅ **Configuration File** - `netlify.toml` is ready with build settings and redirects
✅ **Database Integration** - Neon PostgreSQL will work seamlessly in production

## Pre-Deployment Checklist

### 1. Initialize Your Database

First, make sure your Neon database table is created:

```bash
npm run init-db
```

This creates the `contacts` table with all tracking fields.

### 2. Test Locally

Test that everything works before deploying:

**Terminal 1** - Start local Express server (for development):
```bash
npm run server
```

**Terminal 2** - Start Vite development server:
```bash
npm run dev
```

Visit `http://localhost:5173` and test the contact form submission.

### 3. Build for Production

Test the production build locally:

```bash
npm run build
npm run preview
```

## Deploying to Netlify

### Method 1: Deploy via Netlify UI (Recommended for First Time)

#### Step 1: Push Your Code to GitHub

```bash
git add .
git commit -m "Prepare for Netlify deployment"
git push origin claude/implement-design-principle-01UZf68gdekgjR5ekdCChwZm
```

#### Step 2: Connect to Netlify

1. Go to [https://app.netlify.com](https://app.netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **GitHub** and authorize Netlify
4. Select your **portfolio** repository
5. Select your branch (e.g., `claude/implement-design-principle-01UZf68gdekgjR5ekdCChwZm` or `main`)

#### Step 3: Configure Build Settings

Netlify should auto-detect settings from `netlify.toml`, but verify:

- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Functions directory**: `netlify/functions`

#### Step 4: Add Environment Variables

This is **CRITICAL** - Your database won't work without this!

1. In Netlify dashboard, go to **Site settings** → **Environment variables**
2. Click **"Add a variable"**
3. Add your environment variable:

   **Key**: `DATABASE_URL`
   **Value**: Your Neon connection string
   ```
   postgresql://neondb_owner:npg_fxr9FMEidA8j@ep-green-meadow-ahm0aoyn-pooler.c-3.us-east-1.aws.neon.tech/Portfolio?sslmode=require&channel_binding=require
   ```

4. **Important**: Set scope to **"All deploys"**

#### Step 5: Deploy

Click **"Deploy site"** and wait for the build to complete (usually 2-3 minutes).

### Method 2: Deploy via Netlify CLI

If you prefer command line:

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize Netlify site
netlify init

# Set environment variable
netlify env:set DATABASE_URL "your-neon-connection-string-here"

# Deploy
netlify deploy --prod
```

## Post-Deployment Steps

### 1. Test Your Deployed Site

Once deployed, Netlify will give you a URL like: `https://your-site-name.netlify.app`

1. Visit your site
2. Navigate to the Contact section
3. Fill out the form and submit
4. Check if data is saved successfully

### 2. Verify Database

To check if data is being saved:

1. Use the test endpoint: `https://your-site-name.netlify.app/api/contacts`
2. Or query your Neon database directly via their console
3. Or run locally: `npm run server` and visit `http://localhost:3001/api/contacts`

### 3. Set Up Custom Domain (Optional)

In Netlify dashboard:
1. Go to **Domain settings**
2. Click **"Add custom domain"**
3. Follow instructions to connect your domain

## Project Structure

```
portfolio/
├── netlify/
│   └── functions/         # Serverless functions (API endpoints)
│       ├── contact.js     # POST /api/contact
│       └── contacts.js    # GET /api/contacts
├── src/
│   ├── components/
│   │   └── Modern/
│   │       └── Contact.jsx  # Updated with dynamic API URL
│   └── utils/
│       └── api.js         # API URL helper
├── netlify.toml           # Netlify configuration
├── .env                   # Local environment variables (NOT committed)
└── .env.example           # Template for environment variables
```

## API Endpoints

After deployment, your API will be available at:

- `https://your-site.netlify.app/api/contact` - Submit contact form
- `https://your-site.netlify.app/api/contacts` - Get all contacts

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ Yes | Neon PostgreSQL connection string |

## Troubleshooting

### Build Fails

**Error**: `Module not found` or dependency issues
- **Solution**: Make sure all dependencies are in `package.json`
- Run `npm install` locally to verify

**Error**: `DATABASE_URL is not set`
- **Solution**: Add environment variable in Netlify dashboard (see Step 4 above)

### API Returns 500 Error

**Error**: Database connection fails in production
- **Solution**: Verify `DATABASE_URL` is correctly set in Netlify
- Check Netlify function logs: **Site overview** → **Functions** → Click on function → **Logs**

### API Returns 404

**Error**: `/api/contact` returns 404
- **Solution**: Check that `netlify.toml` is in the root directory
- Verify functions are in `netlify/functions/` directory
- Redeploy the site

### CORS Errors

**Error**: `Access-Control-Allow-Origin` errors
- **Solution**: Already handled in `netlify.toml` headers section
- If issues persist, check browser console for specific error

## Local vs Production

### Development (Local)
- Frontend: `http://localhost:5173` (Vite)
- Backend: `http://localhost:3001` (Express)
- API calls: `http://localhost:3001/api/*`

### Production (Netlify)
- Frontend: `https://your-site.netlify.app`
- Backend: Serverless functions
- API calls: `https://your-site.netlify.app/api/*`

The `src/utils/api.js` helper automatically detects the environment and uses the correct URL.

## Continuous Deployment

Once connected to GitHub:
- Every push to your connected branch triggers a new deploy
- Netlify automatically builds and deploys your site
- Check **Deploys** tab in Netlify dashboard for status

## Performance Tips

1. **Enable Caching**: Already configured in `netlify.toml`
2. **Analytics**: Enable Netlify Analytics in site settings
3. **Forms**: Use Netlify Forms for additional form handling (optional)

## Security Best Practices

✅ Database credentials stored as environment variables
✅ `.env` file excluded from git via `.gitignore`
✅ CORS properly configured for API endpoints
✅ Security headers configured in `netlify.toml`

## Monitoring

After deployment:
1. **Function Logs**: Netlify Dashboard → Functions → Select function → View logs
2. **Analytics**: Enable in Netlify Dashboard for visitor insights
3. **Database**: Monitor in Neon dashboard for query performance

## Getting Help

- **Netlify Docs**: https://docs.netlify.com
- **Netlify Support**: https://answers.netlify.com
- **Neon Docs**: https://neon.tech/docs

## Summary

✅ **Before deploying**:
   - Initialize database with `npm run init-db`
   - Test locally
   - Push to GitHub

✅ **During deployment**:
   - Connect GitHub repo to Netlify
   - Configure build settings (auto-detected)
   - **CRITICAL**: Add `DATABASE_URL` environment variable

✅ **After deployment**:
   - Test contact form submission
   - Verify data in database
   - Set up custom domain (optional)

Your portfolio with full database integration is now ready for production! 🚀
