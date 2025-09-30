import React from 'react';
import CRUDTable from '../../common/CRUDTable';
import { Avatar, Box, Link, Typography, Checkbox, Tooltip, Chip } from '@mui/material';
import { Star } from '@mui/icons-material';

import { InsertDriveFile } from '@mui/icons-material';

const ArticleTable = ({ data, loading, totalItems, page, itemsPerPage, onPageChange, onEdit, onDelete, selectedItems,
    onSelectionChange }) => {
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
                        <Tooltip title="Selected for homepage article">
                            <Star color="primary" sx={{ fontSize: 18 }} />
                        </Tooltip>
                    )}
                </Box>
            ),
        },
        {
            field: 'title',
            headerName: 'Title',
            width: 200,
        },
        {
            field: 'description',
            headerName: 'Description',
            width: 300,
            render: (item) => (
                <Typography variant="body2" noWrap>
                    {item.description || 'No description'}
                </Typography>
            ),
        },
        {
            field: 'date',
            headerName: 'Date',
            width: 120,
            render: (item) => item.date // Display raw API value
        },
        {
            field: 'url',
            headerName: 'URL',
            width: 200,
            render: (item) => (
                item.url ? (
                    <Link href={item.url} target="_blank" rel="noopener" underline="hover">
                        {item.url.length > 30 ? `${item.url.substring(0, 30)}...` : item.url}
                    </Link>
                ) : (
                    'No URL'
                )
            ),
        },
        {
            field: 'pdf',
            headerName: 'PDF',
            width: 150,
            render: (item) => (
                item.pdf ? (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <InsertDriveFile color="primary" sx={{ mr: 1 }} />
                        <Typography variant="body2">
                            {typeof item.pdf === 'string' ? 'View PDF' : item.pdf.name}
                        </Typography>
                    </Box>
                ) : (
                    'No PDF'
                )
            ),
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

export default ArticleTable;