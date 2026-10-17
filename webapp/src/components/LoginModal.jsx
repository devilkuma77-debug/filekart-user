import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { api } from '../services/api';
import { X, ShieldCheck } from 'lucide-react';

export default function LoginModal() {
  const { isLoginModalOpen, closeLoginModal, loginUser, showToast } = useShop();

  const [contact, setContact] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('otp_request'); // 'otp_request', 'otp_verify', 'password_login'
  const [loading, setLoading] = useState(false);

  if (!isLoginModalOpen) return null;

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!contact.trim()) {
      showToast('Please enter Email or 10-digit Mobile number', 'error');
      return;
    }
    setLoading(true);
    try {
      const res = await api.sendOtp(contact);
      if (res.success) {
        setMode('otp_verify');
        showToast(res.message || 'OTP sent! Use demo OTP 789123', 'success');
      } else {
        showToast(res.message, 'error');
      }
    } catch {
      // In case of network glitch, continue with demo OTP
      setMode('otp_verify');
      showToast('Demo Mode: Enter OTP 789123 to verify', 'info');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      showToast('Please enter the OTP', 'error');
      return;
    }
    setLoading(true);
    try {
      const res = await api.verifyOtp(contact, otp, name);
      if (res.success) {
        loginUser(res.token, res.user);
        closeLoginModal();
      } else {
        showToast(res.message || 'Verification failed', 'error');
      }
    } catch {
      // Fallback demo user
      const demoUser = {
        id: 99,
        name: name || (contact.includes('@') ? contact.split('@')[0] : 'Flipkart Customer'),
        email: contact.includes('@') ? contact : `${contact}@flipkart-user.com`,
        phone: contact.includes('@') ? '9888888888' : contact,
        role: 'customer'
      };
      loginUser('demo_token_123', demoUser);
      closeLoginModal();
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    if (!contact || !password) {
      showToast('Please enter credentials', 'error');
      return;
    }
    setLoading(true);
    try {
      const res = await api.login(contact, password);
      if (res.success) {
        loginUser(res.token, res.user);
        closeLoginModal();
      } else {
        showToast(res.message || 'Login failed', 'error');
      }
    } catch {
      showToast('Login server error', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={closeLoginModal}>
      <div className="login-modal-box animate-fade-in" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          onClick={closeLoginModal}
          style={{
            position: 'absolute',
            top: 14,
            right: 14,
            background: 'transparent',
            cursor: 'pointer',
            color: '#878787',
            zIndex: 10
          }}
        >
          <X size={20} />
        </button>

        {/* Left Column (Flipkart Blue) */}
        <div className="login-modal-left">
          <div>
            <h2 style={{ fontSize: '26px', fontWeight: 600, marginBottom: '16px' }}>Login</h2>
            <p style={{ fontSize: '15px', color: '#dbdbdb', lineHeight: 1.5 }}>
              Get access to your Orders, Wishlist and Recommendations
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <img
              src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/login_img_c4a81e.png"
              alt="Flipkart login graphic"
              style={{ width: '100%', maxWidth: '180px' }}
            />
          </div>
        </div>

        {/* Right Column (Input fields) */}
        <div className="login-modal-right">
          {mode === 'otp_request' && (
            <form onSubmit={handleRequestOtp} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ flex: 1 }}>
                <div style={{ position: 'relative', marginBottom: '24px' }}>
                  <input
                    type="text"
                    required
                    placeholder="Enter Email / Mobile Number"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    style={{
                      width: '100%',
                      border: 'none',
                      borderBottom: '1px solid #e0e0e0',
                      padding: '10px 0',
                      fontSize: '15px',
                      color: '#212121'
                    }}
                  />
                </div>

                <p style={{ fontSize: '12px', color: '#878787', lineHeight: 1.5, marginBottom: '24px' }}>
                  By continuing, you agree to Flipkart's{' '}
                  <span style={{ color: '#2874f0', cursor: 'pointer' }}>Terms of Use</span> and{' '}
                  <span style={{ color: '#2874f0', cursor: 'pointer' }}>Privacy Policy</span>.
                </p>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    backgroundColor: '#fb641b',
                    color: '#fff',
                    padding: '14px',
                    borderRadius: '2px',
                    fontWeight: 600,
                    fontSize: '15px',
                    boxShadow: '0 1px 2px 0 rgba(0,0,0,0.2)'
                  }}
                >
                  {loading ? 'REQUESTING...' : 'REQUEST OTP'}
                </button>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => setMode('password_login')}
                  style={{
                    width: '100%',
                    backgroundColor: '#fff',
                    color: '#2874f0',
                    border: '1px solid #e0e0e0',
                    padding: '12px',
                    fontWeight: 600,
                    fontSize: '14px',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                  }}
                >
                  Login with Password
                </button>
              </div>
            </form>
          )}

          {mode === 'otp_verify' && (
            <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', color: '#878787', marginBottom: '16px' }}>
                  Please enter the OTP sent to <strong style={{ color: '#212121' }}>{contact}</strong>
                  <span
                    onClick={() => setMode('otp_request')}
                    style={{ color: '#2874f0', marginLeft: '8px', cursor: 'pointer', fontWeight: 500 }}
                  >
                    Change
                  </span>
                </div>

                <div style={{ marginBottom: '18px' }}>
                  <input
                    type="text"
                    required
                    placeholder="Enter 6-digit OTP (demo: 789123)"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    style={{
                      width: '100%',
                      border: 'none',
                      borderBottom: '2px solid #2874f0',
                      padding: '10px 0',
                      fontSize: '18px',
                      letterSpacing: '4px',
                      color: '#212121',
                      fontWeight: 600
                    }}
                  />
                  <div style={{ fontSize: '11px', color: '#388e3c', marginTop: '6px' }}>
                    💡 Tip: Default test OTP is <strong>789123</strong>
                  </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <input
                    type="text"
                    placeholder="Your Full Name (optional)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      width: '100%',
                      border: 'none',
                      borderBottom: '1px solid #e0e0e0',
                      padding: '8px 0',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    backgroundColor: '#fb641b',
                    color: '#fff',
                    padding: '14px',
                    borderRadius: '2px',
                    fontWeight: 600,
                    fontSize: '15px'
                  }}
                >
                  {loading ? 'VERIFYING...' : 'VERIFY & CONTINUE'}
                </button>
              </div>

              <div style={{ textAlign: 'center', fontSize: '13px' }}>
                Didn't receive code?{' '}
                <span onClick={handleRequestOtp} style={{ color: '#2874f0', cursor: 'pointer', fontWeight: 600 }}>
                  Resend OTP
                </span>
              </div>
            </form>
          )}

          {mode === 'password_login' && (
            <form onSubmit={handlePasswordLogin} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: '20px' }}>
                  <input
                    type="text"
                    required
                    placeholder="Enter Email / Phone"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    style={{ width: '100%', border: 'none', borderBottom: '1px solid #e0e0e0', padding: '10px 0', fontSize: '14px' }}
                  />
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <input
                    type="password"
                    required
                    placeholder="Enter Password (e.g. password123)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ width: '100%', border: 'none', borderBottom: '1px solid #e0e0e0', padding: '10px 0', fontSize: '14px' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    backgroundColor: '#fb641b',
                    color: '#fff',
                    padding: '14px',
                    borderRadius: '2px',
                    fontWeight: 600,
                    fontSize: '15px'
                  }}
                >
                  {loading ? 'LOGGING IN...' : 'LOGIN'}
                </button>
              </div>

              <div style={{ textAlign: 'center' }}>
                <button
                  type="button"
                  onClick={() => setMode('otp_request')}
                  style={{ background: 'transparent', color: '#2874f0', fontWeight: 600, fontSize: '14px' }}
                >
                  Request OTP instead
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
