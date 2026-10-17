import React from 'react';

export default function FestiveBulbStrip({ isBottom = false }) {
  // Generate 28 golden/warm bulbs with small glowing variations
  const bulbs = Array.from({ length: 28 }, (_, i) => i);

  return (
    <div className={`festive-bulb-strip ${isBottom ? 'bottom' : ''}`}>
      <div className="bulb-wire" />
      {bulbs.map((b) => (
        <div key={b} className="festive-bulb" />
      ))}
    </div>
  );
}
