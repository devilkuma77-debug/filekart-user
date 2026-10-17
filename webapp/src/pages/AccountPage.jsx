import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { User, MapPin, Package, Heart, CreditCard, Award, Power, Plus, Trash2 } from 'lucide-react';

export default function AccountPage({ onNavigate }) {
  const { user, logoutUser, addresses, setAddresses, showToast } = useShop();

  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'addresses', 'wallet'
  const [userName, setUserName] = useState(user?.name || 'Aarav Kumar');
  const [gender, setGender] = useState('Male');
  const [email, setEmail] = useState(user?.email || 'customer@flipkart.com');
  const [phone, setPhone] = useState(user?.phone || '9888888888');

  const [showAddAddr, setShowAddAddr] = useState(false);
  const [newAddr, setNewAddr] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    pincode: '',
    locality: '',
    address: '',
    city: '',
    state: '',
    address_type: 'HOME'
  });

  const handleSaveProfile = (e) => {
    e.preventDefault();
    showToast('Personal information updated successfully', 'success');
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newAddr.name || !newAddr.pincode || !newAddr.address) {
      showToast('Please fill all required address fields', 'error');
      return;
    }
    setAddresses(prev => [...prev, { id: Date.now(), ...newAddr, is_default: 0 }]);
    setShowAddAddr(false);
    showToast('Address added successfully!', 'success');
  };

  const handleDeleteAddress = (id) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
    showToast('Address deleted', 'info');
  };

  return (
    <div className="account-layout" style={{ maxWidth: '1240px', margin: '14px auto', padding: '0 12px', display: 'flex', gap: '16px' }}>
      {/* Left Sidebar */}
      <div className="account-sidebar" style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* User Card */}
        <div style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '2px', boxShadow: '0 1px 2px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#2874f0', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 700 }}>
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#878787' }}>Hello,</div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#212121' }}>{user?.name || 'Flipkart Customer'}</div>
          </div>
        </div>

        {/* Menu Links */}
        <div style={{ backgroundColor: '#fff', borderRadius: '2px', boxShadow: '0 1px 2px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          <div
            onClick={() => onNavigate('orders')}
            style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #f0f0f0', cursor: 'pointer', fontWeight: 600, color: '#2874f0' }}
          >
            <Package size={18} /> MY ORDERS
          </div>

          <div style={{ padding: '14px 20px', borderBottom: '1px solid #f0f0f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 600, color: '#878787', fontSize: '12px', marginBottom: '10px' }}>
              <User size={16} /> ACCOUNT SETTINGS
            </div>
            <div style={{ paddingLeft: '28px', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
              <span
                onClick={() => setActiveTab('profile')}
                style={{ cursor: 'pointer', color: activeTab === 'profile' ? '#2874f0' : '#212121', fontWeight: activeTab === 'profile' ? 600 : 400 }}
              >
                Profile Information
              </span>
              <span
                onClick={() => setActiveTab('addresses')}
                style={{ cursor: 'pointer', color: activeTab === 'addresses' ? '#2874f0' : '#212121', fontWeight: activeTab === 'addresses' ? 600 : 400 }}
              >
                Manage Addresses
              </span>
            </div>
          </div>

          <div style={{ padding: '14px 20px', borderBottom: '1px solid #f0f0f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 600, color: '#878787', fontSize: '12px', marginBottom: '10px' }}>
              <CreditCard size={16} /> PAYMENTS & WALLET
            </div>
            <div style={{ paddingLeft: '28px', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
              <span
                onClick={() => setActiveTab('wallet')}
                style={{ cursor: 'pointer', color: activeTab === 'wallet' ? '#2874f0' : '#212121', fontWeight: activeTab === 'wallet' ? 600 : 400 }}
              >
                Flipkart Wallet (₹1,500)
              </span>
            </div>
          </div>

          <div
            onClick={() => onNavigate('wishlist')}
            style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #f0f0f0', cursor: 'pointer', fontSize: '14px' }}
          >
            <Heart size={18} color="#2874f0" /> My Wishlist
          </div>

          <div
            onClick={logoutUser}
            style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', color: '#ff4343', fontWeight: 600, fontSize: '14px' }}
          >
            <Power size={18} /> Logout
          </div>
        </div>
      </div>

      {/* Right Content */}
      <div className="account-content" style={{ flex: 1, backgroundColor: '#fff', borderRadius: '2px', boxShadow: '0 1px 2px rgba(0,0,0,0.08)', padding: '24px' }}>
        {activeTab === 'profile' && (
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px' }}>Personal Information</h2>

            <form onSubmit={handleSaveProfile} style={{ maxWidth: '480px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#878787', display: 'block', marginBottom: '4px' }}>Full Name</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  style={{ width: '100%', border: '1px solid #e0e0e0', padding: '10px 14px', borderRadius: '2px', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#878787', display: 'block', marginBottom: '4px' }}>Your Gender</label>
                <div style={{ display: 'flex', gap: '20px', fontSize: '14px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input type="radio" name="gender" checked={gender === 'Male'} onChange={() => setGender('Male')} /> Male
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input type="radio" name="gender" checked={gender === 'Female'} onChange={() => setGender('Female')} /> Female
                  </label>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#878787', display: 'block', marginBottom: '4px' }}>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', border: '1px solid #e0e0e0', padding: '10px 14px', borderRadius: '2px', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#878787', display: 'block', marginBottom: '4px' }}>Mobile Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ width: '100%', border: '1px solid #e0e0e0', padding: '10px 14px', borderRadius: '2px', fontSize: '14px' }}
                />
              </div>

              <button
                type="submit"
                style={{ backgroundColor: '#2874f0', color: '#fff', fontWeight: 600, padding: '12px 32px', borderRadius: '2px', width: 'fit-content', marginTop: '10px' }}
              >
                SAVE CHANGES
              </button>
            </form>
          </div>
        )}

        {activeTab === 'addresses' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Manage Addresses</h2>
              {!showAddAddr && (
                <button
                  onClick={() => setShowAddAddr(true)}
                  style={{ border: '1px solid #2874f0', backgroundColor: '#fff', color: '#2874f0', fontWeight: 600, padding: '8px 16px', borderRadius: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Plus size={16} /> ADD A NEW ADDRESS
                </button>
              )}
            </div>

            {showAddAddr && (
              <form onSubmit={handleAddAddress} style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '4px', marginBottom: '20px', border: '1px solid #e0e0e0' }}>
                <h4 style={{ marginBottom: '14px' }}>ADD ADDRESS</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                  <input
                    type="text"
                    required
                    placeholder="Name *"
                    value={newAddr.name}
                    onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
                    style={{ border: '1px solid #ccc', padding: '8px 12px' }}
                  />
                  <input
                    type="text"
                    required
                    placeholder="Phone *"
                    value={newAddr.phone}
                    onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                    style={{ border: '1px solid #ccc', padding: '8px 12px' }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                  <input
                    type="text"
                    required
                    placeholder="Pincode *"
                    value={newAddr.pincode}
                    onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                    style={{ border: '1px solid #ccc', padding: '8px 12px' }}
                  />
                  <input
                    type="text"
                    required
                    placeholder="Locality"
                    value={newAddr.locality}
                    onChange={(e) => setNewAddr({ ...newAddr, locality: e.target.value })}
                    style={{ border: '1px solid #ccc', padding: '8px 12px' }}
                  />
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <textarea
                    required
                    placeholder="Address *"
                    rows={2}
                    value={newAddr.address}
                    onChange={(e) => setNewAddr({ ...newAddr, address: e.target.value })}
                    style={{ width: '100%', border: '1px solid #ccc', padding: '8px 12px' }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                  <input
                    type="text"
                    placeholder="City *"
                    value={newAddr.city}
                    onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                    style={{ border: '1px solid #ccc', padding: '8px 12px' }}
                  />
                  <input
                    type="text"
                    placeholder="State *"
                    value={newAddr.state}
                    onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                    style={{ border: '1px solid #ccc', padding: '8px 12px' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button type="submit" style={{ backgroundColor: '#fb641b', color: '#fff', fontWeight: 600, padding: '10px 24px', borderRadius: '2px' }}>
                    SAVE ADDRESS
                  </button>
                  <button type="button" onClick={() => setShowAddAddr(false)} style={{ background: 'none', color: '#2874f0', fontWeight: 600 }}>
                    CANCEL
                  </button>
                </div>
              </form>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {addresses.map((a) => (
                <div key={a.id} style={{ border: '1px solid #e0e0e0', padding: '16px', borderRadius: '2px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <strong style={{ fontSize: '15px' }}>{a.name}</strong>
                      <span style={{ fontSize: '11px', backgroundColor: '#f0f0f0', padding: '2px 6px', borderRadius: '2px', fontWeight: 600 }}>{a.address_type}</span>
                      <strong style={{ fontSize: '15px' }}>{a.phone}</strong>
                    </div>
                    <div style={{ fontSize: '13px', color: '#555', marginTop: '6px' }}>
                      {a.address}, {a.locality}, {a.city}, {a.state} - <strong>{a.pincode}</strong>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteAddress(a.id)} style={{ background: 'none', color: '#d32f2f', cursor: 'pointer' }} title="Delete address">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'wallet' && (
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Flipkart Gift Card & Wallet</h2>
            <div style={{ backgroundColor: '#f0f7ff', border: '1px solid #2874f0', borderRadius: '4px', padding: '24px', maxWidth: '420px', marginBottom: '24px' }}>
              <div style={{ fontSize: '13px', color: '#666' }}>Available Balance</div>
              <div style={{ fontSize: '32px', fontWeight: 800, color: '#2874f0', margin: '6px 0' }}>₹1,500.00</div>
              <div style={{ fontSize: '12px', color: '#388e3c', fontWeight: 600 }}>100% usable on your next Flipkart order</div>
            </div>

            <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '16px' }}>
              <h4 style={{ fontSize: '14px', marginBottom: '10px' }}>SuperCoins Balance: <strong>140 🪙</strong></h4>
              <p style={{ color: '#878787', fontSize: '13px' }}>Earn 2 SuperCoins for every ₹100 spent on Flipkart.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
