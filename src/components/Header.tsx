import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  PhoneCall, 
  Sparkles, 
  Flame, 
  ShieldCheck, 
  Zap, 
  X,
  Menu,
  Truck,
  BookOpen,
  Store,
  HelpCircle,
  MessageCircle,
  ChevronLeft,
  Layers,
  ArrowLeft,
  Bot
} from 'lucide-react';
import { Product, PageType } from '../types';
import { PRODUCTS, CATEGORIES, formatPrice } from '../data/products';
import { SmokeCityLogo } from './SmokeCityLogo';

interface HeaderProps {
  activePage: PageType;
  onNavigate: (page: PageType) => void;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onSelectProduct: (p: Product) => void;
  favoritesCount: number;
  onOpenWishlist: () => void;
  onSelectCategory?: (category: string) => void;
  onOpenAdvisor?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activePage,
  onNavigate,
  cartCount,
  cartTotal,
  onOpenCart,
  onSelectProduct,
  favoritesCount,
  onOpenWishlist,
  onSelectCategory,
  onOpenAdvisor
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Lock body scroll when mobile menu is active with multi-platform touch safety
  useEffect(() => {
    if (isMobileMenuOpen) {
      const originalOverflow = document.body.style.overflow;
      const originalPosition = document.body.style.position;
      const originalWidth = document.body.style.width;

      document.body.style.overflow = 'hidden';
      document.body.style.width = '100%';

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.position = originalPosition;
        document.body.style.width = originalWidth;
      };
    }
  }, [isMobileMenuOpen]);

  // Handle escape key to close menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const searchResults = searchQuery.trim()
    ? PRODUCTS.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const navLinks: { id: PageType; label: string; icon?: React.ReactNode; isHot?: boolean; badge?: string }[] = [
    { id: PageType.HOME, label: 'صفحه اصلی' },
    { id: PageType.SHOP, label: 'فروشگاه و محصولات', icon: <Store className="w-4 h-4 text-amber-500" /> },
    { id: PageType.DEALS, label: 'حراج شگفت‌انگیز', icon: <Flame className="w-4 h-4 text-rose-500 fill-rose-500" />, isHot: true },
    { id: PageType.AUTHENTICITY, label: 'استعلام اصالت کالا', icon: <ShieldCheck className="w-4 h-4 text-emerald-600" /> },
    { id: PageType.TRACKING, label: 'پیگیری سفارشات', icon: <Truck className="w-4 h-4 text-blue-600" /> },
    { id: PageType.BLOG, label: 'مجله تخصصی ویپ', icon: <BookOpen className="w-4 h-4 text-purple-600" /> },
    { id: PageType.CONTACT, label: 'شعب و تماس با ما', icon: <PhoneCall className="w-4 h-4 text-slate-500" /> }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/98 border-b border-slate-200 shadow-xs transition-all text-right">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 text-xs py-1.5 px-4 font-bold text-center flex items-center justify-center gap-2 shadow-sm">
        <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
        <span>جشنواره فروش ویژه اسموک سیتی: ارسال رایگان با کد تخفیف SMOKE10 برای سفارش‌های بالای ۷۰۰ هزار تومان</span>
        <span className="hidden sm:inline-block bg-slate-950/15 px-2 py-0.5 rounded text-[11px] font-black">
          ضمانت ۱۰۰٪ اصالت فیزیکی
        </span>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                onNavigate(PageType.HOME);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              id="brand-logo-btn"
              className="flex items-center gap-2.5 text-right group focus:outline-none cursor-pointer"
            >
              <SmokeCityLogo size="md" />
              <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full border border-amber-300 hidden xl:inline-block">
                VIP
              </span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-lg hidden md:block">
            <div className="relative">
              <input
                id="search-input"
                type="text"
                placeholder="جستجوی پاد، ویپ، سالت نستی، کویل و کارتریج..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchOpen(true)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-2.5 pr-11 pl-4 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')} 
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Live Search Popup */}
            <AnimatePresence>
              {isSearchOpen && searchQuery.trim() && (
                <motion.div 
                  initial={{ opacity: 0, y: -10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full mt-2 w-full bg-white border border-slate-200 rounded-2xl shadow-2xl p-2 z-50 overflow-hidden"
                  onMouseLeave={() => setIsSearchOpen(false)}
                >
                  <div className="text-[11px] font-bold text-slate-500 px-3 py-1.5 border-b border-slate-100 flex justify-between">
                    <span>نتایج جستجو برای "{searchQuery}"</span>
                    <span className="text-amber-600 font-bold">{searchResults.length} کالا یافت شد</span>
                  </div>

                  {searchResults.length > 0 ? (
                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                      {searchResults.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => {
                            onSelectProduct(product);
                            setIsSearchOpen(false);
                            setSearchQuery('');
                          }}
                          className="w-full flex items-center gap-3 p-2.5 hover:bg-amber-50/60 rounded-xl transition-colors text-right cursor-pointer"
                        >
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 object-contain bg-slate-50 rounded-xl p-1 border border-slate-100"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate">{product.name}</p>
                            <p className="text-[10px] text-slate-400 truncate">{product.nameEn}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs font-black text-amber-600">{formatPrice(product.price)}</span>
                              {product.discountPercent > 0 && (
                                <span className="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded font-bold">
                                  %{product.discountPercent} تخفیف
                                </span>
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-xs text-slate-500">
                      کالایی با این مشخصات یافت نشد. می‌توانید با پشتیبانی ما تماس بگیرید.
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Direct Phone Support */}
            <div className="hidden xl:flex items-center gap-2 text-right pl-3 border-l border-slate-200">
              <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-200">
                <PhoneCall className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <div className="text-slate-400 text-[10px] font-bold">مشاوره تلفنی خرید</div>
                <span className="font-bold text-slate-900 font-mono tracking-wide">021-88223344</span>
              </div>
            </div>

            {/* Smart Advisor Bot Trigger (Header Desktop) */}
            {onOpenAdvisor && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onOpenAdvisor}
                className="hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-black transition-all cursor-pointer shadow-2xs"
                title="مشاور هوشمند انتخاب کالا"
              >
                <Bot className="w-4 h-4 text-amber-600" />
                <span>مشاور هوشمند</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </motion.button>
            )}

            {/* Wishlist Link */}
            <motion.button
              id="wishlist-btn"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              onClick={onOpenWishlist}
              className={`p-2.5 rounded-2xl border transition-colors relative cursor-pointer ${
                activePage === PageType.WISHLIST
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-slate-50 hover:bg-rose-50 border-slate-200 hover:border-rose-200 text-slate-600 hover:text-rose-600'
              }`}
              title="علاقه‌مندی‌ها"
            >
              <Heart className={`w-5 h-5 ${favoritesCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
              <AnimatePresence>
                {favoritesCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center shadow-md"
                  >
                    {favoritesCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Cart Trigger */}
            <motion.button
              id="cart-toggle-btn"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenCart}
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-md shadow-amber-500/20 transition-colors cursor-pointer"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span 
                      key={cartCount}
                      initial={{ scale: 0.4 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-2.5 -right-2.5 bg-slate-950 text-amber-400 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <div className="hidden sm:flex flex-col text-right leading-tight">
                <span className="text-[10px] font-bold opacity-80">سبد خرید</span>
                <span className="text-xs font-black">{cartCount > 0 ? formatPrice(cartTotal) : 'خالی'}</span>
              </div>
            </motion.button>

            {/* Mobile Menu Toggle with Zero-Lag Native CSS Animation */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'بستن منو' : 'باز کردن منوی ناوبری'}
              className="lg:hidden relative w-11 h-11 rounded-2xl bg-slate-100 hover:bg-amber-100/70 active:bg-amber-100 border border-slate-200 text-slate-800 flex flex-col items-center justify-center gap-1.5 transition-colors cursor-pointer select-none touch-manipulation z-10"
            >
              <span
                className={`w-5 h-[2.5px] rounded-full bg-slate-900 transition-transform duration-200 ease-out origin-center ${
                  isMobileMenuOpen ? 'rotate-45 translate-y-[8px]' : ''
                }`}
              />
              <span
                className={`w-3.5 h-[2.5px] rounded-full bg-slate-900 transition-all duration-150 ease-out self-start mr-3 origin-right ${
                  isMobileMenuOpen ? 'opacity-0 scale-x-0' : ''
                }`}
              />
              <span
                className={`w-5 h-[2.5px] rounded-full bg-slate-900 transition-transform duration-200 ease-out origin-center ${
                  isMobileMenuOpen ? '-rotate-45 -translate-y-[8px]' : ''
                }`}
              />
            </button>

          </div>

        </div>

        {/* Mobile Search Bar */}
        <div className="mt-3 md:hidden relative">
          <div className="relative">
            <input
              type="text"
              placeholder="جستجو بین صدها مدل پاد، سالت، کویل..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-2.5 pr-10 pl-10 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-all shadow-inner"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                title="پاک کردن جستجو"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Floating Search Results Dropdown on Mobile */}
          {searchQuery.trim() && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl p-2 z-40 max-h-64 overflow-y-auto">
              <div className="text-[11px] font-bold text-slate-500 px-3 py-1.5 border-b border-slate-100 flex justify-between">
                <span>نتایج جستجو</span>
                <span className="text-amber-600 font-bold">{searchResults.length} کالا</span>
              </div>
              {searchResults.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {searchResults.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        onSelectProduct(p);
                        setSearchQuery('');
                      }}
                      className="w-full flex items-center gap-3 p-2.5 hover:bg-amber-50/60 rounded-xl transition-colors text-right cursor-pointer"
                    >
                      <img src={p.image} alt={p.name} referrerPolicy="no-referrer" className="w-10 h-10 object-contain bg-slate-50 rounded-xl p-1 border border-slate-100" />
                      <div className="flex-1 min-w-0">
                        <span className="block truncate text-slate-800 font-bold text-xs">{p.name}</span>
                        <span className="block truncate text-[10px] text-slate-400">{p.brand}</span>
                      </div>
                      <span className="text-amber-600 font-black text-xs whitespace-nowrap">{formatPrice(p.price)}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-3 text-center text-xs text-slate-500 font-medium">
                  کالایی با مشخصات جستجو شده یافت نشد.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Desktop Navigation Links with animated active pill */}
        <nav className="mt-3 pt-2.5 border-t border-slate-100 hidden lg:flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = activePage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    onNavigate(link.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`relative px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer z-10 ${
                    isActive
                      ? 'text-slate-950 font-black'
                      : 'hover:text-amber-600 hover:bg-slate-50'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavTabPill"
                      className="absolute inset-0 bg-amber-500 rounded-xl shadow-sm -z-10"
                      transition={{ type: "spring", stiffness: 450, damping: 35 }}
                    />
                  )}
                  {link.icon}
                  <span>{link.label}</span>
                  {link.isHot && (
                    <motion.span 
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="bg-rose-500 text-white text-[9px] px-1.5 py-0.2 rounded-full font-black"
                    >
                      ویژه
                    </motion.span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1 text-emerald-600 font-bold">
              <ShieldCheck className="w-4 h-4" />
              ضمانت ۱۰۰٪ اصالت فیزیکی
            </span>
            <span>•</span>
            <span>تحویل ۲ ساعته پایتخت</span>
          </div>
        </nav>

      </div>

      {/* Mobile Drawer Menu with createPortal for 100% rock-solid viewport rendering */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isMobileMenuOpen && (
            <div className="fixed inset-0 z-50 overflow-hidden font-['Vazirmatn',sans-serif]">
              {/* Tap to close backdrop with pure GPU opacity transition */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-slate-950/65 touch-none"
              />

              {/* Drawer Container: 120 FPS hardware-accelerated slide */}
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: '0%' }}
                exit={{ x: '100%' }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                style={{ willChange: 'transform' }}
                onClick={(e) => e.stopPropagation()}
                className="fixed top-0 bottom-0 right-0 w-[86%] max-w-sm bg-white h-full shadow-2xl flex flex-col z-50 text-right overflow-hidden transform-gpu"
              >
                {/* Header */}
                <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                  <div className="flex items-center gap-2">
                    <SmokeCityLogo size="sm" />
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full border border-amber-300">
                      VIP
                    </span>
                  </div>

                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-label="بستن منو"
                    className="w-10 h-10 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 active:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer shadow-2xs touch-manipulation"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Quick Action Buttons (Cart & Wishlist) */}
                <div className="grid grid-cols-2 gap-2.5 p-3 bg-slate-100/70 border-b border-slate-200/80">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenCart();
                    }}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 min-h-[44px] rounded-xl bg-amber-500 active:bg-amber-600 text-slate-950 font-black text-xs shadow-xs cursor-pointer touch-manipulation transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>سبد خرید ({cartCount})</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenWishlist();
                    }}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 min-h-[44px] rounded-xl bg-white active:bg-slate-100 border border-slate-200 text-slate-800 font-bold text-xs shadow-2xs cursor-pointer touch-manipulation transition-colors"
                  >
                    <Heart className="w-4 h-4 text-rose-500" />
                    <span>علاقه‌مندی ({favoritesCount})</span>
                  </button>
                </div>

                {/* Scrollable Content Body with smooth native momentum scrolling */}
                <div 
                  className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-5"
                  style={{ WebkitOverflowScrolling: 'touch' }}
                >
                  {/* Smart Advisor Mobile Trigger Banner */}
                  {onOpenAdvisor && (
                    <button
                      onClick={() => {
                        onOpenAdvisor();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 text-right cursor-pointer touch-manipulation"
                    >
                      <div className="w-9 h-9 rounded-xl bg-slate-950 text-white flex items-center justify-center shrink-0">
                        <Bot className="w-5 h-5 text-amber-400" />
                      </div>
                      <div className="flex-1 text-right">
                        <div className="flex items-center gap-1.5">
                          <span>اسموک بات (مشاور هوشمند خرید)</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
                        </div>
                        <div className="text-[10px] font-normal text-slate-900/80 mt-0.5">
                          راهنمایی در انتخاب ویپ، پاد و سالت
                        </div>
                      </div>
                      <ChevronLeft className="w-4 h-4 text-slate-950 shrink-0" />
                    </button>
                  )}

                  {/* Navigation Pages */}
                  <div>
                    <span className="text-[11px] font-black text-slate-400 block mb-2 px-1">صفحات و خدمات</span>
                    <div className="space-y-1">
                      {navLinks.map((link) => {
                        const isActive = activePage === link.id;
                        return (
                          <button
                            key={link.id}
                            onClick={() => {
                              onNavigate(link.id);
                              setIsMobileMenuOpen(false);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className={`w-full flex items-center gap-3 p-3 min-h-[46px] rounded-2xl text-xs font-bold transition-colors text-right cursor-pointer touch-manipulation ${
                              isActive
                                ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                                : 'text-slate-700 hover:bg-slate-100 active:bg-slate-100 hover:text-slate-900'
                            }`}
                          >
                            <span className="w-5 h-5 flex items-center justify-center">{link.icon}</span>
                            <span className="flex-1">{link.label}</span>
                            {link.isHot && (
                              <span className="bg-rose-500 text-white text-[9px] px-2 py-0.5 rounded-full font-black">
                                حراج
                              </span>
                            )}
                            <ChevronLeft className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quick Categories Section */}
                  <div className="border-t border-slate-100 pt-4">
                    <span className="text-[11px] font-black text-slate-400 block mb-2 px-1">دسته‌بندی‌های تخصصی</span>
                    <div className="grid grid-cols-1 gap-1">
                      {CATEGORIES.filter(c => c.id !== 'all').map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => {
                            if (onSelectCategory) {
                              onSelectCategory(cat.id);
                            } else {
                              onNavigate(PageType.SHOP);
                            }
                            setIsMobileMenuOpen(false);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="w-full flex items-center justify-between p-2.5 min-h-[44px] rounded-xl text-xs text-slate-700 hover:bg-amber-50 active:bg-amber-100 hover:text-amber-900 font-semibold transition-colors cursor-pointer text-right touch-manipulation"
                        >
                          <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-amber-400" />
                            <span>{cat.label}</span>
                          </span>
                          <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Consultation & Support Card */}
                  <div className="border-t border-slate-100 pt-4 space-y-2.5">
                    <div className="p-3.5 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200/80 text-right">
                      <div className="flex items-center gap-2 mb-1 text-amber-900 font-bold text-xs">
                        <PhoneCall className="w-4 h-4 text-amber-600" />
                        <span>مشاوره تخصصی و سفارش تلفنی</span>
                      </div>
                      <a 
                        href="tel:02188223344" 
                        className="block text-base font-black font-['Vazirmatn',sans-serif] text-slate-900 hover:text-amber-600 transition-colors mt-1 dir-ltr text-right"
                      >
                        021-88223344
                      </a>
                      <span className="text-[10px] text-slate-500 block mt-0.5">پاسخگویی ۹ صبح الی ۲۱ شب</span>
                    </div>

                    <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200/80 flex items-center justify-between text-right">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-bold text-emerald-900">ضمانت اصالت ۱۰۰٪ فیزیکی</span>
                      </div>
                      <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-1.5 py-0.5 rounded-full">تضمینی</span>
                    </div>
                  </div>

                </div>

                {/* Drawer Footer with safe padding */}
                <div className="p-4 border-t border-slate-100 bg-slate-50 text-center">
                  <p className="text-[11px] text-slate-500 font-medium">ارسال ۲ ساعته در تهران • تحویل پیشتاز سراسر کشور</p>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

    </header>
  );
};
