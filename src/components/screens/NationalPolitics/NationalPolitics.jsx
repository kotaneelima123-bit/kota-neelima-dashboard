import React, { useState, useEffect } from 'react';
import {
    Box,
    Tabs,
    Tab,
    Snackbar,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Chip
} from '@mui/material';
import CategoryManager from './CategoryManager';
import PostManager from './PostManager';
import * as nationalPoliticsService from '../../../api/nationalPoliticsService';

const NationalPolitics = () => {
    const [tabValue, setTabValue] = useState(0);
    const [categories, setCategories] = useState([]);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [confirmDialog, setConfirmDialog] = useState({ open: false });

    useEffect(() => {
        fetchCategories();
        fetchPosts();
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await nationalPoliticsService.getCategories();
            setCategories(data || []);
        } catch (error) {
            showSnackbar('Error fetching categories', 'error');
        }
    };

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const data = await nationalPoliticsService.getPosts();
            setPosts(data || []);
        } catch (error) {
            showSnackbar('Error fetching posts', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCategory = async (categoryName) => {
        try {
            await nationalPoliticsService.createCategory({ name: categoryName });
            await fetchCategories();
            showSnackbar('Category created successfully');
            return true;
        } catch (error) {
            showSnackbar('Error creating category', 'error');
            return false;
        }
    };

    const handleDeleteCategory = async (categoryId) => {
        try {
            await nationalPoliticsService.deleteCategory(categoryId);
            await fetchCategories();
            showSnackbar('Category deleted successfully');
        } catch (error) {
            showSnackbar('Error deleting category', 'error');
        }
    };

    const handleCreatePost = async (postData) => {
        try {
            await nationalPoliticsService.createPost(postData);
            await fetchPosts();
            showSnackbar('Post created successfully');
            return true;
        } catch (error) {
            showSnackbar('Error creating post', 'error');
            return false;
        }
    };

    const handleUpdatePost = async (postId, postData) => {
        try {
            await nationalPoliticsService.updatePost(postId, postData);
            await fetchPosts();
            showSnackbar('Post updated successfully');
            return true;
        } catch (error) {
            showSnackbar('Error updating post', 'error');
            return false;
        }
    };

    const handleDeletePost = async (postId) => {
        try {
            await nationalPoliticsService.deletePost(postId);
            await fetchPosts();
            showSnackbar('Post deleted successfully');
        } catch (error) {
            showSnackbar('Error deleting post', 'error');
        }
    };

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <Box sx={{ width: '100%', p: 3 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={tabValue} onChange={handleTabChange}>
                    <Tab label="Posts" />
                    <Tab label="Categories" />
                </Tabs>
            </Box>

            {tabValue === 0 && (
                <PostManager
                    posts={posts}
                    categories={categories}
                    loading={loading}
                    onCreatePost={handleCreatePost}
                    onUpdatePost={handleUpdatePost}
                    onDeletePost={handleDeletePost}
                    onRefresh={fetchPosts}
                />
            )}

            {tabValue === 1 && (
                <CategoryManager
                    categories={categories}
                    onCreateCategory={handleCreateCategory}
                    onDeleteCategory={handleDeleteCategory}
                />
            )}

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

export default NationalPolitics;