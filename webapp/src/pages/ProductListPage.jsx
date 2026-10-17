import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';
import { Star, Filter, RotateCcw, LayoutGrid, List, Heart, ShoppingCart } from 'lucide-react';

export default function ProductListPage({ onSelectProduct, initialCategory, searchKeyword }) {
  const { searchQuery, setSearchQuery, activeCategory, setActiveCategory, addToCart, toggleWishlist, isInWishlist } = useShop();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // View mode: 'list' or 'grid'
  const [viewMode, setViewMode] = useState('list');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filters
  const [category, setCategory] = useState(initialCategory || activeCategory || 'all');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [brandSearch, setBrandSearch] = useState('');
  const [maxPrice, setMaxPrice] = useState(100000);
  const [minRating, setMinRating] = useState(0);
  const [minDiscount, setMinDiscount] = useState(0);
  const [onlyAssured, setOnlyAssured] = useState(false);
  const [sortBy, setSortBy] = useState('popularity');

  const allBrands = ['Apple', 'Samsung', 'Sony', 'boAt', 'Nike', 'Puma', 'LG', 'HP'];
  const categoriesList = [
    { label: 'All Categories', value: 'all' },
    { label: 'Mobiles & Smartphones', value: 'mobiles' },
    { label: 'Electronics & Audio', value: 'electronics' },
    { label: 'TVs & Appliances', value: 'appliances' },
    { label: 'Fashion & Footwear', value: 'fashion' },
    { label: 'Home & Kitchen', value: 'home-kitchen' },
    { label: 'Beauty & Personal Care', value: 'beauty-grooming' },
    { label: 'Grocery & Essentials', value: 'grocery' }
  ];

  useEffect(() => {
    async function fetchFiltered() {
      setLoading(true);
      try {
        const params = {
          limit: 50,
          sort: sortBy
        };

        if (category && category !== 'all' && category !== 'deals') {
          params.category = category;
        }
        if (category === 'deals') {
          params.deal_of_day = '1';
        }
        const effectiveSearch = searchKeyword || searchQuery;
        if (effectiveSearch) {
          params.search = effectiveSearch;
        }
        if (selectedBrands.length > 0) {
          params.brand = selectedBrands.join(',');
        }
        if (maxPrice < 100000) {
          params.maxPrice = maxPrice;
        }
        if (minRating > 0) {
          params.rating = minRating;
        }
        if (onlyAssured) {
          params.assured = '1';
        }

        const res = await api.getProducts(params);
        if (res.success && res.products) {
          let list = res.products;
          if (minDiscount > 0) {
            list = list.filter(p => (p.discount_percent || 0) >= minDiscount);
          }
          setProducts(list);
          setTotalCount(res.total || list.length);
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchFiltered();
  }, [category, searchQuery, searchKeyword, selectedBrands, maxPrice, minRating, minDiscount, onlyAssured, sortBy]);

  const toggleBrand = (b) => {
    setSelectedBrands(prev =>
      prev.includes(b) ? prev.filter(item => item !== b) : [...prev, b]
    );
  };

  const resetFilters = () => {
    setCategory('all');
    setActiveCategory('all');
    setSearchQuery('');
    setSelectedBrands([]);
    setMaxPrice(100000);
    setMinRating(0);
    setMinDiscount(0);
    setOnlyAssured(false);
    setSortBy('popularity');
  };

  return (
    <div className="product-list-layout" style={{ maxWidth: '1360px', margin: '12px auto', padding: '0 12px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
      {/* Mobile Filter Backdrop */}
      {mobileFiltersOpen && (
        <div
          onClick={() => setMobileFiltersOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 2599
          }}
        />
      )}

      {/* ================= LEFT FILTERS SIDEBAR ================= */}
      <aside
        className={`product-filters-sidebar ${mobileFiltersOpen ? 'mobile-open' : ''}`}
        style={{
          width: '280px',
          backgroundColor: '#fff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          borderRadius: '2px',
          padding: '16px',
          position: 'sticky',
          top: '80px',
          maxHeight: 'calc(100vh - 100px)',
          overflowY: 'auto'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0', paddingBottom: '12px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '17px', fontWeight: 700, color: '#212121' }}>
            <Filter size={18} color="#2874f0" /> Filters
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={resetFilters}
              style={{ background: 'none', color: '#2874f0', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
            >
              <RotateCcw size={12} /> CLEAR
            </button>
            {/* Close button on mobile */}
            <button
              className="mobile-filter-close"
              onClick={() => setMobileFiltersOpen(false)}
              style={{ background: 'none', cursor: 'pointer', color: '#64748b' }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Categories Accordion */}
        <div style={{ marginBottom: '20px', borderBottom: '1px solid #f0f0f0', paddingBottom: '16px' }}>
          <div style={{ fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', color: '#212121', marginBottom: '10px', letterSpacing: '0.4px' }}>
            CATEGORIES
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
            {categoriesList.map((c) => (
              <label key={c.value} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="category"
                  checked={category === c.value}
                  onChange={() => { setCategory(c.value); setActiveCategory(c.value); }}
                />
                <span style={{ color: category === c.value ? '#2874f0' : '#212121', fontWeight: category === c.value ? 700 : 400 }}>
                  {c.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Slider */}
        <div style={{ marginBottom: '20px', borderBottom: '1px solid #f0f0f0', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', color: '#212121', letterSpacing: '0.4px' }}>PRICE</span>
            <span style={{ fontWeight: 700, color: '#2874f0', fontSize: '13px' }}>Max ₹{maxPrice.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min="1000"
            max="100000"
            step="1000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(parseInt(e.target.value))}
            style={{ width: '100%', cursor: 'pointer', accentColor: '#2874f0' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#878787', marginTop: '4px' }}>
            <span>Min ₹1,000</span>
            <span>₹1,00,000+</span>
          </div>
        </div>

        {/* Flipkart Assured Checkbox */}
        <div style={{ marginBottom: '20px', borderBottom: '1px solid #f0f0f0', paddingBottom: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={onlyAssured}
              onChange={(e) => setOnlyAssured(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: '#2874f0' }}
            />
            <img
              src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png"
              alt="Flipkart Assured"
              style={{ height: '20px' }}
            />
          </label>
        </div>

        {/* Customer Ratings */}
        <div style={{ marginBottom: '20px', borderBottom: '1px solid #f0f0f0', paddingBottom: '16px' }}>
          <div style={{ fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', color: '#212121', marginBottom: '10px', letterSpacing: '0.4px' }}>
            CUSTOMER RATINGS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
            {[4, 3].map((star) => (
              <label key={star} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={minRating === star}
                  onChange={() => setMinRating(minRating === star ? 0 : star)}
                  style={{ width: '16px', height: '16px', accentColor: '#2874f0' }}
                />
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {star}★ & above
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Brand Checkboxes */}
        <div style={{ marginBottom: '20px', borderBottom: '1px solid #f0f0f0', paddingBottom: '16px' }}>
          <div style={{ fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', color: '#212121', marginBottom: '10px', letterSpacing: '0.4px' }}>
            BRAND
          </div>
          <input
            type="text"
            placeholder="Search Brand"
            value={brandSearch}
            onChange={(e) => setBrandSearch(e.target.value)}
            style={{ width: '100%', border: '1px solid #e0e0e0', padding: '6px 8px', borderRadius: '2px', fontSize: '12px', marginBottom: '8px' }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '160px', overflowY: 'auto' }}>
            {allBrands
              .filter(b => !brandSearch || b.toLowerCase().includes(brandSearch.toLowerCase()))
              .map((b) => (
                <label key={b} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(b)}
                    onChange={() => toggleBrand(b)}
                    style={{ width: '15px', height: '15px', accentColor: '#2874f0' }}
                  />
                  <span>{b}</span>
                </label>
              ))}
          </div>
        </div>

        {/* Discount Filter */}
        <div>
          <div style={{ fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', color: '#212121', marginBottom: '10px', letterSpacing: '0.4px' }}>
            DISCOUNT
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
            {[40, 30, 20, 10].map((d) => (
              <label key={d} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="discount"
                  checked={minDiscount === d}
                  onChange={() => setMinDiscount(minDiscount === d ? 0 : d)}
                  style={{ width: '15px', height: '15px', accentColor: '#2874f0' }}
                />
                <span>{d}% or more</span>
              </label>
            ))}
          </div>
        </div>
      </aside>

      {/* ================= MAIN PRODUCTS AREA ================= */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Mobile-Only Filter & Sort Bar */}
        <div className="mobile-sort-filter-bar" style={{
          backgroundColor: '#fff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          borderRadius: '4px',
          overflow: 'hidden',
          marginBottom: '10px',
          border: '1px solid #e2e8f0'
        }}>
          <button
            onClick={() => setMobileFiltersOpen(true)}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '10px',
              backgroundColor: '#fff',
              border: 'none',
              borderRight: '1px solid #f0f0f0',
              fontWeight: 700,
              fontSize: '13px',
              color: '#212121',
              cursor: 'pointer'
            }}
          >
            <Filter size={15} color="#2874f0" />
            <span>Filters</span>
            {(selectedBrands.length > 0 || minDiscount > 0 || onlyAssured) && (
              <span style={{ backgroundColor: '#2874f0', color: '#fff', fontSize: '10px', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {selectedBrands.length + (minDiscount ? 1 : 0) + (onlyAssured ? 1 : 0)}
              </span>
            )}
          </button>

          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', padding: '0 8px' }}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                width: '100%',
                border: 'none',
                fontWeight: 700,
                fontSize: '13px',
                color: '#212121',
                padding: '10px 0',
                background: 'transparent',
                textAlign: 'center',
                cursor: 'pointer'
              }}
            >
              <option value="popularity">Sort: Popularity</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>

        {/* Top Sorting Bar with List/Grid Toggle */}
        <div className="desktop-sorting-bar" style={{
          backgroundColor: '#fff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          borderRadius: '2px',
          padding: '12px 20px',
          marginBottom: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <div style={{ fontSize: '12px', color: '#878787', marginBottom: '2px' }}>
              Home {'>'} {category !== 'all' ? category.toUpperCase() : 'ALL PRODUCTS'}
            </div>
            <div style={{ fontSize: '14px', color: '#212121', fontWeight: 600 }}>
              Showing {products.length} results
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '14px' }}>
              <span style={{ fontWeight: 700, color: '#212121' }}>Sort By:</span>
              {[
                { id: 'popularity', label: 'Popularity' },
                { id: 'price_asc', label: 'Price -- Low to High' },
                { id: 'price_desc', label: 'Price -- High to Low' },
                { id: 'newest', label: 'Newest First' }
              ].map((tab) => (
                <span
                  key={tab.id}
                  onClick={() => setSortBy(tab.id)}
                  style={{
                    cursor: 'pointer',
                    fontWeight: sortBy === tab.id ? 700 : 400,
                    color: sortBy === tab.id ? '#2874f0' : '#212121',
                    borderBottom: sortBy === tab.id ? '2px solid #2874f0' : 'none',
                    paddingBottom: '2px'
                  }}
                >
                  {tab.label}
                </span>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', borderLeft: '1px solid #e0e0e0', paddingLeft: '16px' }}>
              <button
                onClick={() => setViewMode('list')}
                title="List View"
                style={{
                  background: viewMode === 'list' ? '#f0f5ff' : 'transparent',
                  color: viewMode === 'list' ? '#2874f0' : '#878787',
                  padding: '6px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                <List size={20} />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                title="Grid View"
                style={{
                  background: viewMode === 'grid' ? '#f0f5ff' : 'transparent',
                  color: viewMode === 'grid' ? '#2874f0' : '#878787',
                  padding: '6px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                <LayoutGrid size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Product Cards Container */}
        {loading ? (
          <div style={{ backgroundColor: '#fff', padding: '60px', textAlign: 'center', color: '#878787' }}>
            Loading Flipkart catalog...
          </div>
        ) : products.length === 0 ? (
          <div style={{ backgroundColor: '#fff', padding: '60px', textAlign: 'center', borderRadius: '2px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <img
              src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/error-no-search-results_2353c5.png"
              alt="No products"
              style={{ maxWidth: '240px', marginBottom: '16px' }}
            />
            <div style={{ fontSize: '18px', fontWeight: 600 }}>Sorry, no results found!</div>
            <p style={{ color: '#878787', fontSize: '13px', marginTop: '6px' }}>
              Please check the spelling or try clearing your filters.
            </p>
            <button
              onClick={resetFilters}
              style={{
                marginTop: '16px',
                backgroundColor: '#2874f0',
                color: '#fff',
                padding: '8px 24px',
                borderRadius: '2px',
                fontWeight: 600,
                fontSize: '13px'
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : viewMode === 'list' ? (
          /* ================= LIST VIEW (FLIPKART OFFICIAL MOBILES / ELECTRONICS STYLE) ================= */
          <div style={{ backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
            {products.map((item) => {
              const wishlisted = isInWishlist(item.id);
              const highlightsList = Array.isArray(item.highlights) && item.highlights.length > 0
                ? item.highlights
                : ['High Performance Processor', 'Long Lasting All-Day Battery', '1 Year Manufacturer Warranty'];

              return (
                <div
                  key={item.id}
                  className="fk-product-list-row"
                  onClick={() => onSelectProduct && onSelectProduct(item)}
                >
                  {/* Left: Image & Wishlist */}
                  <div className="list-row-image-col">
                    <button
                      className={`card-wishlist-btn ${wishlisted ? 'active' : ''}`}
                      onClick={(e) => { e.stopPropagation(); toggleWishlist(item); }}
                      title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    >
                      <Heart size={16} fill={wishlisted ? '#ff4343' : 'none'} color={wishlisted ? '#ff4343' : '#999'} />
                    </button>

                    <img
                      src={item.primary_image || (item.images && item.images[0])}
                      alt={item.title}
                      loading="lazy"
                    />
                  </div>

                  {/* Middle: Title, Rating, Specs */}
                  <div className="list-row-desc-col">
                    <h3 className="list-row-title">{item.title}</h3>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span className="rating-badge">
                        {item.rating || '4.5'} <Star size={10} fill="#fff" strokeWidth={0} />
                      </span>
                      <span className="rating-count">
                        {(item.rating_count || 1240).toLocaleString()} Ratings & {(item.review_count || 320).toLocaleString()} Reviews
                      </span>
                      {item.is_assured && (
                        <img
                          src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png"
                          alt="Flipkart Assured"
                          style={{ height: '18px' }}
                        />
                      )}
                    </div>

                    <ul className="list-row-specs">
                      {highlightsList.slice(0, 5).map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Right: Pricing & Quick Add */}
                  <div className="list-row-price-col">
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                      <span style={{ fontSize: '24px', fontWeight: 700, color: '#212121' }}>
                        ₹{(item.selling_price || 0).toLocaleString()}
                      </span>
                    </div>

                    {item.original_price > item.selling_price && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                        <span style={{ fontSize: '13px', color: '#878787', textDecoration: 'line-through' }}>
                          ₹{(item.original_price || 0).toLocaleString()}
                        </span>
                        <span style={{ fontSize: '13px', color: '#388e3c', fontWeight: 700 }}>
                          {item.discount_percent || 15}% off
                        </span>
                      </div>
                    )}

                    <div style={{ fontSize: '12px', color: '#388e3c', fontWeight: 600, marginTop: '8px' }}>
                      Free delivery
                    </div>

                    <div style={{ fontSize: '12px', color: '#2874f0', marginTop: '4px' }}>
                      Bank Offer Available
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(item, 1);
                      }}
                      style={{
                        marginTop: '16px',
                        backgroundColor: '#ff9f00',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '13px',
                        padding: '10px 18px',
                        borderRadius: '2px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        width: 'fit-content'
                      }}
                    >
                      <ShoppingCart size={15} /> Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ================= GRID VIEW ================= */
          <div className="fk-products-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
            gap: '10px'
          }}>
            {products.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
                onSelectProduct={onSelectProduct}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
