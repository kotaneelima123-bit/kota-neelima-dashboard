import React, { useState, useEffect } from 'react';
import { Box, Snackbar, Alert } from '@mui/material';
import PressForm from './PressForm';
import PressTable from './PressTable';
import * as pressService from '../../../api/pressService';

const Press = () => {
    const [formData, setFormData] = useState({
        title: '',
        hindiTitle: '',
        teluguTitle: '',
        date: null,
        time: null,
        image: null,
    });
    const [currentItem, setCurrentItem] = useState(null);
    const [pressItems, setPressItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        fetchPressItems();
    }, []);

    const fetchPressItems = async () => {
        setLoading(true);
        try {
            const { press } = await pressService.getPressItems();
            setPressItems(press || []);
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
                await pressService.updatePressItem(currentItem._id, formData);
            } else {
                await pressService.createPressItem(formData);
            }
            await fetchPressItems();
            resetForm();
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        setLoading(true);
        try {
            await pressService.deletePressItem(id);
            await fetchPressItems();
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
            <PressForm
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

            <PressTable
                data={pressItems.slice((page - 1) * itemsPerPage, page * itemsPerPage)}
                loading={loading}
                totalItems={pressItems.length}
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

export default Press;