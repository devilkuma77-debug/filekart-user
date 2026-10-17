import React, { useState, useEffect, useRef } from 'react';
import { Clock, ChevronRight, ChevronLeft } from 'lucide-react';
import ProductCard from './ProductCard';

export default function DealsSlider({
  title = 'Deals of the Day',
  products = [],
  onSelectProduct,
  onViewAll,
  sideBanner = null,
  showTimer = true
}) {
  const [timeLeft, setTimeLeft] = useState({ hours: 16, minutes: 24, seconds: 35 });
  const rowRef = useRef(null);

  useEffect(() => {
    if (!showTimer) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [showTimer]);

  const scrollLeft = () => {
    if (rowRef.current) rowRef.current.scrollBy({ left: -420, behavior: 'smooth' });
  };

  const scrollRight = () => {
    if (rowRef.current) rowRef.current.scrollBy({ left: 420, behavior: 'smooth' });
  };

  if (!products.length) return null;

  return (
    <div className="deals-block-wrapper">
      {/* Left Slider Content */}
      <div className="deals-left-content">
        <div className="deals-header">
          <div className="deals-title-area">
            <h2 className="deals-title">{title}</h2>
            {showTimer && (
              <div className="deals-timer">
                <Clock size={16} color="#878787" />
                <span>
                  {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s Left
                </span>
              </div>
            )}
          </div>

          <button className="deals-view-btn" onClick={onViewAll}>
            View All
          </button>
        </div>

        <div style={{ position: 'relative' }}>
          <button
            onClick={scrollLeft}
            className="deals-slider-nav-btn deals-slider-prev"
            style={{
              position: 'absolute',
              left: -8,
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(255,255,255,0.95)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              zIndex: 10,
              width: '36px',
              height: '76px',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '0 4px 4px 0',
              border: '1px solid #e0e0e0'
            }}
          >
            <ChevronLeft size={24} color="#212121" />
          </button>

          <div className="product-slider-row" ref={rowRef}>
            {products.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
                onSelectProduct={onSelectProduct}
              />
            ))}
          </div>

          <button
            onClick={scrollRight}
            className="deals-slider-nav-btn deals-slider-next"
            style={{
              position: 'absolute',
              right: -8,
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(255,255,255,0.95)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              zIndex: 10,
              width: '36px',
              height: '76px',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '4px 0 0 4px',
              border: '1px solid #e0e0e0'
            }}
          >
            <ChevronRight size={24} color="#212121" />
          </button>
        </div>
      </div>

      {/* Optional Right Promotional Ad Banner (Authentic Flipkart Home layout) */}
      {sideBanner && (
        <div className="deals-right-banner" onClick={onViewAll}>
          <img src={sideBanner} alt="Featured Offer" />
        </div>
      )}
    </div>
  );
}
