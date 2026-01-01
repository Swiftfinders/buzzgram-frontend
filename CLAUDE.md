# BuzzGram Frontend - Claude Code Reference

## Project Overview
BuzzGram is a business directory platform for Canadian cities. Users can browse businesses by city and category, favorite businesses, and business owners can manage their listings. The frontend is built with React, TypeScript, and Tailwind CSS.

## Tech Stack
- **Framework**: React 18 with Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS with dark mode support
- **Routing**: React Router v6
- **State Management**: React Context API + React Query (TanStack Query)
- **HTTP Client**: Axios
- **Icons**: Heroicons (SVG)
- **Deployment**: Vercel (auto-deploy from GitHub)

## Project Structure
```
frontend/
├── src/
│   ├── main.tsx              # App entry point
│   ├── App.tsx               # Main router and providers
│   ├── components/
│   │   ├── Header.tsx        # Navigation header with auth
│   │   ├── CitySelector.tsx  # City selection dropdown
│   │   ├── SearchBar.tsx     # Business search
│   │   ├── CategoryFilter.tsx # Category filtering
│   │   ├── BusinessCard.tsx  # Business listing card
│   │   ├── ProtectedRoute.tsx # Route protection wrapper
│   │   ├── UserDropdown.tsx  # User menu dropdown
│   │   └── LoadingSpinner.tsx # Loading state
│   ├── pages/
│   │   ├── HomePage.tsx      # Landing page with businesses
│   │   ├── CityPage.tsx      # City-specific businesses
│   │   ├── BusinessDetail.tsx # Business detail page
│   │   ├── LoginPage.tsx     # User login
│   │   ├── RegisterPage.tsx  # User registration
│   │   ├── AdminDashboard.tsx # Admin control panel
│   │   ├── BusinessOwnerDashboard.tsx # Business owner dashboard (legacy)
│   │   ├── UserDashboard.tsx # User dashboard
│   │   ├── SettingsPage.tsx  # User settings
│   │   ├── FavoritesPage.tsx # User favorites
│   │   └── ProfilePage.tsx   # User profile
│   ├── contexts/
│   │   ├── AuthContext.tsx   # Authentication state
│   │   └── ThemeContext.tsx  # Dark mode state
│   ├── hooks/
│   │   └── useAuth.ts        # Auth context hook
│   ├── lib/
│   │   ├── api.ts            # API client (axios)
│   │   └── queryClient.ts    # React Query config
│   ├── types/
│   │   └── index.ts          # TypeScript types
│   └── index.css             # Global styles + Tailwind
├── public/
├── index.html
├── tailwind.config.js        # Tailwind configuration
├── vite.config.ts            # Vite build config
└── package.json
```

## Key Features

### Authentication & Authorization
- JWT-based authentication (stored in localStorage)
- Auto-refresh on page load via `/api/auth/me`
- Protected routes for authenticated users
- Role-based access (admin, business_owner, user)
- Persistent login state

### User Roles
- **admin**: Access to admin dashboard, can manage all content
- **business_owner**: Access to business owner dashboard, can manage own businesses (legacy)
- **user**: Can favorite businesses, view content

### Dark Mode
- System preference detection
- Manual toggle in header
- Persisted in localStorage
- Tailwind dark: classes throughout

### City Selection
- Sticky city selector in header
- Persisted in localStorage
- URL-based city routing (`/city/:cityId`)
- Mobile-friendly touch events

### Business Features
- Search businesses by name
- Filter by city, category, subcategory
- View business details (contact, social media, description)
- Favorite/unfavorite businesses
- Instagram and website links
- Business owner claim functionality (legacy)

### Favorites System
- Add/remove favorites with heart icon
- Favorites page showing all saved businesses
- Real-time favorite status updates
- Requires authentication

## Routing Structure

### Public Routes
- `/` - Home page (all businesses)
- `/city/:cityId` - City-specific businesses
- `/business/:id` - Business detail page
- `/login` - Login page
- `/register` - Registration page

### Protected Routes (Authenticated)
- `/dashboard` - User dashboard
- `/settings` - User settings
- `/favorites` - User favorites
- `/profile` - User profile

### Admin Routes (Admin Only)
- `/admin` - Admin dashboard

### Business Owner Routes (Business Owner or Admin)
- `/business-dashboard` - Business owner dashboard (legacy)

## API Integration

### API Client (`src/lib/api.ts`)
Base URL configured via environment variable:
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
```

### Authentication
```typescript
// Stored in localStorage
localStorage.setItem('token', token);

// Added to all requests
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
```

### API Endpoints Used
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `GET /api/cities` - List cities
- `GET /api/categories` - List categories
- `GET /api/subcategories` - List subcategories
- `GET /api/businesses` - Search businesses
- `GET /api/businesses/:id` - Get business details
- `GET /api/favorites` - Get user favorites
- `POST /api/favorites` - Add favorite
- `DELETE /api/favorites/:businessId` - Remove favorite
- `GET /api/favorites/check/:businessId` - Check if favorited

## State Management

### React Context
- **AuthContext**: User authentication state, login/logout/register functions
- **ThemeContext**: Dark mode state, toggle function

### React Query (TanStack Query)
- Query caching for API requests
- Auto-refetching on window focus
- Optimistic updates for favorites
- Loading and error states

### localStorage
- `token` - JWT authentication token
- `theme` - Dark mode preference
- `selectedCityId` - Last selected city

## Styling

### Tailwind CSS
- Utility-first approach
- Custom dark mode colors in `tailwind.config.js`:
  - `dark-bg`: #0f172a
  - `dark-card`: #1e293b
  - `dark-border`: #334155
- Responsive breakpoints: sm, md, lg, xl, 2xl

### Color Scheme
- Primary: Orange (orange-500, orange-600)
- Secondary: Gray scale
- Dark mode: Slate scale
- Success: Green
- Error: Red

### Common Patterns
```typescript
// Card
className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border"

// Text
className="text-gray-900 dark:text-white"

// Button
className="bg-orange-600 hover:bg-orange-700 text-white"
```

## Component Patterns

### Protected Routes
```typescript
<Route
  path="/admin"
  element={
    <ProtectedRoute requireAdmin>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
```

### React Query Hooks
```typescript
const { data: businesses, isLoading } = useQuery({
  queryKey: ['businesses', filters],
  queryFn: () => getBusinesses(filters),
});
```

### Auth Hook
```typescript
const { user, isAdmin, isBusinessOwner, login, logout } = useAuth();
```

## Environment Variables

Create `.env.local`:
```
VITE_API_URL=https://backend-production-f30d.up.railway.app/api
```

For development:
```
VITE_API_URL=http://localhost:3001/api
```

## Development

### Install Dependencies
```bash
npm install
```

### Run Dev Server
```bash
npm run dev
# Runs on http://localhost:5173
```

### Build for Production
```bash
npm run build
# Output in dist/
```

### Preview Production Build
```bash
npm run preview
```

### Type Checking
```bash
npm run type-check
# or
tsc --noEmit
```

## Deployment (Vercel)

### Auto-Deploy
- Connected to GitHub repository
- Auto-deploys on push to `main` branch
- Production URL: https://buzzgram-frontend.vercel.app

### Manual Deploy
```bash
# If Vercel CLI is installed
vercel --prod
```

### Environment Variables (Vercel Dashboard)
- `VITE_API_URL`: Backend API URL

## Important Code Conventions

### File Naming
- Components: PascalCase (e.g., `BusinessCard.tsx`)
- Hooks: camelCase with 'use' prefix (e.g., `useAuth.ts`)
- Pages: PascalCase (e.g., `HomePage.tsx`)
- Utilities: camelCase (e.g., `api.ts`)

### Component Structure
```typescript
export default function ComponentName() {
  // Hooks first
  const { user } = useAuth();
  const { data, isLoading } = useQuery(...);

  // Event handlers
  const handleClick = () => { ... };

  // Early returns
  if (isLoading) return <LoadingSpinner />;

  // Main render
  return ( ... );
}
```

### TypeScript Types
Import from `src/types/index.ts`:
```typescript
import type { Business, City, Category } from '../types';
```

## Common Issues & Solutions

### API Connection Errors
- Check `VITE_API_URL` environment variable
- Verify backend is running and healthy
- Check browser console for CORS errors
- Backend must be at: https://backend-production-f30d.up.railway.app

### Authentication Issues
- Token stored in localStorage as 'token'
- Token auto-refreshed on app load via `/api/auth/me`
- Clear localStorage and re-login if issues persist
- Check Network tab for 401 responses

### Dark Mode Not Working
- Check if `theme` in localStorage is 'dark' or 'light'
- Verify Tailwind dark mode is set to 'class' in config
- Check if `dark` class is on `<html>` element

### City Selection Issues
- City stored in localStorage as 'selectedCityId'
- URL params override localStorage
- Clear localStorage to reset

## Legacy Features (Still Present)

### Business Owner Dashboard
The `BusinessOwnerDashboard.tsx` page exists from the original implementation but is a simple placeholder. It shows:
- Business count (hardcoded as 0)
- Quick action links (placeholder)
- User greeting

This is NOT part of the recently reverted Business Owner System. It's original legacy code.

### requireBusinessOwner in ProtectedRoute
The `requireBusinessOwner` prop exists in `ProtectedRoute` component for backwards compatibility. It checks if user role is 'business_owner' or 'admin'.

## Recent Changes (December 2025)

### Reverted Business Owner System
- Removed NEW business owner pages:
  - BusinessOwnerSignup.tsx
  - BusinessOwnerLogin.tsx
  - NewBusinessOwnerDashboard.tsx
  - BusinessOwnerClaim.tsx
  - BusinessOwnerCreate.tsx
  - BusinessOwnerEdit.tsx
  - AdminApprovals.tsx
- Removed BusinessOwnerContext and useBusinessOwner hook
- Reverted App.tsx to remove new business owner routes
- Reverted API client to remove business owner endpoints
- Kept LEGACY BusinessOwnerDashboard (original placeholder)

### Files Modified in Revert
- `src/App.tsx` - Removed new business owner routes
- `src/lib/api.ts` - Removed business owner API functions
- `src/types/index.ts` - Removed business owner specific types
- `src/components/ProtectedRoute.tsx` - Kept legacy requireBusinessOwner
- `src/pages/AdminDashboard.tsx` - Removed approval review link

## Production URLs
- Frontend: https://buzzgram-frontend.vercel.app
- Backend: https://backend-production-f30d.up.railway.app

## Notes for Claude Code
- Always use Read tool before editing files
- Use Edit tool for modifications, Write only for new files
- Never create markdown files unless explicitly requested
- Test dark mode when making UI changes
- Check both mobile and desktop views
- Verify API integration with backend before deploying
- Vercel auto-deploys from GitHub main branch
- Use TodoWrite tool for multi-step tasks
