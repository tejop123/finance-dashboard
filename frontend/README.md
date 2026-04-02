# Finance Dashboard UI

Clean, responsive finance dashboard built with React and Vite. It uses mock data only and focuses on UI, state management, and interactions.

## Features

- Dashboard overview with total balance, income, and expenses
- Balance trend visualization (time-based)
- Spending breakdown by category
- Transactions list with search, filtering, and sorting
- Role-based UI (Viewer vs Admin)
- Admin can add, edit, and delete transactions
- Insights panel with monthly comparisons and savings rate
- Dark mode toggle
- Local storage persistence

## Demo Checklist

- Switch roles (Viewer/Admin) from the header
- Add a transaction (Admin only)
- Search, filter, and sort transactions
- Toggle dark mode
- Export CSV or download a monthly report

## Requirements

- Node.js 18+ (recommended)
- npm 9+ (comes with Node)

## Setup

1. Install dependencies

	npm install

2. Start the dev server

	npm run dev

3. Build for production

	npm run build

4. Preview the production build

	npm run preview

## Project Structure

- src/App.jsx: main dashboard UI and state
- src/App.css: component styling
- src/index.css: global styles and theming

## Configuration

- Data is stored in local storage under financeDashboard.transactions
- Theme preference stored as financeDashboard.theme

## Usage Notes

- Admin role can add, edit, and delete transactions
- Viewer role can only view data and insights
- Empty state views appear when filters return no items

## Available Scripts

- npm run dev: start the dev server
- npm run build: create a production build
- npm run preview: preview the production build

## Customization

- Update mock transactions in src/App.jsx
- Adjust colors and spacing in src/index.css and src/App.css
- Replace the greeting name in the header

## Accessibility & UX

- Buttons and inputs support focus states
- Responsive layouts for tablet and mobile
- Table view collapses into stacked rows on small screens

## Deployment (Vercel)

This project is ready for Vercel with no extra configuration.

Option A: Vercel CLI

1. Install CLI

	npm i -g vercel

2. Login

	vercel login

3. Deploy from the frontend folder

	vercel

4. Production deployment

	vercel --prod

Build settings (auto-detected):

- Framework Preset: Vite
- Build Command: npm run build
- Output Directory: dist

Option B: Vercel Dashboard

1. Push the repo to GitHub
2. Import the repo in Vercel
3. Set the project root to frontend
4. Deploy with default Vite settings

## Notes

- All data is mocked and stored in local storage for this demo.
- Role switching is simulated with a dropdown in the header.
- The UI handles empty states when no transactions match filters.

## Troubleshooting

- If the dev server port is in use, Vite will choose the next available port
- If local storage data seems stale, clear site data in the browser
