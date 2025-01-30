import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import ImageForm from '../components/ImageForm';
import '../App.css';

const ImageFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchImage = async () => {
        try {
          const { data } = await api.get(`/images/${id}/`);
          setInitialValues({
            ...data,
            image: data.image_url  // Usamos la URL completa de la imagen
          });
        } catch (error) {
          console.error('Error fetching image:', error);
        }
      };
      fetchImage();
    }
  }, [id]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('category', values.category);
      if (values.image instanceof File) {
        formData.append('image', values.image);
      }

      if (id) {
        await api.put(`/images/${id}/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        await api.post('/images/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      navigate('/');
    } catch (error) {
      console.error('Error saving image:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="form-page">
      <h2>{id ? 'Editar Imagen' : 'Nueva Imagen'}</h2>
      {(!id || initialValues) && (
        <ImageForm 
          initialValues={initialValues} 
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default ImageFormPage;