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
    Alert
} from '@mui/material';
import { Close as CloseIcon, Info as InfoIcon } from '@mui/icons-material';

const BioForm = ({
    formData,
    bioData,
    loading,
    onChange,
    onSubmit,
    onReset,
    hasExistingBio
}) => {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        onChange({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            onChange({ ...formData, profileImage: e.target.files[0] });
        }
    };

    const removeImage = () => {
        onChange({ ...formData, profileImage: null });
    };

    const imagePreview = formData.profileImage
        ? typeof formData.profileImage === 'string'
            ? formData.profileImage
            : URL.createObjectURL(formData.profileImage)
        : null;

    return (
        <Paper elevation={0} sx={{
            p: 3,
            mb: 3,
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid',
            borderColor: 'grey.200'
        }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                    <Typography variant="h5" component="h2" sx={{ fontWeight: 600, color: '#212b36', mb: 1 }}>
                        {bioData ? 'Edit Bio' : 'Create Bio'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {hasExistingBio
                            ? 'You can only have one bio. Edit your existing bio below.'
                            : 'Create your profile bio with multilingual support.'
                        }
                    </Typography>
                </Box>
            </Box>

            {hasExistingBio && !bioData && (
                <Alert severity="info" sx={{ mb: 3 }} icon={<InfoIcon />}>
                    You already have a bio. You can edit it from the table below.
                </Alert>
            )}

            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <FormControl fullWidth margin="normal">
                        <FormLabel component="legend" sx={{ mb: 1, fontWeight: 500 }}>Profile Image</FormLabel>

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
                                    backgroundColor: '#f4f6f8',
                                    color: 'text.secondary'
                                }}
                            >
                                Upload Image
                            </Avatar>
                        )}

                        <Button
                            variant="outlined"
                            component="label"
                            fullWidth
                            sx={{
                                borderColor: 'grey.300',
                                color: 'text.primary',
                                '&:hover': {
                                    borderColor: 'grey.400',
                                    backgroundColor: 'grey.50'
                                }
                            }}
                        >
                            {formData.profileImage ?
                                (typeof formData.profileImage === 'string' ? 'Change Image' : formData.profileImage.name) :
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
                            label="Designation"
                            name="designation"
                            value={formData.designation}
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
                            rows={3}
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            fullWidth
                            margin="normal"
                            label="Hindi Description"
                            name="descriptionHindi"
                            value={formData.descriptionHindi}
                            onChange={handleInputChange}
                            multiline
                            rows={2}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">हिंदी</InputAdornment>,
                            }}
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            fullWidth
                            margin="normal"
                            label="Telugu Description"
                            name="descriptionTelugu"
                            value={formData.descriptionTelugu}
                            onChange={handleInputChange}
                            multiline
                            rows={2}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">తెలుగు</InputAdornment>,
                            }}
                            sx={{ mb: 2 }}
                        />

                        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{
                                    backgroundColor: '#76030F',
                                    '&:hover': { backgroundColor: '#5a020c' },
                                    minWidth: 120
                                }}
                                disabled={loading || (hasExistingBio && !bioData)}
                                startIcon={loading ? <CircularProgress size={20} /> : null}
                            >
                                {loading ? 'Processing...' : bioData ? 'Update' : 'Create'}
                            </Button>
                            {!bioData && (
                                <Button
                                    variant="outlined"
                                    onClick={onReset}
                                    disabled={loading}
                                    sx={{
                                        borderColor: 'grey.300',
                                        color: 'text.primary',
                                        '&:hover': {
                                            borderColor: 'grey.400',
                                            backgroundColor: 'grey.50'
                                        }
                                    }}
                                >
                                    Clear
                                </Button>
                            )}
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default BioForm;