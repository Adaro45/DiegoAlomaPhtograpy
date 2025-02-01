import React from 'react';
import { Link } from 'react-router-dom';
import { VscTrash, VscEdit } from 'react-icons/vsc';
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
        <h3 className='card-title'>{image.title}</h3>
        <div className="card-actions">
        <span className="category-badge">{image.category}</span>
          <button onClick={() => onDelete(image.id)} className="btn-danger">
            <VscTrash />
          </button>
          <Link to={`/images/${image.id}/edit`} className="btn-edit">
            <VscEdit />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;