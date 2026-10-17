import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { api } from '../services/api';
import { X, ArrowLeft } from 'lucide-react';

// Official Flipkart Mobile Header Logo with Yellow Shopping Bag
const FlipkartMobileHeaderLogo = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
    <span style={{
      color: '#ffffff',
      fontSize: '20px',
      fontWeight: 700,
      fontStyle: 'italic',
      letterSpacing: '-0.3px',
      fontFamily: "'Roboto', sans-serif"
    }}>
      Flipkart
    </span>
    {/* Yellow shopping bag with smiling curve */}
    <div style={{
      width: '28px',
      height: '28px',
      backgroundColor: '#ffe11b',
      borderRadius: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
    }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M7 8V6C7 3.79 8.79 2 11 2H13C15.21 2 17 3.79 17 6V8" stroke="#2874f0" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M4 8.5H20L18.8 21H5.2L4 8.5Z" fill="#ffe11b" />
        <path d="M8.5 13C9.5 15.2 14.5 15.2 15.5 13" stroke="#2874f0" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </div>
  </div>
);

export default function LoginModal() {
  const { isLoginModalOpen, closeLoginModal, loginUser, showToast } = useShop();

  const [inputMethod, setInputMethod] = useState('phone'); // 'phone' or 'email'
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('otp_request'); // 'otp_request', 'otp_verify', 'password_login'
  const [loading, setLoading] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);

  if (!isLoginModalOpen) return null;

  const isInputValid = inputMethod === 'phone' 
    ? phone.trim().length === 10 
    : email.trim().includes('@') && email.trim().length >= 5;

  const handleRequestOtp = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    
    let targetContact = '';
    if (inputMethod === 'phone') {
      if (phone.trim().length !== 10) {
        showToast('Please enter a valid 10-digit mobile number', 'error');
        return;
      }
      targetContact = phone.trim();
    } else {
      if (!email.trim() || !email.includes('@')) {
        showToast('Please enter a valid email address', 'error');
        return;
      }
      targetContact = email.trim();
    }

    setContact(targetContact);
    setLoading(true);
    try {
      const res = await api.sendOtp(targetContact);
      if (res.success) {
        setMode('otp_verify');
        showToast(res.message || 'OTP sent! Use demo OTP 789123', 'success');
      } else {
        showToast(res.message || 'Error sending OTP', 'error');
      }
    } catch {
      // Offline fallback demo OTP
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
      const currentContact = contact || (inputMethod === 'phone' ? phone : email);
      const res = await api.verifyOtp(currentContact, otp, name);
      if (res.success) {
        loginUser(res.token, res.user);
        closeLoginModal();
        showToast('Logged in successfully!', 'success');
      } else {
        showToast(res.message || 'Verification failed', 'error');
      }
    } catch {
      // Fallback demo user
      const currentContact = contact || (inputMethod === 'phone' ? phone : email);
      const isEmail = currentContact.includes('@');
      const demoUser = {
        id: 99,
        name: name || (isEmail ? currentContact.split('@')[0] : `User_${currentContact.slice(-4)}`),
        email: isEmail ? currentContact : `${currentContact}@flipkart-user.com`,
        phone: isEmail ? '9888888888' : currentContact,
        role: 'customer'
      };
      loginUser('demo_token_123', demoUser);
      closeLoginModal();
      showToast('Logged in as demo user!', 'success');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    const currentContact = contact || (inputMethod === 'phone' ? phone : email);
    if (!currentContact || !password) {
      showToast('Please enter credentials', 'error');
      return;
    }
    setLoading(true);
    try {
      const res = await api.login(currentContact, password);
      if (res.success) {
        loginUser(res.token, res.user);
        closeLoginModal();
        showToast('Logged in successfully!', 'success');
      } else {
        showToast(res.message || 'Login failed', 'error');
      }
    } catch {
      showToast('Login server error', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleInputMethod = () => {
    if (inputMethod === 'phone') {
      setInputMethod('email');
      setContact(email);
    } else {
      setInputMethod('phone');
      setContact(phone);
    }
  };

  return (
    <div className="modal-overlay login-overlay" onClick={closeLoginModal}>
      <div className="login-modal-box animate-fade-in" onClick={(e) => e.stopPropagation()}>
        
        {/* Desktop Close Button */}
        <button
          className="login-desktop-close"
          onClick={closeLoginModal}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Mobile App Header (Blue Bar with X and Flipkart Logo) */}
        <div className="login-mobile-header">
          {mode === 'otp_verify' ? (
            <button
              type="button"
              onClick={() => setMode('otp_request')}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#ffffff',
                cursor: 'pointer',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              aria-label="Back"
            >
              <ArrowLeft size={24} color="#ffffff" />
            </button>
          ) : (
            <button
              type="button"
              onClick={closeLoginModal}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#ffffff',
                cursor: 'pointer',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              aria-label="Close"
            >
              <X size={24} color="#ffffff" />
            </button>
          )}

          <div style={{ marginRight: 'auto', marginLeft: '12px' }}>
            <FlipkartMobileHeaderLogo />
          </div>
        </div>

        {/* Left Column (Desktop Only: Flipkart Blue Branding) */}
        <div className="login-modal-left">
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: 600, marginBottom: '16px', lineHeight: 1.2 }}>
              {mode === 'otp_verify' ? 'Verification' : 'Login'}
            </h2>
            <p style={{ fontSize: '15px', color: '#dbdbdb', lineHeight: 1.5 }}>
              {mode === 'otp_verify' 
                ? 'We have sent an OTP to your registered mobile or email' 
                : 'Get access to your Orders, Wishlist and Recommendations'}
            </p>
          </div>
          <div style={{ textAlign: 'center', marginTop: 'auto' }}>
            <img
              src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/login_img_c4a81e.png"
              alt="Flipkart login graphic"
              style={{ width: '100%', maxWidth: '180px', display: 'inline-block' }}
            />
          </div>
        </div>

        {/* Right Column (Form Body: White Card on Mobile) */}
        <div className="login-modal-right">
          
          {/* Mobile Top Headings */}
          <div className="login-mobile-heading-group">
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', margin: '0 0 6px 0' }}>
              {mode === 'otp_verify' 
                ? 'Please enter the OTP sent to' 
                : mode === 'password_login' 
                ? 'Login with Password' 
                : 'Log in for the best experience'}
            </h2>
            <p style={{ fontSize: '14px', color: '#717478', margin: 0 }}>
              {mode === 'otp_verify' ? (
                <>
                  <strong style={{ color: '#212121' }}>
                    {inputMethod === 'phone' ? `+91 ${phone}` : (contact || email)}
                  </strong>
                  <button
                    type="button"
                    onClick={() => setMode('otp_request')}
                    style={{
                      color: '#2874f0',
                      fontWeight: 600,
                      cursor: 'pointer',
                      marginLeft: '8px',
                      background: 'transparent',
                      border: 'none',
                      padding: 0,
                      fontSize: '13px'
                    }}
                  >
                    Change
                  </button>
                </>
              ) : mode === 'password_login' ? (
                'Enter your credentials to continue'
              ) : (
                inputMethod === 'phone' 
                  ? 'Enter your phone number to continue' 
                  : 'Enter your email to continue'
              )}
            </p>
          </div>

          {/* Desktop Heading (Hidden on mobile) */}
          <div className="login-desktop-heading-group" style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#212121', marginBottom: '6px' }}>
              {mode === 'otp_verify' 
                ? 'Enter Verification Code' 
                : mode === 'password_login' 
                ? 'Password Login' 
                : 'Sign In to Flipkart'}
            </h3>
            <p style={{ fontSize: '13px', color: '#878787', margin: 0 }}>
              {mode === 'otp_verify' 
                ? `OTP sent to ${inputMethod === 'phone' ? `+91 ${phone}` : (contact || email)}` 
                : 'Enter your 10-digit mobile number or email ID to continue'}
            </p>
          </div>

          {/* STEP 1: OTP REQUEST (Phone / Email) */}
          {mode === 'otp_request' && (
            <form onSubmit={handleRequestOtp} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ flex: 1 }}>
                
                {inputMethod === 'phone' ? (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: inputFocused ? '1.5px solid #2874f0' : '1px solid #717478',
                    borderRadius: '4px',
                    height: '52px',
                    padding: '0 12px',
                    backgroundColor: '#ffffff',
                    transition: 'border-color 0.2s',
                    boxShadow: inputFocused ? '0 0 0 1px #2874f0' : 'none'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: '#212121',
                      fontWeight: 500,
                      fontSize: '15px',
                      paddingRight: '12px',
                      marginRight: '8px',
                      borderRight: '1px solid #e0e0e0',
                      userSelect: 'none'
                    }}>
                      <span>+91</span>
                      <span style={{ fontSize: '9px', color: '#717478', marginTop: '2px' }}>▼</span>
                    </div>
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={phone}
                      maxLength={10}
                      autoFocus
                      onFocus={() => setInputFocused(true)}
                      onBlur={() => setInputFocused(false)}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        setPhone(val);
                        setContact(val);
                      }}
                      style={{
                        flex: 1,
                        border: 'none',
                        outline: 'none',
                        fontSize: '15px',
                        color: '#212121',
                        background: 'transparent',
                        height: '100%',
                        width: '100%'
                      }}
                    />
                  </div>
                ) : (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: inputFocused ? '1.5px solid #2874f0' : '1px solid #717478',
                    borderRadius: '4px',
                    height: '52px',
                    padding: '0 14px',
                    backgroundColor: '#ffffff',
                    transition: 'border-color 0.2s',
                    boxShadow: inputFocused ? '0 0 0 1px #2874f0' : 'none'
                  }}>
                    <input
                      type="email"
                      placeholder="Email ID"
                      value={email}
                      autoFocus
                      onFocus={() => setInputFocused(true)}
                      onBlur={() => setInputFocused(false)}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setContact(e.target.value);
                      }}
                      style={{
                        width: '100%',
                        border: 'none',
                        outline: 'none',
                        fontSize: '15px',
                        color: '#212121',
                        background: 'transparent',
                        height: '100%'
                      }}
                    />
                  </div>
                )}

                {/* Switch between Phone and Email */}
                <div style={{ textAlign: 'right', marginTop: '12px' }}>
                  <button
                    type="button"
                    onClick={handleToggleInputMethod}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#2874f0',
                      fontSize: '13px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      padding: '4px 0'
                    }}
                  >
                    {inputMethod === 'phone' ? 'Use Email-ID' : 'Use Phone Number'}
                  </button>
                </div>

                {/* Flipkart Legal Notice */}
                <p style={{
                  fontSize: '12px',
                  color: '#717478',
                  lineHeight: '1.6',
                  marginTop: '28px',
                  marginBottom: '20px'
                }}>
                  By continuing, you confirm that you are above 18 years of age, and you agree to the Flipkart's{' '}
                  <span style={{ color: '#2874f0', cursor: 'pointer' }}>Terms of Use</span> and{' '}
                  <span style={{ color: '#2874f0', cursor: 'pointer' }}>Privacy Policy</span>
                </p>
              </div>

              {/* Bottom Sticky Action Bar */}
              <div className="login-bottom-bar">
                <button
                  type="submit"
                  disabled={!isInputValid || loading}
                  style={{
                    width: '100%',
                    height: '48px',
                    backgroundColor: isInputValid ? '#fb641b' : '#c2c2c2',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '2px',
                    fontWeight: 600,
                    fontSize: '15px',
                    cursor: isInputValid ? 'pointer' : 'not-allowed',
                    boxShadow: isInputValid ? '0 1px 3px rgba(0,0,0,0.2)' : 'none',
                    transition: 'background-color 0.2s',
                    letterSpacing: '0.2px'
                  }}
                >
                  {loading ? 'Please wait...' : 'Continue'}
                </button>

                <div style={{ textAlign: 'center', marginTop: '14px' }}>
                  <button
                    type="button"
                    onClick={() => setMode('password_login')}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#2874f0',
                      fontWeight: 500,
                      fontSize: '13px',
                      cursor: 'pointer'
                    }}
                  >
                    Login with Password instead
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* STEP 2: OTP VERIFICATION */}
          {mode === 'otp_verify' && (
            <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ flex: 1 }}>
                
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '13px', color: '#878787', marginBottom: '8px', textAlign: 'center' }}>
                    Enter 6-digit OTP
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="• • • • • •"
                    maxLength={6}
                    value={otp}
                    autoFocus
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    style={{
                      width: '100%',
                      border: 'none',
                      borderBottom: '2.5px solid #2874f0',
                      padding: '10px 0',
                      fontSize: '26px',
                      letterSpacing: '12px',
                      color: '#212121',
                      fontWeight: 700,
                      textAlign: 'center',
                      outline: 'none',
                      backgroundColor: 'transparent'
                    }}
                  />
                  <div style={{
                    fontSize: '12px',
                    color: '#2e7d32',
                    backgroundColor: '#e8f5e9',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    marginTop: '12px',
                    textAlign: 'center'
                  }}>
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
                      height: '48px',
                      border: '1px solid #c2c2c2',
                      borderRadius: '4px',
                      padding: '0 14px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: '#fff'
                    }}
                  />
                </div>
              </div>

              {/* Bottom Sticky Action Bar */}
              <div className="login-bottom-bar">
                <button
                  type="submit"
                  disabled={otp.length < 6 || loading}
                  style={{
                    width: '100%',
                    height: '48px',
                    backgroundColor: otp.length === 6 ? '#fb641b' : '#c2c2c2',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '2px',
                    fontWeight: 700,
                    fontSize: '15px',
                    cursor: otp.length === 6 ? 'pointer' : 'not-allowed',
                    boxShadow: otp.length === 6 ? '0 1px 3px rgba(0,0,0,0.2)' : 'none',
                    transition: 'background-color 0.2s',
                    textTransform: 'uppercase'
                  }}
                >
                  {loading ? 'VERIFYING...' : 'VERIFY & CONTINUE'}
                </button>

                <div style={{ textAlign: 'center', fontSize: '13px', color: '#717478', marginTop: '16px' }}>
                  Didn't receive code?{' '}
                  <button
                    type="button"
                    onClick={handleRequestOtp}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#2874f0',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: '13px',
                      padding: 0
                    }}
                  >
                    Resend OTP
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* STEP 3: PASSWORD LOGIN */}
          {mode === 'password_login' && (
            <form onSubmit={handlePasswordLogin} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: '16px' }}>
                  <input
                    type="text"
                    required
                    placeholder="Enter Email / Mobile Number"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    style={{
                      width: '100%',
                      height: '48px',
                      border: '1px solid #c2c2c2',
                      borderRadius: '4px',
                      padding: '0 14px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <input
                    type="password"
                    required
                    placeholder="Enter Password (e.g. password123)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: '100%',
                      height: '48px',
                      border: '1px solid #c2c2c2',
                      borderRadius: '4px',
                      padding: '0 14px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div className="login-bottom-bar">
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    height: '48px',
                    backgroundColor: '#fb641b',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '2px',
                    fontWeight: 700,
                    fontSize: '15px',
                    cursor: 'pointer',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                  }}
                >
                  {loading ? 'LOGGING IN...' : 'LOGIN'}
                </button>

                <div style={{ textAlign: 'center', marginTop: '14px' }}>
                  <button
                    type="button"
                    onClick={() => setMode('otp_request')}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#2874f0',
                      fontWeight: 600,
                      fontSize: '13px',
                      cursor: 'pointer'
                    }}
                  >
                    Request OTP instead
                  </button>
                </div>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
