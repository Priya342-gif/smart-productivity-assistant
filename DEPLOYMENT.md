# Life OS - Deployment Guide

This guide covers deploying Life OS to production.

## 🌐 Deployment Architecture Options

### Option 1: All-in-One Platform (Easiest)

**Railway.app** - Recommended for MVP
- ✅ Supports Node.js + React + MongoDB in one project
- ✅ Free tier available
- ✅ Automatic HTTPS
- ✅ Easy environment variables
- ✅ GitHub integration for auto-deploy

### Option 2: Split Frontend/Backend

**Frontend:** Vercel or Netlify  
**Backend:** Heroku or Railway  
**Database:** MongoDB Atlas

## 📦 Option 1: Deploy to Railway (Recommended)

### Step 1: Prepare Your Code

1. **Build the frontend for production:**
   ```bash
   cd client
   npm run build
   ```

2. **Update backend to serve React build:**

   Create `life-os/server/server.js` update:
   ```javascript
   // Add this after your API routes
   const path = require('path');
   
   if (process.env.NODE_ENV === 'production') {
     app.use(express.static(path.join(__dirname, '../client/build')));
     
     app.get('*', (req, res) => {
       res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
     });
   }
   ```

3. **Update package.json root scripts:**
   ```json
   {
     "scripts": {
       "start": "node server/server.js",
       "build": "cd client && npm run build",
       "heroku-postbuild": "npm run build"
     }
   }
   ```

### Step 2: Set Up MongoDB Atlas (Free)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Create database user
4. Whitelist all IPs: `0.0.0.0/0` (for Railway)
5. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/life-os`

### Step 3: Deploy to Railway

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your `life-os` repository
6. Railway auto-detects Node.js app

### Step 4: Configure Environment Variables

In Railway dashboard, add:
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/life-os
ANTHROPIC_API_KEY=sk-ant-api03-your-key
PORT=5000
```

### Step 5: Deploy

1. Railway automatically deploys on push to `main` branch
2. Wait for build to complete
3. Railway provides a URL: `https://your-app.railway.app`
4. Visit URL and test!

### Step 6: Initialize Database Indexes

SSH into Railway or run locally against production MongoDB:
```bash
MONGODB_URI=your_production_uri npm run init-db
```

## 📦 Option 2: Vercel (Frontend) + Heroku (Backend)

### Frontend: Deploy to Vercel

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy frontend:**
   ```bash
   cd client
   vercel
   ```

3. **Set environment variable:**
   ```
   REACT_APP_API_URL=https://your-backend-url.herokuapp.com/api
   ```

### Backend: Deploy to Heroku

1. **Install Heroku CLI:**
   ```bash
   # Download from heroku.com/cli
   ```

2. **Login and create app:**
   ```bash
   heroku login
   heroku create life-os-backend
   ```

3. **Add MongoDB Atlas as DATABASE_URL:**
   ```bash
   heroku config:set MONGODB_URI=mongodb+srv://...
   heroku config:set ANTHROPIC_API_KEY=sk-ant-...
   heroku config:set NODE_ENV=production
   ```

4. **Create Procfile:**
   ```
   web: node server/server.js
   ```

5. **Deploy:**
   ```bash
   git push heroku main
   ```

6. **Initialize database:**
   ```bash
   heroku run npm run init-db
   ```

## 🔒 Production Security Checklist

Before going live, implement these security measures:

### 1. Environment Variables
- [ ] Never commit `.env` file
- [ ] Use strong API keys
- [ ] Rotate keys periodically

### 2. Authentication
- [ ] Replace simple name/email with proper auth (JWT or OAuth)
- [ ] Add password hashing (bcrypt)
- [ ] Implement session management

### 3. API Security
- [ ] Add rate limiting:
   ```javascript
   const rateLimit = require('express-rate-limit');
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // limit each IP to 100 requests per windowMs
   });
   app.use('/api/', limiter);
   ```

- [ ] Add helmet for security headers:
   ```javascript
   const helmet = require('helmet');
   app.use(helmet());
   ```

- [ ] Validate and sanitize inputs:
   ```javascript
   const { body, validationResult } = require('express-validator');
   ```

### 4. CORS Configuration
- [ ] Restrict CORS to your frontend domain:
   ```javascript
   const cors = require('cors');
   app.use(cors({
     origin: process.env.FRONTEND_URL || 'http://localhost:3000',
     credentials: true
   }));
   ```

### 5. MongoDB Security
- [ ] Use strong database password
- [ ] Enable IP whitelist (not 0.0.0.0/0 in production)
- [ ] Enable MongoDB authentication
- [ ] Use connection string with authentication

### 6. HTTPS/TLS
- [ ] Ensure platform provides HTTPS (Vercel, Railway, Heroku do by default)
- [ ] Force HTTPS redirect
- [ ] Use secure cookies

### 7. Error Handling
- [ ] Don't expose stack traces to users
- [ ] Log errors to monitoring service (Sentry)
- [ ] Return generic error messages

### 8. Data Validation
- [ ] Validate ObjectIds before querying
- [ ] Sanitize user inputs
- [ ] Escape HTML in user-generated content

## 📊 Monitoring & Logging

### Set Up Error Tracking (Sentry)

1. **Install Sentry:**
   ```bash
   npm install @sentry/node @sentry/react
   ```

2. **Backend integration:**
   ```javascript
   const Sentry = require('@sentry/node');
   Sentry.init({ dsn: process.env.SENTRY_DSN });
   
   app.use(Sentry.Handlers.requestHandler());
   app.use(Sentry.Handlers.errorHandler());
   ```

3. **Frontend integration:**
   ```javascript
   import * as Sentry from '@sentry/react';
   Sentry.init({ dsn: process.env.REACT_APP_SENTRY_DSN });
   ```

### Set Up Logging

1. **Install Winston:**
   ```bash
   npm install winston
   ```

2. **Configure logger:**
   ```javascript
   const winston = require('winston');
   const logger = winston.createLogger({
     level: 'info',
     format: winston.format.json(),
     transports: [
       new winston.transports.File({ filename: 'error.log', level: 'error' }),
       new winston.transports.File({ filename: 'combined.log' })
     ]
   });
   ```

## 🚀 Performance Optimization

### Frontend Optimizations

1. **Code splitting:**
   - React.lazy() for route-based code splitting
   - Lazy load side panel components

2. **Image optimization:**
   - Use WebP format
   - Lazy load images

3. **Caching:**
   - Set cache headers for static assets
   - Use service worker for offline support

### Backend Optimizations

1. **Database query optimization:**
   - Add indexes for frequently queried fields
   - Use lean() for read-only queries
   - Paginate large result sets

2. **Response compression:**
   ```javascript
   const compression = require('compression');
   app.use(compression());
   ```

3. **Caching layer (Redis):**
   ```javascript
   const redis = require('redis');
   const client = redis.createClient(process.env.REDIS_URL);
   // Cache frequent queries
   ```

## 📈 Scaling Considerations

### When to Scale

Signs you need to scale:
- Response times > 1 second
- Database queries slow (> 100ms)
- Memory usage consistently high
- Multiple users experiencing lag

### Horizontal Scaling

1. **Add more server instances:**
   - Railway/Heroku support horizontal scaling
   - Use load balancer (built-in on most platforms)

2. **Database scaling:**
   - MongoDB Atlas auto-scales
   - Add read replicas for read-heavy workloads
   - Shard database if dataset > 100GB

3. **Caching layer:**
   - Add Redis for session management
   - Cache Claude API responses (with TTL)
   - Cache streak calculations

## 🧪 Pre-Deployment Testing

### Checklist Before Going Live

- [ ] All features work in production build
- [ ] Environment variables set correctly
- [ ] Database indexes created
- [ ] Security headers enabled
- [ ] HTTPS working
- [ ] Error tracking configured
- [ ] Backups enabled (MongoDB Atlas auto-backups)
- [ ] Rate limiting active
- [ ] CORS configured correctly
- [ ] API keys secured
- [ ] No console.log statements in production code
- [ ] Mobile responsiveness verified
- [ ] Load testing completed (optional)

### Load Testing (Optional)

Use [artillery.io](https://artillery.io):

```yaml
# load-test.yml
config:
  target: 'https://your-app.railway.app'
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - flow:
      - post:
          url: '/api/chat/message'
          json:
            userId: 'test-user'
            message: 'Hello'
```

Run:
```bash
npx artillery run load-test.yml
```

## 🔄 CI/CD Pipeline (Optional)

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Railway

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Install dependencies
        run: |
          npm install
          cd client && npm install
      
      - name: Run tests
        run: npm test
      
      - name: Build frontend
        run: cd client && npm run build
      
      - name: Deploy to Railway
        uses: bervProject/railway-deploy@main
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
```

## 📞 Post-Deployment

### Verify Deployment

1. Visit your production URL
2. Test auth flow
3. Create goal and mark done
4. Send chat message
5. Check MongoDB Atlas - data should appear
6. Monitor server logs for errors

### Set Up Alerts

1. **MongoDB Atlas alerts:**
   - CPU usage > 80%
   - Disk space < 10%
   - Connection spike

2. **Sentry alerts:**
   - New error types
   - Error rate spike

3. **Platform alerts:**
   - Railway/Heroku: Memory limit reached
   - Response time > threshold

## 🆘 Troubleshooting Deployment Issues

### "Application Error" on Railway/Heroku
- Check logs: `heroku logs --tail` or Railway dashboard
- Verify `PORT` environment variable
- Ensure `npm start` script is correct

### "Cannot connect to MongoDB"
- Verify connection string format
- Check IP whitelist (0.0.0.0/0 for Railway)
- Confirm database user credentials

### Frontend can't reach backend
- Check CORS configuration
- Verify `REACT_APP_API_URL` in Vercel settings
- Ensure backend URL is correct

### Claude API not working
- Verify `ANTHROPIC_API_KEY` is set
- Check API key is valid on Anthropic Console
- Confirm API credits available

---

**Once deployed, Life OS is live! Monitor closely for first few days and iterate based on real usage.** 🚀
