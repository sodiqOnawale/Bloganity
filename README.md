# Bloganity - Modern Blog Application

A full-featured blog application built with React, TypeScript, and Material UI.

## Features

### Core Features
- ✅ **User Authentication** - Sign up, sign in, and logout functionality
- ✅ **Blog Post Management** - Create, edit, delete, and publish blog posts
- ✅ **Rich Text Editor** - React Quill integration for content creation
- ✅ **Post Categories** - Organize posts by categories
- ✅ **Tags System** - Add tags to posts for better organization
- ✅ **Image Support** - Featured images for blog posts
- ✅ **Draft System** - Save posts as drafts before publishing

### Social Features
- ✅ **Like/Unlike Posts** - Users can like posts
- ✅ **Comments System** - Add comments to posts with rich text support
- ✅ **Bookmarking** - Save favorite posts for later
- ✅ **Share Functionality** - Share posts via Web Share API or copy link
- ✅ **View Tracking** - Track post views
- ✅ **Reading Time** - Automatic reading time estimation

### User Experience
- ✅ **Dark/Light Theme** - Toggle between themes with Material UI
- ✅ **Responsive Design** - Mobile-first responsive layout
- ✅ **Search & Filter** - Search posts by title, content, or tags
- ✅ **Category Filtering** - Filter posts by category
- ✅ **Pagination** - Navigate through posts with pagination
- ✅ **User Profiles** - View user profiles with stats and posts
- ✅ **Dashboard** - Manage all your posts in one place

### Technical Features
- ✅ **TypeScript** - Full type safety throughout the application
- ✅ **Material UI v7** - Modern UI components
- ✅ **React Router** - Client-side routing
- ✅ **Context API** - State management with React Context
- ✅ **LocalStorage** - Persistent data storage
- ✅ **Comprehensive Tests** - Unit tests for contexts and components

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Bloganity
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `npm start` - Start the development server
- `npm test` - Run tests
- `npm run build` - Build for production
- `npm run eject` - Eject from Create React App (irreversible)

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Layout.tsx      # Main layout with navigation
│   └── ProtectedRoute.tsx  # Route protection
├── context/            # React Context providers
│   ├── AuthContext.tsx # Authentication state
│   ├── BlogContext.tsx # Blog posts and comments
│   └── ThemeContext.tsx # Theme management
├── pages/              # Page components
│   ├── Home.tsx        # Home page with post listing
│   ├── Login.tsx       # Authentication page
│   ├── Dashboard.tsx   # User dashboard
│   ├── PostDetail.tsx  # Single post view
│   ├── CreatePost.tsx  # Create new post
│   ├── EditPost.tsx    # Edit existing post
│   └── Profile.tsx     # User profile
├── types/              # TypeScript type definitions
│   └── index.ts
└── App.tsx             # Main app component with routing
```

## Technologies Used

- **React 18** - UI library
- **TypeScript** - Type safety
- **Material UI v7** - Component library
- **React Router v6** - Routing
- **React Quill** - Rich text editor
- **date-fns** - Date formatting
- **Jest & React Testing Library** - Testing

## Features in Detail

### Authentication
- User registration with email, username, and password
- Secure login system
- Persistent sessions using localStorage
- Protected routes for authenticated users

### Blog Posts
- Create posts with title, excerpt, content, category, tags, and featured image
- Rich text editing with React Quill
- Save as draft or publish immediately
- Edit and delete posts
- View post statistics (views, likes, reading time)

### Comments
- Add comments to posts
- Rich text support in comments
- Like comments
- Delete own comments or comments on own posts

### User Profile
- View profile information
- See all authored posts
- View bookmarked posts
- Statistics (total posts, bookmarks, views, likes)

## Testing

Run tests with:
```bash
npm test
```

Test coverage includes:
- Context providers (Auth, Blog, Theme)
- Page components
- User interactions

## Future Enhancements

Potential features to add:
- User avatars and profile images
- Follow/unfollow users
- Notifications
- Email notifications
- Advanced search with filters
- Post scheduling
- Analytics dashboard
- Export functionality
- Multi-language support

## License

This project is open source and available under the MIT License.
