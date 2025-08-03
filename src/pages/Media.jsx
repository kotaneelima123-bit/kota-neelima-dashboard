import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
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
    Pagination,
    Stack,
    Grid,
    Avatar,
} from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import axios from 'axios';
import { format } from 'date-fns';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';

const Media = () => {
    // Form state
    const [formData, setFormData] = useState({
        url: '',
        date: null,
        time: null
    });

    // UI state
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState({ success: false, message: '' });
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [mediaItems, setMediaItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [page, setPage] = useState(1);
    const itemsPerPage = 5;

    // Reset form to initial state
    const resetForm = () => {
        setFormData({
            url: '',
            date: null,
            time: null
        });
        setCurrentItem(null);
        setErrors({});
    };

    // Fetch media items
    useEffect(() => {
        const fetchMediaItems = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get('https://kotta-neelima.onrender.com/api/media/post');
                setMediaItems(response.data.media || []);
            } catch (error) {
                console.error('Error fetching media items:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMediaItems();
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (date) => {
        setFormData(prev => ({ ...prev, date }));
    };

    const handleTimeChange = (time) => {
        setFormData(prev => ({ ...prev, time }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.url.trim()) newErrors.url = 'URL is required';
        if (!formData.date) newErrors.date = 'Date is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        setSubmitStatus({ success: false, message: '' });

        try {
            const payload = {
                url: formData.url,
                date: format(formData.date, 'dd-MM-yyyy'),
                time: formData.time ? format(formData.time, 'h:mm a') : ''
            };

            const endpoint = currentItem
                ? `https://kotta-neelima.onrender.com/api/media/update/post/${currentItem._id}`
                : 'https://kotta-neelima.onrender.com/api/media/post';

            const method = currentItem ? 'put' : 'post';

            await axios[method](endpoint, payload, {
                headers: { 'Content-Type': 'application/json' }
            });

            setSubmitStatus({
                success: true,
                message: `Media item ${currentItem ? 'updated' : 'created'} successfully!`
            });
            setSubmitSuccess(true);
            setTimeout(() => setSubmitSuccess(false), 3000);

            // Refresh media items
            setIsLoading(true);
            const response = await axios.get('https://kotta-neelima.onrender.com/api/media/post');
            setMediaItems(response.data.media || []);
            setIsLoading(false);

            // Reset form after both create and update
            resetForm();
        } catch (error) {
            console.error('Error:', error);
            setSubmitStatus({
                success: false,
                message: `Failed to ${currentItem ? 'update' : 'create'} media item. Please try again.`
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (item) => {
        setCurrentItem(item);
        setFormData({
            url: item.url,
            date: new Date(item.date),
            time: item.time ? new Date(`1970-01-01T${item.time}`) : null
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
            await axios.delete(`https://kotta-neelima.onrender.com/api/media/delete/post/${currentItem._id}`);
            setMediaItems(mediaItems.filter(item => item._id !== currentItem._id));
            setDeleteModalOpen(false);
            setSubmitStatus({
                success: true,
                message: 'Media item deleted successfully!'
            });
            setSubmitSuccess(true);
            setTimeout(() => setSubmitSuccess(false), 3000);
            resetForm();
        } catch (error) {
            console.error('Error deleting item:', error);
            setSubmitStatus({
                success: false,
                message: 'Failed to delete media item. Please try again.'
            });
        }
    };

    const handleClearForm = () => {
        if (formData.url || formData.date) {
            if (window.confirm('Are you sure you want to clear the form?')) {
                resetForm();
            }
        }
    };

    // Pagination logic
    const paginatedItems = mediaItems.slice(
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
                                {currentItem ? 'Updated successfully!' : 'Created successfully!'}
                            </Typography>
                        </Box>
                    )}

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h5" component="h2" sx={{ fontWeight: 600, color: '#212b36' }}>
                            {currentItem ? 'Edit Media Item' : 'Add New Media Item'}
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
                        <Grid item xs={12}>
                            <Box component="form" onSubmit={handleSubmit} noValidate>
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="URL *"
                                    name="url"
                                    value={formData.url}
                                    onChange={handleInputChange}
                                    error={!!errors.url}
                                    helperText={errors.url}
                                    sx={{ mb: 2 }}
                                    placeholder="https://example.com/media"
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
                                        {isSubmitting ? 'Processing...' : currentItem ? 'Update' : 'Create'}
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

                {/* Media Items Table */}
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
                        Media Items
                    </Typography>

                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#f4f6f8' }}>
                                    <TableCell sx={{ fontWeight: 600 }}>Thumbnail</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Time</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center">
                                            <CircularProgress />
                                        </TableCell>
                                    </TableRow>
                                ) : paginatedItems.length > 0 ? (
                                    paginatedItems.map((item) => (
                                        <TableRow key={item._id} hover>
                                            <TableCell>
                                                {item.thumbnail ? (
                                                    <Box
                                                        component="img"
                                                        src={item.thumbnail}
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
                                            <TableCell>{item.time || '-'}</TableCell>
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
                                        <TableCell colSpan={4} align="center">
                                            No media items found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {mediaItems.length > itemsPerPage && (
                        <Stack spacing={2} sx={{ mt: 3, alignItems: 'center' }}>
                            <Pagination
                                count={Math.ceil(mediaItems.length / itemsPerPage)}
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
                            Are you sure you want to delete this media item?
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

export default Media;