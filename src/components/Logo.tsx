import React from 'react';

export const Logo = ({ className = "h-12" }: { className?: string }) => {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="flex items-center gap-4">
        {/* Wheat Stalks (Left) - Matching the 3 stalks in the image */}
        <div className="w-10 h-12 flex items-center">
          <svg viewBox="0 0 100 100" className="w-full h-full text-bakery-soft-brown">
            <g transform="translate(10, 80) rotate(-20)">
              <path d="M0,0 Q10,-50 40,-70" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              <path d="M0,-20 Q10,-30 20,-35 M0,-30 Q10,-40 20,-45 M0,-40 Q10,-50 20,-55" fill="none" stroke="currentColor" strokeWidth="3" />
            </g>
            <g transform="translate(30, 85) rotate(-10)">
              <path d="M0,0 Q5,-60 20,-80" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              <path d="M0,-25 Q5,-35 15,-40 M0,-35 Q5,-45 15,-50" fill="none" stroke="currentColor" strokeWidth="3" />
            </g>
          </svg>
        </div>

        {/* Text */}
        <h1 className="text-4xl font-serif font-black tracking-tighter text-bakery-soft-brown italic">BakeNest</h1>

        {/* Basket (Right) - Matching the woven basket with steam */}
        <div className="w-12 h-12 flex items-center">
          <svg viewBox="0 0 100 100" className="w-full h-full text-bakery-soft-brown">
             {/* Steam */}
             <path d="M45,10 Q50,0 55,10 M55,10 Q60,20 65,10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
             {/* Bread tops */}
             <circle cx="35" cy="40" r="12" fill="currentColor" opacity="0.8" />
             <path d="M60,40 L75,25" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
             {/* Basket */}
             <path d="M20,45 L80,45 L75,75 Q50,85 25,75 Z" fill="none" stroke="currentColor" strokeWidth="4" />
             <path d="M25,55 L75,55 M25,65 L75,65 M40,45 L40,80 M60,45 L60,80" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5" />
          </svg>
        </div>
      </div>
      <span className="text-[10px] md:text-[12px] uppercase tracking-[0.4em] font-bold text-bakery-soft-brown -mt-1">
        Freshly Baked Happiness
      </span>
    </div>
  );
};
