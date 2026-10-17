import React from 'react';
import { useShop } from '../context/ShopContext';
import { Star, Heart } from 'lucide-react';

export default function ProductCard({ product, onSelectProduct, className = '', style = {} }) {
  const { toggleWishlist, isInWishlist } = useShop();
  const wishlisted = isInWishlist(product.id);

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div
      className={`fk-product-card ${className}`}
      onClick={() => onSelectProduct && onSelectProduct(product)}
      style={style}
    >
      {/* Wishlist Heart */}
      <button
        className={`card-wishlist-btn ${wishlisted ? 'active' : ''}`}
        onClick={handleWishlistClick}
        title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
      >
        <Heart size={16} fill={wishlisted ? '#ff4343' : 'none'} color={wishlisted ? '#ff4343' : '#999'} />
      </button>

      {/* Image */}
      <div className="card-img-wrap">
        <img
          src={product.primary_image || (product.images && product.images[0])}
          alt={product.title}
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=400';
          }}
        />
      </div>

      {/* Title */}
      <div className="card-title" title={product.title}>
        {product.title}
      </div>

      {/* Ratings & Assured */}
      <div style={{ display: 'flex', alignItems: 'center', margin: '4px 0' }}>
        <span className="rating-badge">
          {product.rating || '4.2'} <Star size={10} fill="#fff" strokeWidth={0} />
        </span>
        <span className="rating-count">({(product.rating_count || 120).toLocaleString()})</span>

        {product.is_assured ? (
          <img
            src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png"
            alt="Flipkart Assured"
            className="assured-badge"
          />
        ) : null}
      </div>

      {/* Pricing */}
      <div className="card-pricing">
        <span className="price-current">₹{(product.selling_price || 0).toLocaleString()}</span>
        {product.original_price > product.selling_price && (
          <>
            <span className="price-original">₹{(product.original_price || 0).toLocaleString()}</span>
            <span className="price-discount">{product.discount_percent || 15}% off</span>
          </>
        )}
      </div>

      {/* Delivery Tag */}
      <div style={{ fontSize: '11px', color: '#2874f0', marginTop: '6px', fontWeight: '500' }}>
        Free delivery
      </div>
    </div>
  );
}
