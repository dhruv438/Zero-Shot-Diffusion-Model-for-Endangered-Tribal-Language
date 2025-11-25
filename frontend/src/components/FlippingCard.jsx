import { useState } from 'react';

export default function FlippingCard({ frontContent, backContent, className = '' }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);
    console.log('Card clicked, flipped:', !isFlipped);
  };

  return (
    <div 
      className={`flipping-card-wrapper ${className}`}
      onClick={handleClick}
      style={{ pointerEvents: 'auto' }}
    >
      <div
        className="flipping-card-3d-space"
        style={{
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front Face */}
        <div className="flipping-card-face flipping-card-front">
          {frontContent}
        </div>

        {/* Back Face */}
        <div className="flipping-card-face flipping-card-back">
          {backContent}
        </div>
      </div>
    </div>
  );
}
