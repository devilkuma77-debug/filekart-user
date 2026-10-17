import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import HeroFestiveBanners from '../components/HeroFestiveBanners';
import TclTvBanner from '../components/TclTvBanner';
import SpotlightSection from '../components/SpotlightSection';
import DealsSlider from '../components/DealsSlider';
import { ShieldCheck, Truck, RefreshCw, Award } from 'lucide-react';

export default function HomePage({ onSelectProduct, onSelectCategory, onViewCategory }) {
  const [allProducts, setAllProducts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [electronics, setElectronics] = useState([]);
  const [fashion, setFashion] = useState([]);
  const [appliances, setAppliances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      try {
        const prodRes = await api.getProducts({ limit: 60 });
        const prods = (prodRes && prodRes.products) || [];
        setAllProducts(prods);

        setDeals(prods.filter(p => p.is_deal_of_day || p.discount_percent >= 30));
        setElectronics(prods.filter(p => p.category_name === 'Electronics' || p.category_name === 'Mobiles'));
        setFashion(prods.filter(p => p.category_name === 'Fashion'));
        setAppliances(prods.filter(p => p.category_name === 'Appliances' || p.category_name === 'Home & Kitchen'));
      } catch (e) {
        console.error('Home load error:', e);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  const handleSelectBannerOrSpotlight = (item) => {
    let found = allProducts.find(p => p.slug === item.slug);
    if (!found && item.title) {
      found = allProducts.find(p => p.title.toLowerCase().includes(item.title.toLowerCase().slice(0, 10)));
    }

    if (found) {
      onSelectProduct(found);
    } else {
      // Complete resilient product object so detail page renders beautifully
      onSelectProduct({
        id: Math.floor(Math.random() * 1000) + 100,
        title: item.title,
        slug: item.slug || 'product-deal',
        selling_price: typeof item.selling_price === 'number' ? item.selling_price : 45990,
        original_price: 64990,
        discount_percent: 29,
        rating: 4.6,
        rating_count: 3200,
        review_count: 480,
        is_assured: 1,
        primary_image: item.image || item.primary_image || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
        images: [
          item.image || item.primary_image || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
          'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80'
        ],
        highlights: [
          'High Performance Next-Gen Architecture',
          'Flipkart Assured Genuine Quality Check',
          'Fast Doorstep Delivery with 7 Days Replacement Policy',
          'Bank Card Discounts Available on Checkout'
        ],
        specifications: {
          'Brand': 'Flipkart Assured',
          'Model Name': item.title,
          'Warranty': '1 Year Manufacturer Warranty'
        }
      });
    }
  };

  const brands = [
    { name: 'Apple', logo: 'https://cdn-icons-png.flaticon.com/512/0/747.png' },
    { name: 'Samsung', logo: 'https://cdn-icons-png.flaticon.com/512/5969/5969116.png' },
    { name: 'Sony', logo: 'https://cdn-icons-png.flaticon.com/512/5969/5969188.png' },
    { name: 'boAt', logo: 'https://cdn-icons-png.flaticon.com/512/3659/3659898.png' },
    { name: 'Nike', logo: 'https://cdn-icons-png.flaticon.com/512/732/732229.png' },
    { name: 'Puma', logo: 'https://cdn-icons-png.flaticon.com/512/732/732230.png' },
    { name: 'LG', logo: 'https://cdn-icons-png.flaticon.com/512/882/882731.png' },
    { name: 'HP', logo: 'https://cdn-icons-png.flaticon.com/512/882/882736.png' }
  ];

  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '0 12px' }}>
      {/* 1. Hero 3-Column Festive Banners (Row 1 of User Screenshot) */}
      <HeroFestiveBanners
        onSelectProduct={handleSelectBannerOrSpotlight}
        onSelectCategory={onSelectCategory}
      />

      {/* 2. Full-Width TCL AI QLED TV Ad Banner (Row 2 of User Screenshot) */}
      <TclTvBanner
        onSelectProduct={handleSelectBannerOrSpotlight}
        onSelectCategory={onSelectCategory}
      />

      {/* 3. Spotlight's On Section (Row 3 of User Screenshot) */}
      <SpotlightSection
        onSelectProduct={handleSelectBannerOrSpotlight}
        onSelectCategory={onSelectCategory}
      />

      {/* 4. Flipkart Trust Strip */}
      <div className="trust-strip-grid" style={{
        backgroundColor: '#fff',
        padding: '16px 20px',
        margin: '14px 0 16px',
        borderRadius: '6px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Truck size={28} color="#2874f0" />
          <div>
            <div style={{ fontWeight: 700, fontSize: '13px' }}>Free & Fast Delivery</div>
            <div style={{ color: '#878787', fontSize: '11px' }}>On millions of Flipkart Assured orders</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <RefreshCw size={28} color="#2874f0" />
          <div>
            <div style={{ fontWeight: 700, fontSize: '13px' }}>7 Days Easy Replacement</div>
            <div style={{ color: '#878787', fontSize: '11px' }}>Hassle-free doorstep pickup & exchange</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ShieldCheck size={28} color="#2874f0" />
          <div>
            <div style={{ fontWeight: 700, fontSize: '13px' }}>100% Genuine Products</div>
            <div style={{ color: '#878787', fontSize: '11px' }}>Direct from brand authorized sellers</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Award size={28} color="#2874f0" />
          <div>
            <div style={{ fontWeight: 700, fontSize: '13px' }}>Flipkart Assured</div>
            <div style={{ color: '#878787', fontSize: '11px' }}>Double quality and speed check</div>
          </div>
        </div>
      </div>

      {/* 5. Deals of the Day (with right promotional flyer) */}
      <DealsSlider
        title="Deals of the Day"
        products={deals.length > 0 ? deals : electronics}
        onSelectProduct={onSelectProduct}
        onViewAll={() => onViewCategory('deals')}
        sideBanner="https://rukminim2.flixcart.com/fk-p-flap/530/800/image/5a51a995e865f5a2.jpg?q=20"
        showTimer={true}
      />

      {/* 6. Best of Electronics */}
      <DealsSlider
        title="Best of Electronics & Gadgets"
        products={electronics}
        onSelectProduct={onSelectProduct}
        onViewAll={() => onViewCategory('electronics')}
        sideBanner="https://rukminim2.flixcart.com/fk-p-flap/530/800/image/3b999a38f3cf5429.jpg?q=20"
        showTimer={false}
      />

      {/* 7. Trending in Fashion & Lifestyle */}
      {fashion.length > 0 && (
        <DealsSlider
          title="Trending in Fashion, Footwear & Accessories"
          products={fashion}
          onSelectProduct={onSelectProduct}
          onViewAll={() => onViewCategory('fashion')}
          showTimer={false}
        />
      )}

      {/* 8. TVs & Large Appliances */}
      {appliances.length > 0 && (
        <DealsSlider
          title="Smart TVs, Refrigerator & Home Living"
          products={appliances}
          onSelectProduct={onSelectProduct}
          onViewAll={() => onViewCategory('appliances')}
          showTimer={false}
        />
      )}

      {/* 9. Top Brands Strip */}
      <div style={{ backgroundColor: '#fff', padding: '20px 24px', borderRadius: '6px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', margin: '16px 0' }}>
        <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '14px', color: '#212121' }}>
          Featured Brand Stores
        </h3>
        <div className="featured-brands-grid" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          {brands.map((b, i) => (
            <div
              key={i}
              onClick={() => onViewCategory(b.name)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 18px',
                border: '1px solid #e0e0e0',
                borderRadius: '6px',
                cursor: 'pointer',
                backgroundColor: '#fafafa',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#2874f0'; e.currentTarget.style.backgroundColor = '#f0f5ff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e0e0e0'; e.currentTarget.style.backgroundColor = '#fafafa'; }}
            >
              <img src={b.logo} alt={b.name} style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
              <strong style={{ fontSize: '13px', color: '#212121' }}>{b.name}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
