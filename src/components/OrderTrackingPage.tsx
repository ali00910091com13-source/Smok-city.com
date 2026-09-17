import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Truck, 
  Search, 
  Clock, 
  MapPin, 
  PhoneCall, 
  CheckCircle2, 
  Package, 
  FileText, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { SAMPLE_TRACKING_ORDERS } from '../data/extraData';
import { TrackingOrder } from '../types';
import { formatPrice } from '../data/products';

export const OrderTrackingPage: React.FC = () => {
  const [orderInput, setOrderInput] = useState('SMC-9941');
  const [currentOrder, setCurrentOrder] = useState<TrackingOrder | null>(SAMPLE_TRACKING_ORDERS['SMC-9941']);
  const [hasSearched, setHasSearched] = useState(true);

  const handleSearch = (codeToSearch?: string) => {
    const code = (codeToSearch || orderInput).trim().toUpperCase();
    if (!code) return;

    setHasSearched(true);
    if (SAMPLE_TRACKING_ORDERS[code]) {
      setCurrentOrder(SAMPLE_TRACKING_ORDERS[code]);
    } else {
      // Create a dynamic realistic in-transit order for any custom code
      setCurrentOrder({
        orderId: code,
        customerName: 'کاربر محترم اسموک سیتی',
        phone: '0912***0000',
        date: 'امروز، ساعت ۱۱:۰۰',
        status: 'shipped',
        statusText: 'بسته در حال انتقال به مرکز توزیع پستی',
        courier: 'پست پیشتاز هوایی',
        courierPhone: '193',
        shippingAddress: 'آدرس ثبت شده در فاکتور سفارش',
        totalAmount: 1450000,
        items: [
          { productName: 'پاد سیستم و سالت انتخابی مشتری', quantity: 1, price: 1450000 }
        ],
        steps: [
          { title: 'ثبت سفارش و پرداخت اینترنتی', desc: 'تراکنش شاپرک با موفقیت انجام شد', time: '۱۱:۰۰', completed: true, current: false },
          { title: 'بررسی اصالت و صدور فاکتور', desc: 'کارت طلایی گارانتی الحاق گردید', time: '۱۱:۲۰', completed: true, current: false },
          { title: 'بسته‌بندی ضربه‌گیر انبار', desc: 'آماده‌سازی برای واحد ارسال', time: '۱۱:۵۰', completed: true, current: true },
          { title: 'تحویل به ناوگان حمل و نقل', desc: 'در صف خروج از تهران', time: 'تخمین: ۱۶:۰۰', completed: false, current: false },
          { title: 'تحویل نهایی به آدرس مقصد', desc: 'تحویل حضوری با دریافت امضا', time: 'فردا', completed: false, current: false }
        ]
      });
    }
  };

  return (
    <div className="bg-slate-50 py-8 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 border border-amber-300 px-4 py-1.5 rounded-full text-xs font-black">
            <Truck className="w-4 h-4 text-amber-600" />
            <span>سامانه لحظه‌ای رصد و پیگیری مرسولات</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
            پیگیری آنلاین سفارش و زمان رسیدن بسته
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            کد رهگیری پیامک‌شده (با فرمت SMC-XXXX) را در کادر زیر وارد کنید تا آخرین موقعیت بسته پستی یا پیک اختصاصی خود را مشاهده نمایید.
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="مثال: SMC-9941 یا SMC-8820"
                value={orderInput}
                onChange={(e) => setOrderInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full bg-slate-50 border-2 border-slate-200 focus:border-amber-500 rounded-2xl py-3.5 pr-4 pl-4 text-sm font-mono font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white transition-all text-left dir-ltr"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => handleSearch()}
              className="px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>جستجوی وضعیت سفارش</span>
            </motion.button>
          </div>

          {/* Quick sample orders */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 pt-1">
            <span className="text-[11px] font-bold text-slate-400">سفارش‌های نمونه جهت بررسی:</span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setOrderInput('SMC-9941');
                handleSearch('SMC-9941');
              }}
              className="text-amber-700 hover:underline font-mono bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 font-bold cursor-pointer"
            >
              SMC-9941 (پیک اکسپرس تهران)
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setOrderInput('SMC-8820');
                handleSearch('SMC-8820');
              }}
              className="text-slate-700 hover:underline font-mono bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 font-bold cursor-pointer"
            >
              SMC-8820 (پست پیشتاز اصفهان)
            </motion.button>
          </div>
        </div>

        {/* Order Details Card */}
        <AnimatePresence mode="wait">
          {hasSearched && currentOrder && (
            <motion.div
              key={currentOrder.orderId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-8 text-right"
            >
              
              {/* Top Status Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-bold">شماره سفارش:</span>
                    <span className="text-base font-black font-mono text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-lg">
                      {currentOrder.orderId}
                    </span>
                    <span className="text-xs bg-amber-100 text-amber-800 font-black px-2.5 py-0.5 rounded-full border border-amber-300">
                      {currentOrder.statusText}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    ثبت شده به نام: <strong className="text-slate-800">{currentOrder.customerName}</strong> ({currentOrder.date})
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-right">
                  <span className="text-[10px] text-slate-400 block font-bold">ارسال از طریق:</span>
                  <span className="text-xs font-bold text-slate-800">{currentOrder.courier}</span>
                </div>
              </div>

              {/* Tracking Progress Steps */}
              <div>
                <h3 className="text-sm font-black text-slate-900 mb-6 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span>مراحل پردازش و ارسال مرسوله</span>
                </h3>

                <div className="relative pr-6 border-r-2 border-slate-200 space-y-6">
                  {currentOrder.steps.map((step, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.08 }}
                      className="relative"
                    >
                      {/* Circle marker */}
                      <div
                        className={`absolute -right-[31px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          step.completed
                            ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                            : step.current
                            ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-200'
                            : 'bg-slate-200 text-slate-400'
                        }`}
                      >
                        {step.completed ? '✓' : idx + 1}
                      </div>

                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className={`text-xs sm:text-sm font-bold ${
                            step.current ? 'text-amber-700 font-black' : step.completed ? 'text-slate-900' : 'text-slate-400'
                          }`}>
                            {step.title}
                          </h4>
                          {step.time && (
                            <span className="text-[11px] font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                              {step.time}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{step.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Address & Items Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
                
                {/* Delivery Address */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <MapPin className="w-4 h-4 text-rose-500" />
                    <span>آدرس مقصد تحویل:</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {currentOrder.shippingAddress}
                  </p>
                  <div className="pt-2 flex items-center gap-2 text-xs text-slate-500">
                    <PhoneCall className="w-3.5 h-3.5 text-slate-400" />
                    <span>تماس با سفیر / مرکز توزیع: </span>
                    <span className="font-mono font-bold text-slate-700">{currentOrder.courierPhone}</span>
                  </div>
                </div>

                {/* Items in this order */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-amber-500" />
                      <span>اقلام این سفارش:</span>
                    </div>
                    <span className="text-slate-500">{currentOrder.items.length} ردیف کالا</span>
                  </div>

                  <div className="divide-y divide-slate-200 text-xs">
                    {currentOrder.items.map((item, idx) => (
                      <div key={idx} className="py-2 flex items-center justify-between">
                        <span className="text-slate-700 font-medium">
                          {item.productName} ({item.quantity} عدد)
                        </span>
                        <span className="font-bold text-slate-900">{formatPrice(item.price)}</span>
                      </div>
                    ))}
                    <div className="pt-2 flex items-center justify-between font-black text-slate-900">
                      <span>مبلغ کل فاکتور:</span>
                      <span className="text-amber-600">{formatPrice(currentOrder.totalAmount)}</span>
                    </div>
                  </div>
                </div>

              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
