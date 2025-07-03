import { useState, useEffect, useCallback } from 'react';

const useApi = (apiFunc, immediate = false) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFunc(...args);
      setData(result.data);
      return result;
    } catch (err) {
      setError(err.response?.data?.message || 'An unexpected error occurred');
      throw err; // Re-throw for component-level handling if needed
    } finally {
      setLoading(false);
    }
  }, [apiFunc]);

  // Execute immediately if immediate is true
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { data, error, loading, execute };
};

export default useApi;