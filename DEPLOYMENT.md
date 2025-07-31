# Finance Quest - Deployment Guide 🚀

## 🎯 **Production Deployment Overview**

This guide covers deploying Finance Quest to production environments with optimal performance, security, and reliability configurations.

---

## ⚡ **Quick Deploy Options**

### **🔥 Recommended: Vercel (Optimized for Next.js)**
```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy from project root
vercel

# 3. Configure environment variables in Vercel dashboard
# 4. Custom domain setup (optional)
```

### **☁️ Alternative: Netlify**
```bash
# 1. Build for production
npm run build

# 2. Deploy dist folder to Netlify
# 3. Configure environment variables
# 4. Set up continuous deployment
```

### **🐳 Docker Deployment**
```dockerfile
# Use official Node.js image
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🔧 **Environment Configuration**

### **Required Environment Variables**
```bash
# Core Application
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com

# OpenAI (Required for AI features)
OPENAI_API_KEY=sk-your-production-openai-key

# Market Data APIs
FRED_API_KEY=your-fred-production-key
ALPHA_VANTAGE_API_KEY=your-alpha-vantage-key
POLYGON_API_KEY=your-polygon-key-optional

# Analytics (Optional)
NEXT_PUBLIC_GA_TRACKING_ID=your-google-analytics-id
```

### **Environment Setup by Platform**

#### **Vercel Environment Variables**
1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Add each variable with appropriate environment (Production/Preview/Development)
3. Redeploy after adding variables

#### **Netlify Environment Variables**
1. Go to Netlify Dashboard → Site → Site settings → Environment variables
2. Add variables in "Environment variables" section
3. Trigger new deploy

#### **Docker/Self-Hosted**
Create `.env.production` file:
```bash
NODE_ENV=production
OPENAI_API_KEY=your-key
# ... other variables
```

---

## 🏗️ **Build Optimization**

### **Production Build Configuration**
```typescript
// next.config.ts
const nextConfig = {
  // Production optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Image optimization
  images: {
    domains: ['your-cdn-domain.com'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Bundle analysis
  experimental: {
    bundlePagesRouterDependencies: true,
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};
```

### **Performance Optimization Checklist**
- [ ] **Bundle Analysis**: Check for large dependencies
- [ ] **Image Optimization**: Use Next.js Image component
- [ ] **Code Splitting**: Dynamic imports for heavy components
- [ ] **Tree Shaking**: Remove unused code
- [ ] **Compression**: Enable gzip/brotli compression

---

## 🔒 **Security Configuration**

### **API Key Security**
```typescript
// Always validate API keys exist
const validateEnvironment = () => {
  const required = ['OPENAI_API_KEY'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

// Call during app initialization
validateEnvironment();
```

### **Rate Limiting (Production)**
```typescript
// lib/rateLimit.ts
import { LRUCache } from 'lru-cache';

const tokenCache = new LRUCache({
  max: 500,
  ttl: 60000, // 1 minute
});

export const rateLimit = (identifier: string) => {
  const tokenCount = (tokenCache.get(identifier) as number) || 0;
  
  if (tokenCount >= 10) { // 10 requests per minute
    return false;
  }
  
  tokenCache.set(identifier, tokenCount + 1);
  return true;
};
```

### **Content Security Policy**
```typescript
// next.config.ts - CSP headers
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' *.vercel-analytics.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: https:;
  font-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  connect-src 'self' https://api.openai.com https://api.stlouisfed.org https://www.alphavantage.co;
`;
```

---

## 📊 **Performance Monitoring**

### **Core Web Vitals Targets**
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms  
- **CLS (Cumulative Layout Shift)**: < 0.1
- **FCP (First Contentful Paint)**: < 1.8s

### **Monitoring Setup**
```typescript
// lib/analytics.ts
export const trackPerformance = () => {
  if (typeof window !== 'undefined') {
    // Core Web Vitals
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(console.log);
      getFID(console.log);
      getFCP(console.log);
      getLCP(console.log);
      getTTFB(console.log);
    });
  }
};
```

### **Error Tracking**
```typescript
// lib/errorTracking.ts
export const logError = (error: Error, context?: any) => {
  if (process.env.NODE_ENV === 'production') {
    // Send to error tracking service (Sentry, LogRocket, etc.)
    console.error('Production Error:', error, context);
  }
};
```

---

## 🔄 **CI/CD Pipeline**

### **GitHub Actions Workflow**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Lint code
        run: npm run lint
        
      - name: Type check
        run: npx tsc --noEmit
        
      - name: Build application
        run: npm run build
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          FRED_API_KEY: ${{ secrets.FRED_API_KEY }}
          
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-args: '--prod'
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

### **Pre-deployment Checklist**
- [ ] **Tests Pass**: All automated tests successful
- [ ] **Build Successful**: No TypeScript errors
- [ ] **Linting Clean**: No ESLint warnings/errors
- [ ] **Environment Variables**: All required keys configured
- [ ] **Performance**: Lighthouse score > 90
- [ ] **Security**: No vulnerable dependencies

---

## 🌐 **Domain & DNS Configuration**

### **Custom Domain Setup (Vercel)**
1. **Add Domain**: Vercel Dashboard → Domains → Add domain
2. **DNS Configuration**: Point A record to Vercel IP
3. **SSL Certificate**: Automatically provisioned
4. **Redirect Setup**: www → non-www (or vice versa)

### **DNS Records Example**
```
Type: A
Name: @
Value: 76.76.19.61

Type: CNAME  
Name: www
Value: cname.vercel-dns.com
```

---

## 📈 **Database & Storage (Future)**

### **Database Options**
```typescript
// Future database integration options
- **PostgreSQL** (Vercel Postgres, Neon)
- **MongoDB** (MongoDB Atlas)
- **Redis** (Upstash Redis for caching)
- **Supabase** (PostgreSQL + Auth + Storage)
```

### **File Storage**
```typescript
// Static assets and user uploads
- **Vercel Blob** (Integrated storage)
- **AWS S3** (Scalable object storage)
- **Cloudinary** (Image optimization)
- **Supabase Storage** (Full-stack solution)
```

---

## 🔧 **Troubleshooting**

### **Common Deployment Issues**

#### **Build Failures**
```bash
# Check for TypeScript errors
npx tsc --noEmit

# Verify dependencies
npm ci

# Clear cache
rm -rf .next node_modules
npm install
```

#### **Environment Variable Issues**
```bash
# Verify variables are set
echo $OPENAI_API_KEY

# Check in application
console.log('API Keys:', {
  openai: !!process.env.OPENAI_API_KEY,
  fred: !!process.env.FRED_API_KEY
});
```

#### **Performance Issues**
```bash
# Analyze bundle size
npm install -g @next/bundle-analyzer
ANALYZE=true npm run build

# Check for memory leaks
node --inspect-brk=0.0.0.0:9229 ./node_modules/.bin/next start
```

### **Debugging Production**
```typescript
// Safe production logging
const isProduction = process.env.NODE_ENV === 'production';

const safeLog = (message: string, data?: any) => {
  if (!isProduction) {
    console.log(message, data);
  } else {
    // Send to logging service in production
    // Avoid logging sensitive data
  }
};
```

---

## 📊 **Health Monitoring**

### **Application Health Checks**
```typescript
// pages/api/health.ts
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version,
    apis: {
      openai: !!process.env.OPENAI_API_KEY,
      fred: !!process.env.FRED_API_KEY,
    }
  };
  
  res.status(200).json(health);
}
```

### **Uptime Monitoring**
```bash
# External monitoring services
- **Pingdom**: Website uptime monitoring
- **UptimeRobot**: Free uptime monitoring
- **StatusPage**: Public status page
- **Sentry**: Error tracking and performance
```

---

## 🚀 **Scaling Considerations**

### **Performance Scaling**
- **CDN**: Vercel Edge Network (automatic)
- **Caching**: API response caching strategies
- **Image Optimization**: Next.js automatic optimization
- **Bundle Splitting**: Route-based code splitting

### **Infrastructure Scaling**
- **Serverless Functions**: Auto-scaling API routes
- **Edge Functions**: Global distribution
- **Database Scaling**: Read replicas, connection pooling
- **Rate Limiting**: Protect against abuse

---

## 📞 **Production Support**

### **Monitoring Dashboards**
- **Vercel Analytics**: Built-in performance metrics
- **Google Analytics**: User behavior tracking
- **Error Tracking**: Sentry or similar service
- **API Monitoring**: Response times and error rates

### **Backup & Recovery**
```bash
# Code backup
- **Git Repository**: Source code versioning
- **Environment Variables**: Secure backup of configs
- **Database Backups**: Automated daily backups
- **Asset Backups**: CDN and storage backups
```

---

This deployment guide ensures Finance Quest runs reliably in production with optimal performance, security, and monitoring. Follow these practices for a robust, scalable deployment that can handle real-world traffic and usage patterns.
