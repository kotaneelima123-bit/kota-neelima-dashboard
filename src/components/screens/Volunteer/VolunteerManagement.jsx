// src/pages/admin/VolunteerManagement.jsx
import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    TableSortLabel,
    TextField,
    InputAdornment,
    IconButton,
    Button,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    CircularProgress,
    Tooltip,
    Alert,
    Snackbar
} from '@mui/material';
import {
    Search as SearchIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon,
    Close as CloseIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import volunteerService from './volunteerService';

// Styled components with your theme color
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    borderRadius: '8px',
    '& .MuiTableCell-head': {
        backgroundColor: '#76030F',
        color: 'white',
        fontWeight: 600
    }
}));

const StatusChip = styled(Chip)(({ status, theme }) => ({
    backgroundColor:
        status === 'pending' ? '#fff3e0' :
            status === 'approved' ? '#e8f5e8' :
                status === 'rejected' ? '#ffebee' : '#f5f5f5',
    color:
        status === 'pending' ? '#ed6c02' :
            status === 'approved' ? '#2e7d32' :
                status === 'rejected' ? '#d32f2f' : '#666',
    fontWeight: 500
}));

const VolunteerManagement = () => {
    const [volunteers, setVolunteers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [orderBy, setOrderBy] = useState('createdAt');
    const [order, setOrder] = useState('desc');
    const [selectedVolunteer, setSelectedVolunteer] = useState(null);
    const [openViewDialog, setOpenViewDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [editFormData, setEditFormData] = useState({
        name: '',
        phoneNumber: '',
        address: '',
        message: ''
    });
    const [formErrors, setFormErrors] = useState({});
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [actionLoading, setActionLoading] = useState(false);

    // Fetch volunteers on component mount
    useEffect(() => {
        fetchVolunteers();
    }, []);

    const fetchVolunteers = async () => {
        setLoading(true);
        try {
            const response = await volunteerService.getAllVolunteers();
            setVolunteers(response.data || []);
        } catch (error) {
            showSnackbar('Failed to fetch volunteers', 'error');
        } finally {
            setLoading(false);
        }
    };

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    // Search filter
    const filteredVolunteers = volunteers.filter(volunteer =>
        volunteer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        volunteer.phoneNumber?.includes(searchTerm) ||
        volunteer.address?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sorting
    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const sortedVolunteers = filteredVolunteers.sort((a, b) => {
        const aValue = a[orderBy] || '';
        const bValue = b[orderBy] || '';

        if (order === 'asc') {
            return aValue < bValue ? -1 : 1;
        } else {
            return aValue > bValue ? -1 : 1;
        }
    });

    // Pagination
    const paginatedVolunteers = sortedVolunteers.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // View Details
    const handleView = (volunteer) => {
        setSelectedVolunteer(volunteer);
        setOpenViewDialog(true);
    };

    // Edit
    const handleEdit = (volunteer) => {
        setSelectedVolunteer(volunteer);
        setEditFormData({
            name: volunteer.name || '',
            phoneNumber: volunteer.phoneNumber || '',
            address: volunteer.address || '',
            message: volunteer.message || ''
        });
        setFormErrors({});
        setOpenEditDialog(true);
    };

    const validateForm = () => {
        const errors = {};
        if (!editFormData.name.trim()) {
            errors.name = 'Name is required';
        } else if (editFormData.name.trim().length < 6) {
            errors.name = 'Name must be at least 6 characters';
        }

        if (!editFormData.phoneNumber.trim()) {
            errors.phoneNumber = 'Phone number is required';
        } else if (!/^[6-9]\d{9}$/.test(editFormData.phoneNumber)) {
            errors.phoneNumber = 'Invalid Indian mobile number';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({ ...prev, [name]: value }));
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleEditSubmit = async () => {
        if (!validateForm()) return;

        setActionLoading(true);
        try {
            await volunteerService.updateVolunteer(selectedVolunteer._id, editFormData);
            showSnackbar('Volunteer updated successfully', 'success');
            setOpenEditDialog(false);
            fetchVolunteers(); // Refresh the list
        } catch (error) {
            showSnackbar('Failed to update volunteer', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    // Delete
    const handleDelete = (volunteer) => {
        setSelectedVolunteer(volunteer);
        setOpenDeleteDialog(true);
    };

    const handleDeleteConfirm = async () => {
        setActionLoading(true);
        try {
            await volunteerService.deleteVolunteer(selectedVolunteer._id);
            showSnackbar('Volunteer deleted successfully', 'success');
            setOpenDeleteDialog(false);
            fetchVolunteers(); // Refresh the list
        } catch (error) {
            showSnackbar('Failed to delete volunteer', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <CircularProgress sx={{ color: '#76030F' }} />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" sx={{ color: '#76030F', fontWeight: 600 }}>
                    Volunteer Management
                </Typography>
                <TextField
                    size="small"
                    placeholder="Search volunteers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: '#76030F' }} />
                            </InputAdornment>
                        )
                    }}
                    sx={{ width: 300 }}
                />
            </Box>

            {/* Table */}
            <StyledTableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Phone Number</TableCell>
                            <TableCell>Address</TableCell>
                            <TableCell>Message</TableCell>
                            {/* <TableCell>Status</TableCell> */}
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'createdAt'}
                                    direction={orderBy === 'createdAt' ? order : 'asc'}
                                    onClick={() => handleRequestSort('createdAt')}
                                    sx={{ color: 'white !important' }}
                                >
                                    Created Date
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedVolunteers.map((volunteer) => (
                            <TableRow key={volunteer._id} hover>
                                <TableCell>{volunteer.name}</TableCell>
                                <TableCell>{volunteer.phoneNumber}</TableCell>
                                <TableCell>{volunteer.address || '-'}</TableCell>
                                <TableCell>
                                    {volunteer.message ? (
                                        <Tooltip title={volunteer.message}>
                                            <span>{volunteer.message.substring(0, 30)}...</span>
                                        </Tooltip>
                                    ) : '-'}
                                </TableCell>
                                {/* <TableCell>
                                    <StatusChip
                                        label={volunteer.status || 'pending'}
                                        status={volunteer.status || 'pending'}
                                        size="small"
                                    />
                                </TableCell> */}
                                <TableCell>{formatDate(volunteer.createdAt)}</TableCell>
                                <TableCell align="center">
                                    <Tooltip title="View Details">
                                        <IconButton
                                            size="small"
                                            onClick={() => handleView(volunteer)}
                                            sx={{ color: '#76030F', mr: 1 }}
                                        >
                                            <ViewIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Edit">
                                        <IconButton
                                            size="small"
                                            onClick={() => handleEdit(volunteer)}
                                            sx={{ color: '#76030F', mr: 1 }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                        <IconButton
                                            size="small"
                                            onClick={() => handleDelete(volunteer)}
                                            sx={{ color: '#d32f2f' }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                        {paginatedVolunteers.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                                    No volunteers found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </StyledTableContainer>

            {/* Pagination */}
            <TablePagination
                component="div"
                count={filteredVolunteers.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
            />

            {/* View Details Dialog */}
            <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ bgcolor: '#76030F', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    Volunteer Details
                    <IconButton onClick={() => setOpenViewDialog(false)} sx={{ color: 'white' }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    {selectedVolunteer && (
                        <Box>
                            <Typography variant="subtitle2" sx={{ color: '#76030F', fontWeight: 600 }}>Name</Typography>
                            <Typography variant="body1" sx={{ mb: 2 }}>{selectedVolunteer.name}</Typography>

                            <Typography variant="subtitle2" sx={{ color: '#76030F', fontWeight: 600 }}>Phone Number</Typography>
                            <Typography variant="body1" sx={{ mb: 2 }}>{selectedVolunteer.phoneNumber}</Typography>

                            <Typography variant="subtitle2" sx={{ color: '#76030F', fontWeight: 600 }}>Address</Typography>
                            <Typography variant="body1" sx={{ mb: 2 }}>{selectedVolunteer.address || 'Not provided'}</Typography>

                            <Typography variant="subtitle2" sx={{ color: '#76030F', fontWeight: 600 }}>Message</Typography>
                            <Typography variant="body1" sx={{ mb: 2 }}>{selectedVolunteer.message || 'Not provided'}</Typography>

                            <Typography variant="subtitle2" sx={{ color: '#76030F', fontWeight: 600 }}>Status</Typography>
                            <Box sx={{ mb: 2 }}>
                                <StatusChip label={selectedVolunteer.status || 'pending'} status={selectedVolunteer.status || 'pending'} />
                            </Box>

                            <Typography variant="subtitle2" sx={{ color: '#76030F', fontWeight: 600 }}>Created At</Typography>
                            <Typography variant="body1" sx={{ mb: 2 }}>{formatDate(selectedVolunteer.createdAt)}</Typography>

                            <Typography variant="subtitle2" sx={{ color: '#76030F', fontWeight: 600 }}>Last Updated</Typography>
                            <Typography variant="body1">{formatDate(selectedVolunteer.updatedAt)}</Typography>
                        </Box>
                    )}
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ bgcolor: '#76030F', color: 'white' }}>
                    Edit Volunteer
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Name *"
                            name="name"
                            value={editFormData.name}
                            onChange={handleEditChange}
                            error={!!formErrors.name}
                            helperText={formErrors.name}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Phone Number *"
                            name="phoneNumber"
                            value={editFormData.phoneNumber}
                            onChange={handleEditChange}
                            error={!!formErrors.phoneNumber}
                            helperText={formErrors.phoneNumber}
                            fullWidth
                            required
                            inputProps={{ maxLength: 10 }}
                        />
                        <TextField
                            label="Address"
                            name="address"
                            value={editFormData.address}
                            onChange={handleEditChange}
                            fullWidth
                            multiline
                            rows={2}
                        />
                        <TextField
                            label="Message"
                            name="message"
                            value={editFormData.message}
                            onChange={handleEditChange}
                            fullWidth
                            multiline
                            rows={3}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpenEditDialog(false)} sx={{ color: '#76030F' }}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleEditSubmit}
                        variant="contained"
                        disabled={actionLoading}
                        sx={{ bgcolor: '#76030F', '&:hover': { bgcolor: '#5a020c' } }}
                    >
                        {actionLoading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Save Changes'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                <DialogTitle sx={{ color: '#d32f2f' }}>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete {selectedVolunteer?.name}'s record? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)} sx={{ color: '#76030F' }}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        variant="contained"
                        color="error"
                        disabled={actionLoading}
                    >
                        {actionLoading ? <CircularProgress size={24} /> : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default VolunteerManagement;