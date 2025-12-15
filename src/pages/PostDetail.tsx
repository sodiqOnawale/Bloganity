import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Chip,
  Button,
  Divider,
  Paper,
  Snackbar,
  Alert,
} from '@mui/material';
import { useBlog } from '../context/BlogContext';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ShareIcon from '@mui/icons-material/Share';
import CommentIcon from '@mui/icons-material/Comment';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    getPost,
    getComments,
    addComment,
    likePost,
    unlikePost,
    incrementViews,
    bookmarkPost,
    unbookmarkPost,
    isBookmarked,
    likeComment,
    deleteComment,
  } = useBlog();
  const [comment, setComment] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const hasIncrementedViews = useRef<string | null>(null);

  const post = id ? getPost(id) : undefined;
  const comments = id ? getComments(id) : [];
  const isLiked = post && user ? post.likedBy?.includes(user.id) : false;
  const bookmarked = post && user ? isBookmarked(post.id, user.id) : false;

  // Increment views only once per post when the component mounts or post ID changes
  useEffect(() => {
    if (id && hasIncrementedViews.current !== id) {
      // Check if we've already viewed this post in this session
      const viewedPosts = sessionStorage.getItem('bloganity_viewed_posts');
      const viewedPostsArray = viewedPosts ? JSON.parse(viewedPosts) : [];
      
      if (!viewedPostsArray.includes(id)) {
        incrementViews(id);
        viewedPostsArray.push(id);
        sessionStorage.setItem('bloganity_viewed_posts', JSON.stringify(viewedPostsArray));
        hasIncrementedViews.current = id;
      } else {
        // Already viewed in this session, just update the ref
        hasIncrementedViews.current = id;
      }
    }
  }, [id, incrementViews]); // Removed 'post' from dependencies to prevent infinite loop

  if (!post) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Post not found
        </Typography>
        <Button variant="contained" onClick={() => navigate('/')}>
          Go Home
        </Button>
      </Container>
    );
  }

  const handleLike = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (isLiked) {
      unlikePost(post.id, user.id);
    } else {
      likePost(post.id, user.id);
    }
  };

  const handleBookmark = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (bookmarked) {
      unbookmarkPost(post.id, user.id);
      setSnackbar({ open: true, message: 'Removed from bookmarks' });
    } else {
      bookmarkPost(post.id, user.id);
      setSnackbar({ open: true, message: 'Added to bookmarks' });
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url,
        });
      } catch {
        setSnackbar({ open: true, message: 'Error sharing post' });
      }
    } else {
      navigator.clipboard.writeText(url);
      setSnackbar({ open: true, message: 'Link copied to clipboard!' });
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !comment.trim()) return;

    addComment({
      postId: post.id,
      author: user,
      content: comment,
    });
    setComment('');
    setSnackbar({ open: true, message: 'Comment added!' });
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        ← Back
      </Button>

      {post.imageUrl && (
        <Box
          component="img"
          src={post.imageUrl}
          alt={post.title}
          sx={{
            width: '100%',
            maxHeight: 400,
            objectFit: 'cover',
            borderRadius: 2,
            mb: 3,
          }}
        />
      )}

      <Box sx={{ mb: 3 }}>
        <Chip label={post.category} color="primary" sx={{ mb: 2 }} />
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          {post.title}
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {post.excerpt}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2, mb: 3 }}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            {post.author.username[0].toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="body1" fontWeight="medium">
              {post.author.username}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {format(new Date(post.createdAt), 'MMM d, yyyy')}
              {post.readingTime && ` · ${post.readingTime} min read`}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 3 }}>
          <IconButton onClick={handleLike} color={isLiked ? 'error' : 'default'}>
            {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
          <Typography variant="body2">{post.likes}</Typography>

          <IconButton onClick={handleBookmark} color={bookmarked ? 'primary' : 'default'}>
            {bookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
          </IconButton>

          <IconButton onClick={handleShare}>
            <ShareIcon />
          </IconButton>

          <Box sx={{ ml: 'auto', display: 'flex', gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              👁 {post.views} views
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <CommentIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
              {comments.length} {comments.length <= 1 ? 'comment' : 'comments'}
            </Typography>
          </Box>
        </Box>

        {post.tags.length > 0 && (
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
            {post.tags.map((tag) => (
              <Chip key={tag} label={`#${tag}`} size="small" variant="outlined" />
            ))}
          </Box>
        )}
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box
        sx={{ mb: 4 }}
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <Divider sx={{ my: 4 }} />

      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        Comments ({comments.length})
      </Typography>

      {user && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <form onSubmit={handleCommentSubmit}>
            <ReactQuill
              theme="snow"
              value={comment}
              onChange={setComment}
              placeholder="Write a comment..."
              style={{ marginBottom: 16 }}
            />
            <Button type="submit" variant="contained" disabled={!comment.trim()}>
              Post Comment
            </Button>
          </form>
        </Paper>
      )}

      {!user && (
        <Box sx={{ textAlign: 'center', py: 3, mb: 3 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Please sign in to leave a comment
          </Typography>
          <Button variant="contained" onClick={() => navigate('/login')}>
            Sign In
          </Button>
        </Box>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {comments.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            No comments yet. Be the first to comment!
          </Typography>
        ) : (
          comments.map((comment) => (
            <Card key={comment.id} variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
                    {comment.author.username[0].toUpperCase()}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" fontWeight="medium">
                      {comment.author.username}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {format(new Date(comment.createdAt), 'MMM d, yyyy HH:mm')}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton size="small" onClick={() => likeComment(comment.id)}>
                      <FavoriteBorderIcon fontSize="small" />
                    </IconButton>
                    <Typography variant="caption">{comment.likes}</Typography>
                    {user && (user.id === comment.author.id || user.id === post.author.id) && (
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => deleteComment(comment.id)}
                      >
                        Delete
                      </IconButton>
                    )}
                  </Box>
                </Box>
                <Box dangerouslySetInnerHTML={{ __html: comment.content }} />
              </CardContent>
            </Card>
          ))
        )}
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ open: false, message: '' })}
      >
        <Alert severity="success">{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default PostDetail;

