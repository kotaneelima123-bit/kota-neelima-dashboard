import React, { useState } from 'react';
import {
    Box,
    IconButton,
    Menu,
    MenuItem,
    Avatar,
    Typography,
    Chip,
    Tooltip,
    Alert,
    Switch,
    FormControlLabel
} from '@mui/material';
import { MoreVert, Edit, Delete, Refresh, Star, StarBorder } from '@mui/icons-material';
import CRUDTable from '../../common/CRUDTable';
import { format } from 'date-fns';

const TodayEventTable = ({ data, loading, onEdit, onDelete, onRefresh, onToggleFeatured }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [processingFeatured, setProcessingFeatured] = useState(false);

    const handleMenuOpen = (event, item) => {
        setAnchorEl(event.currentTarget);
        setSelectedItem(item);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedItem(null);
    };

    const handleEdit = () => {
        onEdit(selectedItem);
        handleMenuClose();
    };

    const handleDelete = () => {
        onDelete(selectedItem._id);
        handleMenuClose();
    };

    const handleToggleFeatured = async () => {
        if (selectedItem) {
            setProcessingFeatured(true);
            await onToggleFeatured(selectedItem._id, selectedItem.featured, selectedItem.status);
            setProcessingFeatured(false);
            handleMenuClose();
        }
    };

    const handleSwitchToggle = async (item) => {
        setSelectedItem(item);
        setProcessingFeatured(true);
        await onToggleFeatured(item._id, item.featured, item.status);
        setProcessingFeatured(false);
    };

    const columns = [
        {
            field: 'image',
            headerName: 'Image',
            render: (item) => (
                <Box sx={{ width: 60, height: 60 }}>
                    {item.image ? (
                        <img
                            src={item.image}
                            alt={item.title}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                borderRadius: '4px'
                            }}
                        />
                    ) : (
                        <Avatar variant="rounded" sx={{ width: 60, height: 60 }}>
                            No Image
                        </Avatar>
                    )}
                </Box>
            ),
        },
        {
            field: 'title',
            headerName: 'Title',
            render: (item) => (
                <Box>
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {item.title}
                        {item.featured && (
                            <Star color="warning" sx={{ fontSize: 16, ml: 0.5, verticalAlign: 'text-bottom' }} />
                        )}
                    </Typography>
                    {item.date && (
                        <Typography variant="caption" color="text.secondary">
                            {format(new Date(item.date), 'dd MMM yyyy')}
                        </Typography>
                    )}
                </Box>
            )
        },
        {
            field: 'description',
            headerName: 'Description',
            render: (item) => (
                <Typography
                    variant="body2"
                    sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                    }}
                >
                    {item.description}
                </Typography>
            )
        },
        {
            field: 'status',
            headerName: 'Status',
            render: (item) => (
                <Chip
                    label={item.status || 'inactive'}
                    color={item.status === 'active' ? 'success' : 'default'}
                    size="small"
                />
            )
        },
        {
            field: 'featured',
            headerName: 'Featured',
            render: (item) => (
                <Tooltip title={item.featured ? 'Featured post' : 'Set as featured'}>
                    <Box>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={item.featured || false}
                                    onChange={() => handleSwitchToggle(item)}
                                    disabled={processingFeatured || loading || item.status !== 'active'}
                                    color="warning"
                                />
                            }
                            label={item.featured ? "Featured" : "Feature"}
                            labelPlacement="start"
                        />
                    </Box>
                </Tooltip>
            )
        },
        {
            field: 'actions',
            headerName: 'Actions',
            render: (item) => (
                <Box>
                    <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, item)}
                        disabled={loading}
                    >
                        <MoreVert />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl && selectedItem && selectedItem._id === item._id)}
                        onClose={handleMenuClose}
                    >
                        <MenuItem onClick={handleEdit}>
                            <Edit fontSize="small" sx={{ mr: 1 }} />
                            Edit
                        </MenuItem>
                        <MenuItem
                            onClick={handleToggleFeatured}
                            disabled={processingFeatured || selectedItem?.status !== 'active'}
                        >
                            {selectedItem?.featured ? (
                                <>
                                    <StarBorder fontSize="small" sx={{ mr: 1 }} />
                                    Unfeature
                                </>
                            ) : (
                                <>
                                    <Star fontSize="small" sx={{ mr: 1 }} />
                                    Set as Featured
                                </>
                            )}
                        </MenuItem>
                        <MenuItem onClick={handleDelete}>
                            <Delete fontSize="small" sx={{ mr: 1 }} />
                            Delete
                        </MenuItem>
                    </Menu>
                </Box>
            ),
        },
    ];

    // REMOVED: The warning about multiple featured events

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                <IconButton onClick={onRefresh} disabled={loading}>
                    <Refresh />
                </IconButton>
            </Box>

            <CRUDTable
                columns={columns}
                data={data}
                loading={loading}
                page={0}
                itemsPerPage={10}
                totalItems={data.length}
                onPageChange={() => { }}
            />
        </Box>
    );
};

export default TodayEventTable;