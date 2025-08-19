import React, { useState, useEffect } from 'react';
import { Box, Snackbar, Alert } from '@mui/material';
import HakkuVideoForm from './HakkuVideoForm';
import HakkuVideoTable from './HakkuVideoTable';
import * as hakkuVideoService from '../../../../api/hakkuVideoService';
import { format } from 'date-fns';

const HakkuVideos = () => {
    const [formData, setFormData] = useState({
        url: '',
        date: '',
        time: '',
    });
    const [currentItem, setCurrentItem] = useState(null);
    const [videoItems, setVideoItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        fetchMediaItems();
    }, []);



    const fetchMediaItems = async () => {
        setLoading(true);
        try {
            const { hakku } = await hakkuVideoService.getVideoItems();
            setVideoItems(hakku || []);
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
                await hakkuVideoService.updateVideoItem(currentItem._id, formData);

            } else {
                await hakkuVideoService.createVideoItem(formData);

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
            await hakkuVideoService.deleteVideoItem(id);

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
            <HakkuVideoForm
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

            <HakkuVideoTable
                data={videoItems.slice((page - 1) * itemsPerPage, page * itemsPerPage)}
                loading={loading}
                totalItems={videoItems.length}
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

export default HakkuVideos;