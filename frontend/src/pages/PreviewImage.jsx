import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import '../App.css';

const PreviewImage = () => {
  const { id } = useParams();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const { data } = await api.get(`/images/${id}/`);
        setImage(data);
      } catch (error) {
        console.error('Error fetching image:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchImage();
  }, [id]);

  if (loading) return <div>Cargando...</div>;
  if (!image) return <div>Imagen no encontrada</div>;

  return (
    <div className="preview-container">
      <h1>{image.title}</h1>
      <div className="image-wrapper">
        <img 
          src={image.image_url} 
          alt={image.title} 
          className="preview-image"
        />
      </div>
      <div className="image-meta">
        <p>Categoría: {image.category}</p>
        <p>Fecha de creación: {new Date(image.creation_date).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default PreviewImage;