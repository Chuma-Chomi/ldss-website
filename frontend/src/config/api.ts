// API Configuration
// IMPORTANT: In production (Netlify), ALWAYS use relative paths
// The Netlify proxy in netlify.toml handles routing /api/* to the backend

export const apiConfig = {
  isProduction: import.meta.env.PROD,
};

// Helper function to get the correct API URL
export const getApiUrl = (endpoint: string) => {
  // Debug logging
  console.log('=== API Configuration ===');
  console.log('Environment:', import.meta.env.PROD ? 'PRODUCTION' : 'DEVELOPMENT');
  console.log('VITE_API_URL (ignored in production):', import.meta.env.VITE_API_URL);
  console.log('Requested endpoint:', endpoint);
  console.log('Token exists:', sessionStorage.getItem('token') ? 'YES' : 'NO');

  // ALWAYS use relative paths - let the proxy handle it
  // Netlify proxy (netlify.toml) routes /api/* -> https://ldss-backend-5tl3.onrender.com/api/*
  const finalUrl = endpoint;
  console.log('Final URL (relative for proxy):', finalUrl);
  console.log('=======================');

  return finalUrl;
};
