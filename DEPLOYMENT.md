# GitHub Pages Deployment Guide

This guide explains how to deploy the React app from the `my-website` folder to GitHub Pages.

## Setup Steps

### 1. Enable GitHub Pages in Repository Settings

1. Go to your GitHub repository
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions** (not "Deploy from a branch")
4. Save the settings

### 2. Push the Code

The GitHub Actions workflow (`.github/workflows/deploy.yml`) will automatically:
- Build your React app when you push to the `main` branch
- Deploy it to GitHub Pages
- Copy the CNAME file to preserve your custom domain

### 3. First Deployment

1. Commit and push all changes:
   ```bash
   git add .
   git commit -m "Setup GitHub Pages deployment"
   git push origin main
   ```

2. Go to the **Actions** tab in your GitHub repository
3. You should see the workflow running
4. Once complete, your site will be live at your custom domain (www.steffenholter.com)

## Manual Deployment (Alternative)

If you prefer to deploy manually:

```bash
cd my-website
npm run build
# The dist folder will contain your built site
# Copy contents to a gh-pages branch or use gh-pages npm package
```

## Notes

- The workflow builds from the `my-website` folder
- The CNAME file in the root is automatically copied to preserve your custom domain
- The site will automatically rebuild on every push to the `main` branch
- Make sure your custom domain DNS is configured correctly in your domain provider

