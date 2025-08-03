import React from 'react';
import CRUDTable from '../../common/CRUDTable';
import { Avatar, Box } from '@mui/material';

const PressTable = ({ data, loading, totalItems, page, itemsPerPage, onPageChange, onEdit, onDelete }) => {
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
        { field: 'title', headerName: 'Title' },
        {
            field: 'date',
            headerName: 'Date',
            render: (item) => item.date // Display raw API value
        },
        {
            field: 'time',
            headerName: 'Time',
            render: (item) => item.time // Display raw API value
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

export default PressTable;