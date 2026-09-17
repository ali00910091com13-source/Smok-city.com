import React from 'react';
import { formatPrice } from '../data/products';
import { RotateCcw } from 'lucide-react';

interface PriceRangeSliderProps {
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  onReset: () => void;
  isFiltered: boolean;
}

export const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({
  min,
  max,
  step = 50000,
  value,
  onChange,
  onReset,
  isFiltered
}) => {
  const [minVal, maxVal] = value;

  // Safe percentage calculation
  const totalRange = max - min || 1;
  const minPercent = Math.max(0, Math.min(100, Math.round(((minVal - min) / totalRange) * 100)));
  const maxPercent = Math.max(0, Math.min(100, Math.round(((maxVal - min) / totalRange) * 100)));

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = Number(e.target.value);
    const newMin = Math.min(rawVal, maxVal - step);
    onChange([newMin, maxVal]);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = Number(e.target.value);
    const newMax = Math.max(rawVal, minVal + step);
    onChange([minVal, newMax]);
  };

  // Quick preset buttons for common shopper budgets in Iranian Tomans
  const presets: { label: string; range: [number, number] }[] = [
    { label: 'زیر ۵۰۰ هزار تومان', range: [min, Math.min(500000, max)] },
    { label: '۵۰۰ هزار تا ۱ میلیون', range: [Math.max(min, 500000), Math.min(1000000, max)] },
    { label: '۱ تا ۲ میلیون تومان', range: [Math.max(min, 1000000), Math.min(2000000, max)] },
    { label: 'بالای ۲ میلیون تومان', range: [Math.max(min, 2000000), max] }
  ];

  return (
    <div className="space-y-4 font-['Vazirmatn',sans-serif]">
      {/* Title & Reset Button */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <span>محدوده قیمت</span>
          {isFiltered && (
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          )}
        </span>
        {isFiltered && (
          <button
            type="button"
            onClick={onReset}
            className="text-xs text-amber-700 hover:text-amber-800 font-bold flex items-center gap-1 hover:underline cursor-pointer"
            title="بازنشانی فیلتر قیمت"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>بازنشانی</span>
          </button>
        )}
      </div>

      {/* Visual Dual Slider */}
      <div className="relative pt-2 pb-2 px-1">
        {/* Base Slider Track */}
        <div className="relative h-2 w-full rounded-full bg-slate-200">
          {/* Active Colored Range Fill */}
          <div
            className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 shadow-sm"
            style={{
              left: `${minPercent}%`,
              right: `${100 - maxPercent}%`
            }}
          />
        </div>

        {/* Dual Input Range Sliders (Overlaid) */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minVal}
          onChange={handleMinChange}
          aria-label="حداقل قیمت"
          className="absolute top-2 -translate-y-1/2 left-0 w-full h-2 bg-transparent appearance-none pointer-events-none cursor-pointer accent-amber-500 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:active:cursor-grabbing [&::-webkit-slider-thumb]:hover:scale-110 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-500 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-grab [&::-moz-range-thumb]:active:cursor-grabbing"
          style={{ zIndex: minVal > max - 100 ? 5 : 3 }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxVal}
          onChange={handleMaxChange}
          aria-label="حداکثر قیمت"
          className="absolute top-2 -translate-y-1/2 left-0 w-full h-2 bg-transparent appearance-none pointer-events-none cursor-pointer accent-amber-500 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:active:cursor-grabbing [&::-webkit-slider-thumb]:hover:scale-110 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-500 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-grab [&::-moz-range-thumb]:active:cursor-grabbing"
          style={{ zIndex: 4 }}
        />
      </div>

      {/* Price Range Display Boxes */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        {/* Min Price Box */}
        <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-2.5 text-right shadow-2xs">
          <span className="text-[11px] text-slate-400 font-bold block mb-1">از (حداقل قیمت)</span>
          <span className="text-xs font-black text-slate-900 block truncate font-['Vazirmatn',sans-serif]">
            {formatPrice(minVal)}
          </span>
        </div>

        {/* Max Price Box */}
        <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-2.5 text-right shadow-2xs">
          <span className="text-[11px] text-slate-400 font-bold block mb-1">تا (حداکثر قیمت)</span>
          <span className="text-xs font-black text-amber-700 block truncate font-['Vazirmatn',sans-serif]">
            {formatPrice(maxVal)}
          </span>
        </div>
      </div>

      {/* Quick Budget Presets */}
      <div className="pt-1.5">
        <span className="text-xs font-bold text-slate-500 block mb-2">انتخاب سریع محدوده بودجه:</span>
        <div className="grid grid-cols-2 gap-2">
          {presets.map((preset, idx) => {
            const isSelected = value[0] === preset.range[0] && value[1] === preset.range[1];
            return (
              <button
                key={idx}
                type="button"
                onClick={() => onChange(preset.range)}
                className={`text-xs py-2 px-2.5 rounded-xl font-bold transition-all text-center border cursor-pointer leading-tight ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-sm font-black ring-2 ring-amber-400/40'
                    : 'bg-white hover:bg-amber-50/70 text-slate-700 border-slate-200/90 hover:border-amber-300 hover:text-slate-900 shadow-2xs'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
