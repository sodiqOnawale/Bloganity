import React, { useState, useRef } from 'react';
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
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useBlog } from '../context/BlogContext';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import IconButton from '@mui/material/IconButton';
import UploadFileIcon from '@mui/icons-material/UploadFile';

const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { allPosts, getBookmarkedPosts } = useBlog();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState(user?.bio || '');
  const [editingAvatar, setEditingAvatar] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || '');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [uploadMethod, setUploadMethod] = useState<'upload' | 'url'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) return null;

  const userPosts = allPosts.filter((post) => post.author.id === user.id);
  const bookmarkedPosts = getBookmarkedPosts(user.id);

  const handleSaveBio = () => {
    setEditing(false);
    updateProfile({ bio });
  };
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setAvatarUrl(base64String);
      setAvatarPreview(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveAvatar = () => {
    const avatarToSave = avatarPreview || avatarUrl;
    if (avatarToSave) {
      updateProfile({ avatar: avatarToSave });
      setEditingAvatar(false);
      setAvatarPreview(null);
      setAvatarUrl('');
    }
  };

  const handleCancelAvatar = () => {
    setEditingAvatar(false);
    setAvatarUrl(user?.avatar || '');
    setAvatarPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };


  const displayPosts = tabValue === 0 ? userPosts : bookmarkedPosts;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={user.avatar}
              sx={{
                width: 120,
                height: 120,
                bgcolor: 'primary.main',
                fontSize: '3rem',
              }}
            >
              {!user.avatar && user.username[0].toUpperCase()}
            </Avatar>
            {editingAvatar ? (
              <Box sx={{ mt: 2, minWidth: 300 }}>
                <Box sx={{ mb: 2 }}>
                  <Button
                    variant={uploadMethod === 'upload' ? 'contained' : 'outlined'}
                    onClick={() => setUploadMethod('upload')}
                    startIcon={<UploadFileIcon />}
                    sx={{ mr: 1 }}
                    size="small"
                  >
                    Upload
                  </Button>
                  <Button
                    variant={uploadMethod === 'url' ? 'contained' : 'outlined'}
                    onClick={() => setUploadMethod('url')}
                    size="small"
                  >
                    From URL
                  </Button>
                </Box>

                {uploadMethod === 'upload' ? (
                  <Box>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      style={{ display: 'none' }}
                    />
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => fileInputRef.current?.click()}
                      startIcon={<UploadFileIcon />}
                      sx={{ mb: 2 }}
                    >
                      Choose Image
                    </Button>
                    {avatarPreview && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" display="block" sx={{ mb: 1 }}>
                          Preview:
                        </Typography>
                        <Avatar
                          src={avatarPreview}
                          sx={{
                            width: 100,
                            height: 100,
                            bgcolor: 'primary.main',
                            fontSize: '2.5rem',
                          }}
                        >
                          {user.username[0].toUpperCase()}
                        </Avatar>
                      </Box>
                    )}
                  </Box>
                ) : (
                  <TextField
                    fullWidth
                    label="Profile Picture URL"
                    value={avatarUrl}
                    onChange={(e) => {
                      setAvatarUrl(e.target.value);
                      setAvatarPreview(e.target.value);
                    }}
                    placeholder="https://example.com/avatar.jpg"
                    sx={{ mb: 2 }}
                  />
                )}

                {(avatarPreview || avatarUrl) && (
                  <Box>
                    <Button variant="contained" onClick={handleSaveAvatar} sx={{ mr: 1 }}>
                      Save
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={handleCancelAvatar}>
                      Cancel
                    </Button>
                  </Box>
                )}
              </Box>
            ) : (
              <IconButton
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': {bgcolor: 'primary.dark'}
                }}
                onClick={() => setEditingAvatar(true)}
                size='small'
              >
                <CameraAltIcon />
              </IconButton>
            )}
          </Box>
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

