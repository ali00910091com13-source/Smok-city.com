import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { formatPrice } from '../data/products';
import { 
  Flame, 
  Clock, 
  Sparkles, 
  Tag, 
  Copy, 
  Check, 
  ShoppingBag, 
  Heart, 
  Star, 
  Zap, 
  ShieldCheck 
} from 'lucide-react';

interface DealsPageProps {
  products: Product[];
  onSelectProduct: (p: Product) => void;
  onAddToCart: (p: Product) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onCopyCoupon?: (code: string) => void;
}

export const DealsPage: React.FC<DealsPageProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
  favorites,
  onToggleFavorite,
  onCopyCoupon
}) => {
  // Live ticking countdown to midnight
  const [timeLeft, setTimeLeft] = useState({ hours: 8, minutes: 42, seconds: 19 });
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [minDiscount, setMinDiscount] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const copyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    onCopyCoupon?.(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const discountedProducts = products
    .filter(p => p.discountPercent >= minDiscount)
    .sort((a, b) => b.discountPercent - a.discountPercent);

  const coupons = [
    { code: 'SMOKE10', title: '۱۰٪ تخفیف کل فاکتور', desc: 'برای خریدهای بالای ۸۰۰ هزار تومان', minOrder: '۸۰۰,۰۰۰ ت' },
    { code: 'WELCOME50', title: '۵۰,۰۰۰ تومان هدیه خرید اول', desc: 'بدون محدودیت حداقل خرید برای کاربران جدید', minOrder: 'بدون سقف' },
    { code: 'FREESHIP', title: 'ارسال اکسپرس کاملاً رایگان', desc: 'تحویل ۲ ساعته پایتخت یا پست پیشتاز سراسری', minOrder: '۶۰۰,۰۰۰ ت' }
  ];

  return (
    <div className="bg-slate-50 py-8 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Hero Deals Banner with Live Countdown */}
        <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-rose-600 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="space-y-3 max-w-xl text-right z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-black">
              <Flame className="w-4 h-4 fill-white" />
              <span>جشنواره تخفیف‌های آتشین روز</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black leading-tight tracking-tight">
              حراج شگفت‌انگیز تجهیزات ویپ و سالت تا ۲۵٪ تخفیف
            </h1>
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
              فرصت طلایی خرید پاد سیستم‌های پرچمدار، سالت‌های وارداتی با ضمانت اصالت فیزیکی و کارتریج‌های ضد نشتی با نازل‌ترین قیمت بازار ایران.
            </p>
          </div>

          {/* Countdown Clock */}
          <div className="bg-slate-950/40 backdrop-blur-xl border border-white/20 rounded-3xl p-6 text-center z-10 w-full sm:w-auto shadow-2xl">
            <div className="flex items-center justify-center gap-2 text-amber-300 text-xs font-bold mb-3">
              <Clock className="w-4 h-4" />
              <span>زمان باقی‌مانده تا پایان حراج امروز</span>
            </div>
            
            <div className="flex items-center justify-center gap-3 dir-ltr">
              <div className="bg-white/10 rounded-2xl px-4 py-2.5 min-w-[65px] border border-white/10">
                <span className="text-2xl sm:text-3xl font-black font-mono block">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[10px] text-white/70">ثانیه</span>
              </div>
              <span className="text-2xl font-bold text-white/60">:</span>
              <div className="bg-white/10 rounded-2xl px-4 py-2.5 min-w-[65px] border border-white/10">
                <span className="text-2xl sm:text-3xl font-black font-mono block">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[10px] text-white/70">دقیقه</span>
              </div>
              <span className="text-2xl font-bold text-white/60">:</span>
              <div className="bg-white/10 rounded-2xl px-4 py-2.5 min-w-[65px] border border-white/10">
                <span className="text-2xl sm:text-3xl font-black font-mono block">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[10px] text-white/70">ساعت</span>
              </div>
            </div>
          </div>

          {/* Decorative background glow */}
          <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        </div>

        {/* Ready Coupons Row */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Tag className="w-5 h-5 text-amber-600" />
              <h2 className="text-lg font-black text-slate-900">کوپن‌های تخفیف آماده استفاده</h2>
            </div>
            <span className="text-xs text-slate-500">کلیک برای کپی آسان</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {coupons.map((coupon) => {
              const isCopied = copiedCode === coupon.code;
              return (
                <div
                  key={coupon.code}
                  className="bg-white rounded-2xl p-4 border-2 border-dashed border-amber-300 hover:border-amber-500 transition-all flex items-center justify-between gap-3 shadow-sm hover:shadow-md group"
                >
                  <div className="text-right space-y-1">
                    <span className="text-xs font-black text-slate-900 block">{coupon.title}</span>
                    <p className="text-[11px] text-slate-500">{coupon.desc}</p>
                    <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-md inline-block">
                      حداقل: {coupon.minOrder}
                    </span>
                  </div>

                  <button
                    onClick={() => copyCode(coupon.code)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shrink-0 ${
                      isCopied 
                        ? 'bg-emerald-500 text-white shadow-md' 
                        : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm'
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>کپی شد</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span className="font-mono">{coupon.code}</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Filter Pills for deals */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">فیلتر درصد تخفیف:</span>
            <button
              onClick={() => setMinDiscount(0)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                minDiscount === 0 ? 'bg-amber-500 text-slate-950 shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              همه پیشنهادات ({products.filter(p => p.discountPercent > 0).length})
            </button>
            <button
              onClick={() => setMinDiscount(15)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                minDiscount === 15 ? 'bg-amber-500 text-slate-950 shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              بالای ۱۵٪ تخفیف
            </button>
            <button
              onClick={() => setMinDiscount(18)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                minDiscount === 18 ? 'bg-amber-500 text-slate-950 shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              تخفیف‌های ویژه (۱۸٪ به بالا)
            </button>
          </div>

          <span className="text-xs text-slate-500 font-medium">
            تعداد کالاهای تخفیف‌دار: {discountedProducts.length} کالا
          </span>
        </div>

        {/* Deals Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {discountedProducts.map((product) => {
            const isFav = favorites.includes(product.id);
            const percentRemaining = Math.max(15, Math.round((product.stockCount / 50) * 100));

            return (
              <div
                key={product.id}
                className="bg-white rounded-3xl border border-slate-200/90 hover:border-amber-400 p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Top tags */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-rose-500 text-white font-black text-xs px-2.5 py-1 rounded-xl shadow-sm flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 fill-white" />
                      %{product.discountPercent} تخفیف ویژه
                    </span>
                    <button
                      onClick={() => onToggleFavorite(product.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500"
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>
                  </div>

                  {/* Image */}
                  <button
                    onClick={() => onSelectProduct(product)}
                    className="w-full flex items-center justify-center py-6 bg-slate-50 rounded-2xl mb-4 group-hover:bg-amber-50/40 transition-colors"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="h-44 object-contain group-hover:scale-105 transition-transform drop-shadow-sm"
                    />
                  </button>

                  {/* Rating & Brand */}
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">{product.brand}</span>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      <span className="font-bold text-slate-800 text-xs">{product.rating}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <button
                    onClick={() => onSelectProduct(product)}
                    className="font-bold text-slate-900 text-sm hover:text-amber-600 transition-colors text-right block line-clamp-1 w-full"
                  >
                    {product.name}
                  </button>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{product.nameEn}</p>

                  {/* Stock progress */}
                  <div className="mt-3 bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        percentRemaining < 30 ? 'bg-rose-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${percentRemaining}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>موجودی باقی‌مانده: {product.stockCount} عدد</span>
                    <span className="text-amber-600 font-bold">{product.salesCount} نفر خریدند</span>
                  </div>
                </div>

                {/* Price & Add to cart */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="text-right">
                    <span className="block text-xs text-slate-400 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <span className="text-base font-black text-slate-900">
                      {formatPrice(product.price)}
                    </span>
                  </div>

                  <button
                    onClick={() => onAddToCart(product)}
                    className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-md hover:scale-105 active:scale-95 flex items-center gap-1.5"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>خرید سریع</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
