import React, { useEffect, useState } from 'react';
import api from '../services/api';
import ImageCard from '../components/ImageCard';
import { Link } from 'react-router-dom';
import '../App.css';

const ImageList = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const { data } = await api.get('/images/');
        setImages(data);
      } catch (error) {
        console.error('Error fetching images:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('¿Seguro que quieres eliminar esta imagen?')) {
      await api.delete(`/images/${id}/`);
      setImages(images.filter(image => image.id !== id));
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Galería de Imágenes</h1>
        <Link to="/images/new" className="btn-primary">
          Nueva Imagen
        </Link>
      </div>
      
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="image-grid">
          {images.map(image => (
            <ImageCard 
              key={image.id} 
              image={image} 
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageList;