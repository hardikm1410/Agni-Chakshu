import { useEffect, useState } from 'react';

export default function ThermalBackground() {
  const [embers, setEmbers] = useState([]);

  useEffect(() => {
    const newEmbers = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100 + 'vw',
      animationDuration: (Math.random() * 5 + 5) + 's',
      animationDelay: (Math.random() * 5) + 's',
      size: (Math.random() * 3 + 2) + 'px',
    }));
    setEmbers(newEmbers);
  }, []);

  return (
    <div className="thermal-bg">
      <div className="thermal-blob blob-1"></div>
      <div className="thermal-blob blob-2"></div>
      <div className="thermal-blob blob-3"></div>
      <div className="energy-wave"></div>
      <div className="energy-wave energy-wave-2"></div>
      
      {embers.map(ember => (
        <div 
          key={ember.id} 
          className="ember" 
          style={{ 
            left: ember.left, 
            animationDuration: ember.animationDuration,
            animationDelay: ember.animationDelay,
            width: ember.size,
            height: ember.size
          }} 
        />
      ))}
    </div>
  );
}
