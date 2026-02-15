# Deployment Guide for k0nach!

## Quick Start with Vercel

### 1. Prerequisites
- Git repository connected to GitHub
- Vercel account
- Environment variables configured

### 2. Environment Setup

Before deploying, ensure all environment variables are set in your Vercel project:

```env
VITE_API_URL=https://your-api-domain.com
GEMINI_API_KEY=your_gemini_api_key
ADMIN_PASSWORD=your_secure_admin_password
```

### 3. Deploy to Vercel

#### Option A: Using Vercel Dashboard
1. Connect your GitHub repository to Vercel
2. Select the root directory as the project root
3. Set environment variables in Vercel settings
4. Deploy - Vercel will automatically detect and build the frontend

#### Option B: Using Vercel CLI
```bash
npm i -g vercel
vercel
# Follow the prompts to link your project
```

### 4. Build Configuration
- **Framework**: Vite React
- **Build Command**: `cd frontend && npm run build`
- **Output Directory**: `frontend/dist`
- **Install Command**: `npm install --legacy-peer-deps && cd frontend && npm install --legacy-peer-deps`

### 5. Backend Deployment

The backend API should be deployed separately:
- **Option 1**: Deploy to Railway, Render, or Heroku
- **Option 2**: Use Vercel Serverless Functions (advanced)
- **Option 3**: Deploy to your own server

Update `VITE_API_URL` environment variable to point to your backend.

### 6. Production Optimizations

The application includes:
- PWA support with service workers
- Optimized caching strategies
- Font optimization
- Bundle code splitting
- Tree-shaking for unused code

### 7. Monitoring & Analytics

Set up monitoring:
1. Error tracking (Sentry, Rollbar)
2. Performance monitoring (Vercel Analytics)
3. Log aggregation (Papertrail, LogRocket)

### 8. Security Checklist

- [ ] HTTPS enabled (automatic with Vercel)
- [ ] Environment variables secured
- [ ] CORS properly configured
- [ ] Admin password is strong and secure
- [ ] No API keys hardcoded
- [ ] Rate limiting enabled on API
- [ ] Database credentials secured

### 9. Performance Tips

1. **Enable CDN**: Vercel automatically uses Edge Network
2. **Image Optimization**: Keep images optimized
3. **Code Splitting**: Already configured in Vite
4. **Caching**: Service Worker handles offline caching
5. **Database**: Optimize queries and use indexes

### 10. Troubleshooting

#### Build fails
- Check Node.js version compatibility
- Verify all dependencies are installed
- Review build logs in Vercel dashboard

#### API calls not working
- Verify `VITE_API_URL` is correct
- Check CORS settings on backend
- Ensure backend is running and accessible

#### Deployment is slow
- Check bundle size: `npm run build` and review dist folder
- Analyze dependencies for unused packages
- Enable Edge Caching in Vercel settings

### 11. Rollback
If deployment has issues:
1. Go to Vercel Dashboard → Deployments
2. Click on previous successful deployment
3. Click "Promote to Production"

### 12. Custom Domain
1. Go to Vercel Dashboard → Settings → Domains
2. Add your custom domain
3. Update DNS records per Vercel instructions

---

**For Support**:
- Vercel Docs: https://vercel.com/docs
- GitHub Issues: Report bugs with detailed logs
- Community: Ask questions on GitHub Discussions

