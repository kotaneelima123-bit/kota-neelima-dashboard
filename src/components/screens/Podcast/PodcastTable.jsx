import React from 'react';
import CRUDTable from '../../common/CRUDTable';
import { Avatar, Box, Link, Typography } from '@mui/material';
import { InsertDriveFile } from '@mui/icons-material';

const ArticleTable = ({ data, loading, totalItems, page, itemsPerPage, onPageChange, onEdit, onDelete }) => {
    const columns = [
        {
            field: 'thumbnail',
            headerName: 'Thumbnail',
            render: (item) => (
                <Box sx={{ width: 120, height: 90 }}>
                    {item.thumbnail ? (
                        <img
                            src={item.thumbnail}
                            alt={item.title}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                borderRadius: '4px'
                            }}
                        />
                    ) : (
                        <Avatar variant="rounded" sx={{ width: 120, height: 90 }}>
                            No Thumbnail
                        </Avatar>
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
            field: 'ytTitle',
            headerName: 'Title',
            render: (item) => item.ytTitle || 'Untitled Media'
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