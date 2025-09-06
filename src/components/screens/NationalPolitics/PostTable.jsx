import React, { useState } from 'react';
import {
    Box,
    IconButton,
    Menu,
    MenuItem,
    Chip,
    Avatar,
    Typography
} from '@mui/material';
import { MoreVert, Edit, Delete, Refresh } from '@mui/icons-material';
import CRUDTable from '../../common/CRUDTable';
import { format } from 'date-fns';

const PostTable = ({ data, loading, onEdit, onDelete, onRefresh }) => {
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
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    {item.title}
                </Typography>
            )
        },
        {
            field: 'category',
            headerName: 'Category',
            render: (item) => (
                <Chip
                    label={item.category?.name || 'Uncategorized'}
                    size="small"
                    variant="outlined"
                />
            )
        },
        {
            field: 'date',
            headerName: 'Date',
            render: (item) => item.date ? format(new Date(item.date), 'dd MMM yyyy') : 'No date'
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
                onEdit={onEdit}
                onDelete={onDelete}
            />
        </Box>
    );
};

export default PostTable;