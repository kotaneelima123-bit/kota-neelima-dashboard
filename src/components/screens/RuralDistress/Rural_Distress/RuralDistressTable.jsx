import React from 'react';
import CRUDTable from '../../../common/CRUDTable';
import { Avatar, Box, Link, Typography } from '@mui/material';
import { InsertDriveFile } from '@mui/icons-material';

const RuralDistressTable = ({ data, loading, totalItems, page, itemsPerPage, onPageChange, onEdit, onDelete }) => {
    const columns = [
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

export default RuralDistressTable;