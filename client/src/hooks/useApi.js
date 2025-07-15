import { useState, useCallback } from 'react';

/**
 * A custom hook to handle API calls with loading and error states
 * @param {Function} apiFunc - The API function to call
 * @returns {Object} An object containing the request function and state variables
 */
export const useApi = (apiFunc) => {
  // State for the data itself
  const [data, setData] = useState(null);
  // State for the loading status
  const [loading, setLoading] = useState(false);
  // State for any errors
  const [error, setError] = useState(null);

  // We wrap the request logic in useCallback to make it stable
  const request = useCallback(async (...args) => {
    setLoading(true); // This triggers the "loading" re-render
    setError(null);
    try {
      const response = await apiFunc(...args);
      console.log('useApi: Received response:', response); // Your log to confirm
      setData(response.data); // **THIS IS THE KEY: This triggers the final re-render with data**
    } catch (err) {
      console.error('useApi: Request failed', err);
      setError(err);
      setData(null);
    } finally {
      setLoading(false); // This ensures loading is always turned off
    }
  }, [apiFunc]); // Dependency array ensures the function is stable

  // Return everything the component needs
  return { data, loading, error, request };
  
  return {
    data,
    error,
    loading,
    execute
  };
};

export default useApi;
