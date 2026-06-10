# Bloganity - Modern Blog Application

A full-featured blog application built with React, TypeScript, and Material UI. Create posts, engage with content, and explore a lively home feed with featured sample stories.

## Features

### Core Features
- **User Authentication** — Sign up and sign in with **email** or **phone number**
- **Blog Post Management** — Create, edit, delete, and publish blog posts
- **Rich Text Editor** — React Quill for post and comment content (dark mode styled)
- **Post Categories** — Organize posts by category
- **Tags System** — Add tags with a compact inline control
- **Featured Images** — Upload from device or paste a URL
- **Draft System** — Save posts as drafts before publishing

### Home Feed
- **All Blogs** tab — Member posts plus featured seed content
- **Member Posts** tab — Only user-created published posts
- **Search & Filter** — Search by title, excerpt, or tags; filter by category
- **Pagination** — Browse posts nine at a time
- **Hero section** — Background image with call-to-action for new visitors

### Social Features
- **Like/Unlike Posts** — Like member-created posts
- **Comments** — Rich text comments on posts
- **Bookmarking** — Save favorite posts for later
- **Share** — Web Share API or copy link
- **View Tracking** — Track post views per session
- **Reading Time** — Automatic reading time estimation

### User Experience
- **Dark/Light Theme** — Toggle with Material UI theming
- **Responsive Design** — Mobile-first layout
- **Sign Up in Nav** — Dedicated `/signup` route and Get Started CTA
- **Scroll to Top** — New pages start at the top on navigation
- **User Profiles** — Bio, avatar (upload or URL), stats, posts, and bookmarks
- **Dashboard** — Manage published posts and drafts

### Technical Features
- **TypeScript** — Type safety across the app
- **Material UI v7** — Modern UI components
- **React Router v6** — Client-side routing
- **Context API** — Auth, blog, and theme state
- **LocalStorage** — Persistent user data (posts, auth, bookmarks)
- **Seed Content** — Featured demo posts and comments kept in code, merged at display time
- **Unit Tests** — Context and page component tests

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

| Command | Description |
|---------|-------------|
| `npm start` / `npm run dev` | Start development server |
| `npm test` | Run tests |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Auto-fix lint issues |

## Project Structure

```
public/
├── images/                 # Hero, favicon, and seed post images
├── favicon.svg
├── manifest.json
└── index.html

src/
├── components/
│   ├── FeaturedImageInput.tsx  # Upload or URL featured image
│   ├── Layout.tsx              # Nav, footer, theme toggle
│   ├── ProtectedRoute.tsx
│   └── ScrollToTop.tsx
├── context/
│   ├── AuthContext.tsx
│   ├── BlogContext.tsx
│   └── ThemeContext.tsx
├── data/
│   ├── defaultPosts.ts         # Featured seed posts
│   ├── defaultComments.ts
│   └── defaultAuthors.ts
├── pages/
│   ├── Home.tsx                # Feed with All / Member tabs
│   ├── Login.tsx               # Sign in / sign up (email or phone)
│   ├── Dashboard.tsx
│   ├── PostDetail.tsx
│   ├── CreatePost.tsx
│   ├── EditPost.tsx
│   └── Profile.tsx
├── styles/
│   └── quill-dark.scss         # Rich text editor dark theme
├── theme/
│   └── theme.tsx               # MUI theme configuration
├── utils/
│   ├── phone.ts
│   └── seedPosts.ts
├── types/
│   └── index.ts
└── BlogApp.tsx                 # Routes and providers
```

## Technologies Used

- **React 18** — UI library
- **TypeScript** — Type safety
- **Material UI v7** — Components and icons
- **React Router v6** — Routing
- **React Quill** — Rich text editor
- **date-fns** — Date formatting
- **Sass** — Global and editor styles
- **Jest & React Testing Library** — Testing

## Features in Detail

### Authentication
- Register and sign in with **email** or **phone number** + password
- Separate `/login` and `/signup` routes
- Sessions persisted in `localStorage`
- Protected routes for dashboard, create/edit post, and profile

### Blog Posts
- Title, excerpt, rich content, category, tags, and optional featured image
- Featured image via **file upload** (base64) or **external URL**
- Draft or publish on create; publish/unpublish from dashboard
- Featured seed posts are read-only (no edit/delete)

### Home Feed Tabs
- **All Blogs** — Combines member posts with featured seed content
- **Member Posts** — Only posts created by registered users
- Seed posts are stored in code, not mixed into user `localStorage`

### Comments
- Rich text comments on any post
- Seed posts include demo comments; users can add their own
- Like and delete rules apply to member content

### User Profile
- Edit bio and avatar (upload or URL)
- View your posts, bookmarks, and engagement stats

## Deployment

Bloganity is a Create React App project and deploys cleanly to [Vercel](https://vercel.com):

```bash
npm run build
```

If the site shows a Vercel login screen before loading, disable **Deployment Protection** for production in your Vercel project settings.

## Testing

```bash
npm test
```

Coverage includes auth/blog contexts and key pages (Home, Login).

## Data Notes

- User posts, comments, auth, and bookmarks live in **browser localStorage**
- Uploaded images are stored as **base64** strings (keep files under ~5MB)
- To reset and see fresh seed content:
```js
localStorage.removeItem('bloganity_posts');
localStorage.removeItem('bloganity_comments');
location.reload();
```

## Future Enhancements

- Backend API and database (replace localStorage)
- Real email/phone verification (e.g. Supabase, Firebase)
- Follow users and notifications
- Post scheduling and analytics
- OAuth sign-in (Google, GitHub)

## License

This project is open source and available under the MIT License.
