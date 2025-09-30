import React, { useState, useEffect } from 'react';
import {
    Box, Snackbar, Alert, Chip,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import ArticleForm from './ArticleForm';
import ArticleTable from './ArticleTable';
import * as articleService from '../../../api/articleService';
import * as homepageService from '../../../api/homepageService';


const Article = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: null,
        url: '',
        pdf: null,
    });
    const [currentItem, setCurrentItem] = useState(null);
    const [articleItems, setArticleItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [confirmDialog, setConfirmDialog] = useState({ open: false });
    const [saving, setSaving] = useState(false);

    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        fetchArticleItems();
        fetchHomepageArticleItems();
    }, []);

    const fetchArticleItems = async () => {
        setLoading(true);
        try {
            const { data } = await articleService.getArticleItems();
            setArticleItems(data || []);
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    const fetchHomepageArticleItems = async () => {
        try {
            const response = await homepageService.getHomepageArticle();
            if (response.success && response.data && response.data.galleryItems) {
                const homepageItemIds = response.data.galleryItems.map(item => item._id);
                setSelectedItems(homepageItemIds);
            }
        } catch (error) {
            console.error('Error fetching homepage gallery items:', error);
        }
    };

    const handleSelectionChange = (newSelectedItems) => {
        if (newSelectedItems.length > 2) {
            showSnackbar('Maximum 2 items can be selected for homepage', 'info');
            return;
        }
        setSelectedItems(newSelectedItems);
    };

    const handleSetHomepageArticle = async () => {
        setSaving(true);
        try {
            await homepageService.setHomepageArticle(selectedItems);
            showSnackbar('Homepage article updated successfully');
            setConfirmDialog({ open: false });
        } catch (error) {
            showSnackbar('Error updating homepage article', 'error');
        } finally {
            setSaving(false);
        }
    };

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (currentItem) {
                await articleService.updateArticleItem(currentItem._id, formData);
            } else {
                await articleService.createArticleItem(formData);
            }
            await fetchArticleItems();
            resetForm();
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        setLoading(true);
        try {
            await articleService.deleteArticleItem(id);
            await fetchArticleItems();
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            date: null,
            url: '',
            pdf: null,
        });
        setCurrentItem(null);
    };

    return (
        <Box sx={{ width: '100%', p: 3 }}>
            <ArticleForm
                formData={formData}
                currentItem={currentItem}
                loading={loading}
                onChange={setFormData}
                onSubmit={handleSubmit}
                onReset={resetForm}
                onAddNew={() => {
                    resetForm();
                    setCurrentItem(null);
                }}
            />

            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
                p: 1.5,
                backgroundColor: 'grey.50',
                borderRadius: 1
            }}>
                <Box>
                    <Chip
                        label={`${selectedItems.length}/2 selected`}
                        color={selectedItems.length > 0 ? "primary" : "default"}
                        variant={selectedItems.length > 0 ? "filled" : "outlined"}
                    />
                    {selectedItems.length > 0 && (
                        <Button
                            size="small"
                            color="secondary"
                            onClick={() => setSelectedItems([])}
                            sx={{ ml: 1 }}
                        >
                            Clear Selection
                        </Button>
                    )}
                </Box>

                <Button
                    variant="contained"
                    disabled={selectedItems.length === 0}
                    onClick={() => setConfirmDialog({
                        open: true,
                        title: "Set as Homepage Article",
                        message: `Are you sure you want to set ${selectedItems.length} article(s) as the homepage article? These articles will be displayed on your website's landing page.`
                    })}
                    sx={{
                        backgroundColor: '#76030F',
                        '&:hover': { backgroundColor: '#5a020c' }
                    }}
                >
                    Set as Homepage Article
                </Button>
            </Box>

            <ArticleTable
                data={articleItems.slice((page - 1) * itemsPerPage, page * itemsPerPage)}
                loading={loading}
                totalItems={articleItems.length}
                page={page}
                itemsPerPage={itemsPerPage}
                onPageChange={(_, value) => setPage(value)}
                onEdit={(item) => {
                    setCurrentItem(item);
                    setFormData({
                        title: item.title,
                        description: item.description || '',
                        date: item.date, // Keep raw API value
                        url: item.url || '',
                        pdf: item.pdfUrl || null,
                    });
                }}

                onDelete={(item) => handleDelete(item._id)}
                selectedItems={selectedItems}
                onSelectionChange={handleSelectionChange}
            />

            {/* Confirmation Dialog */}
            <Dialog
                open={confirmDialog.open}
                onClose={() => setConfirmDialog({ open: false })}
            >
                <DialogTitle>{confirmDialog.title}</DialogTitle>
                <DialogContent>
                    {confirmDialog.message}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDialog({ open: false })}>Cancel</Button>
                    <Button
                        onClick={handleSetHomepageArticle}
                        variant="contained"
                        disabled={saving}
                        sx={{
                            backgroundColor: '#76030F',
                            '&:hover': { backgroundColor: '#5a020c' }
                        }}
                    >
                        {saving ? 'Setting...' : 'Confirm'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>

        </Box>
    );
};

export default Article;