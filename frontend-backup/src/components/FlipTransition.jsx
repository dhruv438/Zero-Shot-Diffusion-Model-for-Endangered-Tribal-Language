import { useEffect, useState } from 'react';

export default function FlipTransition({ children, onComplete }) {
  const [phase, setPhase] = useState('out'); // out -> switch -> in

  useEffect(() => {
    // Start with 'out' phase
    const outTimer = setTimeout(() => {
      setPhase('switch');
    }, 600);

    const switchTimer = setTimeout(() => {
      setPhase('in');
    }, 700);

    const completeTimer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 1300);

    return () => {
      clearTimeout(outTimer);
      clearTimeout(switchTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className={`flip-transition-wrapper flip-phase-${phase}`}>
      <div className="flip-card">
        <div className="flip-card-inner">
          {children}
        </div>
      </div>
    </div>
  );
}
