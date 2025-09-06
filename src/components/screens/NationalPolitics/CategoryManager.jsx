import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Typography,
    Divider
} from '@mui/material';
import { Delete, Add } from '@mui/icons-material';

const CategoryManager = ({ categories, onCreateCategory, onDeleteCategory }) => {
    const [newCategoryName, setNewCategoryName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCreateCategory = async () => {
        if (!newCategoryName.trim()) return;

        setLoading(true);
        const success = await onCreateCategory(newCategoryName.trim());
        if (success) {
            setNewCategoryName('');
        }
        setLoading(false);
    };

    return (
        <Box>
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Add New Category
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                        <TextField
                            label="Category Name"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            fullWidth
                            size="small"
                            disabled={loading}
                        />
                        <Button
                            variant="contained"
                            onClick={handleCreateCategory}
                            disabled={!newCategoryName.trim() || loading}
                            startIcon={<Add />}
                            sx={{ minWidth: 'auto' }}
                        >
                            Add
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Existing Categories ({categories.length})
                    </Typography>
                    {categories.length === 0 ? (
                        <Typography color="textSecondary" sx={{ py: 2, textAlign: 'center' }}>
                            No categories found. Create your first category above.
                        </Typography>
                    ) : (
                        <List>
                            {categories.map((category, index) => (
                                <Box key={category._id}>
                                    <ListItem>
                                        <ListItemText
                                            primary={category.name}
                                            secondary={`ID: ${category._id}`}
                                        />
                                        <ListItemSecondaryAction>
                                            <IconButton
                                                edge="end"
                                                aria-label="delete"
                                                onClick={() => onDeleteCategory(category._id)}
                                                disabled={loading}
                                            >
                                                <Delete />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                    {index < categories.length - 1 && <Divider />}
                                </Box>
                            ))}
                        </List>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

export default CategoryManager;