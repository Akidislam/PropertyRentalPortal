// Central API configuration
// All API calls go through this base URL.
// In production (Vercel), REACT_APP_API_URL is set in the Vercel dashboard.
// In development, it falls back to http://localhost:5000

export const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
