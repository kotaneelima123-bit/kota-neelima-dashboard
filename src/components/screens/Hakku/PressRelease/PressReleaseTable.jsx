import React from 'react';
import CRUDTable from '../../../common/CRUDTable';
import { Avatar, Box, Link } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

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
            render: (item) => item.url || '—'
        },
        {
            field: 'pdf',
            headerName: 'PDF',
            render: (item) =>
                item.pdf ? (
                    <Link href={item.pdf} target="_blank" rel="noopener noreferrer" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <PictureAsPdfIcon fontSize="small" color="error" />
                        View
                    </Link>
                ) : '—',
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