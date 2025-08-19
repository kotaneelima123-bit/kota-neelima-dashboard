import React, { useState, useEffect } from 'react';
import { Box, Snackbar, Alert } from '@mui/material';
import PressCoverageForm from './PressCoverageForm';
import PressCoverageTable from './PressCoverageTable';
import * as hakkuPressCoverageService from '../../../../api/hakkuPressCoverageService';
import { format } from 'date-fns';

const PressCoverage = () => {
    const [formData, setFormData] = useState({
        title: '',
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
            const { data } = await hakkuPressCoverageService.getPressItems();
            setPressItems(data || []);
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
                await hakkuPressCoverageService.updatePressItem(currentItem._id, formData);

            } else {
                await hakkuPressCoverageService.createPressItem(formData);

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
            await hakkuPressCoverageService.deletePressItem(id);

            await fetchPressItems();
        } catch (error) {

        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            url: '',
        });
        setCurrentItem(null);
    };

    return (
        <Box sx={{ width: '100%', p: 3 }}>
            <PressCoverageForm
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

            <PressCoverageTable
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
                        url: item.url,
                    });
                }}
                onDelete={(item) => handleDelete(item._id)}
            />
        </Box>
    );
};

export default PressCoverage;