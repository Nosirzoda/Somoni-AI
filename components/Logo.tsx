
import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  variant?: 'light' | 'dark' | 'emerald';
}

const Logo: React.FC<LogoProps> = ({ 
  className = "", 
  size = 32, 
  showText = false,
  variant = 'emerald'
}) => {
  const colorClass = variant === 'emerald' ? 'text-emerald-600' : variant === 'light' ? 'text-white' : 'text-gray-900';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 512 512" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={colorClass}
      >
        <circle cx="256" cy="256" r="48" fill="currentColor" />
        <circle cx="256" cy="256" r="80" stroke="currentColor" strokeWidth="12" fill="none" />
        
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <circle 
            key={angle}
            cx={256 + 110 * Math.cos(angle * Math.PI / 180)} 
            cy={256 + 110 * Math.sin(angle * Math.PI / 180)} 
            r="12" 
            fill="currentColor" 
          />
        ))}

        <circle cx="256" cy="256" r="150" stroke="currentColor" strokeWidth="16" fill="none" strokeDasharray="40 20" />
        
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
          <g key={angle} transform={`rotate(${angle} 256 256)`}>
            <path d="M256 60 Q286 60 286 90" stroke="currentColor" strokeWidth="12" fill="none" />
            <path d="M256 60 Q226 60 226 90" stroke="currentColor" strokeWidth="12" fill="none" />
            <circle cx="256" cy="60" r="16" fill="currentColor" />
          </g>
        ))}
      </svg>
      
      {showText && (
        <div className="flex flex-col">
          <span className={`font-black tracking-tight leading-none ${variant === 'light' ? 'text-white' : 'text-gray-950 dark:text-slate-100'}`} style={{ fontSize: size * 0.6 }}>
            SOMONI <span className={variant === 'emerald' ? 'text-emerald-600' : ''}>AI</span>
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
