import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import ProductCard from '../components/ProductCard';
import productsData from '../data/products.json';
import './ProductListing.css';

const ProductListing = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    sort: 'new-arrivals',
    stock: ''
  });

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Use local static data instead of backend API
      let filteredProducts = productsData;
      
      if (filters.category) {
        filteredProducts = filteredProducts.filter(p => p.category === filters.category);
      }
      
      if (filters.stock === 'in-stock') {
        filteredProducts = filteredProducts.filter(p => p.stock > 0);
      }
      
      if (filters.sort === 'price-low-high') {
        filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
      }
      
      setProducts(filteredProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="product-listing-page">
      <Helmet>
        <title>Maasaiweb | Authentic Handmade African Crafts & Luxury Decor</title>
        <meta name="description" content="Discover premium, story-driven African crafts. From Maasai jewelry to hand-carved decor, every piece at Maasaiweb tells a story of heritage and heart." />
        <meta property="og:title" content="Maasaiweb | Authentic Handmade African Crafts" />
        <meta property="og:description" content="Luxury African artistry targeting international collectors. Shop ethical, handcrafted treasures." />
        <meta property="og:type" content="website" />
      </Helmet>

      <header className="listing-header">
        <h1 className="display-title">Authentic African Artistry</h1>
        <p className="subtitle">Discover handmade treasures with stories of heritage and heart.</p>
      </header>

      <div className="controls-bar">
        <div className="filters">
          <select name="category" value={filters.category} onChange={handleFilterChange}>
            <option value="">All Categories</option>
            <option value="Jewelry">Jewelry</option>
            <option value="Decor">Decor</option>
            <option value="Fashion">Fashion</option>
            <option value="Crafts">Crafts</option>
          </select>

          <select name="stock" value={filters.stock} onChange={handleFilterChange}>
            <option value="">All Availability</option>
            <option value="in-stock">In Stock Only</option>
          </select>
        </div>

        <div className="sorting">
          <select name="sort" value={filters.sort} onChange={handleFilterChange}>
            <option value="new-arrivals">New Arrivals</option>
            <option value="price-low-high">Price: Low to High</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loader">Gathering treasures...</div>
      ) : (
        <div className="product-grid">
          {products.length > 0 ? (
            products.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
              />
            ))
          ) : (
            <div className="no-products">No crafts found matching your filters.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductListing;
