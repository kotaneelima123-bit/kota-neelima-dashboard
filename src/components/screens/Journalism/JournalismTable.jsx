import React from 'react';
import CRUDTable from '../../common/CRUDTable';
import { Avatar, Box, Link, Typography } from '@mui/material';
import { InsertDriveFile } from '@mui/icons-material';

const JournalismTable = ({ data, loading, totalItems, page, itemsPerPage, onPageChange, onEdit, onDelete }) => {
    const columns = [
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

export default JournalismTable;