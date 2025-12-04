import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Avatar,
  TextField,
  Button,
  Paper,
  Card,
  CardContent,
  CardActions,
  Tabs,
  Tab,
  Chip,
  IconButton,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useBlog } from '../context/BlogContext';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import VisibilityIcon from '@mui/icons-material/Visibility';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { allPosts, getBookmarkedPosts } = useBlog();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState(user?.bio || '');

  if (!user) return null;

  const userPosts = allPosts.filter((post) => post.author.id === user.id);
  const bookmarkedPosts = getBookmarkedPosts(user.id);

  const handleSaveBio = () => {
    // In a real app, this would update the user profile
    setEditing(false);
  };

  const displayPosts = tabValue === 0 ? userPosts : bookmarkedPosts;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
          <Avatar
            sx={{
              width: 120,
              height: 120,
              bgcolor: 'primary.main',
              fontSize: '3rem',
            }}
          >
            {user.username[0].toUpperCase()}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
              {user.username}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {user.email}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Member since {format(new Date(user.createdAt), 'MMMM yyyy')}
            </Typography>
            {editing ? (
              <Box sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Box>
                  <Button variant="contained" onClick={handleSaveBio} sx={{ mr: 1 }}>
                    Save
                  </Button>
                  <Button variant="outlined" onClick={() => setEditing(false)}>
                    Cancel
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box sx={{ mt: 2 }}>
                {bio ? (
                  <Typography variant="body1" paragraph>
                    {bio}
                  </Typography>
                ) : (
                  <Typography variant="body2" color="text.secondary" paragraph>
                    No bio yet. Click edit to add one.
                  </Typography>
                )}
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => setEditing(true)}
                  size="small"
                >
                  Edit Bio
                </Button>
              </Box>
            )}
          </Box>
        </Box>

        <Box sx={{ mt: 4, display: 'flex', gap: 4 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" fontWeight="bold">
              {userPosts.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Posts
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" fontWeight="bold">
              {bookmarkedPosts.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Bookmarked
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" fontWeight="bold">
              {userPosts.reduce((sum, post) => sum + post.views, 0)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Views
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" fontWeight="bold">
              {userPosts.reduce((sum, post) => sum + post.likes, 0)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Likes
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab label={`My Posts (${userPosts.length})`} />
          <Tab label={`Bookmarked (${bookmarkedPosts.length})`} />
        </Tabs>
      </Box>

      {displayPosts.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {tabValue === 0 ? 'No posts yet' : 'No bookmarked posts'}
          </Typography>
          {tabValue === 0 && (
            <Button
              variant="contained"
              onClick={() => navigate('/create-post')}
              sx={{ mt: 2 }}
            >
              Create Your First Post
            </Button>
          )}
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)',
            },
            gap: 3,
          }}
        >
          {displayPosts.map((post) => (
              <Card key={post.id} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {post.imageUrl && (
                  <Box
                    component="img"
                    src={post.imageUrl}
                    alt={post.title}
                    sx={{
                      width: '100%',
                      height: 200,
                      objectFit: 'cover',
                    }}
                  />
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Chip label={post.category} size="small" color="primary" sx={{ mb: 1 }} />
                  <Typography variant="h6" component="h2" gutterBottom noWrap>
                    {post.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }} noWrap>
                    {post.excerpt}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      👁 {post.views}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ❤️ {post.likes}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {format(new Date(post.createdAt), 'MMM d, yyyy')}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    startIcon={<VisibilityIcon />}
                    onClick={() => navigate(`/post/${post.id}`)}
                  >
                    View
                  </Button>
                  {tabValue === 0 && (
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => navigate(`/edit-post/${post.id}`)}
                    >
                      Edit
                    </Button>
                  )}
                </CardActions>
              </Card>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default Profile;

