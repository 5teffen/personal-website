# Personal Website

Personal website built with React and Vite, deployed via GitHub Pages.

## Structure

- `my-website/` - React application (Vite + TypeScript)
- `CNAME` - Custom domain configuration for GitHub Pages
- `.github/workflows/deploy.yml` - GitHub Actions workflow for automatic deployment

## Development

```bash
cd my-website
npm install
npm run dev
```

## Deployment

The site is automatically deployed to GitHub Pages via GitHub Actions when changes are pushed to the `main` branch.

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## Custom Domain

The site uses a custom domain configured via the `CNAME` file. The deployment workflow automatically copies this file to the build output.
