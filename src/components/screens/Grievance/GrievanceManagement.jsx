// src/pages/admin/GrievanceManagement.jsx
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
    Snackbar,
    Link,
    Avatar
} from '@mui/material';
import {
    Search as SearchIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon,
    Close as CloseIcon,
    Download as DownloadIcon,
    Image as ImageIcon,
    Description as DocumentIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import grievanceService from './grievanceService';

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
            status === 'in-progress' ? '#e3f2fd' :
                status === 'resolved' ? '#e8f5e8' :
                    status === 'rejected' ? '#ffebee' : '#f5f5f5',
    color:
        status === 'pending' ? '#ed6c02' :
            status === 'in-progress' ? '#0288d1' :
                status === 'resolved' ? '#2e7d32' :
                    status === 'rejected' ? '#d32f2f' : '#666',
    fontWeight: 500
}));

const DocumentPreview = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: '#eeeeee'
    }
}));

const GrievanceManagement = () => {
    const [grievances, setGrievances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [orderBy, setOrderBy] = useState('createdAt');
    const [order, setOrder] = useState('desc');
    const [selectedGrievance, setSelectedGrievance] = useState(null);
    const [openViewDialog, setOpenViewDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [editFormData, setEditFormData] = useState({
        fullName: '',
        phoneNumber: '',
        location: '',
        problem: '',
        description: '',
        document: null,
        status: 'pending'
    });
    const [formErrors, setFormErrors] = useState({});
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [actionLoading, setActionLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileName, setFileName] = useState('');

    // Fetch grievances on component mount
    useEffect(() => {
        fetchGrievances();
    }, []);

    const fetchGrievances = async () => {
        setLoading(true);
        try {
            const response = await grievanceService.getAllGrievances();
            setGrievances(response.data || []);
        } catch (error) {
            showSnackbar('Failed to fetch grievances', 'error');
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
    const filteredGrievances = grievances.filter(grievance =>
        grievance.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        grievance.phoneNumber?.includes(searchTerm) ||
        grievance.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        grievance.problem?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sorting
    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const sortedGrievances = filteredGrievances.sort((a, b) => {
        const aValue = a[orderBy] || '';
        const bValue = b[orderBy] || '';

        if (order === 'asc') {
            return aValue < bValue ? -1 : 1;
        } else {
            return aValue > bValue ? -1 : 1;
        }
    });

    // Pagination
    const paginatedGrievances = sortedGrievances.slice(
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
    const handleView = (grievance) => {
        setSelectedGrievance(grievance);
        setOpenViewDialog(true);
    };

    // Edit
    const handleEdit = (grievance) => {
        setSelectedGrievance(grievance);
        setEditFormData({
            fullName: grievance.fullName || '',
            phoneNumber: grievance.phoneNumber || '',
            location: grievance.location || '',
            problem: grievance.problem || '',
            description: grievance.description || '',
            document: null,
            status: grievance.status || 'pending'
        });
        setFileName('');
        setSelectedFile(null);
        setFormErrors({});
        setOpenEditDialog(true);
    };

    const validateForm = () => {
        const errors = {};
        if (!editFormData.fullName.trim()) {
            errors.fullName = 'Full name is required';
        } else if (editFormData.fullName.trim().length < 6) {
            errors.fullName = 'Name must be at least 6 characters';
        }

        if (!editFormData.phoneNumber.trim()) {
            errors.phoneNumber = 'Phone number is required';
        } else if (!/^[6-9]\d{9}$/.test(editFormData.phoneNumber)) {
            errors.phoneNumber = 'Invalid Indian mobile number';
        }

        if (!editFormData.location.trim()) {
            errors.location = 'Location is required';
        }

        if (!editFormData.problem.trim()) {
            errors.problem = 'Problem type is required';
        }

        if (!editFormData.description.trim()) {
            errors.description = 'Description is required';
        } else if (editFormData.description.trim().length < 20) {
            errors.description = 'Description must be at least 20 characters';
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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setFileName(file.name);
            setEditFormData(prev => ({ ...prev, document: file }));
        }
    };

    const handleEditSubmit = async () => {
        if (!validateForm()) return;

        setActionLoading(true);
        try {
            const formData = new FormData();
            formData.append('fullName', editFormData.fullName);
            formData.append('phoneNumber', editFormData.phoneNumber);
            formData.append('location', editFormData.location);
            formData.append('problem', editFormData.problem);
            formData.append('description', editFormData.description);
            formData.append('status', editFormData.status);

            if (selectedFile) {
                formData.append('document', selectedFile);
            }

            await grievanceService.updateGrievance(selectedGrievance._id, formData);
            showSnackbar('Grievance updated successfully', 'success');
            setOpenEditDialog(false);
            fetchGrievances(); // Refresh the list
        } catch (error) {
            showSnackbar('Failed to update grievance', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    // Delete
    const handleDelete = (grievance) => {
        setSelectedGrievance(grievance);
        setOpenDeleteDialog(true);
    };

    const handleDeleteConfirm = async () => {
        setActionLoading(true);
        try {
            await grievanceService.deleteGrievance(selectedGrievance._id);
            showSnackbar('Grievance deleted successfully', 'success');
            setOpenDeleteDialog(false);
            fetchGrievances(); // Refresh the list
        } catch (error) {
            showSnackbar('Failed to delete grievance', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    // Handle document download/view
    const handleDocumentClick = (url) => {
        if (url) {
            window.open(url, '_blank');
        }
    };

    // Get document icon based on file type
    const getDocumentIcon = (url) => {
        if (!url) return <DocumentIcon />;
        const extension = url.split('.').pop().toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(extension)) {
            return <ImageIcon />;
        }
        return <DocumentIcon />;
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
                    Grievance Management
                </Typography>
                <TextField
                    size="small"
                    placeholder="Search grievances..."
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
                            <TableCell>Full Name</TableCell>
                            <TableCell>Phone Number</TableCell>
                            <TableCell>Location</TableCell>
                            <TableCell>Problem</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Document</TableCell>
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
                        {paginatedGrievances.map((grievance) => (
                            <TableRow key={grievance._id} hover>
                                <TableCell>{grievance.fullName}</TableCell>
                                <TableCell>{grievance.phoneNumber}</TableCell>
                                <TableCell>{grievance.location}</TableCell>
                                <TableCell>
                                    <Tooltip title={grievance.problem}>
                                        <span>{grievance.problem.length > 20
                                            ? `${grievance.problem.substring(0, 20)}...`
                                            : grievance.problem}
                                        </span>
                                    </Tooltip>
                                </TableCell>
                                <TableCell>
                                    <Tooltip title={grievance.description}>
                                        <span>{grievance.description.length > 30
                                            ? `${grievance.description.substring(0, 30)}...`
                                            : grievance.description}
                                        </span>
                                    </Tooltip>
                                </TableCell>
                                <TableCell>
                                    {grievance.document ? (
                                        <Tooltip title="View Document">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleDocumentClick(grievance.document)}
                                                sx={{ color: '#76030F' }}
                                            >
                                                {getDocumentIcon(grievance.document)}
                                            </IconButton>
                                        </Tooltip>
                                    ) : (
                                        <Typography variant="caption" color="textSecondary">
                                            No file
                                        </Typography>
                                    )}
                                </TableCell>
                                {/* <TableCell>
                                    <StatusChip
                                        label={grievance.status}
                                        status={grievance.status}
                                        size="small"
                                    />
                                </TableCell> */}
                                <TableCell>{formatDate(grievance.createdAt)}</TableCell>
                                <TableCell align="center">
                                    <Tooltip title="View Details">
                                        <IconButton
                                            size="small"
                                            onClick={() => handleView(grievance)}
                                            sx={{ color: '#76030F', mr: 1 }}
                                        >
                                            <ViewIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Edit">
                                        <IconButton
                                            size="small"
                                            onClick={() => handleEdit(grievance)}
                                            sx={{ color: '#76030F', mr: 1 }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                        <IconButton
                                            size="small"
                                            onClick={() => handleDelete(grievance)}
                                            sx={{ color: '#d32f2f' }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                        {paginatedGrievances.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                                    No grievances found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </StyledTableContainer>

            {/* Pagination */}
            <TablePagination
                component="div"
                count={filteredGrievances.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
            />

            {/* View Details Dialog */}
            <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle sx={{ bgcolor: '#76030F', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    Grievance Details
                    <IconButton onClick={() => setOpenViewDialog(false)} sx={{ color: 'white' }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    {selectedGrievance && (
                        <Box>
                            <Typography variant="subtitle2" sx={{ color: '#76030F', fontWeight: 600 }}>Full Name</Typography>
                            <Typography variant="body1" sx={{ mb: 2 }}>{selectedGrievance.fullName}</Typography>

                            <Typography variant="subtitle2" sx={{ color: '#76030F', fontWeight: 600 }}>Phone Number</Typography>
                            <Typography variant="body1" sx={{ mb: 2 }}>{selectedGrievance.phoneNumber}</Typography>

                            <Typography variant="subtitle2" sx={{ color: '#76030F', fontWeight: 600 }}>Location</Typography>
                            <Typography variant="body1" sx={{ mb: 2 }}>{selectedGrievance.location}</Typography>

                            <Typography variant="subtitle2" sx={{ color: '#76030F', fontWeight: 600 }}>Problem</Typography>
                            <Typography variant="body1" sx={{ mb: 2 }}>{selectedGrievance.problem}</Typography>

                            <Typography variant="subtitle2" sx={{ color: '#76030F', fontWeight: 600 }}>Description</Typography>
                            <Typography variant="body1" sx={{ mb: 2 }}>{selectedGrievance.description}</Typography>

                            <Typography variant="subtitle2" sx={{ color: '#76030F', fontWeight: 600 }}>Status</Typography>
                            <Box sx={{ mb: 2 }}>
                                <StatusChip label={selectedGrievance.status} status={selectedGrievance.status} />
                            </Box>

                            <Typography variant="subtitle2" sx={{ color: '#76030F', fontWeight: 600 }}>Document</Typography>
                            {selectedGrievance.document ? (
                                <DocumentPreview onClick={() => handleDocumentClick(selectedGrievance.document)}>
                                    {getDocumentIcon(selectedGrievance.document)}
                                    <Typography variant="body2">View Document</Typography>
                                    <DownloadIcon fontSize="small" sx={{ ml: 'auto' }} />
                                </DocumentPreview>
                            ) : (
                                <Typography variant="body2" sx={{ mb: 2 }}>No document attached</Typography>
                            )}

                            <Typography variant="subtitle2" sx={{ color: '#76030F', fontWeight: 600, mt: 2 }}>Created At</Typography>
                            <Typography variant="body1" sx={{ mb: 2 }}>{formatDate(selectedGrievance.createdAt)}</Typography>

                            <Typography variant="subtitle2" sx={{ color: '#76030F', fontWeight: 600 }}>Last Updated</Typography>
                            <Typography variant="body1">{formatDate(selectedGrievance.updatedAt)}</Typography>
                        </Box>
                    )}
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle sx={{ bgcolor: '#76030F', color: 'white' }}>
                    Edit Grievance
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Full Name *"
                            name="fullName"
                            value={editFormData.fullName}
                            onChange={handleEditChange}
                            error={!!formErrors.fullName}
                            helperText={formErrors.fullName}
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
                            label="Location *"
                            name="location"
                            value={editFormData.location}
                            onChange={handleEditChange}
                            error={!!formErrors.location}
                            helperText={formErrors.location}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Problem Type *"
                            name="problem"
                            value={editFormData.problem}
                            onChange={handleEditChange}
                            error={!!formErrors.problem}
                            helperText={formErrors.problem}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Description *"
                            name="description"
                            value={editFormData.description}
                            onChange={handleEditChange}
                            error={!!formErrors.description}
                            helperText={formErrors.description}
                            fullWidth
                            required
                            multiline
                            rows={3}
                        />
                        <TextField
                            select
                            label="Status"
                            name="status"
                            value={editFormData.status}
                            onChange={handleEditChange}
                            fullWidth
                            SelectProps={{
                                native: true
                            }}
                        >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="rejected">Rejected</option>
                        </TextField>

                        <Box>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>Update Document (Optional)</Typography>
                            <input
                                type="file"
                                id="document-upload"
                                onChange={handleFileChange}
                                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                                style={{ display: 'none' }}
                            />
                            <label htmlFor="document-upload">
                                <Button
                                    variant="outlined"
                                    component="span"
                                    sx={{ color: '#76030F', borderColor: '#76030F' }}
                                >
                                    Choose File
                                </Button>
                            </label>
                            {fileName && (
                                <Typography variant="caption" sx={{ ml: 2 }}>
                                    Selected: {fileName}
                                </Typography>
                            )}
                            {selectedGrievance?.document && !fileName && (
                                <Typography variant="caption" sx={{ ml: 2, color: 'text.secondary' }}>
                                    Current document will be kept if no new file selected
                                </Typography>
                            )}
                        </Box>
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
                        Are you sure you want to delete {selectedGrievance?.fullName}'s grievance? This action cannot be undone.
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

export default GrievanceManagement;