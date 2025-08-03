import React, { useState, useEffect } from 'react';
import { Box, Snackbar, Alert } from '@mui/material';
import MediaForm from './MediaForm';
import MediaTable from './MediaTable';
import * as mediaService from '../../../api/mediaService';
import { format } from 'date-fns';

const Media = () => {
    const [formData, setFormData] = useState({
        url: '',
        date: '',
        time: '',
    });
    const [currentItem, setCurrentItem] = useState(null);
    const [mediaItems, setMediaItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        fetchMediaItems();
    }, []);



    const fetchMediaItems = async () => {
        setLoading(true);
        try {
            const { media } = await mediaService.getMediaItems();
            setMediaItems(media || []);
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
                await mediaService.updateMediaItem(currentItem._id, formData);

            } else {
                await mediaService.createMediaItem(formData);

            }
            await fetchMediaItems();
            resetForm();
        } catch (error) {

        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        setLoading(true);
        try {
            await mediaService.deleteMediaItem(id);

            await fetchMediaItems();
        } catch (error) {

        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            url: '',
            date: '',
            time: '',
        });
        setCurrentItem(null);
    };

    return (
        <Box sx={{ width: '100%', p: 3 }}>
            <MediaForm
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

            <MediaTable
                data={mediaItems.slice((page - 1) * itemsPerPage, page * itemsPerPage)}
                loading={loading}
                totalItems={mediaItems.length}
                page={page}
                itemsPerPage={itemsPerPage}
                onPageChange={(_, value) => setPage(value)}
                onEdit={(item) => {
                    setCurrentItem(item);
                    setFormData({
                        url: item.url,
                        date: item.date,
                        time: item.time,
                    });
                }}
                onDelete={(item) => handleDelete(item._id)}
            />
        </Box>
    );
};

export default Media;