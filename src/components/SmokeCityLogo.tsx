import React from 'react';
import logoImg from '../assets/images/smoke_city_logo_1789743787986.jpg';

interface SmokeCityLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showSubtext?: boolean;
  className?: string;
  imgClassName?: string;
  textClassName?: string;
  subtextClassName?: string;
}

export const SmokeCityLogo: React.FC<SmokeCityLogoProps> = ({
  size = 'md',
  showText = true,
  showSubtext = true,
  className = '',
  imgClassName = '',
  textClassName = '',
  subtextClassName = '',
}) => {
  const sizeMap = {
    sm: {
      container: 'w-9 h-9 min-w-[36px]',
      title: 'text-sm font-black',
      sub: 'text-[9px] font-bold',
    },
    md: {
      container: 'w-11 h-11 min-w-[44px]',
      title: 'text-xl font-black',
      sub: 'text-[10px] font-bold',
    },
    lg: {
      container: 'w-14 h-14 min-w-[56px]',
      title: 'text-2xl font-black',
      sub: 'text-xs font-bold',
    },
    xl: {
      container: 'w-20 h-20 min-w-[80px]',
      title: 'text-3xl font-black',
      sub: 'text-sm font-bold',
    },
  };

  const selectedSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Circular Logo Emblem */}
      <div
        className={`relative ${selectedSize.container} rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-amber-500 via-amber-400 to-orange-500 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-all duration-300 ring-2 ring-white/80 shrink-0 ${imgClassName}`}
      >
        <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center">
          <img
            src={logoImg}
            alt="لوگوی اسموک سیتی - Smoke City"
            className="w-full h-full object-cover rounded-full select-none"
            referrerPolicy="no-referrer"
            loading="eager"
          />
        </div>
      </div>

      {/* Typography Brand Name */}
      {showText && (
        <div className="flex flex-col text-right">
          <span
            className={`tracking-tight text-slate-950 leading-none ${selectedSize.title} ${textClassName}`}
          >
            اسموک سیتی
          </span>
          {showSubtext && (
            <span
              className={`tracking-widest text-amber-600 uppercase mt-1 leading-none ${selectedSize.sub} ${subtextClassName}`}
            >
              SMOKE CITY VAPE
            </span>
          )}
        </div>
      )}
    </div>
  );
};
