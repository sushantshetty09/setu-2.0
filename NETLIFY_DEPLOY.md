# Deploying SETU on Netlify 🚀

> **Live Production URL:** [https://setu-gov.netlify.app](https://setu-gov.netlify.app)  
> **Netlify Site Admin Dashboard:** [https://app.netlify.com/projects/setu-gov](https://app.netlify.com/projects/setu-gov)

---

## Quick Steps for Netlify Deployment

### Method 1: Deploy via Git (GitHub / GitLab / Bitbucket) [Recommended]

1. **Push your code to GitHub / Git repository**.
2. Go to [app.netlify.com](https://app.netlify.com) and click **"Add new site"** > **"Import an existing project"**.
3. Select your repository.
4. Netlify will automatically detect the settings from [`netlify.toml`](./netlify.toml):
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/dist` (or `dist` if base directory is set to `frontend`)
5. **Environment Variables**:
   Under **Site configuration** > **Environment variables**, add:
   - `VITE_API_BASE_URL` (URL of your deployed FastAPI backend, e.g. `https://your-setu-backend.onrender.com/api` or leave `/api` if using Netlify proxy redirect)
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_FIREBASE_MEASUREMENT_ID`
6. Click **Deploy Site**.

---

### Method 2: Manual Drag & Drop Deploy (Netlify Drop)

1. In your local terminal, build the production bundle:
   ```bash
   cd frontend
   npm run build
   ```
2. Navigate to [app.netlify.com/drop](https://app.netlify.com/drop).
3. Drag and drop the `frontend/dist` folder into the upload box.

---

## Important Configurations Included

- **SPA Routing Fix**: Direct page links (such as `/schemes`, `/chat`, `/find`, etc.) will properly load without 404 errors via `_redirects` and `netlify.toml`.
- **Security Headers**: Standard security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`) and asset caching are pre-configured.
- **Dynamic API Base**: The frontend dynamically reads `VITE_API_BASE_URL` to route requests to your deployed backend.
