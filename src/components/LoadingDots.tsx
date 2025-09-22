import React from 'react';

const LoadingDots: React.FC = () => {
  return (
    <div className="flex items-center gap-1">
      <span className="animate-bounce [animation-delay:-0.3s]">
        <div className="h-2 w-2 bg-primary rounded-full"></div>
      </span>
      <span className="animate-bounce [animation-delay:-0.15s]">
        <div className="h-2 w-2 bg-primary rounded-full"></div>
      </span>
      <span className="animate-bounce">
        <div className="h-2 w-2 bg-primary rounded-full"></div>
      </span>
    </div>
  );
};

export default LoadingDots;