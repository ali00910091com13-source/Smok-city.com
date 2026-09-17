import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';
import { CATEGORIES, formatPrice } from '../data/products';
import { PriceRangeSlider } from './PriceRangeSlider';
import { 
  Search, 
  SlidersHorizontal, 
  Heart, 
  ShoppingBag, 
  Star, 
  Flame, 
  Grid, 
  List, 
  Check, 
  X,
  Sparkles,
  ArrowUpDown,
  Filter,
  RotateCw
} from 'lucide-react';

interface ShopPageProps {
  products: Product[];
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
  onSelectProduct: (p: Product) => void;
  onAddToCart: (p: Product) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  products,
  selectedCategory,
  onSelectCategory,
  onSelectProduct,
  onAddToCart,
  favorites,
  onToggleFavorite
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'discount' | 'rating'>('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Compute min and max prices across products
  const { minAvailablePrice, maxAvailablePrice } = useMemo(() => {
    if (!products || products.length === 0) {
      return { minAvailablePrice: 0, maxAvailablePrice: 4000000 };
    }
    const prices = products.map(p => p.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    // Round to convenient steps
    return {
      minAvailablePrice: Math.floor(min / 50000) * 50000,
      maxAvailablePrice: Math.ceil(max / 100000) * 100000
    };
  }, [products]);

  // Price range filter state
  const [priceRange, setPriceRange] = useState<[number, number]>([minAvailablePrice, maxAvailablePrice]);

  // If min or max bound shifts, sync if at bounds
  React.useEffect(() => {
    setPriceRange([minAvailablePrice, maxAvailablePrice]);
  }, [minAvailablePrice, maxAvailablePrice]);

  // Lock body scroll when mobile filters drawer is open
  useEffect(() => {
    if (isMobileFiltersOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isMobileFiltersOpen]);

  // Extract unique brands
  const allBrands = useMemo(() => {
    const brands = Array.from(new Set(products.map(p => p.brand)));
    return brands;
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Category filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }
      // Brand filter
      if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) {
        return false;
      }
      // Price range filter
      if (p.price < priceRange[0] || p.price > priceRange[1]) {
        return false;
      }
      // In stock
      if (onlyInStock && !p.inStock) {
        return false;
      }
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchNameEn = p.nameEn.toLowerCase().includes(q);
        const matchBrand = p.brand.toLowerCase().includes(q);
        if (!matchName && !matchNameEn && !matchBrand) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'popular') return b.salesCount - a.salesCount;
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'discount') return b.discountPercent - a.discountPercent;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [products, selectedCategory, selectedBrands, priceRange, onlyInStock, searchQuery, sortBy]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const isPriceFiltered = priceRange[0] > minAvailablePrice || priceRange[1] < maxAvailablePrice;

  const resetPriceRange = () => {
    setPriceRange([minAvailablePrice, maxAvailablePrice]);
  };

  const clearAllFilters = () => {
    onSelectCategory('all');
    setSelectedBrands([]);
    setOnlyInStock(false);
    setSearchQuery('');
    setPriceRange([minAvailablePrice, maxAvailablePrice]);
  };

  const activeFiltersCount = 
    (selectedCategory !== 'all' ? 1 : 0) + 
    selectedBrands.length + 
    (onlyInStock ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0) +
    (isPriceFiltered ? 1 : 0);

  return (
    <div className="bg-slate-50 py-8 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-amber-600 font-bold text-xs mb-1">
              <Sparkles className="w-4 h-4" />
              <span>فروشگاه آنلاین اسموک سیتی</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              کاتالوگ جامع محصولات و تجهیزات ویپینگ
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-2xl">
              تمامی دستگاه‌ها، سالت‌ها و کارتریج‌ها با ۱۰۰٪ اصالت تضمینی، ضمانت سلامت فیزیکی و آماده ارسال سریع به سراسر ایران
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-amber-50 border border-amber-200/80 rounded-2xl px-4 py-2.5 text-center">
              <span className="block text-xl font-black text-amber-700">{filteredProducts.length}</span>
              <span className="text-[11px] text-slate-600 font-medium">کالای در دسترس</span>
            </div>
          </div>
        </div>

        {/* Main Grid: Sidebar Filters + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Filters (Desktop) */}
          <aside className="hidden lg:block lg:col-span-1 space-y-6">
            
            {/* Filter Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6 sticky top-28">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
                  <SlidersHorizontal className="w-4 h-4 text-amber-500" />
                  <span>فیلترهای پیشرفته</span>
                </div>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" />
                    حذف فیلترها
                  </button>
                )}
              </div>

              {/* Categories */}
              <div>
                <h3 className="text-xs font-bold text-slate-800 mb-3">دسته‌بندی اصلی</h3>
                <div className="space-y-1.5">
                  {CATEGORIES.map(cat => {
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => onSelectCategory(cat.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                          isSelected 
                            ? 'bg-amber-500 text-slate-950 font-black shadow-sm' 
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <span>{cat.label}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          isSelected ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {cat.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Range Slider */}
              <div className="border-t border-slate-100 pt-5">
                <PriceRangeSlider
                  min={minAvailablePrice}
                  max={maxAvailablePrice}
                  value={priceRange}
                  onChange={setPriceRange}
                  onReset={resetPriceRange}
                  isFiltered={isPriceFiltered}
                />
              </div>

              {/* Brand Filter */}
              <div className="border-t border-slate-100 pt-5">
                <h3 className="text-xs font-bold text-slate-800 mb-3">برند سازنده</h3>
                <div className="space-y-2">
                  {allBrands.map(brand => {
                    const isChecked = selectedBrands.includes(brand);
                    return (
                      <label 
                        key={brand}
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleBrand(brand)}
                            className="rounded text-amber-500 focus:ring-amber-400 w-4 h-4 border-slate-300"
                          />
                          <span className="font-semibold text-slate-700">{brand}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {products.filter(p => p.brand === brand).length} کالا
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* In Stock Switch */}
              <div className="border-t border-slate-100 pt-5">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs font-bold text-slate-800">فقط کالاهای موجود در انبار</span>
                  <input
                    type="checkbox"
                    checked={onlyInStock}
                    onChange={(e) => setOnlyInStock(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500 relative"></div>
                </label>
              </div>

            </div>
          </aside>

          {/* Main Products Content */}
          <main className="lg:col-span-3 space-y-6">
            
            {/* Top Toolbar */}
            <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              
              {/* Search Inside Shop */}
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="جستجو در این بخش..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-2.5 pr-10 pl-4 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Mobile Filter Trigger */}
              <button
                onClick={() => setIsMobileFiltersOpen(true)}
                className="lg:hidden flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold"
              >
                <Filter className="w-4 h-4" />
                <span>فیلترها ({activeFiltersCount})</span>
              </button>

              {/* Sorting and View Mode */}
              <div className="flex items-center justify-between sm:justify-end gap-3">
                <div className="flex items-center gap-2 text-xs">
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-500 hidden sm:inline">مرتب‌سازی:</span>
                  <select
                    value={sortBy}
                    onChange={(e: any) => setSortBy(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-amber-500"
                  >
                    <option value="popular">پرفروش‌ترین‌ها</option>
                    <option value="discount">بیشترین تخفیف</option>
                    <option value="rating">بالاترین امتیاز</option>
                    <option value="price-asc">ارزان‌ترین</option>
                    <option value="price-desc">گران‌ترین</option>
                  </select>
                </div>

                {/* View Mode Toggle */}
                <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg transition-colors ${
                      viewMode === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                    }`}
                    title="نمایش شبکه‌ای"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-lg transition-colors ${
                      viewMode === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                    }`}
                    title="نمایش سطری"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>

            {/* Active filter badges */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs text-slate-400">فیلترهای فعال:</span>
                {selectedCategory !== 'all' && (
                  <span className="bg-amber-100 text-amber-800 border border-amber-300 text-xs px-2.5 py-1 rounded-full flex items-center gap-1 font-bold">
                    دسته: {CATEGORIES.find(c => c.id === selectedCategory)?.label}
                    <button onClick={() => onSelectCategory('all')} className="hover:text-amber-950">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedBrands.map(b => (
                  <span key={b} className="bg-slate-200 text-slate-800 text-xs px-2.5 py-1 rounded-full flex items-center gap-1 font-bold">
                    برند: {b}
                    <button onClick={() => toggleBrand(b)} className="hover:text-black">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {onlyInStock && (
                  <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs px-2.5 py-1 rounded-full flex items-center gap-1 font-bold">
                    فقط موجود در انبار
                    <button onClick={() => setOnlyInStock(false)} className="hover:text-emerald-950">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {isPriceFiltered && (
                  <span className="bg-amber-100 text-amber-900 border border-amber-300 text-xs px-2.5 py-1 rounded-full flex items-center gap-1 font-bold">
                    قیمت: {formatPrice(priceRange[0])} تا {formatPrice(priceRange[1])}
                    <button onClick={resetPriceRange} className="hover:text-amber-950">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Product List */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
                <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-4 border border-amber-200">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-black text-slate-800">کالایی مطابق با فیلترهای انتخابی یافت نشد</h3>
                <p className="text-xs text-slate-500 mt-2 max-w-md mx-auto">
                  پیشنهاد می‌کنیم فیلترهای انتخابی را تغییر داده یا از بخش جستجو نام کالا را به صورت عمومی‌تر وارد نمایید.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="mt-6 px-6 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-colors shadow-md"
                >
                  مشاهده همه محصولات
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map(product => {
                  const isFav = favorites.includes(product.id);
                  return (
                    <div
                      key={product.id}
                      className="bg-white rounded-3xl border border-slate-200/80 hover:border-amber-400/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group"
                    >
                      {/* Top image & badges */}
                      <div className="relative p-6 bg-slate-50/70 text-center flex items-center justify-center border-b border-slate-100">
                        {product.discountPercent > 0 && (
                          <div className="absolute top-4 right-4 bg-rose-500 text-white font-black text-[11px] px-2.5 py-1 rounded-xl shadow-md">
                            %{product.discountPercent} تخفیف
                          </div>
                        )}
                        <button
                          onClick={() => onToggleFavorite(product.id)}
                          className={`absolute top-4 left-4 p-2 rounded-xl transition-all ${
                            isFav 
                              ? 'bg-rose-50 text-rose-500 shadow-sm' 
                              : 'bg-white text-slate-400 hover:text-rose-500 hover:bg-rose-50'
                          }`}
                          title="نشان کردن کالا"
                        >
                          <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500' : ''}`} />
                        </button>

                        <button
                          onClick={() => onSelectProduct(product)}
                          className="w-full flex items-center justify-center py-4"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            referrerPolicy="no-referrer"
                            className="h-44 object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-sm"
                          />
                        </button>

                        <div className="absolute bottom-3 right-4 flex items-center gap-1.5">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-white/90 px-2 py-0.5 rounded-lg border border-slate-200">
                            {product.brand}
                          </span>
                          <span className="text-[9px] font-black bg-slate-900/80 backdrop-blur text-amber-400 px-1.5 py-0.5 rounded-md border border-white/10 flex items-center gap-1 shadow-xs">
                            <RotateCw className="w-2.5 h-2.5" />
                            <span>3D</span>
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-3 text-right">
                        <div>
                          <div className="flex items-center gap-1 text-amber-500 text-xs mb-1">
                            <Star className="w-3.5 h-3.5 fill-amber-500" />
                            <span className="font-bold text-slate-800">{product.rating}</span>
                            <span className="text-[10px] text-slate-400">({product.reviewCount} نظر)</span>
                          </div>

                          <button
                            onClick={() => onSelectProduct(product)}
                            className="text-right w-full font-bold text-slate-900 text-sm hover:text-amber-600 transition-colors line-clamp-1"
                          >
                            {product.name}
                          </button>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5 font-sans">
                            {product.nameEn}
                          </p>
                        </div>

                        {/* Price & Action */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                          <div>
                            {product.originalPrice > product.price && (
                              <span className="block text-[11px] text-slate-400 line-through">
                                {formatPrice(product.originalPrice)}
                              </span>
                            )}
                            <span className="text-base font-black text-slate-900">
                              {formatPrice(product.price)}
                            </span>
                          </div>

                          <button
                            onClick={() => onAddToCart(product)}
                            className="p-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all shadow-md hover:scale-105 active:scale-95 flex items-center gap-1 text-xs"
                            title="افزودن به سبد خرید"
                          >
                            <ShoppingBag className="w-4 h-4" />
                            <span className="hidden sm:inline">خرید</span>
                          </button>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* List View */
              <div className="space-y-4">
                {filteredProducts.map(product => {
                  const isFav = favorites.includes(product.id);
                  return (
                    <div
                      key={product.id}
                      className="bg-white rounded-3xl border border-slate-200/80 hover:border-amber-400/80 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-center gap-6"
                    >
                      <button
                        onClick={() => onSelectProduct(product)}
                        className="w-32 h-32 shrink-0 bg-slate-50 rounded-2xl p-2 flex items-center justify-center border border-slate-100"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          className="h-28 object-contain"
                        />
                      </button>

                      <div className="flex-1 text-right space-y-2 w-full">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-lg">
                            {product.categoryLabel} • {product.brand}
                          </span>
                          <button
                            onClick={() => onToggleFavorite(product.id)}
                            className="text-slate-400 hover:text-rose-500"
                          >
                            <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                          </button>
                        </div>

                        <button
                          onClick={() => onSelectProduct(product)}
                          className="text-base font-black text-slate-900 hover:text-amber-600 transition-colors text-right block"
                        >
                          {product.name}
                        </button>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {product.shortDesc}
                        </p>
                      </div>

                      <div className="sm:border-r sm:border-slate-100 sm:pr-6 flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3">
                        <div className="text-right">
                          {product.originalPrice > product.price && (
                            <span className="block text-xs text-slate-400 line-through">
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                          <span className="text-lg font-black text-slate-900">
                            {formatPrice(product.price)}
                          </span>
                        </div>

                        <button
                          onClick={() => onAddToCart(product)}
                          className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-colors flex items-center gap-1.5 shadow-md"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          افزودن به سبد
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </main>

        </div>

      </div>

      {/* Mobile Filters Drawer */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isMobileFiltersOpen && (
            <div className="fixed inset-0 z-50 overflow-hidden font-['Vazirmatn',sans-serif]">
              {/* Tap to dismiss backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setIsMobileFiltersOpen(false)}
                className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
              />

              {/* Drawer panel anchored to the right */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                className="fixed top-0 bottom-0 right-0 w-[85%] max-w-xs sm:max-w-sm bg-white h-full shadow-2xl flex flex-col z-50 text-right overflow-hidden"
              >
                {/* Drawer Header */}
                <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-slate-50">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-600 flex items-center justify-center">
                      <Filter className="w-4 h-4" />
                    </div>
                    <span className="font-black text-slate-900 text-sm">فیلترهای جستجو</span>
                  </div>
                  <button
                    onClick={() => setIsMobileFiltersOpen(false)}
                    aria-label="بستن فیلترها"
                    className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center cursor-pointer shadow-2xs"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Drawer Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
                  {/* Category Filter */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 mb-2">دسته‌بندی محصولات</h4>
                    <div className="space-y-1">
                      {CATEGORIES.map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => {
                            onSelectCategory(cat.id);
                            setIsMobileFiltersOpen(false);
                          }}
                          className={`w-full text-right px-3 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                            selectedCategory === cat.id
                              ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                              : 'text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Range Slider */}
                  <div className="border-t border-slate-100 pt-4">
                    <PriceRangeSlider
                      min={minAvailablePrice}
                      max={maxAvailablePrice}
                      value={priceRange}
                      onChange={setPriceRange}
                      onReset={resetPriceRange}
                      isFiltered={isPriceFiltered}
                    />
                  </div>

                  {/* Brands */}
                  <div className="border-t border-slate-100 pt-4">
                    <h4 className="text-xs font-bold text-slate-700 mb-2">برندها</h4>
                    <div className="max-h-48 overflow-y-auto space-y-1">
                      {allBrands.map(b => (
                        <label key={b} className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg hover:bg-slate-50 text-xs text-slate-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedBrands.includes(b)}
                            onChange={() => toggleBrand(b)}
                            className="rounded text-amber-500 w-4 h-4 cursor-pointer"
                          />
                          <span className="font-semibold">{b}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* In-Stock Only */}
                  <div className="border-t border-slate-100 pt-4">
                    <label className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer">
                      <span className="text-xs font-bold text-slate-800">فقط کالاهای موجود</span>
                      <input
                        type="checkbox"
                        checked={onlyInStock}
                        onChange={(e) => setOnlyInStock(e.target.checked)}
                        className="rounded text-amber-500 w-4 h-4 cursor-pointer"
                      />
                    </label>
                  </div>
                </div>

                {/* Drawer Footer CTA */}
                <div className="p-4 border-t border-slate-100 bg-slate-50">
                  <button
                    onClick={() => setIsMobileFiltersOpen(false)}
                    className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 font-black text-xs text-slate-950 shadow-md cursor-pointer transition-colors"
                  >
                    مشاهده {filteredProducts.length} کالا
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

    </div>
  );
};
