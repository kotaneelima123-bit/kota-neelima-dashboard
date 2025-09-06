import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Button,
    Typography,
    MenuItem
} from '@mui/material';
import { Add } from '@mui/icons-material';
import PostForm from './PostForm';
import PostTable from './PostTable';

const PostManager = ({ posts, categories, loading, onCreatePost, onUpdatePost, onDeletePost, onRefresh }) => {
    const [formOpen, setFormOpen] = useState(false);
    const [currentPost, setCurrentPost] = useState(null);
    const [formLoading, setFormLoading] = useState(false);

    const handleCreatePost = async (postData) => {
        setFormLoading(true);
        const success = await onCreatePost(postData);
        if (success) {
            setFormOpen(false);
        }
        setFormLoading(false);
    };

    const handleUpdatePost = async (postId, postData) => {
        setFormLoading(true);
        const success = await onUpdatePost(postId, postData);
        if (success) {
            setFormOpen(false);
            setCurrentPost(null);
        }
        setFormLoading(false);
    };

    const handleEditPost = (post) => {
        setCurrentPost(post);
        setFormOpen(true);
    };

    const handleFormClose = () => {
        setFormOpen(false);
        setCurrentPost(null);
    };

    const handleDeletePost = (postId) => {
        onDeletePost(postId);
    };

    return (
        <Box>
            <Card sx={{ mb: 3 }}>
                <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">
                        Posts ({posts.length})
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => setFormOpen(true)}
                        disabled={categories.length === 0}
                    >
                        Add New Post
                    </Button>
                </CardContent>
                {categories.length === 0 && (
                    <CardContent sx={{ backgroundColor: 'warning.light', py: 2 }}>
                        <Typography variant="body2" color="warning.dark">
                            You need to create at least one category before adding posts.
                        </Typography>
                    </CardContent>
                )}
            </Card>

            <PostTable
                data={posts}
                loading={loading}
                onEdit={handleEditPost}
                // onDelete={handleDeletePost}
                onDelete={(item) => handleDeletePost(item._id)}
                onRefresh={onRefresh}
            />

            <PostForm
                open={formOpen}
                onClose={handleFormClose}
                post={currentPost}
                categories={categories}
                loading={formLoading}
                onSubmit={currentPost ?
                    (data) => handleUpdatePost(currentPost._id, data) :
                    handleCreatePost
                }
            />
        </Box>
    );
};

export default PostManager;