import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flame, 
  Timer, 
  ShoppingBag, 
  Heart, 
  ArrowLeft, 
  Sparkles,
  Eye,
  Check
} from 'lucide-react';
import { Product } from '../types';
import { formatPrice } from '../data/products';

interface FlashSaleProps {
  products: Product[];
  onSelectProduct: (p: Product) => void;
  onAddToCart: (p: Product) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onViewAllDeals?: () => void;
}

export const FlashSale: React.FC<FlashSaleProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
  favorites,
  onToggleFavorite,
  onViewAllDeals
}) => {
  // Live countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    hours: 7,
    minutes: 42,
    seconds: 19
  });
  const [addedMap, setAddedMap] = useState<{ [id: string]: boolean }>({});

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

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    onAddToCart(product);
    setAddedMap(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedMap(prev => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  return (
    <section id="flash-sale-section" className="py-12 bg-slate-50/80 border-b border-slate-200/90 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Title and Countdown */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-gradient-to-r from-rose-50 via-orange-50 to-amber-50 border border-rose-200 p-5 sm:p-6 rounded-3xl shadow-sm"
        >
          
          <div className="flex items-center gap-3.5 text-right">
            <div 
              className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center shadow-md shadow-rose-500/30"
            >
              <Flame className="w-7 h-7 fill-white stroke-none" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">حراج شگفت‌انگیز و تخفیف‌های امروز</h2>
                <span 
                  className="text-[11px] font-black bg-rose-500 text-white px-2 py-0.5 rounded-full shadow-sm"
                >
                  تعداد محدود
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">تخفیف‌های استثنایی با انقضای محدود تا پایان امشب</p>
            </div>
          </div>

          {/* Countdown timer & View all deals link */}
          <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
            {onViewAllDeals && (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={onViewAllDeals}
                className="text-xs font-black text-amber-700 hover:text-amber-800 bg-white hover:bg-amber-100/60 border border-amber-200 px-3.5 py-2 rounded-xl transition-all flex items-center gap-1 shadow-sm cursor-pointer"
              >
                <span>مشاهده تمام تخفیف‌ها</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </motion.button>
            )}

            <div className="flex items-center gap-2 bg-white border border-rose-200 rounded-2xl px-4 py-2 shadow-sm">
              <Timer className="w-4 h-4 text-rose-500 animate-spin" style={{ animationDuration: '8s' }} />
              <span className="text-xs text-slate-500 font-bold ml-1">زمان باقی‌مانده:</span>
              <div className="flex items-center gap-1.5 font-mono text-sm font-black text-slate-900" dir="ltr">
                <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded-lg border border-slate-200">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-rose-500 font-bold">:</span>
                <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded-lg border border-slate-200">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-rose-500 font-bold">:</span>
                <motion.span 
                  key={timeLeft.seconds}
                  initial={{ scale: 1.15 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className="bg-rose-500 text-white px-2 py-0.5 rounded-lg shadow-sm inline-block"
                >
                  {String(timeLeft.seconds).padStart(2, '0')}
                </motion.span>
              </div>
            </div>
          </div>

        </motion.div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map((product, idx) => {
            const isFav = favorites.includes(product.id);
            const isAdded = addedMap[product.id];
            const soldPercent = Math.min(92, Math.round((product.salesCount / (product.salesCount + product.stockCount)) * 100));

            return (
              <motion.div
                key={product.id}
                id={`flash-card-${product.id}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ y: -8 }}
                onClick={() => onSelectProduct(product)}
                className="group relative bg-white rounded-3xl border border-slate-200/90 hover:border-amber-400 p-5 transition-colors duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between cursor-pointer"
              >
                <div>
                  {/* Top badges */}
                  <div className="flex items-center justify-between mb-2">
                    <motion.span 
                      whileHover={{ scale: 1.05 }}
                      className="bg-rose-500 text-white text-xs font-black px-2.5 py-1 rounded-xl shadow-sm flex items-center gap-1"
                    >
                      <Flame className="w-3.5 h-3.5 fill-white" />
                      %{product.discountPercent} تخفیف
                    </motion.span>

                    <motion.button
                      type="button"
                      whileTap={{ scale: 1.25 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(product.id);
                      }}
                      className={`p-2 rounded-xl transition-colors cursor-pointer ${
                        isFav 
                          ? 'bg-rose-50 text-rose-500 border border-rose-200' 
                          : 'bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-rose-50'
                      }`}
                      title="افزودن به علاقه‌مندی"
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </motion.button>
                  </div>

                  {/* Product Image */}
                  <div className="relative aspect-square w-full bg-slate-50 rounded-2xl p-4 flex items-center justify-center overflow-hidden mb-3 border border-slate-100 group-hover:bg-amber-50/40 transition-colors">
                    <motion.img
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      whileHover={{ scale: 1.08 }}
                      transition={{ duration: 0.3 }}
                      className="max-h-full max-w-full object-contain drop-shadow-sm"
                    />

                    {product.badge && (
                      <span className="absolute bottom-2 right-2 text-[10px] font-bold bg-white text-amber-700 px-2 py-0.5 rounded-lg border border-amber-200 shadow-xs">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                      {product.brand}
                    </span>
                    <h3 className="text-sm font-black text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-1 mb-0.5">
                      {product.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 truncate mb-3">{product.nameEn}</p>

                    {/* Stock progress bar */}
                    <div className="mt-auto mb-3 bg-slate-100 rounded-full p-1 border border-slate-200">
                      <div className="flex justify-between text-[10px] text-slate-500 px-1 mb-1 font-medium">
                        <span>فروش رفته: {soldPercent}%</span>
                        <span className="text-rose-600 font-bold">فقط {product.stockCount} عدد مانده</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${soldPercent}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: 0.3 }}
                          className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price & Action */}
                <div>
                  <div className="pt-3 border-t border-slate-100 mb-3 flex items-center justify-between text-right">
                    <div>
                      <div className="text-[11px] text-slate-400 line-through">
                        {formatPrice(product.originalPrice)}
                      </div>
                      <div className="text-base font-black text-slate-900">
                        {formatPrice(product.price)}
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                      ضمانت اصالت
                    </span>
                  </div>

                  {/* Add to Cart / Details buttons */}
                  <div className="grid grid-cols-4 gap-2">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => handleQuickAdd(e, product)}
                      className={`col-span-3 py-2.5 px-3 rounded-2xl font-black text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                        isAdded
                          ? 'bg-emerald-500 text-white shadow-md'
                          : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                      }`}
                    >
                      <AnimatePresence mode="wait">
                        {isAdded ? (
                          <motion.span 
                            key="added"
                            initial={{ scale: 0.7, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.7, opacity: 0 }}
                            className="flex items-center gap-1"
                          >
                            <Check className="w-4 h-4" />
                            <span>اضافه شد!</span>
                          </motion.span>
                        ) : (
                          <motion.span 
                            key="add"
                            initial={{ scale: 0.7, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.7, opacity: 0 }}
                            className="flex items-center gap-1"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>افزودن به سبد</span>
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>

                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onSelectProduct(product)}
                      className="py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                      title="مشاهده مشخصات کامل"
                    >
                      <Eye className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
