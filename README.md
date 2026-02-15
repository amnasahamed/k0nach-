# k0nach! - Assignment & Payment Management System

Professional task and payment management platform built with React, TypeScript, and modern web technologies.

## Features

### Admin Portal
- Secure password-based authentication
- Student management
- Assignment/task creation and tracking
- Payment processing
- Writer management
- Comprehensive audit logging
- Real-time analytics dashboard

### Writer Portal
- Mobile-friendly interface
- Phone-based authentication
- Task submissions
- Payment tracking
- Performance analytics

### Technical Features
- Progressive Web App (PWA) support
- Offline functionality with service workers
- Real-time data sync
- Responsive design for all devices
- Dark mode support (planned)
- Advanced caching strategies

## Tech Stack

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 3
- **UI State**: React Router 7
- **Charts**: Recharts
- **PWA**: Vite PWA Plugin
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **API**: RESTful
- **Authentication**: Token-based

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd k0nach-
```

2. **Install dependencies**
```bash
npm install
cd frontend && npm install --legacy-peer-deps
```

3. **Environment Setup**
```bash
cp frontend/.env.example frontend/.env.local
# Edit frontend/.env.local with your API URL and API keys
```

4. **Development**
```bash
# Terminal 1: Backend
npm run dev:backend

# Terminal 2: Frontend
cd frontend && npm run dev
```

The application will be available at `http://localhost:5173`

## Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
```bash
git push origin main
```

2. **Connect to Vercel**
- Go to [vercel.com](https://vercel.com)
- Click "New Project"
- Select your repository
- Vercel will auto-detect the configuration

3. **Set Environment Variables**
In Vercel Dashboard → Settings → Environment Variables:
```
VITE_API_URL=https://your-api-domain.com
GEMINI_API_KEY=your_api_key
ADMIN_PASSWORD=secure_password
```

4. **Deploy**
- Click "Deploy"
- Monitor build logs
- Your app is live!

### Verify Deployment
- Frontend: `https://your-project.vercel.app`
- Check "Deployments" tab for status
- View build logs for any issues

## Project Structure

```
k0nach-/
├── frontend/                 # React frontend
│   ├── components/          # Reusable components
│   │   ├── ui/             # Base UI components
│   │   ├── dashboard/      # Dashboard pages
│   │   └── ...
│   ├── src/
│   │   ├── context/        # React context
│   │   ├── utils/          # Utilities
│   │   └── App.tsx
│   ├── vite.config.ts      # Vite configuration
│   ├── tailwind.config.js  # Tailwind config
│   └── index.css           # Global styles
├── backend/                 # Express backend (if applicable)
├── vercel.json             # Vercel deployment config
└── DEPLOYMENT.md           # Deployment guide

```

## Available Commands

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run type-check   # Type checking
```

### Backend
```bash
npm run dev:backend  # Start backend development
npm run build:backend # Build backend
```

## Performance Optimizations

The application includes several performance optimizations:

1. **Code Splitting**: Automatic splitting of vendor and app code
2. **Lazy Loading**: Route-based code splitting with React Router
3. **Caching**: Service Worker with multiple caching strategies
4. **Minification**: Automatic minification of JS/CSS in production
5. **Image Optimization**: Efficient asset handling
6. **Tree Shaking**: Removal of unused code

## Security Features

- HTTPS enforcement (Vercel auto-provides)
- Secure password hashing on backend
- Token-based authentication
- CORS configuration
- Environment variable protection
- XSS prevention via React
- CSRF protection on API calls

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS 14+, Android 5+)

## Troubleshooting

### Build Fails
```bash
# Clear cache and reinstall
rm -rf node_frontend/node_modules
npm install --legacy-peer-deps
cd frontend && npm install --legacy-peer-deps
```

### API Connection Issues
- Verify `VITE_API_URL` environment variable
- Check backend is running
- Review CORS settings
- Check firewall rules

### Slow Performance
- Run `npm run build` and check output size
- Review Network tab in DevTools
- Check for console errors
- Profile with Chrome DevTools

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

Private - All rights reserved

## Support

For issues and support:
- GitHub Issues: Create a detailed bug report
- Email: support@k0nach.example.com
- Documentation: See DEPLOYMENT.md for advanced topics

## Roadmap

- [ ] Dark mode support
- [ ] Advanced reporting
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Real-time notifications
- [ ] Advanced payment integrations

---

**Built with ❤️ using modern web technologies**
