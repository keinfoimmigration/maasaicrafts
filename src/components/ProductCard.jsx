import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { id, name, price, stock, imageUrl, short_description, cultural_history } = product;

  const getStockStatus = () => {
    if (stock <= 0) return { text: 'Out of Stock', class: 'out-of-stock', disabled: true };
    if (stock < 10) return { text: `Only ${stock} left 🔥`, class: 'low-stock', disabled: false };
    return { text: 'In Stock', class: 'in-stock', disabled: false };
  };

  const status = getStockStatus();

  const handleWhatsApp = (e) => {
    e.preventDefault();
    const text = encodeURIComponent(`Hi, I'm interested in purchasing the ${name} (ID: ${id}) for $${price}. Please let me know how to proceed!`);
    window.open(`https://wa.me/254140526299?text=${text}`, '_blank');
  };

  return (
    <div className="product-card">
      <Link to={`/product/${id}`} className="product-link" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="product-image-container">
          <img 
            src={imageUrl} 
            alt={name} 
            loading="lazy" 
            className="product-image"
          />
          <div className="product-category-badge">{product.category}</div>
        </div>
        
        <div className="product-info">
          <h3 className="product-name">{name}</h3>
        </div>
      </Link>
      
      <div className="product-info">
        <p className="product-price">${price.toFixed(2)}</p>
        
        <div className={`stock-status ${status.class}`}>
          {status.text}
        </div>
        
        <p className="product-description">{short_description}</p>
        
        <div className="cultural-snippet">
          <strong>Story:</strong> {cultural_history.substring(0, 80)}...
        </div>
        
        <button 
          className="add-to-cart-btn" 
          disabled={status.disabled}
          onClick={handleWhatsApp}
          style={{ background: '#25D366' }}
        >
          {status.disabled ? 'Sold Out' : 'Inquire on WhatsApp'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
