import React from 'react';
import CRUDTable from '../../../common/CRUDTable';
import { Avatar, Box, Link, Typography } from '@mui/material';
import { InsertDriveFile } from '@mui/icons-material';

const ArticleTable = ({ data, loading, totalItems, page, itemsPerPage, onPageChange, onEdit, onDelete }) => {
    const columns = [
        {
            field: 'title',
            headerName: 'Title',
            width: 300,
            render: (item) => (
                <Typography variant="body2" noWrap>
                    {item.title || 'No title'}
                </Typography>
            ),
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
            field: 'url',
            headerName: 'URL',
            width: 300,
            render: (item) => (
                <Typography variant="body2" noWrap>
                    {item.url || 'No url'}
                </Typography>
            ),
        },
        {
            field: 'date',
            headerName: 'Date',
            width: 120,
            render: (item) => item.date // Display raw API value
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