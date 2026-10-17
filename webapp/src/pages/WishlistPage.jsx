import React from 'react';
import { useShop } from '../context/ShopContext';
import { Heart, Trash2, ShoppingCart, Star } from 'lucide-react';

export default function WishlistPage({ onSelectProduct }) {
  const { wishlist, toggleWishlist, addToCart, user, openLoginModal } = useShop();

  if (!user) {
    return (
      <div style={{ maxWidth: '800px', margin: '40px auto', backgroundColor: '#fff', padding: '60px', textAlign: 'center', borderRadius: '2px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
        <Heart size={48} color="#ff4343" style={{ marginBottom: '16px' }} />
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>Please log in to view your wishlist</h2>
        <button
          onClick={openLoginModal}
          style={{ backgroundColor: '#2874f0', color: '#fff', fontWeight: 600, padding: '10px 32px', borderRadius: '2px', marginTop: '12px' }}
        >
          LOGIN
        </button>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div style={{ maxWidth: '900px', margin: '40px auto', backgroundColor: '#fff', padding: '60px', textAlign: 'center', borderRadius: '2px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
        <img
          src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/mywishlist-empty_39f4ac.png"
          alt="Empty Wishlist"
          style={{ width: '220px', marginBottom: '20px' }}
        />
        <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#212121', marginBottom: '8px' }}>Empty Wishlist</h2>
        <p style={{ color: '#878787', fontSize: '14px' }}>You have no items in your wishlist. Start adding!</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1240px', margin: '14px auto', padding: '0 12px' }}>
      <div style={{ backgroundColor: '#fff', borderRadius: '2px', boxShadow: '0 1px 2px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #f0f0f0', fontWeight: 600, fontSize: '17px' }}>
          My Wishlist ({wishlist.length})
        </div>

        {wishlist.map((item) => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              gap: '24px',
              padding: '24px',
              borderBottom: '1px solid #f0f0f0',
              alignItems: 'center'
            }}
          >
            <div
              onClick={() => onSelectProduct(item)}
              style={{ width: '100px', height: '100px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <img src={item.primary_image} alt={item.title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            </div>

            <div style={{ flex: 1 }}>
              <div
                onClick={() => onSelectProduct(item)}
                style={{ fontSize: '16px', fontWeight: 500, color: '#212121', cursor: 'pointer', marginBottom: '6px' }}
              >
                {item.title}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span className="rating-badge">
                  {item.rating || '4.5'} <Star size={10} fill="#fff" strokeWidth={0} />
                </span>
                <span style={{ fontSize: '12px', color: '#878787' }}>({(item.rating_count || 120).toLocaleString()})</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                <span style={{ fontSize: '18px', fontWeight: 700, color: '#212121' }}>
                  ₹{(item.selling_price || 0).toLocaleString()}
                </span>
                {item.original_price > item.selling_price && (
                  <>
                    <span style={{ fontSize: '14px', color: '#878787', textDecoration: 'line-through' }}>
                      ₹{(item.original_price || 0).toLocaleString()}
                    </span>
                    <span style={{ fontSize: '14px', color: '#388e3c', fontWeight: 600 }}>
                      {item.discount_percent || 15}% off
                    </span>
                  </>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
              <button
                onClick={() => { addToCart(item); toggleWishlist(item); }}
                style={{
                  backgroundColor: '#ff9f00',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '13px',
                  padding: '10px 20px',
                  borderRadius: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <ShoppingCart size={16} /> MOVE TO CART
              </button>

              <button
                onClick={() => toggleWishlist(item)}
                style={{ background: 'none', color: '#878787', padding: '8px', cursor: 'pointer' }}
                title="Remove from Wishlist"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
