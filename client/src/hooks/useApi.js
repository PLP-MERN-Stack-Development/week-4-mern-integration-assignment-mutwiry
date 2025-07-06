import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * A custom hook to handle API calls with loading and error states
 * @param {Function} apiFunction - The API function to call
 * @returns {Object} An object containing the execute function and state variables
 */
const useApi = (apiFunction) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const isMounted = useRef(true);
  
  // Create a stable reference to the API function
  const apiFuncRef = useRef(apiFunction);
  apiFuncRef.current = apiFunction;
  
  // Clean up function to set isMounted to false when component unmounts
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  /**
   * Execute the API function with the provided arguments
   * @param  {...any} args - Arguments to pass to the API function
   * @returns {Promise<any>} The response from the API
   */
  const execute = useCallback(async (...args) => {
    if (!isMounted.current) {
      console.log('Component unmounted, skipping API call');
      return null;
    }
    
    console.log('useApi: Starting API request with args:', args);
    setLoading(true);
    setError(null);
    
    try {
      // Call the API function with provided arguments
      console.log('useApi: Calling API function');
      const response = await apiFuncRef.current(...args);
      
      // Log the response for debugging
      console.log('useApi: API response:', {
        status: response?.status,
        statusText: response?.statusText,
        data: response?.data ? {
          hasData: true,
          isArray: Array.isArray(response.data),
          keys: Object.keys(response.data || {})
        } : 'No data'
      });
      
      // Only update state if component is still mounted
      if (isMounted.current) {
        // Use response.data if it exists, otherwise use the whole response
        const responseData = response?.data !== undefined ? response.data : response;
        
        console.log('useApi: Setting response data:', {
          hasData: !!responseData,
          dataType: typeof responseData,
          isArray: Array.isArray(responseData),
          dataKeys: responseData ? Object.keys(responseData) : 'no keys'
        });
        
        setData(responseData);
        setLoading(false);
        return response;
      }
      
      return null;
    } catch (err) {
      // Handle errors if component is still mounted
      if (isMounted.current) {
        const errorMessage = err.response?.data?.message || 
                           err.message || 
                           'An unexpected error occurred';
        
        console.error('useApi: Error in API call:', {
          message: err.message,
          response: err.response,
          stack: err.stack
        });
        
        setError(errorMessage);
        setLoading(false);
      }
      
      // Re-throw the error so it can be caught by the caller if needed
      throw err;
    }
  }, []);
  
  return {
    data,
    error,
    loading,
    execute
  };
};

export default useApi;
