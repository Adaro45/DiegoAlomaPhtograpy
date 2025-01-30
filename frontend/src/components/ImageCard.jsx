import React from 'react';
import { Link } from 'react-router-dom';
import { FiTrash2, FiEdit } from 'react-icons/fi';
import '../App.css';

const ImageCard = ({ image, onDelete }) => {
  return (
    <div className="image-card">
      <img 
        src={image.image} 
        alt={image.title} 
        className="thumbnail"
      />
      <div className="card-content">
        <h3>{image.title}</h3>
        <span className="category-badge">{image.category}</span>
        <div className="card-actions">
          <button onClick={() => onDelete(image.id)} className="btn-danger">
            <FiTrash2 />
          </button>
          <Link to={`/images/${image.id}/edit`} className="btn-edit">
            <FiEdit />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;