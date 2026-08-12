import React, { useRef } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    Grid,
    CircularProgress,
    IconButton,
} from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, parse } from 'date-fns';
import { Add as AddIcon, Close as CloseIcon, CheckCircle as CheckCircleIcon, UploadFile as UploadFileIcon } from '@mui/icons-material';


const PressReleaseForm = ({
    formData,
    currentItem,
    loading,
    onChange,
    onSubmit,
    onReset,
    onAddNew,
    onPdfChange,
    pdfFile,
}) => {
    const pdfInputRef = useRef(null);
    // Date conversion functions
    // const parseApiDate = (dateString) => {
    //     if (!dateString) return null;
    //     return parse(dateString, 'dd-MM-yyyy', new Date());
    // };

    // const parseApiTime = (timeString) => {
    //     if (!timeString) return null;
    //     return parse(timeString, 'hh:mm a', new Date());
    // };

    // const formatForApi = (date, formatStr) => {
    //     if (!date) return '';
    //     return format(date, formatStr);
    // };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        onChange({ ...formData, [name]: value });
    };

    const handlePdfSelect = (e) => {
        const file = e.target.files[0] || null;
        onPdfChange(file);
        // reset input so selecting same file again triggers change
        e.target.value = '';
    };

    const handleRemovePdf = () => {
        onPdfChange(null);
    };

    // const handleDateChange = (date) => {
    //     onChange({
    //         ...formData,
    //         date: date ? formatForApi(date, 'dd-MM-yyyy') : ''
    //     });
    // };

    // const handleTimeChange = (time) => {
    //     onChange({
    //         ...formData,
    //         time: time ? formatForApi(time, 'hh:mm a') : ''
    //     });
    // };

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

                            {/* PDF Upload (optional) */}
                            <input
                                ref={pdfInputRef}
                                type="file"
                                accept="application/pdf"
                                style={{ display: 'none' }}
                                onChange={handlePdfSelect}
                            />
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                                    PDF File (optional)
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Button
                                        variant="outlined"
                                        startIcon={<UploadFileIcon />}
                                        onClick={() => pdfInputRef.current.click()}
                                        size="small"
                                    >
                                        {pdfFile ? 'Change PDF' : 'Upload PDF'}
                                    </Button>
                                    {pdfFile && (
                                        <>
                                            <Typography variant="body2" sx={{ color: 'text.primary', maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {pdfFile.name}
                                            </Typography>
                                            <IconButton size="small" onClick={handleRemovePdf} aria-label="Remove PDF">
                                                <CloseIcon fontSize="small" />
                                            </IconButton>
                                        </>
                                    )}
                                    {!pdfFile && currentItem?.pdf && (
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            Current: <a href={currentItem.pdf} target="_blank" rel="noopener noreferrer">View PDF</a>
                                        </Typography>
                                    )}
                                </Box>
                            </Box>

                            {/* <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                <DatePicker
                                    label="Date"
                                    value={formData.date ? parseApiDate(formData.date) : null}
                                    onChange={handleDateChange}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            fullWidth
                                        />
                                    )}
                                />

                                <TimePicker
                                    label="Time"
                                    value={formData.time ? parseApiTime(formData.time) : null}
                                    onChange={handleTimeChange}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            fullWidth
                                        />
                                    )}
                                />
                            </Box> */}

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
                                    {loading ? 'Processing...' : currentItem ? 'Update' : 'Create'}
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

export default PressReleaseForm;