/**
 * OpenAI API Service - Factory Implementation
 * This file decides whether to use the direct API approach or the proxy approach
 * based on environment variables. The proxy approach is recommended for production.
 */

import * as directService from './openaiServiceDirect';
import * as proxyService from './openaiServiceProxy';

// Determine which implementation to use based on environment variable
const useProxy = process.env.REACT_APP_USE_PROXY === 'true';

// Export the appropriate implementation
export const sendMessage = useProxy ? proxyService.sendMessage : directService.sendMessage;

/**
 * Provides information about which implementation is being used
 * @returns {Object} - Information about the current implementation
 */
export const getServiceInfo = () => {
  return {
    implementation: useProxy ? 'proxy' : 'direct',
    description: useProxy 
      ? 'Using backend proxy (secure, recommended for production)' 
      : 'Using direct API calls (less secure, for development only)',
    apiUrl: useProxy ? process.env.REACT_APP_BACKEND_URL : 'OpenAI API'
  };
};
