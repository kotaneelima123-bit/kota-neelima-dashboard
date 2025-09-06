import React, { useState } from 'react';
import {
    Box,
    IconButton,
    Menu,
    MenuItem,
    Avatar,
    Typography
} from '@mui/material';
import { MoreVert, Edit, Delete, Refresh } from '@mui/icons-material';
import CRUDTable from '../../common/CRUDTable';
import { format } from 'date-fns';

const TodayEventTable = ({ data, loading, onEdit, onDelete, onRefresh }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);

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
                        <MenuItem onClick={handleDelete}>
                            <Delete fontSize="small" sx={{ mr: 1 }} />
                            Delete
                        </MenuItem>
                    </Menu>
                </Box>
            ),
        },
    ];

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
                // onEdit={onEdit}
                // onDelete={onDelete}
            />
        </Box>
    );
};

export default TodayEventTable;