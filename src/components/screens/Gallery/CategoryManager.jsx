import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    Chip,
    Alert
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import * as galleryCategoryService from '../../../api/galleryCategoryService';

const CategoryManager = ({ categories, onCategoryUpdate }) => {
    const [loading, setLoading] = useState(false);
    const [categoryForm, setCategoryForm] = useState({ name: '' });
    const [editingCategory, setEditingCategory] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!categoryForm.name.trim()) {
            setError('Category name is required');
            return;
        }

        setLoading(true);
        setError('');

        try {
            if (editingCategory) {
                await galleryCategoryService.updateGalleryCategory(editingCategory._id, categoryForm);
            } else {
                await galleryCategoryService.createGalleryCategory(categoryForm);
            }

            onCategoryUpdate();
            resetForm();
            setDialogOpen(false);
        } catch (error) {
            setError('Error saving category');
            console.error('Error saving category:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!categoryToDelete) return;

        setLoading(true);
        try {
            await galleryCategoryService.deleteGalleryCategory(categoryToDelete._id);
            onCategoryUpdate();
            setDeleteDialogOpen(false);
            setCategoryToDelete(null);
        } catch (error) {
            setError('Error deleting category');
            console.error('Error deleting category:', error);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setCategoryForm({ name: '' });
        setEditingCategory(null);
        setError('');
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setCategoryForm({ name: category.name });
        setDialogOpen(true);
    };

    const handleAddNew = () => {
        resetForm();
        setDialogOpen(true);
    };

    return (
        <Box>
            <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'white', borderRadius: '8px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" component="h2" sx={{ fontWeight: 600, color: '#212b36' }}>
                        Category Management
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleAddNew}
                        sx={{
                            backgroundColor: '#76030F',
                            '&:hover': { backgroundColor: '#5a020c' }
                        }}
                    >
                        Add Category
                    </Button>
                </Box>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 600 }}>Category Name</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {categories.map((category) => (
                                <TableRow key={category._id}>
                                    <TableCell>
                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                            {category.name}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label="Active"
                                            color="success"
                                            variant="outlined"
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            onClick={() => handleEdit(category)}
                                            sx={{ color: '#76030F' }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => {
                                                setCategoryToDelete(category);
                                                setDeleteDialogOpen(true);
                                            }}
                                            sx={{ color: '#d32f2f' }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {categories.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="body1" color="textSecondary">
                            No categories found. Create your first category to get started.
                        </Typography>
                    </Box>
                )}
            </Paper>

            {/* Add/Edit Category Dialog */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editingCategory ? 'Edit Category' : 'Add New Category'}
                </DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}
                        <TextField
                            autoFocus
                            label="Category Name"
                            fullWidth
                            variant="outlined"
                            value={categoryForm.name}
                            onChange={(e) => setCategoryForm({ name: e.target.value })}
                            placeholder="Enter category name"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={loading}
                            sx={{
                                backgroundColor: '#76030F',
                                '&:hover': { backgroundColor: '#5a020c' }
                            }}
                        >
                            {loading ? <CircularProgress size={24} /> : editingCategory ? 'Update' : 'Create'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Delete Category</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete the category "{categoryToDelete?.name}"?
                        This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button
                        onClick={handleDelete}
                        variant="contained"
                        disabled={loading}
                        sx={{
                            backgroundColor: '#d32f2f',
                            '&:hover': { backgroundColor: '#c62828' }
                        }}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CategoryManager;