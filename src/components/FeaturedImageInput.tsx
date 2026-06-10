import React, { useRef, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import LinkIcon from '@mui/icons-material/Link';
import CloseIcon from '@mui/icons-material/Close';

interface FeaturedImageInputProps {
  value: string;
  onChange: (value: string) => void;
}

const MAX_IMAGE_SIZE_MB = 5;

const FeaturedImageInput: React.FC<FeaturedImageInputProps> = ({ value, onChange }) => {
  const [uploadMethod, setUploadMethod] = useState<'upload' | 'url'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      alert(`Image size should be less than ${MAX_IMAGE_SIZE_MB}MB`);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      onChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleClear = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="body2" gutterBottom>
        Featured Image
      </Typography>
      <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1.5 }}>
        Optional image for your post card and detail page
      </Typography>

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
          startIcon={<LinkIcon />}
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
          >
            Choose Image
          </Button>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
            JPG, PNG, GIF, or WebP up to {MAX_IMAGE_SIZE_MB}MB
          </Typography>
        </Box>
      ) : (
        <TextField
          fullWidth
          label="Image URL"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
        />
      )}

      {value && (
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Preview
            </Typography>
            <Button size="small" color="inherit" startIcon={<CloseIcon />} onClick={handleClear}>
              Remove
            </Button>
          </Box>
          <Box
            component="img"
            src={value}
            alt="Featured preview"
            sx={{
              width: '100%',
              maxHeight: 240,
              objectFit: 'cover',
              borderRadius: 2,
              border: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default FeaturedImageInput;
