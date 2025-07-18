[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=19766922&assignment_repo_type=AssignmentRepo)
# 🚀 MERN Stack Blog Application

A full-stack blog application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring user authentication, role-based access control, and a modern, responsive UI.

## 📋 Features

### Core Features
- 🔐 User Authentication (Register/Login)
- 👥 Role-based Access Control (Admin/User)
- 📝 Blog Post Management
  - Create posts (Admin only)
  - View all posts
  - View individual posts
  - Comment on posts
- 🏷️ Category Management
- 💬 Comment System
- 🎨 Modern, Responsive UI with Material-UI

### Advanced Features
- 🔒 Protected Routes
- 👤 User Profile Management
- 🎯 Role-based UI Elements
- 📱 Mobile-responsive Design
- 🎨 Custom Styling with Gradients and Modern UI

## 🛠️ Tech Stack

### Frontend
- React.js with Vite
- React Router for navigation
- Material-UI for components
- Axios for API calls
- Context API for state management

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing

## 📦 Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd week-4-mern-integration-assignment-DennisAmutsa
```

2. Install server dependencies:
```bash
cd server
npm install
```

3. Install client dependencies:
```bash
cd client
npm install
```

4. Set up environment variables:

Create `.env` files in both server and client directories:

Server (.env):
```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

Client (.env):
```
VITE_API_URL=http://localhost:5000
```

## 🚀 Running the Application

1. Start the backend server:
```bash
cd server
npm run dev
```

2. Start the frontend development server:
```bash
cd client
npm run dev
```

The application will be available at `http://localhost:5173`

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/users` - Get all users (Admin only)

### Post Endpoints
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get a specific post
- `POST /api/posts` - Create a new post (Admin only)
- `PUT /api/posts/:id` - Update a post (Admin only)
- `DELETE /api/posts/:id` - Delete a post (Admin only)

### Comment Endpoints
- `POST /api/posts/:id/comments` - Add a comment to a post
- `GET /api/posts/:id/comments` - Get all comments for a post

### Category Endpoints
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create a new category (Admin only)

## 🎨 UI Components

### Pages
1. **Home Page**
   - Displays all blog posts in a card layout
   - Responsive grid system
   - Modern gradient styling

2. **Post Detail Page**
   - Full post content
   - Comments section
   - Comment form for logged-in users

3. **Create Post Page** (Admin only)
   - Form for creating new posts
   - Category selection
   - Rich text editor

4. **About Page**
   - Project information
   - Team details
   - Modern styling with gradients

5. **Contact Page**
   - Contact form
   - Contact information
   - Location details

### Navigation
- Responsive navbar
- Role-based menu items
- Styled with pastel gradients
- Black links for main navigation
- White links for admin features

## 🔒 Security Features
- JWT-based authentication
- Password hashing
- Protected routes
- Role-based access control
- Input validation
- Error handling

## 🐛 Troubleshooting

### Common Issues
1. **MongoDB Connection Error**
   - Check if MongoDB is running
   - Verify connection string in .env

2. **Authentication Issues**
   - Clear browser storage
   - Check JWT token expiration
   - Verify user credentials

3. **API Connection Issues**
   - Check if both servers are running
   - Verify proxy settings in vite.config.js
   - Check API URL in .env

## 📝 License
MIT License

## 👥 Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Project Structure
```
week-4-mern-integration-assignment-DennisAmutsa/
├── client/   # React frontend
├── server/   # Express backend
└── README.md
```

## Prerequisites
- Node.js (v16+ recommended)
- npm (v8+ recommended)
- MongoDB (local or Atlas)

## Setup Instructions

### 1. Clone the Repository
```
git clone <your-repo-url>
cd week-4-mern-integration-assignment-DennisAmutsa
```

### 2. Install Dependencies
#### Backend
```
cd server
npm install
```
#### Frontend
```
cd ../client
npm install
```

### 3. Configure Environment Variables
#### Backend (`server/.env`)
```
MONGO_URI=mongodb://localhost:27017/mernblog
JWT_SECRET=your_jwt_secret
PORT=5000
```
- Adjust `MONGO_URI` if using MongoDB Atlas.

#### Frontend
- No special .env needed for local dev (API is proxied to backend).

### 4. Start the Application
#### Start Backend
```
cd server
npm run dev
```
#### Start Frontend
```
cd ../client
npm run dev
```
- The frontend will run on [http://localhost:5173](http://localhost:5173) (or next available port).
- The backend runs on [http://localhost:5000](http://localhost:5000).

## Usage

### Registration & Login
- Register as a user or admin (choose role on register page).
- Login to access your profile and (if admin) admin features.

### Admin Features
- Only admins can:
  - Create, edit, and delete posts
  - Manage categories and users
  - Access the admin dashboard
- Regular users can only view posts and add comments.

### Navigation
- Home, About, and Contact links are always visible.
- "Create Post" and admin links are only visible to admins.

### Styling
- The app uses a modern, responsive design with gradients and Material-UI components.

## Customization
- Update theme colors in `client/src/App.jsx`.
- Edit About and Contact page content in `client/src/pages/About.jsx` and `client/src/pages/Contact.jsx`.

## Troubleshooting
- If you see 500 errors, ensure MongoDB is running and your `.env` is correct.
- If ports are in use, the frontend will try the next available port (5173+).

## License
This project is for educational purposes.

## Files Included

- `Week4-Assignment.md`: Detailed assignment instructions
- Starter code for both client and server:
  - Basic project structure
  - Configuration files
  - Sample models and components

## Requirements

- Node.js (v18 or higher)
- MongoDB (local installation or Atlas account)
- npm or yarn
- Git

## Submission

Your work will be automatically submitted when you push to your GitHub Classroom repository. Make sure to:

1. Complete both the client and server portions of the application
2. Implement all required API endpoints
3. Create the necessary React components and hooks
4. Document your API and setup process in the README.md
5. Include screenshots of your working application

## Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)

## 📸 Screenshots

### Home Page
![Home Page](screenshots/home.png)
*Modern card layout with gradient styling and responsive design*

### Post Detail
![Post Detail](screenshots/post-detail.png)
*Full post view with comments section and user interactions*

### Create Post (Admin)
![Create Post](screenshots/create-post.png)
*Admin-only post creation interface with category selection*

### About Page
![About Page](screenshots/about.png)
*Project information with modern gradient styling*

### Contact Page
![Contact Page](screenshots/contact.png)
*Contact form with gradient background and modern UI elements*

## 📚 Detailed API Documentation

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "user123",
  "email": "user@example.com",
  "password": "password123",
  "role": "user"
}
```
Response:
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "user_id",
    "username": "user123",
    "email": "user@example.com",
    "role": "user"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```
Response:
```json
{
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "username": "user123",
    "role": "user"
  }
}
```

### Posts

#### Get All Posts (with Pagination)
```http
GET /api/posts?page=1&limit=10
```
Response:
```json
{
  "posts": [...],
  "currentPage": 1,
  "totalPages": 5,
  "totalPosts": 50
}
```

#### Create Post (Admin only)
```http
POST /api/posts
Authorization: Bearer jwt_token
Content-Type: application/json

{
  "title": "Post Title",
  "content": "Post content...",
  "category": "category_id"
}
```

## 🔍 Advanced Features Implementation

### Pagination
- Implemented using MongoDB's `skip()` and `limit()`
- Frontend pagination controls with Material-UI
- Configurable page size

### Search and Filtering
- Full-text search on post titles and content
- Category-based filtering
- Date range filtering
- Combined search and filter functionality

### Image Upload
- Cloudinary integration for image storage
- Image optimization and resizing
- Support for multiple image formats

### Real-time Updates
- WebSocket integration for real-time comments
- Live post updates for admin users
- Notification system for new comments 