import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  FormControl,
  FormLabel,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Modal,
  IconButton,
  InputAdornment,
  Avatar,
  Pagination,
  Stack,
  Grid
} from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import axios from 'axios';
import { format } from 'date-fns';
import { Edit as EditIcon, Delete as DeleteIcon, Close as CloseIcon, CheckCircle as CheckCircleIcon, Add as AddIcon } from '@mui/icons-material';

const Gallery = () => {
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    hindiTitle: '',
    teluguTitle: '',
    date: null,
    time: null,
    image: null
  });
  
  // UI state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: false, message: '' });
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [galleryItems, setGalleryItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      title: '',
      hindiTitle: '',
      teluguTitle: '',
      date: null,
      time: null,
      image: null
    });
    setCurrentItem(null);
    setImagePreview(null);
    setErrors({});
  };

  // Fetch gallery items
  useEffect(() => {
    const fetchGalleryItems = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('https://kotta-neelima.onrender.com/api/gallery/posts');
        setGalleryItems(response.data.galleries);
      } catch (error) {
        console.error('Error fetching gallery items:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGalleryItems();
  }, []);

  // Auto-dismiss alerts
  useEffect(() => {
    if (submitStatus.message) {
      const timer = setTimeout(() => {
        setSubmitStatus({ success: false, message: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [submitStatus.message]);

  // Handle image preview
  useEffect(() => {
    if (formData.image) {
      if (typeof formData.image === 'string') {
        setImagePreview(formData.image);
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(formData.image);
      }
    } else {
      setImagePreview(null);
    }
  }, [formData.image]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFormData(prev => ({ ...prev, image: e.target.files[0] }));
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setImagePreview(null);
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, date }));
  };

  const handleTimeChange = (time) => {
    setFormData(prev => ({ ...prev, time }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.image && !currentItem?.image) newErrors.image = 'Image is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus({ success: false, message: '' });

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('hindiTitle', formData.hindiTitle);
      formDataToSend.append('teluguTitle', formData.teluguTitle);
      formDataToSend.append('date', format(formData.date, 'dd-MM-yyyy'));
      formDataToSend.append('time', format(formData.time, 'h:mm a'));
      if (formData.image) formDataToSend.append('image', formData.image);

      const endpoint = currentItem
        ? `https://kotta-neelima.onrender.com/api/gallery/update/post/${currentItem._id}`
        : 'https://kotta-neelima.onrender.com/api/gallery/create/post';

      const method = currentItem ? 'put' : 'post';

      await axios[method](endpoint, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setSubmitStatus({
        success: true,
        message: `Gallery item ${currentItem ? 'updated' : 'created'} successfully!`
      });
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);

      // Refresh gallery items
      setIsLoading(true);
      const response = await axios.get('https://kotta-neelima.onrender.com/api/gallery/posts');
      setGalleryItems(response.data.galleries);
      setIsLoading(false);

      // Reset form after both create and update
      resetForm();
    } catch (error) {
      console.error('Error:', error);
      setSubmitStatus({
        success: false,
        message: `Failed to ${currentItem ? 'update' : 'create'} gallery item. Please try again.`
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (item) => {
    setCurrentItem(item);
    setFormData({
      title: item.title,
      hindiTitle: item.hindiTitle || '',
      teluguTitle: item.teluguTitle || '',
      date: new Date(item.date),
      time: new Date(`1970-01-01T${item.time}`),
      image: item.imageUrl || null
    });
  };

  const handleAddNew = () => {
    resetForm();
  };

  const handleDelete = (item) => {
    setCurrentItem(item);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`https://kotta-neelima.onrender.com/api/gallery/delete/post/${currentItem._id}`);
      setGalleryItems(galleryItems.filter(item => item._id !== currentItem._id));
      setDeleteModalOpen(false);
      setSubmitStatus({
        success: true,
        message: 'Gallery item deleted successfully!'
      });
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
      resetForm();
    } catch (error) {
      console.error('Error deleting item:', error);
      setSubmitStatus({
        success: false,
        message: 'Failed to delete gallery item. Please try again.'
      });
    }
  };

  const handleClearForm = () => {
    if (formData.title || formData.image) {
      if (window.confirm('Are you sure you want to clear the form?')) {
        resetForm();
      }
    }
  };

  // Pagination logic
  const paginatedItems = galleryItems.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ width: '100%', p: 3 }}>
        {/* Create/Edit Section */}
        <Paper elevation={0} sx={{
          p: 3,
          mb: 3,
          backgroundColor: 'white',
          borderRadius: '8px',
          border: submitSuccess ? '2px solid #4caf50' : 'none',
          transition: 'border 0.3s ease',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {submitSuccess && (
            <Box sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              display: 'flex',
              alignItems: 'center',
              color: '#4caf50'
            }}>
              <CheckCircleIcon sx={{ mr: 1 }} />
              <Typography variant="body2">
                {currentItem ? 'Updated successfully!' : 'Uploaded successfully!'}
              </Typography>
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 600, color: '#212b36' }}>
              {currentItem ? 'Edit Gallery Item' : 'Add New Gallery Item'}
            </Typography>
            {currentItem && (
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddNew}
                sx={{ ml: 2 }}
              >
                Add New
              </Button>
            )}
          </Box>

          {submitStatus.message && (
            <Alert severity={submitStatus.success ? 'success' : 'error'} sx={{ mb: 3 }}>
              {submitStatus.message}
            </Alert>
          )}

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth margin="normal" error={!!errors.image}>
                <FormLabel component="legend" sx={{ mb: 1 }}>Image *</FormLabel>

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
                {errors.image && (
                  <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                    {errors.image}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={8}>
              <Box component="form" onSubmit={handleSubmit} noValidate>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Title *"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  error={!!errors.title}
                  helperText={errors.title}
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

                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <DatePicker
                    label="Date *"
                    value={formData.date}
                    onChange={handleDateChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        error={!!errors.date}
                        helperText={errors.date}
                      />
                    )}
                  />

                  <TimePicker
                    label="Time"
                    value={formData.time}
                    onChange={handleTimeChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                      />
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
                    disabled={isSubmitting}
                    startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                  >
                    {isSubmitting ? 'Processing...' : currentItem ? 'Update' : 'Upload'}
                  </Button>
                  {!currentItem && (
                    <Button
                      variant="outlined"
                      onClick={handleClearForm}
                      disabled={isSubmitting}
                    >
                      Clear
                    </Button>
                  )}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Gallery Items Table */}
        <Paper elevation={0} sx={{
          p: 3,
          backgroundColor: 'white',
          borderRadius: '8px'
        }}>
          <Typography variant="h5" component="h2" gutterBottom sx={{
            fontWeight: 600,
            color: '#212b36',
            mb: 3
          }}>
            Gallery Items
          </Typography>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f4f6f8' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Image</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Time</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : paginatedItems.length > 0 ? (
                  paginatedItems.map((item) => (
                    <TableRow key={item._id} hover>
                      <TableCell>
                        {item.image ? (
                          <Box
                            component="img"
                            src={item.image}
                            alt={item.title}
                            sx={{
                              width: 60,
                              height: 60,
                              objectFit: 'cover',
                              borderRadius: '4px'
                            }}
                          />
                        ) : (
                          <Avatar variant="rounded" sx={{ width: 60, height: 60 }}>
                            No Image
                          </Avatar>
                        )}
                      </TableCell>
                      <TableCell>{item.title}</TableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>{item.time}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => handleEdit(item)}
                          sx={{ color: '#637381' }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(item)}
                          sx={{ color: '#637381' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No gallery items found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {galleryItems.length > itemsPerPage && (
            <Stack spacing={2} sx={{ mt: 3, alignItems: 'center' }}>
              <Pagination
                count={Math.ceil(galleryItems.length / itemsPerPage)}
                page={page}
                onChange={(_, value) => setPage(value)}
                shape="rounded"
                sx={{
                  '& .MuiPaginationItem-root': {
                    color: '#637381'
                  },
                  '& .MuiPaginationItem-root.Mui-selected': {
                    backgroundColor: '#76030F',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#5a020c'
                    }
                  }
                }}
              />
            </Stack>
          )}
        </Paper>

        {/* Delete Confirmation Modal */}
        <Modal
          open={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 3,
            borderRadius: '8px',
            outline: 'none'
          }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Confirm Delete
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Are you sure you want to delete "{currentItem?.title}"?
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => setDeleteModalOpen(false)}
                sx={{
                  color: '#637381',
                  borderColor: '#dfe3e8',
                  '&:hover': {
                    borderColor: '#919eab'
                  }
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleDeleteConfirm}
                sx={{
                  backgroundColor: '#76030F',
                  '&:hover': { backgroundColor: '#5a020c' }
                }}
              >
                Delete
              </Button>
            </Box>
          </Box>
        </Modal>
      </Box>
    </LocalizationProvider>
  );
};

export default Gallery;