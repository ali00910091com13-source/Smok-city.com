import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  ShoppingBag, 
  Heart, 
  Eye, 
  Check, 
  Star, 
  ShieldCheck, 
  Truck, 
  ArrowLeft, 
  Flame,
  RotateCw
} from 'lucide-react';
import { Product } from '../types';
import { CATEGORIES, formatPrice } from '../data/products';

interface FeaturedProductsProps {
  products: Product[];
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
  onSelectProduct: (p: Product) => void;
  onAddToCart: (p: Product) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onNavigateShop?: () => void;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  products,
  selectedCategory,
  onSelectCategory,
  onSelectProduct,
  onAddToCart,
  favorites,
  onToggleFavorite,
  onNavigateShop
}) => {
  const [addedMap, setAddedMap] = useState<{ [id: string]: boolean }>({});

  const filtered = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory);

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    onAddToCart(product);
    setAddedMap(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedMap(prev => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  return (
    <section id="products-section" className="py-14 bg-white border-b border-slate-200/90 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8"
        >
          <div className="text-right">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ویترین برگزیده محصولات</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              جدیدترین و پرفروش‌ترین تجهیزات اورجینال
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              مجموعه‌ای کامل از بهترین دستگاه‌های ویپ، پاد سیستم‌های روز دنیا و طعم‌های محبوب سالت نیکوتین
            </p>
          </div>

          {/* Filter Tabs with Active Tab Motion Pill */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none self-start md:self-auto bg-slate-100 p-1.5 rounded-2xl border border-slate-200 relative">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  id={`cat-filter-${cat.id}`}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`relative px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors z-10 cursor-pointer ${
                    isSelected
                      ? 'text-slate-950 font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="activeCategoryTabPill"
                      className="absolute inset-0 bg-amber-500 rounded-xl shadow-sm -z-10"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  {cat.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Product Cards Grid with Layout Animations */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {filtered.slice(0, 8).map((product, idx) => {
              const isFav = favorites.includes(product.id);
              const isAdded = addedMap[product.id];

              return (
                <motion.div
                  layout
                  key={product.id}
                  id={`featured-card-${product.id}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, delay: idx * 0.05 }}
                  whileHover={{ y: -8 }}
                  onClick={() => onSelectProduct(product)}
                  className="group relative bg-white rounded-3xl border border-slate-200 hover:border-amber-400 p-5 transition-colors duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    {/* Top tags */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg">
                        {product.brand}
                      </span>

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

                      {product.discountPercent > 0 && (
                        <span className="absolute top-2 right-2 text-[10px] font-black bg-rose-500 text-white px-2 py-0.5 rounded-lg shadow-sm">
                          %{product.discountPercent} تخفیف
                        </span>
                      )}

                      {product.badge && (
                        <span className="absolute bottom-2 left-2 text-[10px] font-bold bg-white text-slate-700 px-2 py-0.5 rounded-md border border-slate-200 shadow-xs">
                          {product.badge}
                        </span>
                      )}

                      {/* 3D Model Available Badge */}
                      <span className="absolute bottom-2 right-2 text-[9px] font-black bg-slate-900/80 backdrop-blur text-amber-400 px-1.5 py-0.5 rounded-md border border-white/10 flex items-center gap-1 shadow-xs">
                        <RotateCw className="w-2.5 h-2.5" />
                        <span>3D مدل</span>
                      </span>
                    </div>

                    {/* Rating & Sales */}
                    <div className="flex items-center justify-between text-xs mb-1">
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-500" />
                        <span className="font-bold text-slate-800 text-xs">{product.rating}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">({product.reviewsCount} نظر خریداران)</span>
                    </div>

                    {/* Title & Desc */}
                    <div className="text-right">
                      <h3 className="text-sm font-black text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-1 mb-0.5">
                        {product.name}
                      </h3>
                      <p className="text-[11px] text-slate-400 truncate mb-3">{product.nameEn}</p>
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div>
                    <div className="pt-3 border-t border-slate-100 mb-3 flex items-center justify-between text-right">
                      <div>
                        {product.discountPercent > 0 ? (
                          <>
                            <div className="text-[11px] text-slate-400 line-through">
                              {formatPrice(product.originalPrice)}
                            </div>
                            <div className="text-base font-black text-slate-900">
                              {formatPrice(product.price)}
                            </div>
                          </>
                        ) : (
                          <div className="text-base font-black text-slate-900">
                            {formatPrice(product.price)}
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        موجودی: {product.stockCount}
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
          </AnimatePresence>
        </motion.div>

        {/* View All in Shop CTA */}
        {onNavigateShop && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={onNavigateShop}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-slate-100 hover:bg-amber-500 hover:text-slate-950 text-slate-800 font-black text-xs sm:text-sm transition-all shadow-sm border border-slate-200 cursor-pointer"
            >
              <span>مشاهده تمامی محصولات در فروشگاه پیشرفته</span>
              <ArrowLeft className="w-4 h-4" />
            </motion.button>
          </motion.div>
        )}

      </div>
    </section>
  );
};
