import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function BannerCarousel({ banners = [], onBannerClick }) {
  const defaultBanners = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&q=80',
      title: 'Flipkart Big Billion Days - Unbelievable Smartphone Deals',
      category: 'mobiles'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=1600&q=80',
      title: 'Top Laptops & Audio Devices - Up to 60% Off',
      category: 'electronics'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80',
      title: 'Fashion Mega Carnival - Extra 15% Off with Bank Cards',
      category: 'fashion'
    }
  ];

  const slideList = banners.length > 0 ? banners : defaultBanners;
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slideList.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [slideList.length]);

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slideList.length) % slideList.length);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slideList.length);
  };

  if (!slideList.length) return null;

  return (
    <div style={{ position: 'relative', width: '100%', height: '280px', overflow: 'hidden', margin: '10px 0', borderRadius: '2px', backgroundColor: '#e0e0e0' }}>
      {slideList.map((slide, index) => (
        <div
          key={index}
          onClick={() => onBannerClick && onBannerClick(slide.category || 'all')}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: index === current ? 1 : 0,
            transition: 'opacity 0.6s ease-in-out',
            cursor: 'pointer'
          }}
        >
          <img
            src={slide.image}
            alt={slide.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(transparent, rgba(0,0,0,0.65))',
            color: '#fff',
            padding: '24px 32px 14px',
            fontSize: '18px',
            fontWeight: 600
          }}>
            {slide.title}
          </div>
        </div>
      ))}

      {/* Controls */}
      <button
        onClick={prevSlide}
        style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          transform: 'translateY(-50%)',
          backgroundColor: 'rgba(255,255,255,0.85)',
          color: '#212121',
          padding: '24px 8px',
          borderTopRightRadius: '4px',
          borderBottomRightRadius: '4px',
          boxShadow: '1px 2px 10px rgba(0,0,0,0.15)',
          zIndex: 10
        }}
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={nextSlide}
        style={{
          position: 'absolute',
          top: '50%',
          right: 0,
          transform: 'translateY(-50%)',
          backgroundColor: 'rgba(255,255,255,0.85)',
          color: '#212121',
          padding: '24px 8px',
          borderTopLeftRadius: '4px',
          borderBottomLeftRadius: '4px',
          boxShadow: '-1px 2px 10px rgba(0,0,0,0.15)',
          zIndex: 10
        }}
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicators */}
      <div style={{
        position: 'absolute',
        bottom: 8,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '6px',
        zIndex: 10
      }}>
        {slideList.map((_, i) => (
          <div
            key={i}
            onClick={() => setCurrent(i)}
            style={{
              width: i === current ? '24px' : '8px',
              height: '8px',
              borderRadius: '4px',
              backgroundColor: i === current ? '#2874f0' : 'rgba(255,255,255,0.6)',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          />
        ))}
      </div>
    </div>
  );
}
