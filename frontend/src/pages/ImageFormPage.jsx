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
      
      // Manejar imagen existente vs nueva
      if (values.image instanceof File) {
        formData.append('image', values.image);
      } else if (!id) {  // Requerida solo para creación
        throw new Error('La imagen es requerida');
      }
  
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-CSRFToken': getCookie('csrftoken')  // Si usas CSRF
        }
      };
  
      if (id) {
        await api.put(`/images/${id}/`, formData, config);  // Usar PATCH
      } else {
        await api.post('/images/', formData, config);
      }
      navigate('/');
    } catch (error) {
      console.error('Error saving image:', error.response?.data || error);
    } finally {
      setSubmitting(false);
    }
  };
  
  // Función auxiliar para CSRF (si es necesario)
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
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