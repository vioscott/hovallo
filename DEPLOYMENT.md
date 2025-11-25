# Deployment Guide - Hovallo to Vercel

## Quick Deployment Steps

### 1. Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository (e.g., `hovallo-property-platform`)
3. **Do NOT** initialize with README, .gitignore, or license (we already have these)
4. Click "Create repository"

### 2. Push Code to GitHub

Run these commands in your terminal:

```bash
# Add GitHub as remote origin (replace with your repository URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push code to GitHub
git branch -M main
git push -u origin main
```

### 3. Deploy to Vercel

#### Option A: Using Vercel Dashboard (Recommended)

1. Go to https://vercel.com and sign in (or create account)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Add Environment Variables:
   Click "Environment Variables" and add:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

6. Click "Deploy"

#### Option B: Using Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy (follow prompts)
vercel

# For production deployment
vercel --prod
```

### 4. Configure Supabase for Production

1. Go to your Supabase dashboard
2. Navigate to **Authentication** → **URL Configuration**
3. Add your Vercel deployment URL to:
   - **Site URL**: `https://your-app.vercel.app`
   - **Redirect URLs**: `https://your-app.vercel.app/**`

### 5. Run Database Migrations

Make sure you've run both migrations in your Supabase SQL Editor:

1. `supabase_schema.sql` - Main database schema
2. `analytics_schema.sql` - Analytics tables and functions

### 6. Test Your Deployment

1. Visit your Vercel URL
2. Test user registration and login
3. Create a test property listing
4. Visit the property page to generate view data
5. Check the analytics dashboard

## Environment Variables

Your `.env` file (local development only):
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important**: Never commit `.env` to Git. It's already in `.gitignore`.

## Vercel Configuration

Vercel will automatically detect your Vite project. The build settings are:

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Development Command**: `npm run dev`

## Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Update DNS records as instructed
5. Update Supabase redirect URLs with your custom domain

## Continuous Deployment

Once connected to GitHub:
- Every push to `main` branch triggers automatic deployment
- Pull requests create preview deployments
- Rollback to previous deployments anytime

## Troubleshooting

### Build Fails

**Error**: "Cannot find module 'recharts'"
**Solution**: Ensure `package.json` includes recharts and date-fns in dependencies

**Error**: Environment variables not found
**Solution**: Add environment variables in Vercel dashboard under Project Settings → Environment Variables

### Runtime Errors

**Error**: Supabase connection failed
**Solution**: 
1. Verify environment variables are set correctly in Vercel
2. Check Supabase URL and anon key are correct
3. Ensure Supabase project is not paused

**Error**: Authentication redirect fails
**Solution**: Add your Vercel URL to Supabase redirect URLs

## Post-Deployment Checklist

- [ ] Verify environment variables are set in Vercel
- [ ] Run both database migrations in Supabase
- [ ] Update Supabase redirect URLs
- [ ] Test user registration and login
- [ ] Test property creation
- [ ] Test analytics dashboard
- [ ] Check mobile responsiveness
- [ ] Test all major features

## Monitoring

Vercel provides:
- **Analytics**: View page views, top pages, etc.
- **Logs**: Real-time function logs
- **Speed Insights**: Performance metrics

Access these in your Vercel project dashboard.

## Updating Your Deployment

To deploy updates:

```bash
# Make your changes
git add .
git commit -m "Your commit message"
git push origin main
```

Vercel will automatically deploy the changes.

## Support

- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- Vite Docs: https://vitejs.dev/guide/

---

**Ready to deploy!** Follow the steps above to get your Hovallo platform live on Vercel.
