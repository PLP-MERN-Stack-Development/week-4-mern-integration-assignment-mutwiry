import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { posts } from '../services/api';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];

const PostForm = ({ isEdit = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    categories: [],
    featuredImage: null,
  });
  
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [fileError, setFileError] = useState('');

  // Fetch post data if in edit mode
  useEffect(() => {
    if (isEdit && id) {
      const fetchPost = async () => {
        try {
          const response = await posts.get(id);
          const post = response.data;
          setFormData({
            title: post.title,
            content: post.content,
            categories: post.categories,
            featuredImage: post.featuredImage,
          });
          if (post.featuredImage) {
            setImagePreview(post.featuredImage);
          }
        } catch (error) {
          console.error('Error fetching post:', error);
          toast.error('Failed to load post data');
        }
      };
      fetchPost();
    }
  }, [id, isEdit]);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    // Reset previous errors
    setFileError('');
    
    // Check if file exists
    if (!file) {
      setFormData(prev => ({ ...prev, featuredImage: null }));
      setImagePreview('');
      return;
    }
    
    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setFileError('Invalid file type. Please upload an image (JPEG, PNG, GIF, or WebP).');
      return;
    }
    
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setFileError('File is too large. Maximum size is 5MB.');
      return;
    }
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setFormData(prev => ({ ...prev, featuredImage: file }));
    };
    reader.readAsDataURL(file);
  };

  // Handle input changes for text fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle category selection
  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      categories: checked
        ? [...prev.categories, value]
        : prev.categories.filter(cat => cat !== value)
    }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }
    
    if (formData.categories.length === 0) {
      newErrors.categories = 'Select at least one category';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('categories', JSON.stringify(formData.categories));
      
      // Only append the file if it's a new file (not a string URL)
      if (formData.featuredImage && typeof formData.featuredImage !== 'string') {
        formDataToSend.append('featuredImage', formData.featuredImage);
      }
      
      if (isEdit) {
        await posts.update(id, formDataToSend);
        toast.success('Post updated successfully');
      } else {
        await posts.create(formDataToSend);
        toast.success('Post created successfully');
      }
      
      navigate('/');
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error(error.response?.data?.message || 'Failed to save post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">
        {isEdit ? 'Edit Post' : 'Create New Post'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter post title"
            disabled={loading}
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
        </div>
        
        {/* Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Content <span className="text-red-500">*</span>
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={8}
            className={`w-full px-3 py-2 border rounded-md ${errors.content ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Write your post content here..."
            disabled={loading}
          />
          {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
        </div>
        
        {/* Featured Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Featured Image
          </label>
          <div className="mt-1 flex items-center">
            <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                   disabled={loading}>
              Choose File
              <input
                type="file"
                name="featuredImage"
                accept="image/*"
                onChange={handleFileChange}
                className="sr-only"
                disabled={loading}
              />
            </label>
            <span className="ml-2 text-sm text-gray-500">
              {formData.featuredImage ? 
                (typeof formData.featuredImage === 'string' ? 'Current image' : formData.featuredImage.name) : 
                'No file chosen'}
            </span>
          </div>
          
          {/* File error message */}
          {fileError && <p className="mt-1 text-sm text-red-600">{fileError}</p>}
          
          {/* Image Preview */}
          {(imagePreview || formData.featuredImage) && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-1">Preview:</p>
              <div className="relative w-full max-w-xs">
                <img 
                  src={imagePreview || formData.featuredImage} 
                  alt="Preview" 
                  className="h-48 w-auto object-contain rounded-md border border-gray-200"
                />
                {isEdit && formData.featuredImage && (
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, featuredImage: null }));
                      setImagePreview('');
                      setFileError('');
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none"
                    disabled={loading}
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Categories */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categories <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category._id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`category-${category._id}`}
                  value={category._id}
                  checked={formData.categories.includes(category._id)}
                  onChange={handleCategoryChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  disabled={loading}
                />
                <label
                  htmlFor={`category-${category._id}`}
                  className="ml-2 text-sm text-gray-700"
                >
                  {category.name}
                </label>
              </div>
            ))}
          </div>
          {errors.categories && (
            <p className="mt-1 text-sm text-red-600">{errors.categories}</p>
          )}
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isEdit ? 'Updating...' : 'Creating...'}
              </span>
            ) : isEdit ? (
              'Update Post'
            ) : (
              'Create Post'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;