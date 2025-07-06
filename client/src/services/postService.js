import api from './api';

const POSTS_API = '/posts';

/**
 * Get all posts with pagination and search
 * @param {number} page - Page number (1-based)
 * @param {string} keyword - Search keyword
 * @param {number} limit - Number of items per page
 * @returns {Promise<Object>} Object containing posts and pagination info
 */
export const getAllPosts = async (page = 1, keyword = '', limit = 10) => {
  try {
    console.log(`[postService] Fetching posts - page: ${page}, limit: ${limit}, keyword: "${keyword}"`);
    
    // Log the full request details
    console.log('[postService] Making request to:', POSTS_API);
    console.log('[postService] Request params:', { page, limit, keyword: keyword || undefined });
    
    // Make the API request with cache-busting timestamp
    const timestamp = new Date().getTime();
    const response = await api.get(POSTS_API, { 
      params: { 
        page, 
        limit,
        keyword: keyword || undefined, // Only include keyword if it's not empty
        _t: timestamp // Cache buster
      }
    });
    
    // Log response summary
    console.log('[postService] Received response:', {
      status: response.status,
      statusText: response.statusText,
      data: response.data ? {
        success: response.data.success,
        count: response.data.data?.length || 0,
        hasData: !!response.data.data,
        hasPagination: !!response.data.pagination
      } : 'no data in response'
    });

    // If no data in response, return empty array with default pagination
    if (!response.data) {
      console.warn('[postService] No data in response');
      return {
        ...response,
        data: {
          success: true,
          data: [],
          pagination: {
            currentPage: page,
            totalPages: 0,
            totalItems: 0
          }
        }
      };
    }
    
    // Helper function to process posts array
    const processPosts = (posts) => {
      if (!Array.isArray(posts)) return [];
      return posts.map(post => ({
        ...post,
        _id: post._id ? String(post._id) : null
      }));
    };
    
    // Handle different response structures
    // Case 1: Standard success response with data array and pagination
    if (response.data.success === true) {
      // Check if data is nested under data property or directly in response
      const responseData = response.data.data || response.data;
      const isDataArray = Array.isArray(responseData);
      
      let processedPosts = [];
      
      if (isDataArray) {
        processedPosts = processPosts(responseData);
      } else if (responseData && Array.isArray(responseData.posts)) {
        // Handle case where posts are in a posts property
        processedPosts = processPosts(responseData.posts);
      } else if (responseData && responseData.data && Array.isArray(responseData.data)) {
        // Handle nested data structure
        processedPosts = processPosts(responseData.data);
      }
      
      console.log(`[postService] Successfully retrieved ${processedPosts.length} posts`);
      
      // Get pagination from response or create default
      const pagination = response.data.pagination || 
                        (response.data.data && response.data.data.pagination) || 
                        {
                          currentPage: page,
                          totalPages: 1,
                          totalItems: processedPosts.length,
                          perPage: limit
                        };
      
      return {
        ...response,
        data: {
          success: true,
          data: processedPosts,
          pagination: pagination
        }
      };
    }
    
    // Case 2: Direct array response
    if (Array.isArray(response.data)) {
      console.log(`[postService] Direct array response with ${response.data.length} posts`);
      const processedPosts = processPosts(response.data);
      
      return {
        ...response,
        data: {
          success: true,
          data: processedPosts,
          pagination: {
            currentPage: 1,
            totalPages: 1,
            totalItems: processedPosts.length
          }
        }
      };
    }
    
    // Case 3: Success but no data or invalid format
    if (response.data.success === false) {
      console.error('[postService] API returned error:', response.data.message);
      throw new Error(response.data.message || 'Failed to fetch posts');
    }
    
    // If we get here, the response format is unexpected
    console.error('[postService] Unexpected response format:', response);
    throw new Error('Unexpected response format from server');
    
  } catch (error) {
    console.error('[postService] Error in getAllPosts:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    // Enhance error message with server response if available
    if (error.response?.data?.message) {
      error.message = error.response.data.message;
    }
    
    throw error;
  }
};

export const getPostById = async (id) => {
  try {
    console.log(`[postService] Fetching post with ID: ${id}`);
    
    // Validate ID format
    if (!id) {
      throw new Error('No post ID provided');
    }
    
    const response = await api.get(`${POSTS_API}/${id}`);
    console.log('[postService] Raw API response:', response);
    
    // Handle different response structures
    if (response.data) {
      // Case 1: { success: true, data: post }
      if (response.data.success === true && response.data.data) {
        console.log('[postService] Successfully retrieved post:', response.data.data._id);
        return { data: response.data.data };
      }
      
      // Case 2: Direct post object
      if (response.data._id) {
        console.log('[postService] Direct post object received:', response.data._id);
        return { data: response.data };
      }
      
      // Case 3: Success but no data
      if (response.data.success === false) {
        console.error('[postService] API returned error:', response.data.message);
        throw new Error(response.data.message || 'Failed to fetch post');
      }
    }
    
    // If we get here, the response format is unexpected
    console.error('[postService] Unexpected response format:', response);
    throw new Error('Unexpected response format from server');
    
  } catch (error) {
    console.error('[postService] Error in getPostById:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    // Enhance error message with server response if available
    if (error.response?.data?.message) {
      error.message = error.response.data.message;
    }
    
    throw error;
  }
};

export const createPost = (postData) => api.post(POSTS_API, postData);

export const updatePost = (id, postData) => api.put(`${POSTS_API}/${id}`, postData);

export const deletePost = (id) => api.delete(`${POSTS_API}/${id}`);