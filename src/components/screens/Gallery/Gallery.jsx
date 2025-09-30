import React, { useState, useEffect } from 'react';
import {
  Box,
  Snackbar,
  Alert,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab
} from '@mui/material';
import GalleryForm from './GalleryForm';
import GalleryTable from './GalleryTable';
import CategoryManager from './CategoryManager';
import * as galleryService from '../../../api/galleryService';
import * as galleryCategoryService from '../../../api/galleryCategoryService';
import * as homepageService from '../../../api/homepageService';

const Gallery = () => {
  const [formData, setFormData] = useState({
    title: '',
    hindiTitle: '',
    teluguTitle: '',
    date: null,
    time: null,
    image: null,
    categoryId: ''
  });
  const [currentItem, setCurrentItem] = useState(null);
  const [galleryItems, setGalleryItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState(1);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [confirmDialog, setConfirmDialog] = useState({ open: false });
  const [activeTab, setActiveTab] = useState(0);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchGalleryItems();
    fetchHomepageGalleryItems();
    fetchCategories();
  }, []);

  const fetchGalleryItems = async () => {
    setLoading(true);
    try {
      const { data } = await galleryService.getGalleryItems();
      setGalleryItems(data || []);
    } catch (error) {
      showSnackbar('Error fetching gallery items', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await galleryCategoryService.getGalleryCategories();
      console.log('Fetched categories:', data);
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      showSnackbar('Error fetching categories', 'error');
    }
  };

  const fetchHomepageGalleryItems = async () => {
    try {
      const response = await homepageService.getHomepageGallery();
      if (response.success && response.data && response.data.galleryItems) {
        const homepageItemIds = response.data.galleryItems.map(item => item._id);
        setSelectedItems(homepageItemIds);
      }
    } catch (error) {
      console.error('Error fetching homepage gallery items:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (currentItem) {
        await galleryService.updateGalleryItem(currentItem._id, formData);
      } else {
        await galleryService.createGalleryItem(formData);
      }
      await fetchGalleryItems();
      resetForm();
      showSnackbar(`Item ${currentItem ? 'updated' : 'created'} successfully`);
    } catch (error) {
      showSnackbar('Error saving item', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await galleryService.deleteGalleryItem(id);
      setSelectedItems(prev => prev.filter(itemId => itemId !== id));
      await fetchGalleryItems();
      showSnackbar('Item deleted successfully');
    } catch (error) {
      showSnackbar('Error deleting item', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectionChange = (newSelectedItems) => {
    if (newSelectedItems.length > 6) {
      showSnackbar('Maximum 6 items can be selected for homepage', 'info');
      return;
    }
    setSelectedItems(newSelectedItems);
  };

  const handleSetHomepageGallery = async () => {
    setSaving(true);
    try {
      await homepageService.setHomepageGallery(selectedItems);
      showSnackbar('Homepage gallery updated successfully');
      setConfirmDialog({ open: false });
    } catch (error) {
      showSnackbar('Error updating homepage gallery', 'error');
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      hindiTitle: '',
      teluguTitle: '',
      date: null,
      time: null,
      image: null,
      categoryId: ''
    });
    setCurrentItem(null);
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleCategoryUpdate = () => {
    fetchCategories(); // Refresh categories after CRUD operations
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      {/* Tabs for Gallery and Category Management */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Gallery Management" />
          <Tab label="Category Management" />
        </Tabs>
      </Box>

      {activeTab === 0 ? (
        <>
          <GalleryForm
            formData={formData}
            currentItem={currentItem}
            loading={loading}
            categories={categories}
            onChange={setFormData}
            onSubmit={handleSubmit}
            onReset={resetForm}
            onAddNew={() => {
              resetForm();
              setCurrentItem(null);
            }}
          />

          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
            p: 1.5,
            backgroundColor: 'grey.50',
            borderRadius: 1
          }}>
            <Box>
              <Chip
                label={`${selectedItems.length}/6 selected`}
                color={selectedItems.length > 0 ? "primary" : "default"}
                variant={selectedItems.length > 0 ? "filled" : "outlined"}
              />
              {selectedItems.length > 0 && (
                <Button
                  size="small"
                  color="secondary"
                  onClick={() => setSelectedItems([])}
                  sx={{ ml: 1 }}
                >
                  Clear Selection
                </Button>
              )}
            </Box>

            <Button
              variant="contained"
              disabled={selectedItems.length === 0}
              onClick={() => setConfirmDialog({
                open: true,
                title: "Set as Homepage Gallery",
                message: `Are you sure you want to set ${selectedItems.length} image(s) as the homepage gallery? These images will be displayed on your website's landing page.`
              })}
              sx={{
                backgroundColor: '#76030F',
                '&:hover': { backgroundColor: '#5a020c' }
              }}
            >
              Set as Homepage Gallery
            </Button>
          </Box>

          <GalleryTable
            data={galleryItems.slice((page - 1) * itemsPerPage, page * itemsPerPage)}
            loading={loading}
            totalItems={galleryItems.length}
            page={page}
            itemsPerPage={itemsPerPage}
            categories={categories}
            onPageChange={(_, value) => setPage(value)}
            onEdit={(item) => {
              setCurrentItem(item);
              setFormData({
                title: item.title,
                hindiTitle: item.hindiTitle || '',
                teluguTitle: item.teluguTitle || '',
                date: item.date,
                time: item.time,
                image: item.image || null,
                categoryId: item.categoryId || null
              });
            }}
            onDelete={(item) => handleDelete(item._id)}
            selectedItems={selectedItems}
            onSelectionChange={handleSelectionChange}
          />
        </>
      ) : (
        <CategoryManager
          categories={categories}
          onCategoryUpdate={handleCategoryUpdate}
        />
      )}

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false })}
      >
        <DialogTitle>{confirmDialog.title}</DialogTitle>
        <DialogContent>
          {confirmDialog.message}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false })}>Cancel</Button>
          <Button
            onClick={handleSetHomepageGallery}
            variant="contained"
            disabled={saving}
            sx={{
              backgroundColor: '#76030F',
              '&:hover': { backgroundColor: '#5a020c' }
            }}
          >
            {saving ? 'Setting...' : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Gallery;