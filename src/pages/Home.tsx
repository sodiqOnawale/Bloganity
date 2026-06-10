import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Avatar,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Tabs,
  Tab,
} from '@mui/material';
import { useBlog } from '../context/BlogContext';
import { useAuth } from '../context/AuthContext';
import { isSeedPost } from '../utils/seedPosts';
import { format } from 'date-fns';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CommentIcon from '@mui/icons-material/Comment';


const POSTS_PER_PAGE = 9;

type FeedTab = 'all' | 'member';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { communityPosts, userPosts, getComments } = useBlog();
  const { isAuthenticated } = useAuth();
  const [feedTab, setFeedTab] = useState<FeedTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [page, setPage] = useState(1);

  const sourcePosts = feedTab === 'all' ? communityPosts : userPosts;
  const categories = Array.from(new Set(sourcePosts.map((post) => post.category)));

  const filteredPosts = sourcePosts.filter((post) => {
    const matchesSearch =
      searchQuery === '' ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const paginatedPosts = filteredPosts.slice(
    (page - 1) * POSTS_PER_PAGE,
    page * POSTS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper
        sx={{
          p: { xs: 4, md: 6 },
          mb: 6,
          textAlign: 'center',
          color: 'common.white',
          minHeight: { xs: 280, md: 360 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: `linear-gradient(rgba(13, 27, 42, 0.72), rgba(13, 27, 42, 0.55)), url(${process.env.PUBLIC_URL}/images/hero-bg.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
          Welcome to Bloganity
        </Typography>
        <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
          Discover amazing stories and share your thoughts
        </Typography>
        {!isAuthenticated && (
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/signup')}
            sx={{
              bgcolor: 'white',
              color: 'black',
              '&:hover': { bgcolor: 'grey.100' },
            }}
          >
            Get Started
          </Button>
        )}
      </Paper>

      <Box sx={{ mb: 4 }}>
        <Tabs
          value={feedTab}
          onChange={(_, value: FeedTab) => {
            setFeedTab(value);
            setPage(1);
          }}
          sx={{ mb: 3 }}
        >
          <Tab label={`All Blogs (${communityPosts.length})`} value="all" />
          <Tab label={`Member Posts (${userPosts.length})`} value="member" />
        </Tabs>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
            gap: 2,
            mb: 3,
          }}
        >
          <TextField
            fullWidth
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(1);
              }}
              label="Category"
            >
              <MenuItem value="all">All Categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {filteredPosts.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            {feedTab === 'member' && !searchQuery && selectedCategory === 'all'
              ? 'No member posts yet'
              : 'No posts found'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {feedTab === 'member' && !searchQuery && selectedCategory === 'all' ? (
              <>
                Be the first to share your story, or browse featured posts in{' '}
                <Button
                  size="small"
                  onClick={() => setFeedTab('all')}
                  sx={{ textTransform: 'none', p: 0, minWidth: 0, verticalAlign: 'baseline' }}
                >
                  All Blogs
                </Button>
                .
                {isAuthenticated && (
                  <>
                    {' '}You can also{' '}
                    <Link to="/create-post" style={{ color: 'inherit' }}>
                      create a post
                    </Link>
                    .
                  </>
                )}
              </>
            ) : (
              isAuthenticated && (
                <>
                  Try adjusting your search or{' '}
                  <Link to="/create-post" style={{ color: 'inherit' }}>
                    create your first post!
                  </Link>
                </>
              )
            )}
          </Typography>
        </Box>
      ) : (
        <>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              },
              gap: 3,
              mb: 4,
            }}
          >
            {paginatedPosts.map((post) => {
              const comments = post.id ? getComments(post.id) : []
              return (
                <Card
                  key={post.id}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6,
                    },
                    cursor: 'pointer',
                  }}
                  onClick={() => navigate(`/post/${post.id}`)}
                >
                  {post.imageUrl && (
                    <CardMedia
                      component="img"
                      height="200"
                      image={post.imageUrl}
                      alt={post.title}
                    />
                  )}
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                      <Chip
                        label={post.category}
                        size="small"
                        color="primary"
                      />
                      {isSeedPost(post.id) && (
                        <Chip label="Featured" size="small" variant="outlined" />
                      )}
                    </Box>
                    <Typography variant="h6" component="h2" gutterBottom noWrap>
                      {post.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                      noWrap
                    >
                      {post.excerpt}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar sx={{ width: 24, height: 24, bgcolor: 'secondary.main' }}>
                        {post.author.username[0].toUpperCase()}
                      </Avatar>
                      <Typography variant="caption" color="text.secondary">
                        {post.author.username}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {format(new Date(post.createdAt), 'MMM d, yyyy')}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <VisibilityIcon fontSize="small" color="action" />
                        <Typography variant="caption" color="text.secondary">
                          {post.views}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <FavoriteIcon fontSize="small" color="action" />
                        <Typography variant="caption" color="text.secondary">
                          {post.likes}
                        </Typography>
                      </Box>
                      {post.readingTime && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <AccessTimeIcon fontSize="small" color="action" />
                          <Typography variant="caption" color="text.secondary">
                            {post.readingTime} min
                          </Typography>
                        </Box>
                      )}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <CommentIcon fontSize="small" color="action" />
                        <Typography variant="caption" color="text.secondary">
                          {comments.length}
                        </Typography>
                      </Box>
                    </Box>
                    {post.tags.length > 0 && (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                        {post.tags.slice(0, 3).map((tag) => (
                          <Chip
                            key={tag}
                            label={`#${tag}`}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        ))}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </Box>

          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default Home;
