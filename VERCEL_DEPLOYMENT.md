# Vercel Deployment Guide for Stock Prediction Portal

This guide will help you deploy your Django + React project to Vercel.

## Prerequisites

- Vercel account (sign up at [vercel.com](https://vercel.com))
- GitHub repository with your project
- Python 3.8+ installed locally (for testing)

## Project Structure Changes Made

1. **Created Vercel configuration**: `vercel.json` - Configures Vercel to build and deploy the Django backend
2. **Created API handler**: `api/index.py` - Serverless function that handles Django requests
3. **Updated Django settings**: Modified `backend-drf/stock_prediction_main/settings.py` for Vercel compatibility
4. **Updated dependencies**: Added `dj-database-url` to `requirements.txt` for database configuration
5. **Created `.env.example`**: Template for environment variables

## Deployment Steps

### 1. Commit and Push Changes

First, commit the configuration changes to your GitHub repository:

```bash
git add .
git commit -m "Add Vercel deployment configuration"
git push origin main
```

### 2. Import Project to Vercel

1. Go to [vercel.com](https://vercel.com) and log in
2. Click "Add New Project" → "Import Git Repository"
3. Select your `stock-prediction-portal` repository
4. Click "Import"

### 3. Configure Project Settings

In the Vercel project configuration:

**Framework Preset**: Select "Other" (since this is a custom Django setup)

**Root Directory**: Leave as `./` (root of your repository)

**Build Command**: Leave empty (Vercel will handle Python dependencies automatically)

**Output Directory**: Leave empty

### 4. Set Environment Variables

Add the following environment variables in Vercel (Settings → Environment Variables):

- `SECRET_KEY`: Generate a secure random key (e.g., using `python -c "import secrets; print(secrets.token_urlsafe(50))"`)
- `DEBUG`: Set to `False` for production
- `DATABASE_URL`: 
  - **Option 1 (Recommended)**: Use Vercel Postgres (free tier available)
  - **Option 2**: Use an external PostgreSQL database (Render, Railway, etc.)
  - **Option 3 (Development only)**: `sqlite:///db.sqlite3` (not recommended for production)

### 5. Deploy

Click "Deploy" and wait for the build to complete. Vercel will:
- Install Python dependencies from `requirements.txt`
- Build the serverless function
- Deploy to their global edge network

### 6. Update Django Settings for Production

After deployment, update your `backend-drf/stock_prediction_main/settings.py`:

```python
ALLOWED_HOSTS = ['your-vercel-domain.vercel.app', 'your-custom-domain.com']

CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'https://your-frontend-domain.vercel.app',  # Add your frontend URL
]
```

### 7. Frontend Deployment

For your React frontend (`frontend-react`), you have two options:

**Option A: Deploy Frontend Separately**
1. Create a separate Vercel project for the frontend
2. Update the frontend's API calls to use your deployed backend URL
3. Follow standard Vercel React deployment process

**Option B: Serve Frontend from Django**
1. Build the React frontend: `cd frontend-react && npm run build`
2. Move the `dist` folder to Django's static files
3. Configure Django to serve the frontend

## Important Notes

### Database Considerations

- **SQLite** is not recommended for production on Vercel due to file system limitations
- **Vercel Postgres** is the recommended option for production databases
- **External databases** (Render, Railway, AWS RDS) work well with Vercel

### Media Files

The current setup uses local media storage. For production, consider:
- Vercel Blob Storage
- AWS S3
- Cloudflare R2

### Machine Learning Model

Your `stock_prediction_model.keras` file is currently ignored by git. For production:
1. Upload the model to cloud storage (S3, Vercel Blob)
2. Update your Django code to download/load the model from cloud storage
3. Or commit the model file if it's not too large

### Performance Considerations

- Django on Vercel uses serverless functions, which have cold starts
- For better performance, consider:
  - Using Vercel's Edge Network for static assets
  - Implementing caching strategies
  - Using a dedicated server for heavy ML computations

## Troubleshooting

### Build Errors

If you encounter build errors:
1. Check the Vercel build logs
2. Ensure all dependencies are in `requirements.txt`
3. Verify Python version compatibility

### Runtime Errors

If the app deploys but doesn't work:
1. Check Vercel function logs
2. Verify environment variables are set correctly
3. Ensure database connection is working
4. Check CORS settings

### Database Connection Issues

If you get database errors:
1. Verify `DATABASE_URL` is correctly formatted
2. Ensure database is accessible from Vercel's network
3. Check database credentials and permissions

## Post-Deployment Checklist

- [ ] Set up production database
- [ ] Configure CORS for frontend domain
- [ ] Set up monitoring/logging
- [ ] Configure custom domain (optional)
- [ ] Set up SSL certificates (automatic with Vercel)
- [ ] Test all API endpoints
- [ ] Test authentication flow
- [ ] Test ML model predictions
- [ ] Set up backup strategy for database

## Alternative Deployment Options

If Vercel deployment proves challenging for Django, consider:

1. **Render.com** - Excellent Django support with free tier
2. **Railway.app** - Good Django support with database included
3. **Heroku** - Mature Django deployment platform
4. **DigitalOcean App Platform** - Good for Django + custom requirements

These platforms might offer better Django-specific support and easier database integration.