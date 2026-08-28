# CrossFit Championship Manager

## Running the app

This is a client-side React application powered by Vite.

- Install dependencies with `npm ci`
- Start the development server with `npm run dev`
- Build for production with `npm run build`

The Replit workflow runs the Vite development server on port 5000 and allows proxied preview hosts.

## Project structure

- `src/App.jsx` — application shell and view routing
- `src/components/` — dashboard, leaderboard, timer, admin, athlete, WOD, score, and heat views
- `src/context/TournamentContext.jsx` — in-memory tournament state
- `src/utils/` — sample data, scoring, and audio helpers
- `public/` — PWA manifest, icon, and service worker

No external services or environment variables are required for the current frontend-only version.