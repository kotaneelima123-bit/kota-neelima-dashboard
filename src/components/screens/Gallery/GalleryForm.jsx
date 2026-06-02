import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  FormControl,
  FormLabel,
  Avatar,
  Grid,
  InputAdornment,
  CircularProgress,
  IconButton,
  Alert,
  MenuItem,
  Select
} from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';
import { format, parse } from 'date-fns';

const GalleryForm = ({
  formData,
  currentItem,
  loading,
  categories,
  onChange,
  onSubmit,
  onReset,
  onAddNew,
}) => {

  const [imageError, setImageError] = useState('');
  const [imageRequirements] = useState({
    maxSizeMB: 1,
    requiredWidth: 800,
    requiredHeight: 600
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...formData, [name]: value });
  };

  const handleCategoryChange = (e) => {
    onChange({ ...formData, categoryId: e.target.value });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageError('');

    if (!file.type.startsWith('image/')) {
      setImageError('Please upload an image file');
      return;
    }

    if (file.size > imageRequirements.maxSizeMB * 1024 * 1024) {
      setImageError(`Image must be less than ${imageRequirements.maxSizeMB}MB`);
      return;
    }

    const img = new Image();
    img.onload = () => {
      // Width/height validation is temporarily disabled.
      // To enable it again later, uncomment this block and remove the direct onChange below.
      // if (img.width !== imageRequirements.requiredWidth ||
      // img.height !== imageRequirements.requiredHeight) {
      // setImageError(
      // `Image must be exactly ${imageRequirements.requiredWidth}px × ${imageRequirements.requiredHeight}px`
      // );
      // } else {
      // onChange({ ...formData, image: file });
      // }
      onChange({ ...formData, image: file });
      URL.revokeObjectURL(img.src);
    };

    img.onerror = () => {
      setImageError('Failed to load image');
      URL.revokeObjectURL(img.src);
    };

    img.src = URL.createObjectURL(file);
  };

  const removeImage = () => {
    onChange({ ...formData, image: null });
  };

  const imagePreview = formData.image
    ? typeof formData.image === 'string'
      ? formData.image
      : URL.createObjectURL(formData.image)
    : null;

  const parseApiDate = (dateString) => {
    if (!dateString) return null;
    return parse(dateString, 'dd-MM-yyyy', new Date());
  };

  const parseApiTime = (timeString) => {
    if (!timeString) return null;
    return parse(timeString, 'hh:mm a', new Date());
  };

  const formatForApi = (date, formatStr) => {
    if (!date) return '';
    return format(date, formatStr);
  };

  const handleDateChange = (date) => {
    onChange({
      ...formData,
      date: date ? formatForApi(date, 'dd-MM-yyyy') : ''
    });
  };

  const handleTimeChange = (time) => {
    onChange({
      ...formData,
      time: time ? formatForApi(time, 'hh:mm a') : ''
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Paper elevation={0} sx={{
        p: 3,
        mb: 3,
        backgroundColor: 'white',
        borderRadius: '8px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600, color: '#212b36' }}>
            {currentItem ? 'Edit Gallery Item' : 'Add New Gallery Item'}
          </Typography>
          {currentItem && (
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={onAddNew}
              sx={{ ml: 2 }}
            >
              Add New
            </Button>
          )}
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth margin="normal">
              <FormLabel component="legend" sx={{ mb: 1 }}>Image</FormLabel>

              {imagePreview ? (
                <Box sx={{ position: 'relative', mb: 2 }}>
                  <Box
                    component="img"
                    src={imagePreview}
                    alt="Preview"
                    sx={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }}
                  />
                  <IconButton
                    onClick={removeImage}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(0,0,0,0.7)'
                      }
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              ) : (
                <Avatar
                  variant="rounded"
                  sx={{
                    width: '100%',
                    height: '200px',
                    mb: 2,
                    backgroundColor: '#f4f6f8'
                  }}
                >
                  No Image
                </Avatar>
              )}

              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{
                  borderColor: '#919eab',
                  color: '#212b36',
                  '&:hover': {
                    borderColor: '#212b36'
                  }
                }}
              >
                {formData.image ?
                  (typeof formData.image === 'string' ? 'Change Image' : formData.image.name) :
                  'Upload Image'}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Button>
              {imageError && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {imageError}
                </Alert>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} md={8}>
            <Box component="form" onSubmit={onSubmit} noValidate>
              <TextField
                fullWidth
                margin="normal"
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                margin="normal"
                label="Hindi Title"
                name="hindiTitle"
                value={formData.hindiTitle}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">हिंदी</InputAdornment>,
                }}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                margin="normal"
                label="Telugu Title"
                name="teluguTitle"
                value={formData.teluguTitle}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">తెలుగు</InputAdornment>,
                }}
                sx={{ mb: 2 }}
              />

              {/* Category Dropdown */}
              <FormControl fullWidth margin="normal" sx={{ mb: 2 }}>
                <FormLabel component="legend">Category (Optional)</FormLabel>
                <Select
                  value={formData.categoryId || ''}
                  onChange={handleCategoryChange}
                  displayEmpty
                  name="categoryId"
                >
                  <MenuItem value="null">No Category</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category._id} value={category._id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <DatePicker
                  label="Date"
                  value={formData.date ? parseApiDate(formData.date) : null}
                  onChange={handleDateChange}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth />
                  )}
                />

                <TimePicker
                  label="Time"
                  value={formData.time ? parseApiTime(formData.time) : null}
                  onChange={handleTimeChange}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth />
                  )}
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    backgroundColor: '#76030F',
                    '&:hover': { backgroundColor: '#5a020c' },
                  }}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : null}
                >
                  {loading ? 'Processing...' : currentItem ? 'Update' : 'Upload'}
                </Button>
                {!currentItem && (
                  <Button
                    variant="outlined"
                    onClick={onReset}
                    disabled={loading}
                  >
                    Clear
                  </Button>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </LocalizationProvider>
  );
};

export default GalleryForm;
