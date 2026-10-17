import React, { useState } from 'react';
import { X, MapPin, Navigation } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function LocationModal({ isOpen, onClose, currentLocation, onSelectLocation }) {
  const { showToast } = useShop();
  const [pincode, setPincode] = useState('');

  if (!isOpen) return null;

  const popularLocations = [
    { city: 'Bengaluru', pincode: '560103' },
    { city: 'New Delhi', pincode: '110001' },
    { city: 'Mumbai', pincode: '400001' },
    { city: 'Hyderabad', pincode: '500001' },
    { city: 'Chennai', pincode: '600001' },
    { city: 'Kolkata', pincode: '700001' }
  ];

  const handleApplyPincode = (e) => {
    e.preventDefault();
    if (pincode.trim().length === 6) {
      onSelectLocation(`Deliver to ${pincode.trim()}`);
      showToast(`Delivery location set to ${pincode.trim()}`, 'success');
      onClose();
    } else {
      showToast('Please enter a valid 6-digit Pincode', 'error');
    }
  };

  const handleSelectCity = (loc) => {
    onSelectLocation(`${loc.city} ${loc.pincode}`);
    showToast(`Delivery location set to ${loc.city} (${loc.pincode})`, 'success');
    onClose();
  };

  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          onSelectLocation('Bengaluru 560103');
          showToast('Current location detected: Bengaluru 560103', 'success');
          onClose();
        },
        () => {
          onSelectLocation('Bengaluru 560103');
          showToast('Delivery location set to Bengaluru 560103', 'info');
          onClose();
        }
      );
    } else {
      onSelectLocation('Bengaluru 560103');
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#fff',
          width: '100%',
          maxWidth: '440px',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
          position: 'relative'
        }}
      >
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 14, right: 14, background: 'none', cursor: 'pointer', color: '#64748b' }}
        >
          <X size={20} />
        </button>

        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f0f0f0' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#212121', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={20} color="#2874f0" /> Choose your location
          </h3>
          <p style={{ fontSize: '12px', color: '#878787', marginTop: '4px' }}>
            Select a delivery location to see product availability and delivery options
          </p>
        </div>

        <div style={{ padding: '20px 24px' }}>
          {/* Detect my location button */}
          <button
            onClick={handleDetectLocation}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              backgroundColor: '#f0f5ff',
              color: '#2874f0',
              fontWeight: 600,
              fontSize: '13px',
              padding: '10px',
              borderRadius: '6px',
              border: '1px dashed #2874f0',
              cursor: 'pointer',
              marginBottom: '16px'
            }}
          >
            <Navigation size={15} /> Use current location
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '14px 0', color: '#878787', fontSize: '11px', textTransform: 'uppercase' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e0e0e0' }} />
            <span>or enter a pincode</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e0e0e0' }} />
          </div>

          <form onSubmit={handleApplyPincode} style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            <input
              type="text"
              maxLength={6}
              placeholder="Enter 6-digit Pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              style={{
                flex: 1,
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                padding: '9px 12px',
                fontSize: '14px',
                fontWeight: 600
              }}
            />
            <button
              type="submit"
              style={{
                backgroundColor: '#2874f0',
                color: '#fff',
                fontWeight: 600,
                fontSize: '13px',
                padding: '0 20px',
                borderRadius: '6px'
              }}
            >
              Apply
            </button>
          </form>

          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '10px', textTransform: 'uppercase' }}>
              Popular Delivery Cities
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {popularLocations.map((loc, i) => (
                <div
                  key={i}
                  onClick={() => handleSelectCity(loc)}
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #f0f0f0',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    backgroundColor: '#fafafa',
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#2874f0'; e.currentTarget.style.backgroundColor = '#f0f5ff'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#f0f0f0'; e.currentTarget.style.backgroundColor = '#fafafa'; }}
                >
                  <strong>{loc.city}</strong>
                  <div style={{ fontSize: '11px', color: '#878787' }}>{loc.pincode}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
