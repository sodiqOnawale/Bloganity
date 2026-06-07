import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Tabs,
  Tab,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import { useAuth } from '../context/AuthContext';
import { isValidPhone } from '../utils/phone';

type AuthMethod = 'email' | 'phone';

const Login: React.FC = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [authMethod, setAuthMethod] = useState<AuthMethod>('email');
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(() => location.pathname !== '/signup');

  useEffect(() => {
    setIsLogin(location.pathname !== '/signup');
  }, [location.pathname]);

  const resetForm = () => {
    setIdentifier('');
    setPassword('');
    setUsername('');
    setError('');
  };

  const handleAuthMethodChange = (_: React.MouseEvent<HTMLElement>, value: AuthMethod | null) => {
    if (!value) return;
    setAuthMethod(value);
    setIdentifier('');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      if (authMethod === 'phone' && !isValidPhone(identifier)) {
        setError('Enter a valid phone number');
        return;
      }

      const success = await login(identifier, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError(authMethod === 'phone' ? 'Invalid phone number or password' : 'Invalid email or password');
      }
      return;
    }

    if (!username.trim()) {
      setError('Username is required');
      return;
    }

    if (authMethod === 'phone') {
      if (!isValidPhone(identifier)) {
        setError('Enter a valid phone number');
        return;
      }

      const success = await register({
        username,
        phone: identifier,
        password,
      });

      if (success) {
        navigate('/dashboard');
      } else {
        setError('Phone number or username already exists');
      }
      return;
    }

    const success = await register({
      username,
      email: identifier,
      password,
    });

    if (success) {
      navigate('/dashboard');
    } else {
      setError('Email or username already exists');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" fontWeight="bold">
          {isLogin ? 'Sign In' : 'Sign Up'}
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 4 }}>
          {isLogin
            ? 'Welcome back! Please sign in to your account.'
            : 'Create a new account to start blogging'}
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs
            value={isLogin ? 0 : 1}
            onChange={(_, newValue) => {
              const signingIn = newValue === 0;
              setIsLogin(signingIn);
              navigate(signingIn ? '/login' : '/signup', { replace: true });
              resetForm();
            }}
            centered
          >
            <Tab label="Sign In" />
            <Tab label="Sign Up" />
          </Tabs>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <ToggleButtonGroup
            value={authMethod}
            exclusive
            onChange={handleAuthMethodChange}
            size="small"
            aria-label="authentication method"
          >
            <ToggleButton value="email" aria-label="email">
              <EmailIcon sx={{ mr: 1, fontSize: 18 }} />
              Email
            </ToggleButton>
            <ToggleButton value="phone" aria-label="phone">
              <PhoneIcon sx={{ mr: 1, fontSize: 18 }} />
              Phone
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <TextField
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              margin="normal"
            />
          )}
          <TextField
            fullWidth
            label={authMethod === 'phone' ? 'Phone Number' : 'Email'}
            type={authMethod === 'phone' ? 'tel' : 'email'}
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            margin="normal"
            placeholder={authMethod === 'phone' ? '+1 (555) 123-4567' : 'you@example.com'}
            helperText={authMethod === 'phone' ? 'Include country code for international numbers' : undefined}
            inputProps={authMethod === 'phone' ? { inputMode: 'tel', autoComplete: 'tel' } : { autoComplete: 'email' }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            margin="normal"
            helperText={!isLogin ? 'Minimum 6 characters' : ''}
            inputProps={{ minLength: 6 }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3, mb: 2 }}
          >
            {isLogin ? 'Sign In' : 'Sign Up'}
          </Button>
        </form>

        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Button component={Link} to="/" size="small">
            ← Back to Home
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
