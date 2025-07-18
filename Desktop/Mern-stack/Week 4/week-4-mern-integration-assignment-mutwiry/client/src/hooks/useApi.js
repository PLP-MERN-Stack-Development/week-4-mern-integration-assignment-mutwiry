import { useState, useCallback } from 'react';
import axios from 'axios';

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (config) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios(config);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const get = useCallback((url, config = {}) => {
    return request({ ...config, method: 'GET', url });
  }, [request]);

  const post = useCallback((url, data, config = {}) => {
    return request({ ...config, method: 'POST', url, data });
  }, [request]);

  const put = useCallback((url, data, config = {}) => {
    return request({ ...config, method: 'PUT', url, data });
  }, [request]);

  const del = useCallback((url, config = {}) => {
    return request({ ...config, method: 'DELETE', url });
  }, [request]);

  return {
    loading,
    error,
    get,
    post,
    put,
    delete: del
  };
};

export default useApi; 