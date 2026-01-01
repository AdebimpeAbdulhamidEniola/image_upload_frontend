import React from "react";

const LoadingIndicator = () => (
  <div className="absolute inset-0 flex items-center justify-center z-20">
    {/* Blur only the upload area, very subtle */}
    <div className="absolute inset-0 bg-black/5 backdrop-blur-[1.5px] z-10 pointer-events-none" style={{ borderRadius: 'inherit' }}></div>
    {/* Centered loading bar */}
    <div className="relative z-20 flex flex-col items-center">
      <div className="w-40 h-2 bg-blue-200 dark:bg-blue-900 rounded-full overflow-hidden relative">
        <div className="h-2 bg-blue-500 dark:bg-blue-400 animate-loading-bar rounded-full absolute left-0 top-0" style={{ width: '40%' }}></div>
      </div>
    </div>
    <style jsx>{`
      @keyframes loading-bar {
        0% { width: 0%; }
        50% { width: 60%; }
        100% { width: 100%; }
      }
      .animate-loading-bar {
        animation: loading-bar 1.2s infinite linear;
      }
    `}</style>
  </div>
);

export default LoadingIndicator;
