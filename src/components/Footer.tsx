import React, { useState } from 'react';
import { 
  Flame, 
  PhoneCall, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  Send, 
  Instagram, 
  MessageCircle,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { PageType } from '../types';
import { SmokeCityLogo } from './SmokeCityLogo';

interface FooterProps {
  onNavigate?: (page: PageType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [newsInput, setNewsInput] = useState('');
  const [newsJoined, setNewsJoined] = useState(false);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsInput.trim()) return;
    setNewsJoined(true);
    setTimeout(() => {
      setNewsInput('');
    }, 2000);
  };

  return (
    <footer className="bg-slate-100 border-t border-slate-200 text-slate-700 text-right pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Newsletter & Club row */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 mb-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-amber-700 font-bold text-xs mb-1">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>عضویت در باشگاه اختصاصی مشتریان اسموک سیتی</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              دریافت کوپن تخفیف ۵۰,۰۰۰ تومانی اولین خرید
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              با ثبت شماره یا ایمیل خود، کد تخفیف بلافاصله برای شما ارسال شده و از حراجی‌های فصلی مطلع شوید.
            </p>
          </div>

          <form onSubmit={handleJoin} className="w-full md:w-auto flex flex-col sm:flex-row gap-2.5">
            {newsJoined ? (
              <div className="bg-emerald-50 text-emerald-800 font-bold text-xs p-3 rounded-2xl border border-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>شماره شما ثبت شد! کد تخفیف SMOKE10 برای شما فعال است.</span>
              </div>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="شماره موبایل یا ایمیل..."
                  value={newsInput}
                  onChange={(e) => setNewsInput(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 w-full sm:w-72"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-colors shrink-0 shadow-md"
                >
                  دریافت کوپن هدیه
                </button>
              </>
            )}
          </form>
        </div>

        {/* 4 Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Col 1: About */}
          <div className="space-y-4">
            <SmokeCityLogo size="sm" />
            <p className="text-xs text-slate-500 leading-relaxed text-justify font-normal">
              اسموک سیتی معتبرترین مرجع تخصصی خرید آنلاین پاد سیستم، ویپ حرفه‌ای، سالت نیکوتین و کارتریج‌های روز با ضمانت ۱۰۰٪ اصالت فیزیکی و ۷ روز گارانتی سلامت کالا در ایران است.
            </p>
            <div className="flex items-center gap-3 pt-2 text-slate-600">
              <span className="text-xs font-bold text-slate-700">شبکه‌های اجتماعی:</span>
              <a href="#instagram" className="p-2 bg-white border border-slate-200 hover:bg-amber-500 hover:text-slate-950 rounded-xl transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#telegram" className="p-2 bg-white border border-slate-200 hover:bg-amber-500 hover:text-slate-950 rounded-xl transition-colors">
                <Send className="w-4 h-4" />
              </a>
              <a href="#whatsapp" className="p-2 bg-white border border-slate-200 hover:bg-amber-500 hover:text-slate-950 rounded-xl transition-colors">
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-slate-900 border-b border-slate-200 pb-2">
              صفحات و بخش‌های سایت
            </h4>
            <ul className="space-y-2 text-xs font-bold text-slate-600">
              <li>
                <button 
                  onClick={() => onNavigate && onNavigate(PageType.SHOP)} 
                  className="hover:text-amber-600 transition-colors"
                >
                  فروشگاه کامل و فیلترها
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate && onNavigate(PageType.DEALS)} 
                  className="hover:text-amber-600 transition-colors"
                >
                  تخفیف‌ها و پیشنهادات شگفت‌انگیز
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate && onNavigate(PageType.AUTHENTICITY)} 
                  className="hover:text-amber-600 transition-colors"
                >
                  سامانه استعلام اصالت کالا
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate && onNavigate(PageType.TRACKING)} 
                  className="hover:text-amber-600 transition-colors"
                >
                  پیگیری سفارش و مرسوله
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate && onNavigate(PageType.BLOG)} 
                  className="hover:text-amber-600 transition-colors"
                >
                  مجله تخصصی و مقالات آموزشی
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate && onNavigate(PageType.CONTACT)} 
                  className="hover:text-amber-600 transition-colors"
                >
                  تماس و آدرس شعب حضوری
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Service */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-slate-900 border-b border-slate-200 pb-2">
              خدمات مشتریان و راهنما
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><span className="hover:text-amber-600 cursor-pointer">راهنمای انتخاب سالت و کویل</span></li>
              <li><span className="hover:text-amber-600 cursor-pointer">شرایط گارانتی و مرجوعی ۷ روزه</span></li>
              <li><span className="hover:text-amber-600 cursor-pointer">شیوه‌ها و هزینه ارسال سفارشات</span></li>
              <li><span className="hover:text-amber-600 cursor-pointer">پرسش‌های پرتکرار مشتریان</span></li>
              <li><span className="hover:text-amber-600 cursor-pointer">قوانین و مقررات خرید و حریم خصوصی</span></li>
            </ul>
          </div>

          {/* Col 4: Contact & Badges */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-slate-900 border-b border-slate-200 pb-2">
              اطلاعات تماس و مشاوره
            </h4>
            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="font-mono text-sm font-bold text-slate-900">021-88223344</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>همه روزه از ساعت ۹ الی ۲۱</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">تهران، خیابان ولیعصر، بالاتر از پارک ساعی، پلاک ۲۱۴، ساختمان اسموک سیتی</span>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="pt-3 grid grid-cols-3 gap-2">
              <div className="bg-white p-2.5 rounded-2xl border border-slate-200 text-center flex flex-col items-center justify-center shadow-xs">
                <ShieldCheck className="w-5 h-5 text-emerald-600 mb-1" />
                <span className="text-[10px] text-slate-700 font-bold">ضمانت اصالت</span>
              </div>
              <div className="bg-white p-2.5 rounded-2xl border border-slate-200 text-center flex flex-col items-center justify-center shadow-xs">
                <Clock className="w-5 h-5 text-amber-600 mb-1" />
                <span className="text-[10px] text-slate-700 font-bold">ارسال ۲ ساعته</span>
              </div>
              <div className="bg-white p-2.5 rounded-2xl border border-slate-200 text-center flex flex-col items-center justify-center shadow-xs">
                <Sparkles className="w-5 h-5 text-blue-600 mb-1" />
                <span className="text-[10px] text-slate-700 font-bold">۷ روز گارانتی</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom line */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-normal">
          <p>© کلیه حقوق مادی و معنوی متعلق به وب‌سایت فروشگاه آنلاین اسموک سیتی می‌باشد.</p>
          <div className="flex items-center gap-4">
            <span>درگاه امن بانکی شاپرک</span>
            <span>•</span>
            <span>نماد اعتماد الکترونیکی</span>
            <span>•</span>
            <span>سیستم استعلام اصالت آنلاین</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
