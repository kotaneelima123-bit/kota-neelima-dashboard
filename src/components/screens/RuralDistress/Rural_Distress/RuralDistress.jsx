import React, { useState, useEffect } from 'react';
import { Box, Snackbar, Alert } from '@mui/material';
import RuralDistressForm from './RuralDistressForm';
import RuralDistressTable from './RuralDistressTable';
import * as ruralDistressService from '../../../../api/ruralDistressService';

const RuralDistress = () => {
    const [formData, setFormData] = useState({
        description: ''
    });
    const [currentItem, setCurrentItem] = useState(null);
    const [articleItems, setArticleItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        fetchArticleItems();
    }, []);

    const fetchArticleItems = async () => {
        setLoading(true);
        try {
            const { data } = await ruralDistressService.getRuralDistressItems();
            setArticleItems(data || []);
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
                await ruralDistressService.updateRuralDistressItem(currentItem._id, formData);
            } else {
                await ruralDistressService.createRuralDistressItem(formData);
            }
            await fetchArticleItems();
            resetForm();
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        setLoading(true);
        try {
            await ruralDistressService.deleteRuralDistressItem(id);
            await fetchArticleItems();
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            description: '',
        });
        setCurrentItem(null);
    };

    return (
        <Box sx={{ width: '100%', p: 3 }}>
            <RuralDistressForm
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

            <RuralDistressTable
                data={articleItems.slice((page - 1) * itemsPerPage, page * itemsPerPage)}
                loading={loading}
                totalItems={articleItems.length}
                page={page}
                itemsPerPage={itemsPerPage}
                onPageChange={(_, value) => setPage(value)}
                onEdit={(item) => {
                    setCurrentItem(item);
                    setFormData({
                        description: item.description || '',
                    });
                }}

                onDelete={(item) => handleDelete(item._id)}
            />
        </Box>
    );
};

export default RuralDistress;