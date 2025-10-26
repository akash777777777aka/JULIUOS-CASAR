import React from 'react';

const Spinner: React.FC = () => {
  return (
    <div className="w-12 h-12 flex justify-between items-center">
      <div className="w-2.5 h-2.5 bg-amber-400 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
      <div className="w-2.5 h-2.5 bg-amber-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
      <div className="w-2.5 h-2.5 bg-amber-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
    </div>
  );
};

export default Spinner;