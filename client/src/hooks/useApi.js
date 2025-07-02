import { useState, useEffect, useCallback } from 'react';

const useApi = (apiFunc) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const request = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFunc(...args);
      setData(result.data.data); // Assuming your API returns { success, data }
      return result.data;
    } catch (err) {
      setError(err.response?.data?.message || 'An unexpected error occurred');
      throw err; // Re-throw for component-level handling if needed
    } finally {
      setLoading(false);
    }
  }, [apiFunc]);

  return { data, error, loading, request };
};

export default useApi;