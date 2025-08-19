import React, { useState, useEffect } from 'react';
import { Box, Snackbar, Alert } from '@mui/material';
import PressReleaseForm from './PressReleaseForm';
import PressReleaseTable from './PressReleaseTable';
import * as hakkuPressReleaseService from '../../../../api/hakkuPressReleaseService';
import { format } from 'date-fns';

const PressRelease = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        url: '',
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
            const { pressReleases } = await hakkuPressReleaseService.getPressItems();
            setPressItems(pressReleases || []);
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
                await hakkuPressReleaseService.updatePressItem(currentItem._id, formData);

            } else {
                await hakkuPressReleaseService.createPressItem(formData);

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
            await hakkuPressReleaseService.deletePressItem(id);

            await fetchPressItems();
        } catch (error) {

        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            url: '',
        });
        setCurrentItem(null);
    };

    return (
        <Box sx={{ width: '100%', p: 3 }}>
            <PressReleaseForm
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

            <PressReleaseTable
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
                        description: item.description,
                        url: item.url,
                    });
                }}
                onDelete={(item) => handleDelete(item._id)}
            />
        </Box>
    );
};

export default PressRelease;