import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import productsData from '../data/products.json';
import './ProductDetail.css';

const ProductDetail = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      // simulate network request to static data
      const productFound = productsData.find(p => String(p.id) === slug || p.name.toLowerCase().replace(/ /g, '-') === slug);
      setProduct(productFound || null);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="detail-loader">Unveiling the story...</div>;
  if (!product) return <div className="detail-error">Heritage not found. <Link to="/">Return to Gallery</Link></div>;

  return (
    <div className="product-detail-page">
      <Helmet>
        <title>{product.name} | Maasaiweb Authentic African Crafts</title>
        <meta name="description" content={product.short_description} />
        <meta property="og:title" content={`${product.name} | Maasaiweb`} />
        <meta property="og:description" content={product.cultural_history.substring(0, 160)} />
        <meta property="og:image" content={product.imageUrl} />
        <meta property="og:type" content="product" />
      </Helmet>
      
      <Link to="/" className="back-link">← Back to Gallery</Link>
      
      <div className="product-layout">
        <div className="image-section">
          <img src={product.imageUrl} alt={product.name} className="main-image" />
        </div>
        
        <div className="content-section">
          <span className="category-tag">{product.category}</span>
          <h1 className="detail-name">{product.name}</h1>
          <p className="detail-price">${product.price.toFixed(2)}</p>
          
          <div className="stock-info">
            {product.stock > 0 ? (
              <span className="status in-stock">✓ Available for Global Shipping</span>
            ) : (
              <span className="status out-of-stock">✕ Currently Out of Stock</span>
            )}
          </div>

          <div className="description-block">
            <h3>The Essence</h3>
            <p>{product.short_description}</p>
          </div>

          <div className="story-block">
            <h3>Cultural Heritage</h3>
            <p>{product.cultural_history}</p>
          </div>

          <button 
            className="buy-button" 
            disabled={product.stock <= 0}
            onClick={() => {
              const text = encodeURIComponent(`Hi, I'm interested in purchasing the ${product.name} (ID: ${product.id}) for $${product.price.toFixed(2)}. Please let me know how to proceed!`);
              window.open(`https://wa.me/254140526299?text=${text}`, '_blank');
            }}
            style={{ background: '#25D366' }}
          >
            {product.stock > 0 ? 'Inquire on WhatsApp' : 'Sold Out'}
          </button>

          <footer className="product-footer">
            <div className="footer-item">🌍 Master Artisan Crafted</div>
            <div className="footer-item">🛡 Authentic Fair Trade</div>
            <div className="footer-item">✈ Worldwide Sourcing</div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
