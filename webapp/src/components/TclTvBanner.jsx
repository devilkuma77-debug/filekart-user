import React from 'react';

export default function TclTvBanner({ onSelectProduct, onSelectCategory }) {
  const handleClick = () => {
    if (onSelectProduct) {
      onSelectProduct({
        slug: 'tcl-85p8l-85-inch-ai-qled-4k-google-tv',
        title: 'TCL 85P8L 215 cm (85 inch) AI QLED Ultra HD (4K) Smart Google TV'
      });
    } else if (onSelectCategory) {
      onSelectCategory('appliances');
    }
  };

  return (
    <div
      onClick={handleClick}
      style={{
        width: '100%',
        margin: '14px 0 16px',
        borderRadius: '12px',
        overflow: 'hidden',
        cursor: 'pointer',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.25)',
        background: 'radial-gradient(ellipse at center, #1b263b 0%, #0d1b2a 50%, #050b14 100%)',
        position: 'relative',
        border: '1px solid #1e3a5f'
      }}
    >
      {/* Decorative festive Diwali bokeh glow dots */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'radial-gradient(circle at 15% 50%, rgba(255, 215, 0, 0.08) 0%, transparent 40%), radial-gradient(circle at 85% 50%, rgba(30, 144, 255, 0.08) 0%, transparent 40%)',
        pointerEvents: 'none'
      }} />

      {/* Top right AD badge */}
      <div style={{
        position: 'absolute',
        top: 14,
        right: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        color: '#111',
        fontSize: '11px',
        fontWeight: 800,
        padding: '2px 8px',
        borderRadius: '3px',
        letterSpacing: '0.5px',
        zIndex: 5
      }}>
        AD
      </div>

      <div className="tcl-ad-container" style={{
        maxWidth: '1360px',
        margin: '0 auto',
        padding: '24px 36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        zIndex: 2,
        minHeight: '210px'
      }}>
        {/* Left: Product Title and Big Price */}
        <div className="tcl-ad-left" style={{ flex: '0 0 34%', zIndex: 2 }}>
          <h2 style={{
            fontSize: '36px',
            fontWeight: 800,
            color: '#ffffff',
            margin: '0 0 8px',
            lineHeight: 1.1,
            letterSpacing: '-0.5px',
            display: 'flex',
            alignItems: 'baseline',
            gap: '6px'
          }}>
            <span>85P8L</span>
            <span style={{
              fontSize: '20px',
              fontWeight: 700,
              color: '#00e5ff',
              verticalAlign: 'super'
            }}>
              Ai
            </span>
            <span style={{ fontSize: '32px', fontWeight: 700, color: '#f0f4f8' }}>QLED TV</span>
          </h2>

          <div style={{
            fontSize: '34px',
            fontWeight: 900,
            color: '#ffffff',
            margin: '6px 0 12px',
            letterSpacing: '-0.4px',
            textShadow: '0 2px 10px rgba(0,0,0,0.5)'
          }}>
            Just ₹1,20,500*
          </div>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(255, 215, 0, 0.15)',
            border: '1px solid rgba(255, 215, 0, 0.4)',
            padding: '4px 12px',
            borderRadius: '20px',
            color: '#ffd700',
            fontSize: '12px',
            fontWeight: 600
          }}>
            <span>✨ 215 cm (85") Ultra HD 4K</span>
            <span>•</span>
            <span>Dolby Vision Atmos</span>
          </div>
        </div>

        {/* Center: Monumental 85" TV Visual on Golden Stage with Diya */}
        <div className="tcl-ad-center" style={{
          flex: '0 0 38%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}>
          {/* TV Outer Frame */}
          <div style={{
            width: '100%',
            maxWidth: '420px',
            height: '170px',
            backgroundColor: '#050505',
            borderRadius: '6px',
            border: '3px solid #334155',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.8), 0 0 24px rgba(0, 195, 255, 0.3)',
            overflow: 'hidden',
            position: 'relative'
          }}>
            {/* Peacock/Flower Glowing Mandala Wallpaper */}
            <div style={{
              width: '100%',
              height: '100%',
              background: 'radial-gradient(circle at center, #ffd700 0%, #00b0ff 35%, #00227b 70%, #000814 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Floral / Mandala Decorative Rings */}
              <svg width="180" height="180" viewBox="0 0 200 200" style={{ filter: 'drop-shadow(0 0 10px #00e5ff)' }}>
                <circle cx="100" cy="100" r="85" fill="none" stroke="#00e5ff" strokeWidth="1.5" strokeDasharray="6 3" />
                <circle cx="100" cy="100" r="65" fill="none" stroke="#ffd700" strokeWidth="2" />
                <circle cx="100" cy="100" r="45" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="4 2" />
                {Array.from({ length: 12 }, (_, i) => {
                  const angle = (i * 30 * Math.PI) / 180;
                  const x = 100 + 55 * Math.cos(angle);
                  const y = 100 + 55 * Math.sin(angle);
                  return <circle key={i} cx={x} cy={y} r="5" fill="#ffd700" />;
                })}
                <circle cx="100" cy="100" r="18" fill="#ffe57f" />
                <circle cx="100" cy="100" r="8" fill="#ff6d00" />
              </svg>
            </div>
          </div>

          {/* Golden TV Stand with Lit Diya in front */}
          <div style={{
            position: 'relative',
            marginTop: '-6px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            {/* TV Base Stand */}
            <div style={{ width: '120px', height: '8px', backgroundColor: '#64748b', borderRadius: '4px' }} />

            {/* Lit Brass Diya */}
            <div style={{
              marginTop: '4px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              {/* Glowing Flame */}
              <div style={{
                width: '8px',
                height: '14px',
                borderRadius: '50% 50% 20% 20%',
                background: 'linear-gradient(180deg, #fff 0%, #ffeb3b 40%, #ff5722 100%)',
                boxShadow: '0 0 10px 3px #ffeb3b, 0 0 18px 6px rgba(255, 87, 34, 0.6)',
                animation: 'bulbGlow 1.5s infinite alternate ease-in-out'
              }} />
              {/* Diya Clay Base */}
              <div style={{
                width: '26px',
                height: '8px',
                backgroundColor: '#b87333',
                borderRadius: '0 0 12px 12px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.5)'
              }} />
            </div>
          </div>
        </div>

        {/* Right: TCL Brand Logo & Tagline */}
        <div className="tcl-ad-right" style={{
          flex: '0 0 24%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          paddingLeft: '20px'
        }}>
          {/* TCL Big Bold Logo */}
          <div style={{
            fontSize: '54px',
            fontWeight: 900,
            color: '#ffffff',
            letterSpacing: '1px',
            lineHeight: 1
          }}>
            TCL
          </div>

          {/* Tagline */}
          <div style={{
            fontSize: '15px',
            fontWeight: 400,
            color: '#cbd5e1',
            marginTop: '6px',
            letterSpacing: '0.4px'
          }}>
            Master the Moment
          </div>

          {/* Buy Now Button on Hover */}
          <div style={{
            marginTop: '16px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#2874f0',
            color: '#ffffff',
            padding: '7px 18px',
            borderRadius: '4px',
            fontWeight: 700,
            fontSize: '13px',
            boxShadow: '0 2px 8px rgba(40, 116, 240, 0.4)'
          }}>
            View Deal →
          </div>
        </div>
      </div>
    </div>
  );
}
