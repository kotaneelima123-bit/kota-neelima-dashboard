import React, { useState, useEffect } from 'react';
import { Box, Snackbar, Alert } from '@mui/material';
import BooksForm from './BooksForm';
import BooksTable from './BooksTable';
import * as ruralDistressService from '../../../../api/ruralDistressService';

const Books = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        author: '',
        publishedDate: null,
        bookImage: null,
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
            const { data } = await ruralDistressService.getBookItems();
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
                await ruralDistressService.updateBookItem(currentItem._id, formData);
            } else {
                await ruralDistressService.createBookItem(formData);
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
            await ruralDistressService.deleteBookItem(id);
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
            author: '',
            publishedDate: null,
            bookImage: null,
        });
        setCurrentItem(null);
    };

    return (
        <Box sx={{ width: '100%', p: 3 }}>
            <BooksForm
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

            <BooksTable
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
                        author: item.author,
                        publishedDate: item.publishedDate || null, // Keep raw API value
                        // Convert image URL to null since we can't set a file input programmatically
                        bookImage: item.bookImage || null,
                    });
                }}

                onDelete={(item) => handleDelete(item._id)}
            />
        </Box>
    );
};

export default Books;