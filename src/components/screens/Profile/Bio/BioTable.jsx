import React from 'react';
import CRUDTable from '../../../common/CRUDTable';
import { Avatar, Box } from '@mui/material';

const BioTable = ({ data, loading, totalItems, page, itemsPerPage, onPageChange, onEdit, onDelete }) => {
    const columns = [
        {
            field: 'image',
            headerName: 'Image',
            render: (item) => (
                <Box sx={{ width: 60, height: 60 }}>
                    {item.profileImage ? (
                        <img
                            src={item.profileImage}
                            // alt={item.title}
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
        { field: 'description', headerName: 'Description' },
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

export default BioTable;