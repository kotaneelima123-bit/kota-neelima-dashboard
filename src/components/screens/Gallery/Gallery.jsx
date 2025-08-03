import React, { useState, useEffect } from 'react';
import { Box, Snackbar, Alert } from '@mui/material';
import GalleryForm from './GalleryForm';
import GalleryTable from './GalleryTable';
import * as galleryService from '../../../api/galleryService';

const Gallery = () => {
  const [formData, setFormData] = useState({
    title: '',
    hindiTitle: '',
    teluguTitle: '',
    date: null,
    time: null,
    image: null,
  });
  const [currentItem, setCurrentItem] = useState(null);
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    setLoading(true);
    try {
      const { galleries } = await galleryService.getGalleryItems();
      setGalleryItems(galleries || []);
    } catch (error) {
    } finally {
      setLoading(false);
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
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await galleryService.deleteGalleryItem(id);
      await fetchGalleryItems();
    } catch (error) {
    } finally {
      setLoading(false);
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
    });
    setCurrentItem(null);
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <GalleryForm
        formData={formData}
        currentItem={currentItem}
        loading={loading}
        onChange={setFormData}
        onSubmit={handleSubmit}
        onReset={resetForm}
        onAddNew={() => {
          resetForm();
          setCurrentItem(null);
        }}
      />

      <GalleryTable
        data={galleryItems.slice((page - 1) * itemsPerPage, page * itemsPerPage)}
        loading={loading}
        totalItems={galleryItems.length}
        page={page}
        itemsPerPage={itemsPerPage}
        onPageChange={(_, value) => setPage(value)}
        onEdit={(item) => {
          setCurrentItem(item);
          setFormData({
            title: item.title,
            hindiTitle: item.hindiTitle || '',
            teluguTitle: item.teluguTitle || '',
            date: item.date, // Keep raw API value
            time: item.time, // Keep raw API value
            image: item.imageUrl || null,
          });
        }}

        onDelete={(item) => handleDelete(item._id)}
      />
    </Box>
  );
};

export default Gallery;