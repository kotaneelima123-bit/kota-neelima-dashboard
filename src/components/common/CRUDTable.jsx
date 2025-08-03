import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Pagination,
    Stack,
    IconButton,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const CRUDTable = ({
    columns,
    data,
    loading,
    page,
    itemsPerPage,
    totalItems,
    onPageChange,
    onEdit,
    onDelete,
}) => {
    return (
        <Paper elevation={0} sx={{ p: 3, backgroundColor: 'white', borderRadius: '8px' }}>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#f4f6f8' }}>
                            {columns.map((column) => (
                                <TableCell key={column.field} sx={{ fontWeight: 600 }}>
                                    {column.headerName}
                                </TableCell>
                            ))}
                            {(onEdit || onDelete) && <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length + 1} align="center">
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : data.length > 0 ? (
                            data.map((row) => (
                                <TableRow key={row._id} hover>
                                    {columns.map((column) => (
                                        <TableCell key={`${row._id}-${column.field}`}>
                                            {column.render ? column.render(row) : row[column.field]}
                                        </TableCell>
                                    ))}
                                    {(onEdit || onDelete) && (
                                        <TableCell>
                                            {onEdit && (
                                                <IconButton onClick={() => onEdit(row)} sx={{ color: '#637381' }}>
                                                    <EditIcon />
                                                </IconButton>
                                            )}
                                            {onDelete && (
                                                <IconButton onClick={() => onDelete(row)} sx={{ color: '#637381' }}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            )}
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length + 1} align="center">
                                    No items found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {totalItems > itemsPerPage && (
                <Stack spacing={2} sx={{ mt: 3, alignItems: 'center' }}>
                    <Pagination
                        count={Math.ceil(totalItems / itemsPerPage)}
                        page={page}
                        onChange={onPageChange}
                        shape="rounded"
                        sx={{
                            '& .MuiPaginationItem-root': { color: '#637381' },
                            '& .MuiPaginationItem-root.Mui-selected': {
                                backgroundColor: '#76030F',
                                color: 'white',
                                '&:hover': { backgroundColor: '#5a020c' },
                            },
                        }}
                    />
                </Stack>
            )}
        </Paper>
    );
};

export default CRUDTable;