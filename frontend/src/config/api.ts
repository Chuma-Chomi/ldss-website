// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const apiConfig = {
  baseURL: API_BASE_URL,
  // For local development, use relative paths (will use Vite proxy)
  // For production, use full backend URL from environment variable
  isProduction: import.meta.env.PROD,
};

// Helper function to get the correct API URL
export const getApiUrl = (endpoint: string) => {
  if (apiConfig.isProduction && apiConfig.baseURL) {
    return `${apiConfig.baseURL}${endpoint}`;
  }
  // For local development, use relative paths
  return endpoint;
};
