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
    Snackbar,
    Alert,
    Paper as MuiPaper,
    IconButton as MuiIconButton,
    AlertTitle
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Add as AddIcon, Close as CloseIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { format, parse } from 'date-fns';

const ArticleForm = ({
    formData,
    currentItem,
    loading,
    onChange,
    onSubmit,
    onReset,
    onAddNew,
}) => {

    const [pdfError, setPdfError] = useState('');
    const [pdfRequirements] = useState({
        maxSizeMB: 5, // 5MB max size for PDF
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        onChange({ ...formData, [name]: value });
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setPdfError('');

        // 1. Check if file is a PDF
        if (!file.type.includes('pdf')) {
            setPdfError('Please upload a PDF file');
            return;
        }

        // 2. Check file size
        if (file.size > pdfRequirements.maxSizeMB * 1024 * 1024) {
            setPdfError(`PDF must be less than ${pdfRequirements.maxSizeMB}MB`);
            return;
        }

        // All validations passed
        onChange({ ...formData, pdf: file });
    };

    const removePdf = () => {
        onChange({ ...formData, pdf: null });
    };

    // Add these conversion functions
    const parseApiDate = (dateString) => {
        if (!dateString) return null;
        // Adjust the format to match your API's date format (e.g., 'dd-MM-yyyy')
        return parse(dateString, 'dd-MM-yyyy', new Date());
    };

    const formatForApi = (date, formatStr) => {
        if (!date) return '';
        return format(date, formatStr);
    };

    // Update your handleDateChange
    const handleDateChange = (date) => {
        onChange({
            ...formData,
            date: date ? formatForApi(date, 'dd-MM-yyyy') : ''
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
                        {currentItem ? 'Edit Article Item' : 'Add New Article Item'}
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
                    <Grid item xs={12}>
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
                                label="Description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                multiline
                                rows={4}
                                sx={{ mb: 2 }}
                            />

                            <TextField
                                fullWidth
                                margin="normal"
                                label="URL"
                                name="url"
                                value={formData.url}
                                onChange={handleInputChange}
                                sx={{ mb: 2 }}
                            />

                            <DatePicker
                                label="Date"
                                value={formData.date ? parseApiDate(formData.date) : null}
                                onChange={handleDateChange}
                                renderInput={(params) => (
                                    <TextField {...params} fullWidth sx={{ mb: 2 }} />
                                )}
                            />

                            <FormControl fullWidth margin="normal">
                                <FormLabel component="legend" sx={{ mb: 1 }}>PDF File</FormLabel>

                                {formData.pdf ? (
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Typography variant="body2" sx={{ mr: 2 }}>
                                            {typeof formData.pdf === 'string' ? 'PDF attached' : formData.pdf.name}
                                        </Typography>
                                        <IconButton
                                            onClick={removePdf}
                                            size="small"
                                        >
                                            <CloseIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                ) : (
                                    <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                                        No PDF attached
                                    </Typography>
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
                                    {formData.pdf ? 'Change PDF' : 'Upload PDF'}
                                    <input
                                        type="file"
                                        hidden
                                        accept=".pdf,application/pdf"
                                        onChange={handleFileChange}
                                    />
                                </Button>
                                {pdfError && (
                                    <Alert severity="error" sx={{ mt: 1 }}>
                                        {pdfError}
                                    </Alert>
                                )}
                            </FormControl>

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

export default ArticleForm;