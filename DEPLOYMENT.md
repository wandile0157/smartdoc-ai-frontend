# Frontend Deployment Guide - Vercel

## Prerequisites
- GitHub account
- Vercel account (free tier available)
- Next.js frontend code pushed to GitHub

## Step 1: Prepare Repository

Ensure these files exist in your `frontend/` folder:
- `package.json`
- `next.config.js`
- `vercel.json`
- `.env.local` (for local development only)

## Step 2: Deploy to Vercel

### Option A: Via Vercel Dashboard (Easiest)

1. Go to [Vercel](https://vercel.com)
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Select the `frontend` directory as root
5. Vercel auto-detects Next.js configuration

### Option B: Via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy from frontend folder
cd frontend
vercel

# Follow prompts
# - Link to existing project: No
# - Project name: smartdoc-ai
# - Directory: ./
```

## Step 3: Configure Environment Variables

In Vercel Dashboard:

1. Go to your project
2. Click **"Settings"** → **"Environment Variables"**
3. Add these variables for **Production**:
```
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
NEXT_PUBLIC_API_PREFIX=/api/v1
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_APP_NAME=SmartDoc AI
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_MAX_FILE_SIZE_MB=10
```

4. Click **"Save"**

## Step 4: Redeploy

1. Go to **"Deployments"** tab
2. Click on latest deployment
3. Click **"Redeploy"**
4. Or push new commit to trigger automatic deployment

## Step 5: Set Root Directory

1. Go to **"Settings"** → **"General"**
2. Find **"Root Directory"**
3. Set to: `frontend`
4. Click **"Save"**

## Step 6: Test Your Application

Visit your Vercel URL:
- `https://your-app.vercel.app`

Test:
- Landing page loads
- Login/Signup works
- Dashboard displays
- Sample documents load
- API connection works

## Step 7: Custom Domain (Optional)

1. Go to **"Settings"** → **"Domains"**
2. Add your custom domain (e.g., `smartdoc-ai.com`)
3. Follow DNS configuration instructions
4. Vercel handles SSL automatically

## Automatic Deployments

Vercel automatically deploys:
- **Production**: Commits to `main` branch
- **Preview**: Pull requests and other branches

## Environment-Specific Deployments

### Production
- Branch: `main`
- URL: `https://your-app.vercel.app`
- Uses production environment variables

### Preview
- Branch: Any other branch
- URL: Unique preview URL per branch
- Uses preview environment variables

## Troubleshooting

### Build fails
- Check build logs in Vercel dashboard
- Ensure all dependencies in `package.json`
- Verify Node version compatibility

### API connection fails
- Check `NEXT_PUBLIC_API_URL` is correct
- Ensure backend is deployed and running
- Check CORS settings in backend

### Environment variables not working
- Ensure they start with `NEXT_PUBLIC_`
- Redeploy after adding variables
- Check variable names match code

## Performance Optimization

Vercel automatically provides:
- Global CDN
- Image optimization
- Automatic caching
- Edge functions
- Analytics

## Monitoring

Access via Vercel Dashboard:
- Real-time logs
- Performance metrics
- Error tracking
- Analytics (on paid plans)

## Costs

Vercel free tier includes:
- Unlimited deployments
- 100GB bandwidth per month
- Automatic SSL
- Preview deployments
- Sufficient for portfolio projects