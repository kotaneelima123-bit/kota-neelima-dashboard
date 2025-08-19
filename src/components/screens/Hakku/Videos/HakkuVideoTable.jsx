import React from 'react';
import CRUDTable from '../../../common/CRUDTable';
import { Avatar, Box } from '@mui/material';

const HakkuVideoTable = ({ data, loading, totalItems, page, itemsPerPage, onPageChange, onEdit, onDelete }) => {
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
            render: (item) => item.title || 'Untitled Media'
        },
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

export default HakkuVideoTable;