import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  Switch,
  FormControlLabel,
  Alert,
} from '@mui/material';
import { useBlog } from '../context/BlogContext';
import { useAuth } from '../context/AuthContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import SaveIcon from '@mui/icons-material/Save';
import PublishIcon from '@mui/icons-material/Publish';

const CATEGORIES = [
  'Technology',
  'Lifestyle',
  'Travel',
  'Food',
  'Health',
  'Business',
  'Education',
  'Entertainment',
  'Sports',
  'Other',
];

const EditPost: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { allPosts, updatePost } = useBlog();
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [published, setPublished] = useState(false);
  const [error, setError] = useState('');

  const post = id ? allPosts.find((p) => p.id === id) : undefined;

  useEffect(() => {
    if (post) {
      if (post.author.id !== user?.id) {
        navigate('/dashboard');
        return;
      }
      setTitle(post.title);
      setExcerpt(post.excerpt);
      setContent(post.content);
      setCategory(post.category);
      setTags(post.tags);
      setImageUrl(post.imageUrl || '');
      setPublished(post.published);
    }
  }, [post, user, navigate]);

  if (!post) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Post not found
        </Typography>
        <Button variant="contained" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  const handleTagAdd = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleTagDelete = (tagToDelete: string) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };

  const handleSubmit = (publish: boolean) => {
    if (!title.trim() || !excerpt.trim() || !content.trim() || !category) {
      setError('Please fill in all required fields');
      return;
    }

    if (!id) return;

    updatePost(id, {
      title: title.trim(),
      excerpt: excerpt.trim(),
      content,
      category,
      tags,
      imageUrl: imageUrl.trim() || undefined,
      published: publish,
    });

    navigate('/dashboard');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Edit Post
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <TextField
          fullWidth
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          required
          multiline
          rows={2}
          sx={{ mb: 2 }}
          helperText="A short description of your post"
        />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Category</InputLabel>
          <Select value={category} onChange={(e) => setCategory(e.target.value)} label="Category">
            {CATEGORIES.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Featured Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          sx={{ mb: 2 }}
          helperText="Optional: URL to an image for your post"
        />

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" gutterBottom>
            Tags
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
            <TextField
              size="small"
              placeholder="Add a tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleTagAdd();
                }
              }}
              sx={{ flexGrow: 1 }}
            />
            <Button variant="outlined" onClick={handleTagAdd}>
              Add
            </Button>
          </Stack>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                onDelete={() => handleTagDelete(tag)}
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" gutterBottom>
            Content
          </Typography>
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            style={{ minHeight: '300px', marginBottom: '50px' }}
          />
        </Box>

        <FormControlLabel
          control={
            <Switch
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
          }
          label="Published"
        />
      </Paper>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button variant="outlined" onClick={() => navigate('/dashboard')}>
          Cancel
        </Button>
        <Button
          variant="outlined"
          startIcon={<SaveIcon />}
          onClick={() => handleSubmit(false)}
          disabled={!title.trim() || !content.trim()}
        >
          Save as Draft
        </Button>
        <Button
          variant="contained"
          startIcon={<PublishIcon />}
          onClick={() => handleSubmit(true)}
          disabled={!title.trim() || !content.trim() || !category}
        >
          {published ? 'Update' : 'Publish'}
        </Button>
      </Box>
    </Container>
  );
};

export default EditPost;

