# Blog API

A RESTful API for a blog application built with the MERN stack.

## Features

- User authentication (register, login)
- CRUD operations for blog posts
- Category management
- Comment system
- Image upload support
- Pagination
- Search and filtering

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/blog_db
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Posts

- `GET /api/posts` - Get all posts (with pagination)
- `GET /api/posts/:id` - Get a single post
- `POST /api/posts` - Create a new post
- `PUT /api/posts/:id` - Update a post
- `DELETE /api/posts/:id` - Delete a post

### Categories

- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get a single category
- `POST /api/categories` - Create a new category (admin only)
- `PUT /api/categories/:id` - Update a category (admin only)
- `DELETE /api/categories/:id` - Delete a category (admin only)

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer your_jwt_token
```

## Error Handling

The API uses standard HTTP status codes:

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

## Development

To start the development server with hot reloading:

```bash
npm run dev
```

## Production

To start the production server:

```bash
npm start
``` 