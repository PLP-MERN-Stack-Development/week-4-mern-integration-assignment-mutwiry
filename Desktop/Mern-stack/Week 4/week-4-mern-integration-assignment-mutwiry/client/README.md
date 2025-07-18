# Blog Client

A React-based frontend for the blog application built with the MERN stack.

## Features

- User authentication (login, register)
- View and create blog posts
- Category filtering
- Search functionality
- Responsive design
- Material-UI components

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Project Structure

- `src/` - Source files
  - `components/` - Reusable components
  - `contexts/` - React contexts
  - `pages/` - Page components
  - `services/` - API services
  - `App.jsx` - Main application component
  - `main.jsx` - Application entry point

## Development

The development server will start at `http://localhost:5173` by default.

## Production

To build the application for production:

```bash
npm run build
```

The build files will be in the `dist` directory. 