import React from 'react';
import CRUDTable from '../../common/CRUDTable';
import { Avatar, Box, Checkbox, Tooltip, Chip } from '@mui/material';
import { Star } from '@mui/icons-material';

const GalleryTable = ({
    data,
    loading,
    totalItems,
    page,
    itemsPerPage,
    categories,
    onPageChange,
    onEdit,
    onDelete,
    selectedItems,
    onSelectionChange
}) => {
    // const getCategoryName = (categoryId) => {
    //     if (!categoryId) return 'No Category';
    //     const category = categories.find(cat => cat._id === categoryId);
    //     return category ? category.name : 'Unknown Category';
    // };

    const columns = [
        {
            field: 'selection',
            headerName: 'Select for Homepage',
            render: (item) => (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Checkbox
                        checked={selectedItems.includes(item._id)}
                        onChange={(e) => {
                            const newSelectedItems = e.target.checked
                                ? [...selectedItems, item._id]
                                : selectedItems.filter(id => id !== item._id);
                            onSelectionChange(newSelectedItems);
                        }}
                        disabled={selectedItems.length >= 6 && !selectedItems.includes(item._id)}
                    />
                    {selectedItems.includes(item._id) && (
                        <Tooltip title="Selected for homepage gallery">
                            <Star color="primary" sx={{ fontSize: 18 }} />
                        </Tooltip>
                    )}
                </Box>
            ),
        },
        {
            field: 'image',
            headerName: 'Image Preview',
            render: (item) => (
                <Box sx={{ width: 80, height: 80, position: 'relative' }}>
                    {item.image ? (
                        <img
                            src={item.image}
                            alt={item.title || 'Gallery image'}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                borderRadius: '4px'
                            }}
                        />
                    ) : (
                        <Avatar variant="rounded" sx={{ width: 80, height: 80 }}>
                            No Image
                        </Avatar>
                    )}
                    {selectedItems.includes(item._id) && (
                        <Chip
                            label="Homepage"
                            size="small"
                            color="primary"
                            sx={{
                                position: 'absolute',
                                top: 4,
                                right: 4,
                                height: 20,
                                fontSize: '0.7rem',
                                fontWeight: 'bold'
                            }}
                        />
                    )}
                </Box>
            ),
        },
        {
            field: 'title',
            headerName: 'Title',
            render: (item) => (
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    maxWidth: 200,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                }}>
                    {item.title}
                    {selectedItems.includes(item._id) && (
                        <Tooltip title="On homepage">
                            <Star color="primary" sx={{ fontSize: 16, ml: 1, flexShrink: 0 }} />
                        </Tooltip>
                    )}
                </Box>
            )
        },
        {
            field: 'category',
            headerName: 'Category',
            render: (item) => (
                <Chip
                    label={item.category?.name || 'No Category'}
                    variant={item.category ? "filled" : "outlined"}
                    color={item.category ? "primary" : "default"}
                    size="small"
                />
            )
        },
        {
            field: 'date',
            headerName: 'Date',
            render: (item) => item.date || 'No date'
        },
        {
            field: 'time',
            headerName: 'Time',
            render: (item) => item.time || 'No time'
        },
    ];

    return (
        <CRUDTable
            columns={columns}
            data={data}
            loading={loading}
            page={page}
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
            onPageChange={onPageChange}
            onEdit={onEdit}
            onDelete={onDelete}
        />
    );
};

export default GalleryTable;