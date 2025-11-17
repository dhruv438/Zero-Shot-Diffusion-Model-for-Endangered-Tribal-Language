import { useState, useRef, useEffect } from 'react';

export default function RotatingWheel({ items }) {
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startRotation, setStartRotation] = useState(0);
  const wheelRef = useRef(null);
  const animationRef = useRef(null);

  // Auto-rotation effect
  useEffect(() => {
    if (!isDragging) {
      animationRef.current = setInterval(() => {
        setRotation(prev => prev + 0.2); // Slow continuous rotation
      }, 16); // ~60fps
    } else {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, [isDragging]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setStartRotation(rotation);
    document.body.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX;
    const rotationChange = deltaX * 0.5; // Increased sensitivity
    setRotation(startRotation + rotationChange);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.body.style.cursor = 'default';
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, startX, startRotation]);

  const radius = 300; // Reduced radius for less gap between cards
  const angleStep = 360 / items.length;

  return (
    <div className="wheel-container">
      <div 
        className="wheel-3d" 
        ref={wheelRef}
        onMouseDown={handleMouseDown}
        style={{
          transform: `rotateY(${rotation}deg)`,
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
      >
        {items.map((item, index) => {
          const angle = angleStep * index;
          const x = Math.sin((angle * Math.PI) / 180) * radius;
          const z = Math.cos((angle * Math.PI) / 180) * radius;
          
          return (
            <div
              key={index}
              className="wheel-card"
              style={{
                transform: `translate3d(${x}px, 0, ${z}px) rotateY(${angle}deg)`
              }}
            >
              <div className="wheel-card-content">
                <div className="wheel-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="wheel-hint">
        <span>← Drag to rotate →</span>
      </div>
    </div>
  );
}
