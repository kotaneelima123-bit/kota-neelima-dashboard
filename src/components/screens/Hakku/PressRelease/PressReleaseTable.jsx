import React from 'react';
import CRUDTable from '../../../common/CRUDTable';
import { Avatar, Box } from '@mui/material';

const PressCoverageTable = ({ data, loading, totalItems, page, itemsPerPage, onPageChange, onEdit, onDelete }) => {
    const columns = [
        {
            field: 'title',
            headerName: 'Title',
            render: (item) => item.title || 'Untitled Media'
        },
        {
            field: 'description',
            headerName: 'Description',
            render: (item) => item.description || 'Untitled Media'
        },
        {
            field: 'url',
            headerName: 'URL',
            render: (item) => item.url || 'Untitled Media'
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

export default PressCoverageTable;