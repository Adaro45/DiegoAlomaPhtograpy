// frontend/src/pages/SlideshowBuilder.jsx
import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import api from '../services/api';
import '../App.css';

const SlideshowBuilder = () => {
    const [slideshows, setSlideshows] = useState([]);
    const [selectedSlideshow, setSelectedSlideshow] = useState(null);
    const [availableImages, setAvailableImages] = useState([]);
    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const [slidesRes, imagesRes] = await Promise.all([
                api.get('/slideshows/'),
                api.get('/slideshows/available_images/')
            ]);
            setSlideshows(slidesRes.data);
            setAvailableImages(imagesRes.data);
        };
        fetchData();
    }, []);

    const updateSlideshowOrder = async (updatedImages) => {
        const orderedImages = updatedImages.map((img, index) => ({
            id: img.id,
            order: index
        }));
        
        await api.patch(`/slideshows/${selectedSlideshow.id}/`, {
            images: orderedImages
        });
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="builder-container">
                <div className="slideshow-selector">
                    <h2>Slideshows Existentes</h2>
                    <select onChange={(e) => setSelectedSlideshow(slideshows.find(s => s.id == e.target.value))}>
                        <option value="">Nuevo Slideshow</option>
                        {slideshows.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </select>
                </div>

                <div className="builder-panels">
                    <ImagePanel 
                        images={availableImages} 
                        type="available"
                        onAdd={async (image) => {
                            await api.post(`/slideshows/${selectedSlideshow.id}/images/`, { image: image.id });
                            // Actualizar estados
                        }}
                    />
                    
                    <SlideshowPanel 
                        slideshow={selectedSlideshow} 
                        onReorder={updateSlideshowOrder}
                        onPreview={() => setShowPreview(!showPreview)}
                    />
                </div>

                {showPreview && selectedSlideshow && (
                    <SlideshowPreview 
                        slideshow={selectedSlideshow} 
                        onClose={() => setShowPreview(false)}
                    />
                )}
            </div>
        </DndProvider>
    );
};

// Componentes Drag and Drop
const ImageCard = ({ image, type, index, moveImage }) => {
    const [{ isDragging }, drag] = useDrag({
        type: 'IMAGE',
        item: { id: image.id, index, type },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, drop] = useDrop({
        accept: 'IMAGE',
        hover: (item) => {
            if (item.index !== index || item.type !== type) {
                moveImage(item.index, index, item.type, type);
                item.index = index;
                item.type = type;
            }
        },
    });

    return (
        <div 
            ref={(node) => drag(drop(node))}
            className={`image-card ${isDragging ? 'dragging' : ''}`}
        >
            <img src={image.image_url} alt={image.title} />
            <span>{image.title}</span>
        </div>
    );
};

export default SlideshowBuilder;