import React, { useEffect, useState } from 'react';
import api from '../services/api';
import '../App.css';

const SlideshowPreview = ({ slideshow, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [images, setImages] = useState([]);

    useEffect(() => {
        const fetchImages = async () => {
            const { data } = await api.get(`/slideshows/${slideshow.id}/`);
            setImages(data.images);
        };
        fetchImages();
    }, [slideshow]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % images.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [images]);

    const getPositionClass = (index) => {
        const positions = {
            [currentIndex]: 'center',
            [(currentIndex - 1 + images.length) % images.length]: 'left',
            [(currentIndex + 1) % images.length]: 'right'
        };
        return positions[index] || 'hidden';
    };

    return (
        <div className="preview-overlay">
            <div className="preview-content">
                <div className="logo-overlay">
                    <img src="/logo-fotografo.png" alt="Logo" className="logo" />
                </div>
                <div className="slider-container">
                    {images.map((image, index) => (
                        <div 
                            key={image.id}
                            className={`slider-item ${getPositionClass(index)}`}
                        >
                            <img 
                                src={image.image_url} 
                                alt={image.title} 
                                className="slider-image"
                            />
                        </div>
                    ))}
                </div>
                <button onClick={onClose} className="close-btn">Cerrar Vista Previa</button>
            </div>
        </div>
    );
};