# Deployment Guide

## Overview

This guide covers the deployment process, environment configuration, and production optimization for the Web 7B Frontend application.

## 🏗️ Build Process

### Development Build

```bash
# Start development server
npm run dev

# The development server will be available at:
# http://localhost:5173
```

### Production Build

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview

# The preview server will be available at:
# http://localhost:4173
```

### Build Output

The production build creates optimized files in the `dist/` directory:

```
dist/
├── index.html              # Main HTML file
├── assets/
│   ├── index-[hash].js     # Main JavaScript bundle
│   ├── index-[hash].css    # Main CSS bundle
│   ├── [name]-[hash].js    # Code-split chunks
│   └── [name]-[hash].css   # Component-specific styles
└── [other static assets]
```

## 🔧 Environment Configuration

### Environment Variables

Create environment-specific files in the project root:

#### Development (`.env.development`)
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=Web 7B Hospital (Dev)
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=development
VITE_SENTRY_DSN=
VITE_ANALYTICS_ID=
```

#### Production (`.env.production`)
```env
VITE_API_BASE_URL=https://api.web7b.com/api
VITE_APP_NAME=Web 7B Hospital
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=production
VITE_SENTRY_DSN=https://your-sentry-dsn
VITE_ANALYTICS_ID=GA-XXXXXXXXX
```

#### Staging (`.env.staging`)
```env
VITE_API_BASE_URL=https://staging-api.web7b.com/api
VITE_APP_NAME=Web 7B Hospital (Staging)
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=staging
VITE_SENTRY_DSN=https://your-sentry-dsn
VITE_ANALYTICS_ID=GA-XXXXXXXXX
```

### Environment Type Definitions

Define TypeScript types for environment variables:

```typescript
// env.d.ts
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_ENVIRONMENT: 'development' | 'staging' | 'production';
  readonly VITE_SENTRY_DSN?: string;
  readonly VITE_ANALYTICS_ID?: string;
  readonly VITE_FIREBASE_API_KEY?: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN?: string;
  readonly VITE_FIREBASE_PROJECT_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

### Environment Usage

```typescript
// shared/config/config.ts
export const config = {
  api: {
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000,
  },
  app: {
    name: import.meta.env.VITE_APP_NAME,
    version: import.meta.env.VITE_APP_VERSION,
    environment: import.meta.env.VITE_ENVIRONMENT,
  },
  sentry: {
    dsn: import.meta.env.VITE_SENTRY_DSN,
  },
  analytics: {
    id: import.meta.env.VITE_ANALYTICS_ID,
  },
};
```

## 🚀 Deployment Platforms

### Vercel Deployment

#### 1. Vercel Configuration

Create `vercel.json` in the project root:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

#### 2. Environment Variables in Vercel

Configure environment variables in Vercel dashboard:

1. Go to your project in Vercel dashboard
2. Navigate to Settings → Environment Variables
3. Add each environment variable:
   - `VITE_API_BASE_URL`
   - `VITE_APP_NAME`
   - `VITE_APP_VERSION`
   - `VITE_ENVIRONMENT`
   - `VITE_SENTRY_DSN`
   - `VITE_ANALYTICS_ID`

#### 3. Deployment Commands

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Deploy to preview
vercel
```

### Netlify Deployment

#### 1. Netlify Configuration

Create `netlify.toml` in the project root:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

#### 2. Environment Variables in Netlify

Configure environment variables in Netlify dashboard:

1. Go to your site in Netlify dashboard
2. Navigate to Site settings → Environment variables
3. Add each environment variable with appropriate values

### Docker Deployment

#### 1. Dockerfile

Create `Dockerfile` in the project root:

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

#### 2. Nginx Configuration

Create `nginx.conf`:

```nginx
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        # Security headers
        add_header X-Frame-Options "DENY" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;
        add_header X-XSS-Protection "1; mode=block" always;

        # Cache static assets
        location /assets/ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Handle client-side routing
        location / {
            try_files $uri $uri/ /index.html;
        }

        # API proxy (if needed)
        location /api/ {
            proxy_pass http://backend:3000/api/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

#### 3. Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "80:80"
    environment:
      - VITE_API_BASE_URL=http://localhost:3000/api
    depends_on:
      - backend

  backend:
    image: web7b-backend:latest
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:password@db:5432/web7b
    depends_on:
      - db

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=web7b
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

#### 4. Docker Commands

```bash
# Build and run with Docker Compose
docker-compose up --build

# Build Docker image
docker build -t web7b-frontend .

# Run Docker container
docker run -p 80:80 web7b-frontend
```

## 📊 Performance Optimization

### Bundle Analysis

```bash
# Analyze bundle size
npm run build:analyze

# This will open a visual bundle analyzer in your browser
```

### Build Optimization

#### 1. Vite Configuration

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      'shared': resolve(__dirname, 'src/shared'),
      'public': resolve(__dirname, 'src/public'),
      'admin': resolve(__dirname, 'src/admin'),
    },
  },
  build: {
    target: 'es2015',
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          query: ['@tanstack/react-query'],
          ui: ['shared/components/ui'],
        },
      },
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  server: {
    port: 5173,
    host: true,
  },
  preview: {
    port: 4173,
    host: true,
  },
});
```

#### 2. Code Splitting

```typescript
// Lazy load routes
const PublicRoutes = React.lazy(() => import('./PublicRoutes'));
const AdminRoutes = React.lazy(() => import('./AdminRoutes'));

// Lazy load heavy components
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));
```

#### 3. Image Optimization

```typescript
// Use optimized image formats
import { Image } from 'shared/components/ui';

// WebP with fallback
<Image
  src="/images/hero.webp"
  fallback="/images/hero.jpg"
  alt="Hero image"
  loading="lazy"
/>
```

### Caching Strategy

#### 1. Service Worker

```typescript
// public/sw.js
const CACHE_NAME = 'web7b-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/index.js',
  '/assets/index.css',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
```

#### 2. Cache Headers

```nginx
# nginx.conf
location /assets/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public";
}
```

## 🔒 Security Configuration

### Security Headers

```nginx
# nginx.conf
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;" always;
```

### Content Security Policy

```html
<!-- index.html -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' data:;
  connect-src 'self' https:;
">
```

### HTTPS Configuration

```nginx
# nginx.conf for HTTPS
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Redirect HTTP to HTTPS
    if ($scheme != "https") {
        return 301 https://$server_name$request_uri;
    }

    # ... rest of configuration
}
```

## 📈 Monitoring & Analytics

### Error Tracking

```typescript
// src/main.tsx
import * as Sentry from '@sentry/react';

if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.VITE_ENVIRONMENT,
    integrations: [
      new Sentry.BrowserTracing(),
      new Sentry.Replay(),
    ],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}
```

### Performance Monitoring

```typescript
// src/shared/utils/analytics.ts
export const trackPageView = (page: string) => {
  if (typeof gtag !== 'undefined') {
    gtag('config', import.meta.env.VITE_ANALYTICS_ID, {
      page_path: page,
    });
  }
};

export const trackEvent = (action: string, category: string, label?: string) => {
  if (typeof gtag !== 'undefined') {
    gtag('event', action, {
      event_category: category,
      event_label: label,
    });
  }
};
```

### Health Checks

```typescript
// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: import.meta.env.VITE_APP_VERSION,
    environment: import.meta.env.VITE_ENVIRONMENT,
  });
});
```

## 🔄 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run type-check

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run build
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-files
          path: dist/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build-files
          path: dist/
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./
```

### Environment Secrets

Configure secrets in GitHub repository:

1. Go to Settings → Secrets and variables → Actions
2. Add the following secrets:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`

## 🚨 Troubleshooting

### Common Issues

#### 1. Build Failures

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for TypeScript errors
npm run type-check

# Check for linting errors
npm run lint
```

#### 2. Environment Variables

```bash
# Verify environment variables are loaded
npm run dev

# Check if variables are accessible
console.log(import.meta.env.VITE_API_BASE_URL);
```

#### 3. Routing Issues

```nginx
# Ensure proper SPA routing configuration
location / {
    try_files $uri $uri/ /index.html;
}
```

#### 4. Performance Issues

```bash
# Analyze bundle size
npm run build:analyze

# Check for large dependencies
npm ls --depth=0
```

### Debug Commands

```bash
# Development debugging
npm run dev -- --debug

# Build debugging
npm run build -- --debug

# Preview with debugging
npm run preview -- --debug
```

## 📋 Deployment Checklist

### Pre-deployment

- [ ] All tests passing
- [ ] TypeScript compilation successful
- [ ] Linting passes
- [ ] Environment variables configured
- [ ] API endpoints accessible
- [ ] Build size optimized
- [ ] Security headers configured

### Post-deployment

- [ ] Application loads correctly
- [ ] All routes working
- [ ] API integration functional
- [ ] Error tracking configured
- [ ] Analytics tracking working
- [ ] Performance metrics acceptable
- [ ] Security headers present

### Monitoring

- [ ] Error tracking active
- [ ] Performance monitoring configured
- [ ] Uptime monitoring enabled
- [ ] Log aggregation set up
- [ ] Alerting configured

---

This deployment guide provides comprehensive instructions for deploying the Web 7B Frontend application to various platforms with proper optimization, security, and monitoring configurations. 