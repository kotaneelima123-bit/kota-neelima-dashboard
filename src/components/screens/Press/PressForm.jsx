import React from 'react';
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
    Snackbar,
    Alert,
    Paper as MuiPaper,
    IconButton as MuiIconButton,
    AlertTitle
} from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Add as AddIcon, Close as CloseIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { format, parse } from 'date-fns';

const PressForm = ({
    formData,
    currentItem,
    loading,
    onChange,
    onSubmit,
    onReset,
    onAddNew,
}) => {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        onChange({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            onChange({ ...formData, image: e.target.files[0] });
        }
    };

    const removeImage = () => {
        onChange({ ...formData, image: null });
    };

    const imagePreview = formData.image
        ? typeof formData.image === 'string'
            ? formData.image
            : URL.createObjectURL(formData.image)
        : null;

    // Add these conversion functions
    const parseApiDate = (dateString) => {
        if (!dateString) return null;
        // Adjust the format to match your API's date format (e.g., 'dd-MM-yyyy')
        return parse(dateString, 'dd-MM-yyyy', new Date());
    };

    const parseApiTime = (timeString) => {
        if (!timeString) return null;
        // Adjust the format to match your API's time format (e.g., 'hh:mm a')
        return parse(timeString, 'hh:mm a', new Date());
    };

    const formatForApi = (date, formatStr) => {
        if (!date) return '';
        return format(date, formatStr);
    };

    // Update your handleDateChange and handleTimeChange
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
                        {currentItem ? 'Edit Press Item' : 'Add New Press Item'}
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

export default PressForm;