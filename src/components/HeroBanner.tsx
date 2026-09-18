import React from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  ArrowLeft, 
  ShieldCheck, 
  Truck, 
  Headphones, 
  Flame, 
  Zap,
  CheckCircle2,
  Tag
} from 'lucide-react';
import { HERO_IMAGE } from '../data/products';
import { Product } from '../types';

interface HeroBannerProps {
  onExploreClick: () => void;
  onSelectFeatured: (product: Product) => void;
  featuredProduct: Product;
  onFilterCategory: (cat: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onExploreClick,
  onSelectFeatured,
  featuredProduct,
  onFilterCategory
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-100/80 via-white to-slate-50 border-b border-slate-200/90 pt-8 pb-12">
      
      {/* Background ambient lighting - static hardware-accelerated gradients for smooth 120fps scrolling */}
      <div 
        className="absolute top-0 right-1/4 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none transform-gpu" 
      />
      <div 
        className="absolute top-1/3 left-10 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl pointer-events-none transform-gpu" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Right Text Column (Persian RTL) */}
          <motion.div 
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="lg:col-span-7 space-y-6 text-right"
          >
            
            {/* Top pill badge */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="inline-flex items-center gap-2 bg-amber-50 border border-amber-300/80 px-3.5 py-1.5 rounded-full text-xs font-black text-amber-900 shadow-sm hover:shadow-md transition-shadow"
            >
              <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-ping" />
              <span>جشنواره تخفیف‌های ویژه اسموک سیتی</span>
              <motion.span 
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-[11px] bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded-full shadow-xs"
              >
                تا ۲۵٪ تخفیف
              </motion.span>
            </motion.div>

            {/* Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.3]"
            >
              خرید مطمئن انواع <br className="hidden sm:inline" />
              <span className="text-amber-600 inline-block">
                پاد سیستم، ویپ و سالت نیکوتین
              </span>
              <span className="block text-2xl sm:text-3xl text-slate-700 font-bold mt-2">
                با ضمانت ۱۰۰٪ اصالت و تست اسکرچ بارکد
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.5 }}
              className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl font-normal"
            >
              مرجع تخصصی خرید آنلاین محبوب‌ترین برندهای جهانی ویپینگ از جمله اکسوا (OXVA)، گیک‌ویپ (Geekvape)، وپرسو (Vaporesso)، نستی جویس و پادهای یکبار مصرف. ارسال فوری کمتر از ۲ ساعت در پایتخت و تحویل پیشتاز سراسری.
            </motion.p>

            {/* Bullet Highlights with Staggered Fade */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1 text-xs text-slate-700 font-medium"
            >
              <motion.div 
                whileHover={{ y: -3, scale: 1.02 }}
                className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-2.5 shadow-sm transition-shadow hover:shadow-md"
              >
                <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="font-bold">گارانتی تعویض ۷ روزه</span>
              </motion.div>
              <motion.div 
                whileHover={{ y: -3, scale: 1.02 }}
                className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-2.5 shadow-sm transition-shadow hover:shadow-md"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="font-bold">تست بارکد بین‌المللی</span>
              </motion.div>
              <motion.div 
                whileHover={{ y: -3, scale: 1.02 }}
                className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-2.5 shadow-sm col-span-2 sm:col-span-1 transition-shadow hover:shadow-md"
              >
                <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                <span className="font-bold">مشاوره تخصصی رایگان</span>
              </motion.div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38, duration: 0.5 }}
              className="flex flex-wrap items-center gap-3 pt-2"
            >
              <motion.button
                id="hero-explore-btn"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={onExploreClick}
                className="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/25 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Flame className="w-4 h-4 fill-slate-950" />
                <span>مشاهده حراج شگفت‌انگیز</span>
                <ArrowLeft className="w-4 h-4" />
              </motion.button>

              <motion.button
                id="hero-featured-btn"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onSelectFeatured(featuredProduct)}
                className="px-5 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 hover:border-amber-400 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-sm cursor-pointer"
              >
                <Zap className="w-4 h-4 text-amber-500" />
                <span>خرید پرچمدار اکسوا پرو (OXVA)</span>
              </motion.button>
            </motion.div>

            {/* Trust Stats Bar */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              className="pt-4 border-t border-slate-200 flex items-center gap-6 text-slate-500 text-xs"
            >
              <motion.div whileHover={{ scale: 1.08 }} className="transition-transform cursor-default">
                <span className="text-base font-black text-slate-900 block">۱۰,۰۰۰+</span>
                <span>مشتری راضی</span>
              </motion.div>
              <div className="h-6 w-px bg-slate-200" />
              <motion.div whileHover={{ scale: 1.08 }} className="transition-transform cursor-default">
                <span className="text-base font-black text-slate-900 block">۵۰+ برند</span>
                <span>اورجینال جهانی</span>
              </motion.div>
              <div className="h-6 w-px bg-slate-200" />
              <motion.div whileHover={{ scale: 1.08 }} className="transition-transform cursor-default">
                <span className="text-base font-black text-emerald-600 block">۴.۹ / ۵</span>
                <span>شاخص رضایت</span>
              </motion.div>
            </motion.div>

          </motion.div>

          {/* Left Column: Visual Showcase with Smooth Floating Physics */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, x: -25 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="lg:col-span-5 relative flex justify-center"
          >
            
            {/* Glowing background container */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-md aspect-square rounded-3xl bg-gradient-to-tr from-amber-100/60 via-white to-orange-100/60 p-4 border border-slate-200/90 shadow-xl flex items-center justify-center group overflow-hidden"
            >
              
              {/* Product Hero Image with Optimized Hardware Acceleration */}
              <img
                src={HERO_IMAGE}
                alt="پاد سیستم و ویپ اورجینال"
                referrerPolicy="no-referrer"
                loading="eager"
                className="w-full h-full object-contain p-2 drop-shadow-2xl transition-transform duration-300 group-hover:scale-105"
              />

              {/* Floating Tag */}
              <div 
                className="absolute top-4 right-4 bg-white border border-slate-200 px-3.5 py-2 rounded-2xl shadow-lg flex items-center gap-2.5 text-right"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <div>
                  <div className="text-[10px] text-slate-400 font-bold">پیشنهاد منتخب هفته</div>
                  <div className="text-xs font-black text-slate-900">اکسوا ایکس پرو ۳۰ وات</div>
                </div>
              </div>

              {/* Floating Discount Tag */}
              <div 
                className="absolute bottom-4 left-4 bg-rose-500 text-white px-3.5 py-1.5 rounded-2xl shadow-lg text-xs font-black flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>۱۸٪ تخفیف ویژه بهاره</span>
              </div>

            </motion.div>

          </motion.div>

        </div>

        {/* 4 Quick Category Action Cards with Staggered Hover & Pop */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mt-10 pt-4"
        >
          <motion.button
            whileHover={{ y: -6, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onFilterCategory('pod')}
            className="p-4 rounded-2xl bg-white hover:bg-amber-50/50 border border-slate-200 hover:border-amber-400 transition-all text-right group flex items-center justify-between shadow-sm hover:shadow-lg cursor-pointer"
          >
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">مناسب ترک سیگار</span>
              <span className="text-sm font-black text-slate-900 group-hover:text-amber-600 transition-colors">انواع پاد سیستم</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-950 transition-all border border-amber-200 group-hover:rotate-6">
              <Zap className="w-5 h-5" />
            </div>
          </motion.button>

          <motion.button
            whileHover={{ y: -6, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onFilterCategory('vape')}
            className="p-4 rounded-2xl bg-white hover:bg-cyan-50/50 border border-slate-200 hover:border-cyan-400 transition-all text-right group flex items-center justify-between shadow-sm hover:shadow-lg cursor-pointer"
          >
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">دود و کام‌دهی بالا</span>
              <span className="text-sm font-black text-slate-900 group-hover:text-cyan-600 transition-colors">ویپ‌های ساب‌اهم</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all border border-cyan-200 group-hover:rotate-6">
              <Flame className="w-5 h-5" />
            </div>
          </motion.button>

          <motion.button
            whileHover={{ y: -6, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onFilterCategory('salt')}
            className="p-4 rounded-2xl bg-white hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-400 transition-all text-right group flex items-center justify-between shadow-sm hover:shadow-lg cursor-pointer"
          >
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">نیکوتین ۲۰ تا ۵۰mg</span>
              <span className="text-sm font-black text-slate-900 group-hover:text-emerald-600 transition-colors">سالت نیکوتین اصل</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all border border-emerald-200 group-hover:rotate-6">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </motion.button>

          <motion.button
            whileHover={{ y: -6, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onFilterCategory('disposable')}
            className="p-4 rounded-2xl bg-white hover:bg-purple-50/50 border border-slate-200 hover:border-purple-400 transition-all text-right group flex items-center justify-between shadow-sm hover:shadow-lg cursor-pointer"
          >
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">آماده مصرف و طعم‌دار</span>
              <span className="text-sm font-black text-slate-900 group-hover:text-purple-600 transition-colors">پاد یکبار مصرف</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-slate-950 transition-all border border-purple-200 group-hover:rotate-6">
              <Sparkles className="w-5 h-5" />
            </div>
          </motion.button>
        </motion.div>

      </div>

    </div>
  );
};
