# Render Deployment Guide for Stock Prediction Portal

This guide will help you deploy your Django + React project to Render.com, which offers excellent Django support with a free tier.

## Why Render?

- **Excellent Django support** - Render is built for Django applications
- **Free PostgreSQL database** - Included with the free tier
- **Automatic SSL** - HTTPS enabled by default
- **Simple configuration** - No complex serverless function setup needed
- **Git-based deployment** - Connect your GitHub repository and deploy automatically

## Prerequisites

- Render account (sign up at [render.com](https://render.com))
- GitHub repository with your project
- Python 3.8+ installed locally (for testing)

## Deployment Steps

### 1. Update and Push Changes

First, commit the Render configuration changes to your GitHub repository:

```bash
git add .
git commit -m "Add Render deployment configuration"
git push origin main
```

### 2. Connect Your GitHub Account to Render

1. Go to [render.com](https://render.com) and log in/sign up
2. Click "Sign Up" and choose "Sign up with GitHub"
3. Authorize Render to access your GitHub repositories

### 3. Create New Web Service

1. In Render dashboard, click **"New +"** → **"Web Service"**
2. Select your `stock-prediction-portal` repository
3. Render will automatically detect the `render.yaml` configuration file
4. Click **"Apply"** to use the configuration

### 4. Review and Deploy

Render will show you the configuration from `render.yaml`:
- **Name**: stock-prediction-api
- **Environment**: Python
- **Build Command**: Automatic (pip install + collectstatic)
- **Start Command**: gunicorn server
- **Database**: PostgreSQL (will be created automatically)

Click **"Create Web Service"** to start deployment.

### 5. Wait for Deployment

Render will:
- Clone your repository
- Install Python dependencies
- Run database migrations
- Collect static files
- Start the Django server with gunicorn
- Assign a URL like `https://stock-prediction-api.onrender.com`

The first deployment typically takes 5-10 minutes.

### 6. Run Database Migrations

After the initial deployment, you may need to run migrations manually:

1. Go to your web service in Render dashboard
2. Click **"Shell"** tab
3. Run: `cd backend-drf && python manage.py migrate`

### 7. Configure Environment Variables

After deployment, update environment variables if needed:

1. Go to your web service → **"Environment"** tab
2. Update `CORS_ALLOWED_ORIGINS` to include your frontend URL
3. Add any additional environment variables as needed

## Project Configuration Details

### render.yaml
The configuration file includes:
- **Web service**: Django API with gunicorn
- **PostgreSQL database**: Automatic database creation
- **Environment variables**: Secret key, debug mode, allowed hosts
- **Static files**: Automatic collection during build

### Django Settings Updates
Your Django settings have been updated for Render:
- **ALLOWED_HOSTS**: Configured via environment variable
- **DATABASE_URL**: Uses Render PostgreSQL automatically
- **Static files**: Configured for production
- **Security settings**: SSL, secure cookies, HSTS enabled
- **CORS**: Configured via environment variable

## Frontend Deployment

For your React frontend, you have two options:

### Option A: Deploy Frontend Separately on Render

1. Create a separate Render web service for the frontend
2. Point it to the `frontend-react` directory
3. Update React API calls to use your deployed backend URL

### Option B: Deploy Frontend on Vercel

1. Deploy only the React frontend to Vercel (standard React deployment)
2. Update React API calls to use your Render backend URL
3. Add your Vercel frontend URL to `CORS_ALLOWED_ORIGINS` in Render

## Post-Deployment Checklist

- [ ] Test API endpoints at `https://stock-prediction-api.onrender.com`
- [ ] Run database migrations in Render shell
- [ ] Update CORS settings for your frontend
- [ ] Test authentication flow
- [ ] Test ML model predictions
- [ ] Configure custom domain (optional)
- [ ] Set up monitoring and logs
- [ ] Test media file uploads

## Common Issues and Solutions

### Database Connection Issues

If you get database errors:
1. Check that the database was created in Render dashboard
2. Verify `DATABASE_URL` environment variable is set
3. Run migrations manually in the Render shell

### Static Files Not Loading

If static files don't load:
1. Check that `collectstatic` ran during build
2. Verify `STATIC_ROOT` and `STATIC_URL` settings
3. Check Render logs for static file collection errors

### CORS Errors

If you get CORS errors:
1. Update `CORS_ALLOWED_ORIGINS` environment variable
2. Include your frontend URL (with https)
3. Restart the service after updating environment variables

### Build Failures

If the build fails:
1. Check Render build logs
2. Ensure all dependencies are in `requirements.txt`
3. Verify Python version compatibility
4. Check for syntax errors in Django settings

## Environment Variables

Key environment variables for Render:

- `SECRET_KEY`: Auto-generated by Render
- `DEBUG`: Set to `False` for production
- `ALLOWED_HOSTS`: Your Render domain + custom domains
- `CORS_ALLOWED_ORIGINS`: Frontend URLs that can access the API
- `DATABASE_URL`: Auto-set by Render from PostgreSQL
- `DJANGO_SETTINGS_MODULE`: `stock_prediction_main.settings`

## Scaling and Performance

### Free Tier Limitations
- 512 MB RAM
- Shared CPU
- 512 hours/month usage
- Sleeps after 15 minutes of inactivity

### Paid Plans
If you need better performance:
- **Starter ($7/month)**: 512 MB RAM, no sleep
- **Standard ($25/month)**: 1 GB RAM, better performance
- **Pro ($125/month)**: 2 GB RAM, dedicated resources

### Performance Tips
- Use `gunicorn` workers (configured in render.yaml)
- Enable database connection pooling
- Use Redis for caching (available on Render)
- Optimize database queries
- Implement caching for ML model predictions

## Monitoring and Logs

### Access Logs
1. Go to your web service in Render dashboard
2. Click **"Logs"** tab
3. View real-time logs and historical logs

### Health Checks
Render automatically checks if your service is healthy. Ensure:
- Your API returns 200 status for health checks
- Database connections are working
- No memory leaks or crashes

## Custom Domain Setup

To use a custom domain:

1. Go to your web service → **"Settings"** → **"Domains"**
2. Add your custom domain
3. Update DNS records as instructed by Render
4. Update `ALLOWED_HOSTS` to include your custom domain
5. Update SSL certificates (automatic with Render)

## Backup and Recovery

### Database Backups
Render automatically backs up PostgreSQL databases:
- Daily backups retained for 7 days (free tier)
- Manual backups available in dashboard
- Point-in-time recovery available (paid plans)

### Recovery Process
1. Go to your database in Render dashboard
2. Click **"Backups"** tab
3. Select backup to restore from
4. Follow the recovery process

## Security Best Practices

1. **Keep DEBUG=False** in production
2. **Use strong SECRET_KEY** (auto-generated by Render)
3. **Enable SSL** (automatic with Render)
4. **Restrict CORS origins** to specific domains
5. **Update dependencies regularly**
6. **Monitor logs for suspicious activity**
7. **Use environment variables for sensitive data**

## Troubleshooting Commands

### Access Render Shell
```bash
# In Render dashboard, go to your service → "Shell" tab
cd backend-drf
python manage.py shell
```

### Manual Migrations
```bash
cd backend-drf
python manage.py migrate
```

### Create Superuser
```bash
cd backend-drf
python manage.py createsuperuser
```

### Check Logs
```bash
# In Render dashboard, go to your service → "Logs" tab
# Filter by: "error", "warning", "info"
```

## Alternative Deployment Options

If Render doesn't meet your needs:

- **Railway.app**: Similar to Render, good Django support
- **Heroku**: Mature platform, excellent Django support (paid)
- **DigitalOcean App Platform**: Good for custom requirements
- **AWS/Elastic Beanstalk**: Enterprise-grade solution

## Support and Resources

- **Render Documentation**: [docs.render.com](https://docs.render.com)
- **Django on Render Guide**: [render.com/docs/deploy-django](https://render.com/docs/deploy-django)
- **Render Community**: [community.render.com](https://community.render.com)
- **Support**: [support@render.com](mailto:support@render.com)

## Next Steps

After successful deployment:

1. Test all API endpoints
2. Set up monitoring and alerts
3. Configure custom domain (optional)
4. Set up CI/CD pipeline
5. Optimize performance
6. Plan for scaling

Your Django backend is now live on Render! 🚀