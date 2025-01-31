import React, { useEffect, useState } from 'react';
import api from '../services/api';
import ImageCard from '../components/ImageCard';
import { Link } from 'react-router-dom';
import '../App.css';
const categoryOptions = [
  { value: "wedding", label: "Bodas" },
  { value: "newborn", label: "Recién Nacidos" },
  { value: "portrait", label: "Retratos" },
  { value: "artistic", label: "Artístico" },
];
const ImageList = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [titleFilter, setTitleFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const params = {
          title: titleFilter,
          category: categoryFilter
        };
        
        const { data } = await api.get('/images/', { params });
        setImages(data);
      } catch (error) {
        console.error('Error fetching images:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchImages();
  }, [titleFilter, categoryFilter]);  // Se ejecuta cuando cambian los filtros

  const handleClearFilters = () => {
    setTitleFilter('');
    setCategoryFilter('');
  };
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
      
      {/* Filtros */}
      <div className="filters-container">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Buscar por título..."
            value={titleFilter}
            onChange={(e) => setTitleFilter(e.target.value)}
            className="filter-input"
          />
        </div>
        
        <div className="filter-group">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">Todas las categorías</option>
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <button 
          onClick={handleClearFilters}
          className="btn-secondary"
        >
          Limpiar Filtros
        </button>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : images.length === 0 ? (
        <p className="no-results">No se encontraron imágenes con los filtros aplicados</p>
      ) : (
        <div className="image-grid">
          {images.map(image => (
            <ImageCard 
              key={image.id} 
              image={image} 
              onDelete={() => handleDelete(image.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageList;