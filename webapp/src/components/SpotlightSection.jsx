import React, { useRef } from 'react';
import FestiveBulbStrip from './FestiveBulbStrip';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

export default function SpotlightSection({ onSelectProduct, onSelectCategory }) {
  const scrollRef = useRef(null);

  const spotlightItems = [
    {
      id: 1,
      title: 'Athletic Running Shoes',
      subtitle: 'From ₹899*',
      category: 'Fashion',
      slug: 'sparx-men-athletic-lightweight-running-shoes',
      tag: 'Min 50% Off',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
      description: 'Charcoal Grey & White Running Shoes'
    },
    {
      id: 2,
      title: 'boAt True Wireless Earbuds',
      subtitle: 'From ₹999*',
      category: 'Electronics',
      slug: 'boat-airdopes-141-tws-earbuds-42h',
      tag: 'Up to 75% Off',
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80',
      description: 'boAt Airdopes 141 with 42H Playtime'
    },
    {
      id: 3,
      title: 'Luxury Chronograph Watch',
      subtitle: 'Under ₹1,499*',
      category: 'Fashion',
      slug: 'curren-luxury-men-chronograph-watch-leather',
      tag: 'Premium Gift Box',
      image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&q=80',
      description: 'Square Chronograph with Leather Strap'
    },
    {
      id: 4,
      title: 'Stainless Steel Bottles',
      subtitle: 'Set of 4 | ₹1,299*',
      category: 'Home & Kitchen',
      slug: 'milton-thermosteel-stainless-steel-bottle-set-of-4',
      tag: 'Vacuum Insulated',
      image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80',
      description: 'Milton 1000ml Steel Water Bottles'
    },
    {
      id: 5,
      title: 'Sony ANC Headphones',
      subtitle: 'From ₹26,990*',
      category: 'Electronics',
      slug: 'sony-wh-1000xm5-noise-cancelling-headphones',
      tag: 'Top Rated',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
      description: 'Industry Leading Noise Cancellation'
    },
    {
      id: 6,
      title: 'Apple iPhone 15',
      subtitle: 'From ₹65,999*',
      category: 'Mobiles',
      slug: 'apple-iphone-15-black-128gb',
      tag: 'Extra Bank Offer',
      image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&q=80',
      description: 'Dynamic Island, 48MP Camera'
    }
  ];

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -360 : 360;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleCardClick = (item) => {
    if (onSelectProduct) {
      onSelectProduct({
        slug: item.slug,
        title: item.title,
        selling_price: item.subtitle,
        primary_image: item.image
      });
    } else if (onSelectCategory) {
      onSelectCategory(item.category.toLowerCase());
    }
  };

  return (
    <div className="spotlight-container">
      {/* Top Diwali Bulb Garland */}
      <FestiveBulbStrip />

      {/* Royal Blue Header Ribbon Banner */}
      <div className="spotlight-banner-header">
        <div className="spotlight-title-text">
          <Sparkles size={22} color="#ffeb3b" />
          <span>Spotlight's on</span>
        </div>

        {/* View All & Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => onSelectCategory && onSelectCategory('all')}
            style={{
              backgroundColor: '#2874f0',
              color: '#ffffff',
              padding: '6px 16px',
              borderRadius: '4px',
              fontSize: '13px',
              fontWeight: 700,
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}
          >
            VIEW ALL
          </button>

          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => handleScroll('left')}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => handleScroll('right')}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Cards Slider */}
      <div
        ref={scrollRef}
        style={{
          display: 'flex',
          gap: '16px',
          padding: '20px',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          backgroundColor: '#f1f5f9'
        }}
      >
        {spotlightItems.map((item) => (
          <div
            key={item.id}
            onClick={() => handleCardClick(item)}
            className="spotlight-item-card"
            style={{
              minWidth: '240px',
              maxWidth: '240px',
              flex: '0 0 240px',
              backgroundColor: '#ffffff'
            }}
          >
            {/* Tag Badge */}
            <div style={{
              position: 'absolute',
              top: 10,
              left: 10,
              backgroundColor: '#e8f5e9',
              color: '#2e7d32',
              fontSize: '11px',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '4px'
            }}>
              {item.tag}
            </div>

            {/* Product Image */}
            <div className="spotlight-img-box">
              <img src={item.image} alt={item.title} />
            </div>

            {/* Details */}
            <div style={{ width: '100%', marginTop: '6px' }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 700,
                color: '#212121',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {item.title}
              </div>

              <div style={{
                fontSize: '15px',
                fontWeight: 800,
                color: '#388e3c',
                margin: '4px 0 2px'
              }}>
                {item.subtitle}
              </div>

              <div style={{
                fontSize: '11.5px',
                color: '#878787',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {item.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
