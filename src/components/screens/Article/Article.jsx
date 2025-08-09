import React, { useState, useEffect } from 'react';
import { Box, Snackbar, Alert } from '@mui/material';
import ArticleForm from './ArticleForm';
import ArticleTable from './ArticleTable';
import * as articleService from '../../../api/articleService';

const Article = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: null,
        url: '',
        pdf: null,
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
            const { data } = await articleService.getArticleItems();
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
                await articleService.updateArticleItem(currentItem._id, formData);
            } else {
                await articleService.createArticleItem(formData);
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
            await articleService.deleteArticleItem(id);
            await fetchArticleItems();
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            date: null,
            url: '',
            pdf: null,
        });
        setCurrentItem(null);
    };

    return (
        <Box sx={{ width: '100%', p: 3 }}>
            <ArticleForm
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

            <ArticleTable
                data={articleItems.slice((page - 1) * itemsPerPage, page * itemsPerPage)}
                loading={loading}
                totalItems={articleItems.length}
                page={page}
                itemsPerPage={itemsPerPage}
                onPageChange={(_, value) => setPage(value)}
                onEdit={(item) => {
                    setCurrentItem(item);
                    setFormData({
                        title: item.title,
                        description: item.description || '',
                        date: item.date, // Keep raw API value
                        url: item.url || '',
                        pdf: item.pdfUrl || null,
                    });
                }}

                onDelete={(item) => handleDelete(item._id)}
            />
        </Box>
    );
};

export default Article;