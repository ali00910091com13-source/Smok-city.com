import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Check, 
  ShoppingBag, 
  Heart, 
  Share2, 
  Zap, 
  Cpu, 
  Battery, 
  Gauge, 
  Plus, 
  Minus, 
  CheckCircle2, 
  ChevronRight, 
  Flame, 
  Sparkles,
  Layers,
  MessageSquare,
  Box,
  Sliders,
  Send,
  RotateCw,
  Maximize2,
  Camera,
  Bot
} from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS, formatPrice } from '../data/products';
import { Product3DViewer } from './Product3DViewer';

interface ProductDetailPageProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (p: Product, quantity: number, colorId?: string, resistanceId?: string, withAddon?: boolean) => void;
  onSelectProduct: (p: Product) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onOpenAdvisor?: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  onBack,
  onAddToCart,
  onSelectProduct,
  favorites,
  onToggleFavorite,
  onOpenAdvisor
}) => {
  // Gallery active image
  const gallery = product.galleryImages && product.galleryImages.length > 0 
    ? product.galleryImages 
    : [product.image];
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // 3D View Mode State
  const [viewMode, setViewMode] = useState<'gallery' | '3d'>('gallery');
  const [is3DModalOpen, setIs3DModalOpen] = useState<boolean>(false);

  // Selected options
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.id || '');
  const [selectedResistance, setSelectedResistance] = useState(product.resistances?.[0]?.id || '');
  const [quantity, setQuantity] = useState(1);
  const [withAddon, setWithAddon] = useState(false);
  const addonPrice = 464000; // Bundle add-on salt nicotine

  // Derived selected color hex for real-time 3D model synchronization
  const selectedColorObj = product.colors?.find(c => c.id === selectedColor) || product.colors?.[0];
  const selectedColorHex = selectedColorObj?.hex;

  // Tab switcher
  const [activeTab, setActiveTab] = useState<'review' | 'specs' | 'box' | 'reviews'>('review');

  // Interactive reviews state
  const [localReviews, setLocalReviews] = useState(product.reviews || [
    {
      id: 'rev-1',
      author: 'محمد رضایی',
      rating: 5,
      date: '۲ روز پیش',
      comment: 'بهترین پاد سیستمی که تا به حال داشتم. طعم‌دهی سالت با کویل ۰.۶ بی‌نظیره و اصلا نشتی نداره.',
      verified: true,
      recommended: true
    },
    {
      id: 'rev-2',
      author: 'امیرحسین تهرانی',
      rating: 5,
      date: 'هفته گذشته',
      comment: 'باتریش برای من دو روز کامل جواب میده، کیفیت بدنه و صفحه نمایش رنگی RGB واقعا جذابه.',
      verified: true,
      recommended: true
    }
  ]);
  const [authorInput, setAuthorInput] = useState('');
  const [commentInput, setCommentInput] = useState('');
  const [userRating, setUserRating] = useState(5);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const isFav = favorites.includes(product.id);

  // Price calculation
  const basePrice = product.price;
  const originalPrice = product.originalPrice;
  const currentTotal = (basePrice * quantity) + (withAddon ? addonPrice : 0);
  const originalTotal = (originalPrice * quantity) + (withAddon ? 580000 : 0);
  const totalSavings = originalTotal - currentTotal;

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorInput.trim() || !commentInput.trim()) return;

    const newRev = {
      id: `rev-${Date.now()}`,
      author: authorInput.trim(),
      rating: userRating,
      date: 'هم‌اکنون',
      comment: commentInput.trim(),
      verified: true,
      recommended: userRating >= 4
    };

    setLocalReviews([newRev, ...localReviews]);
    setAuthorInput('');
    setCommentInput('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3500);
  };

  // Related products
  const relatedProducts = PRODUCTS.filter(p => p.id !== product.id).slice(0, 4);

  return (
    <div className="bg-slate-50 min-h-screen py-6 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 overflow-x-auto pb-1 text-right">
          <button 
            onClick={onBack}
            className="hover:text-amber-600 transition-colors shrink-0 font-bold"
          >
            صفحه اصلی
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 rotate-180 shrink-0" />
          <button 
            onClick={onBack}
            className="hover:text-amber-600 transition-colors shrink-0"
          >
            {product.categoryLabel}
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 rotate-180 shrink-0" />
          <span className="text-slate-400 shrink-0">{product.brand}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 rotate-180 shrink-0" />
          <span className="text-amber-600 font-bold truncate">{product.name}</span>
        </nav>

        {/* Top Main PDP Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
          
          {/* Gallery & 3D Column */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* View Mode Switcher Header */}
            <div className="flex items-center justify-between gap-2 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-1">
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  type="button"
                  onClick={() => setViewMode('gallery')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    viewMode === 'gallery'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5 text-amber-500" />
                  <span>گالری عکس‌ها ({gallery.length})</span>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.96 }}
                  type="button"
                  onClick={() => setViewMode('3d')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    viewMode === '3d'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>مدل سه‌بعدی ۳۶۰° (3D)</span>
                </motion.button>
              </div>

              {/* Fullscreen 3D studio button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => setIs3DModalOpen(true)}
                className="px-3 py-1.5 rounded-xl text-[11px] font-bold text-slate-700 hover:text-amber-700 bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-200 shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                title="مشاهده در استودیوی تمام‌صفحه"
              >
                <Maximize2 className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden sm:inline">استودیو تمام‌صفحه</span>
              </motion.button>
            </div>

            {/* Main Display Area (Gallery or 3D Viewer) */}
            <div className="relative aspect-square w-full bg-slate-50 rounded-3xl border border-slate-200 overflow-hidden shadow-inner flex items-center justify-center">
              {viewMode === '3d' ? (
                <div className="w-full h-full">
                  <Product3DViewer 
                    product={product} 
                    selectedColorHex={selectedColorHex} 
                  />
                </div>
              ) : (
                <div className="relative w-full h-full p-6 flex items-center justify-center group">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={gallery[activeImageIndex] || product.image}
                      initial={{ opacity: 0, scale: 0.94 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.94 }}
                      transition={{ duration: 0.25 }}
                      src={gallery[activeImageIndex] || product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="max-h-full max-w-full object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-500"
                    />
                  </AnimatePresence>

                  {/* Badges on Gallery */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    {product.discountPercent > 0 && (
                      <motion.span 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-rose-500 text-white text-xs font-black px-3 py-1 rounded-xl shadow-md"
                      >
                        %{product.discountPercent} تخفیف ویژه
                      </motion.span>
                    )}
                    <span className="bg-white/95 backdrop-blur border border-amber-300 text-amber-800 text-[11px] font-black px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-sm">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      نسخه ۳ اورجینال
                    </span>
                  </div>

                  {/* Action buttons (Wishlist & Share) */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onToggleFavorite(product.id)}
                      className={`p-2.5 rounded-xl transition-colors cursor-pointer ${
                        isFav 
                          ? 'bg-rose-500 text-white shadow-md' 
                          : 'bg-white text-slate-400 hover:text-rose-500 border border-slate-200 shadow-sm'
                      }`}
                      title="نشان کردن کالا"
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-white' : ''}`} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        if (navigator.clipboard) {
                          navigator.clipboard.writeText(window.location.href);
                          alert('لینک صفحه محصول با موفقیت کپی شد.');
                        }
                      }}
                      className="p-2.5 rounded-xl bg-white text-slate-500 hover:text-slate-800 border border-slate-200 shadow-sm transition-colors cursor-pointer"
                      title="اشتراک‌گذاری"
                    >
                      <Share2 className="w-4 h-4" />
                    </motion.button>
                  </div>

                  {/* Quick 3D Switch Pill */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setViewMode('3d')}
                    className="absolute bottom-4 left-4 bg-slate-900/90 hover:bg-slate-950 text-white border border-amber-400/40 px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-2 shadow-lg transition-all cursor-pointer"
                  >
                    <RotateCw className="w-3.5 h-3.5 text-amber-400" />
                    <span>مشاهده مدل سه‌بعدی تعاملی ۳۶۰°</span>
                  </motion.button>
                </div>
              )}
            </div>

            {/* Thumbnail Switcher (when in gallery mode) or Color Swatches (when in 3D mode) */}
            {viewMode === 'gallery' && gallery.length > 1 ? (
              <div className="grid grid-cols-5 gap-2.5">
                {gallery.map((imgUrl, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`aspect-square rounded-2xl bg-slate-50 p-2 border transition-all overflow-hidden flex items-center justify-center cursor-pointer ${
                      activeImageIndex === idx
                        ? 'border-amber-500 shadow-md ring-2 ring-amber-200 scale-105'
                        : 'border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`نمای ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="max-h-full max-w-full object-contain"
                    />
                  </motion.button>
                ))}
              </div>
            ) : viewMode === '3d' && product.colors && product.colors.length > 0 ? (
              <div className="bg-slate-100/90 border border-slate-200 p-3 rounded-2xl flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <span>رنگ بدنه مدل سه‌بعدی:</span>
                  <strong className="text-slate-900">{selectedColorObj?.name}</strong>
                </span>
                <div className="flex items-center gap-1.5">
                  {product.colors.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedColor(c.id)}
                      className={`w-6 h-6 rounded-full border-2 transition-all cursor-pointer ${
                        selectedColor === c.id 
                          ? 'border-amber-500 scale-125 shadow-md ring-2 ring-amber-200' 
                          : 'border-white hover:scale-110 opacity-80'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
            ) : null}

            {/* Confidence & Authenticity callout below gallery */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-black text-slate-900 block">ضمانت ۱۰۰٪ اصالت فیزیکی کالا</span>
                  <span className="text-[11px] text-slate-500">دارای برچسب اسکرچ شرکتی جهت رجیستری</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <span className="font-black text-slate-900 block">۷ روز مهلت تست</span>
                  <span className="text-[11px] text-slate-500">تعویض در صورت خرابی فنی</span>
                </div>
              </div>
            </div>

          </div>

          {/* Details & Purchase Panel */}
          <div className="lg:col-span-6 space-y-6 text-right">
            
            {/* Brand and category */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-amber-800 font-black bg-amber-50 border border-amber-200 px-3 py-1 rounded-xl">
                برند: {product.brand} • سری پرچمدار
              </span>
              <span className="text-slate-400 font-mono text-xs">
                کد کالا: OX-{product.id.substring(0, 5).toUpperCase()}
              </span>
            </div>

            {/* Product Title */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight mb-1">
                {product.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 font-sans tracking-wide">
                {product.nameEn}
              </p>
            </div>

            {/* Rating and review counter */}
            <div className="flex items-center gap-4 text-xs border-y border-slate-100 py-3">
              <div className="flex items-center gap-1.5 text-amber-500 font-bold">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(product.rating) 
                          ? 'fill-amber-500 text-amber-500' 
                          : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-slate-800 font-black">{product.rating}</span>
              </div>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600 font-medium">{localReviews.length} نظر ثبت شده</span>
              <span className="text-slate-300">•</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-md">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                موجود در انبار مرکزی
              </span>
            </div>

            {/* Quick Specs Highlight Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-center">
                <Gauge className="w-4 h-4 text-amber-600 mx-auto mb-1" />
                <span className="text-[10px] text-slate-400 block font-bold">توان خروجی</span>
                <span className="text-xs font-black text-slate-900">۵ تا ۳۰ وات</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-center">
                <Battery className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                <span className="text-[10px] text-slate-400 block font-bold">ظرفیت باتری</span>
                <span className="text-xs font-black text-slate-900">۱۰۰۰ میلی‌آمپر</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-center">
                <Cpu className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                <span className="text-[10px] text-slate-400 block font-bold">پورت شارژ</span>
                <span className="text-xs font-black text-slate-900">Type-C فست</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-center">
                <Zap className="w-4 h-4 text-purple-600 mx-auto mb-1" />
                <span className="text-[10px] text-slate-400 block font-bold">کارتریج</span>
                <span className="text-xs font-black text-slate-900">Top-Fill V3</span>
              </div>
            </div>

            {/* Color Swatches Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-black text-slate-800">
                    انتخاب رنگ دستگاه:
                  </span>
                  <span className="text-amber-700 font-bold">
                    {product.colors.find(c => c.id === selectedColor)?.name}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  {product.colors.map((color) => {
                    const active = selectedColor === color.id;
                    return (
                      <button
                        key={color.id}
                        type="button"
                        onClick={() => setSelectedColor(color.id)}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all ${
                          active
                            ? 'bg-amber-50 border-amber-500 text-amber-950 shadow-sm ring-2 ring-amber-200'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-slate-300 shadow-inner flex items-center justify-center"
                          style={{ backgroundColor: color.hex }}
                        >
                          {active && <Check className="w-2.5 h-2.5 text-white drop-shadow" />}
                        </span>
                        <span>{color.name.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Resistance / Cartridge choice */}
            {product.resistances && product.resistances.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-black text-slate-800">
                    مقاومت کارتریج پیش‌فرض:
                  </span>
                  <span className="text-xs text-slate-400">قابل تعویض بعدی</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {product.resistances.map((res) => {
                    const active = selectedResistance === res.id;
                    return (
                      <button
                        key={res.id}
                        type="button"
                        onClick={() => setSelectedResistance(res.id)}
                        className={`p-3 rounded-2xl border text-right transition-all flex flex-col justify-between ${
                          active
                            ? 'bg-amber-50 border-amber-500 text-amber-950 shadow-sm'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-1">
                          <span className="font-black text-xs text-slate-900">{res.ohms}</span>
                          {active && <Check className="w-3.5 h-3.5 text-amber-600" />}
                        </div>
                        <span className="text-[11px] text-slate-500">{res.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Special Bundle Addon Booster */}
            <div 
              onClick={() => setWithAddon(!withAddon)}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between gap-4 ${
                withAddon 
                  ? 'bg-amber-50/70 border-amber-400 shadow-sm' 
                  : 'bg-slate-50 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                  withAddon ? 'bg-amber-500 border-amber-500 text-slate-950' : 'border-slate-300 bg-white'
                }`}>
                  {withAddon && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-900">
                      پیشنهاد ویژه مکمل: سالت نیکوتین نستی کشمن انبه اصل
                    </span>
                    <span className="text-[10px] bg-rose-500 text-white font-black px-1.5 py-0.2 rounded">
                      ۲۰٪ تخفیف
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    افزودن سالت ۳۰ میل اصل مالزی هماهنگ با کارتریج دستگاه
                  </p>
                </div>
              </div>
              <div className="text-left shrink-0">
                <span className="text-[11px] text-slate-400 line-through block">۵۸۰,۰۰۰ تومان</span>
                <span className="text-xs font-black text-amber-700 block">+ {formatPrice(addonPrice)}</span>
              </div>
            </div>

            {/* Price Box */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">قیمت اصلی کالا:</span>
                <span className="text-xs text-slate-400 line-through">
                  {formatPrice(originalTotal)}
                </span>
              </div>

              {totalSavings > 0 && (
                <div className="flex items-center justify-between text-xs text-emerald-800 font-black bg-emerald-100/70 border border-emerald-300 p-2 rounded-xl">
                  <span>سود شما از این خرید:</span>
                  <span>{formatPrice(totalSavings)}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <span className="text-sm font-black text-slate-900">مبلغ نهایی قابل پرداخت:</span>
                <span className="text-xl sm:text-2xl font-black text-slate-900">
                  {formatPrice(currentTotal)}
                </span>
              </div>

              <p className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
                <Truck className="w-3.5 h-3.5 text-blue-600" />
                <span>ارسال رایگان در سراسر کشور برای خریدهای بالای ۷۰۰ هزار تومان با کد SMOKE10</span>
              </p>
            </div>

            {/* Quantity and Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              
              {/* Counter */}
              <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-2xl p-1.5 w-full sm:w-36">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-xl bg-white hover:bg-slate-100 flex items-center justify-center text-slate-600 border border-slate-200"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-sm font-black text-slate-900 px-3 font-mono">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                  className="w-8 h-8 rounded-xl bg-white hover:bg-slate-100 flex items-center justify-center text-slate-600 border border-slate-200"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <motion.button
                type="button"
                id="pdp-add-to-cart-btn"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onAddToCart(product, quantity, selectedColor, selectedResistance, withAddon)}
                className="flex-1 w-full py-4 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <ShoppingBag className="w-5 h-5 stroke-[2.3]" />
                <span>افزودن به سبد خرید و ادامه</span>
              </motion.button>

            </div>

            {/* Smart Advisor Direct Consultation CTA */}
            {onOpenAdvisor && (
              <button
                type="button"
                onClick={onOpenAdvisor}
                className="w-full py-3 px-4 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/90 text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs hover:shadow-xs"
              >
                <Bot className="w-4 h-4 text-amber-600" />
                <span>نیاز به راهنمایی دارید؟ مشاوره با دستیار هوشمند درباره {product.name}</span>
              </button>
            )}

          </div>

        </div>

        {/* Detailed Tabs Section */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          
          {/* Tab Headers */}
          <div className="flex items-center border-b border-slate-200 bg-slate-50 overflow-x-auto scrollbar-none px-4">
            {[
              { id: 'review', label: 'نقد و بررسی تخصصی', icon: <Sparkles className="w-4 h-4" /> },
              { id: 'specs', label: 'مشخصات فنی و چیپست', icon: <Sliders className="w-4 h-4" /> },
              { id: 'box', label: 'محتویات جعبه', icon: <Box className="w-4 h-4" /> },
              { id: 'reviews', label: `نظرات خریداران (${localReviews.length})`, icon: <MessageSquare className="w-4 h-4" /> },
            ].map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`relative py-4 px-6 text-xs sm:text-sm font-black transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                    active
                      ? 'text-amber-700 bg-white font-black'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="pdpActiveTabLine"
                      className="absolute bottom-0 right-0 left-0 h-0.5 bg-amber-500"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {/* Tab 1: Detailed Review */}
              {activeTab === 'review' && (
                <div className="p-6 sm:p-8 space-y-6 text-right leading-relaxed text-xs sm:text-sm text-slate-600">
                  <div className="space-y-4 max-w-4xl">
                    <h3 className="text-lg font-black text-slate-900">
                      معرفی و بررسی کارشناسی دستگاه {product.name}
                    </h3>
                    <p className="text-slate-600 leading-relaxed text-justify">
                      {product.fullDesc}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                      <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-2 flex items-center gap-2">
                          <Zap className="w-4 h-4 text-amber-600" />
                          سیستم کارتریج‌های ضد لیکیج Top-Fill V3
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          در کارتریج‌های نسخه سوم، ورودی تزریق سالت به بالای مخزن منتقل شده تا بدون نیاز به درآوردن کارتریج بتوانید آن را پر کنید. علاوه بر این، ساختار مهر و موم چند لایه سیلیکونی احتمال نشتی مایع را به صفر رسانده است.
                        </p>
                      </div>

                      <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm mb-2 flex items-center gap-2">
                          <Battery className="w-4 h-4 text-emerald-600" />
                          باتری پرقدرت با فست شارژ Type-C
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          باتری داخلی پرظرفیت این دستگاه امکان ویپینگ یک الی دو روزه کامل را با هر بار شارژ برای کاربران معمولی فراهم کرده و با درگاه تایپ سی ظرف مدت ۴۰ دقیقه به طور کامل شارژ می‌گردد.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Specs */}
              {activeTab === 'specs' && (
                <div className="p-6 sm:p-8 text-right">
                  <div className="max-w-3xl divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                    {product.specs.map((item, idx) => (
                      <div key={idx} className="flex py-3 px-4 text-xs even:bg-slate-50">
                        <span className="w-1/3 text-slate-500 font-bold">{item.label || (item as any).key}</span>
                        <span className="w-2/3 font-black text-slate-900">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: Box Contents */}
              {activeTab === 'box' && (
                <div className="p-6 sm:p-8 text-right space-y-4">
                  <h3 className="text-base font-black text-slate-900">اقلام موجود در بسته‌بندی کارخانه‌ای</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
                    {product.boxContents.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 4: Reviews */}
              {activeTab === 'reviews' && (
                <div className="p-6 sm:p-8 space-y-8 text-right">
                  
                  {/* Write Review Form */}
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 max-w-2xl space-y-4">
                    <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-amber-600" />
                      <span>ثبت نظر و تجربه استفاده از این محصول</span>
                    </h4>

                    {reviewSubmitted ? (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-emerald-100 border border-emerald-300 text-emerald-900 p-4 rounded-xl text-xs font-bold"
                      >
                        نظر شما با موفقیت ثبت شد و در لیست نمایش داده شد. از مشارکت شما متشکریم!
                      </motion.div>
                    ) : (
                      <form onSubmit={handleAddReview} className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">نام شما</label>
                            <input
                              type="text"
                              required
                              placeholder="مثال: سینا محمدی"
                              value={authorInput}
                              onChange={(e) => setAuthorInput(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">امتیاز شما</label>
                            <div className="flex items-center gap-1 py-1">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <button
                                  key={s}
                                  type="button"
                                  onClick={() => setUserRating(s)}
                                  className="p-1 cursor-pointer"
                                >
                                  <Star className={`w-5 h-5 ${s <= userRating ? 'fill-amber-500 text-amber-500' : 'text-slate-300'}`} />
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">متن نظر شما</label>
                          <textarea
                            rows={3}
                            required
                            placeholder="تجربه شما در مورد طعم‌دهی، ماندگاری باتری و کیفیت بدنه..."
                            value={commentInput}
                            onChange={(e) => setCommentInput(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-amber-500"
                          ></textarea>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-colors shadow-md flex items-center gap-1.5 cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>ثبت و انتشار نظر</span>
                        </motion.button>
                      </form>
                    )}
                  </div>

                  {/* Reviews List */}
                  <div className="space-y-4 max-w-3xl">
                    {localReviews.map((rev) => (
                      <div key={rev.id} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-slate-900">{rev.author}</span>
                            {rev.verified && (
                              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                                خریدار تایید شده
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400">{rev.date}</span>
                        </div>

                        <div className="flex items-center gap-1 text-amber-500">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                          ))}
                        </div>

                        <p className="text-xs text-slate-700 leading-relaxed font-normal">
                          {rev.comment}
                        </p>
                      </div>
                    ))}
                  </div>

                </div>
              )}
            </motion.div>
          </AnimatePresence>

        </div>

      </div>

      {/* Fullscreen 3D Studio Inspection Modal */}
      <AnimatePresence>
        {is3DModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setIs3DModalOpen(false)}
              className="fixed inset-0 bg-slate-950/95"
            />

            {/* Modal Dialog Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-5xl h-[90vh] bg-slate-950 rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative z-10 flex flex-col transform-gpu"
            >
              <Product3DViewer
                product={product}
                selectedColorHex={selectedColorHex}
                isFullScreenModal={true}
                onCloseModal={() => setIs3DModalOpen(false)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
