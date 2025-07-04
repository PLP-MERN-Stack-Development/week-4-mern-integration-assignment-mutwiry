import api from './api';

const POSTS_API = '/posts';

export const getAllPosts = (page = 1, limit = 10) => {
  return api.get(POSTS_API, { params: { page, limit } });
};

export const getPostById = (id) => api.get(`${POSTS_API}/${id}`);

export const createPost = (postData) => api.post(POSTS_API, postData);

export const updatePost = (id, postData) => api.put(`${POSTS_API}/${id}`, postData);

export const deletePost = (id) => api.delete(`${POSTS_API}/${id}`);