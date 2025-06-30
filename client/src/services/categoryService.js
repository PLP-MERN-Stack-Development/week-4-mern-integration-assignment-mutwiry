import api from './api';

const categoryService = {
  /**
   * Fetches all categories from the server.
   * @returns {Promise<Array>}
   */
  getAll: async () => {
    try {
      const response = await api.get('/categories');
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      // Depending on the app's error handling strategy, you might want to throw the error
      // or return a default value like an empty array.
      throw error;
    }
  },

  // You can add more category-related functions here in the future, e.g.:
  /*
  getById: async (id) => {
    const response = await api.get(`/categories/${id}`);
    return response.data.data;
  },

  create: async (categoryData) => {
    const response = await api.post('/categories', categoryData);
    return response.data.data;
  },
  */
};

export default categoryService;
