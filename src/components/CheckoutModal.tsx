import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem } from '../types';
import { formatPrice } from '../data/products';
import { 
  X, 
  CheckCircle2, 
  Truck, 
  CreditCard, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  User, 
  Tag, 
  FileText, 
  Printer, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  cartTotal: number;
  onOrderCompleted: (orderId: string) => void;
  onNavigateTracking: (orderId: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  cartTotal,
  onOrderCompleted,
  onNavigateTracking
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [province, setProvince] = useState('تهران');
  const [city, setCity] = useState('تهران');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'express' | 'post'>('express');
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod' | 'card'>('online');
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState<{ text: string; success: boolean } | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [generatedOrderId, setGeneratedOrderId] = useState('');

  if (!isOpen) return null;

  const shippingCost = cartTotal > 700000 || deliveryMethod === 'post' ? 0 : 45000;
  const finalPayable = Math.max(0, cartTotal + shippingCost - appliedDiscount);

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (code === 'SMOKE10') {
      const disc = Math.round(cartTotal * 0.1);
      setAppliedDiscount(disc);
      setCouponMessage({ text: `کوپن ۱۰٪ تخفیف (${formatPrice(disc)}) اعمال شد!`, success: true });
    } else if (code === 'WELCOME50') {
      setAppliedDiscount(50000);
      setCouponMessage({ text: 'تخفیف ۵۰,۰۰۰ تومانی خرید اول اعمال شد!', success: true });
    } else if (code === 'FREESHIP') {
      setCouponMessage({ text: 'هزینه ارسال رایگان اعمال گردید.', success: true });
    } else {
      setCouponMessage({ text: 'کد تخفیف نامعتبر است یا منقضی شده است.', success: false });
    }
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !address.trim()) {
      alert('لطفاً فیلدهای ستاره‌دار (نام، شماره تماس، آدرس) را تکمیل نمایید.');
      return;
    }

    const orderNumber = 'SMC-' + Math.floor(1000 + Math.random() * 9000);
    setGeneratedOrderId(orderNumber);
    setIsCompleted(true);
    onOrderCompleted(orderNumber);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
          />

          {/* Dialog Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-6 text-right shadow-2xl relative z-10"
          >
            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-6 left-6 p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </motion.button>

        {!isCompleted ? (
          <form onSubmit={handleFinalSubmit} className="space-y-6">
            
            <div>
              <div className="flex items-center gap-2 text-amber-600 font-bold text-xs mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>درگاه امن پرداخت اینترنتی و تسویه حساب</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                ثبت اطلاعات ارسال و پرداخت سفارش
              </h2>
            </div>

            {/* Recipient Information */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <h3 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                <User className="w-4 h-4 text-amber-500" />
                <span>مشخصات تحویل‌گیرنده:</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    نام و نام خانوادگی <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: رامین سعیدی"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    شماره تماس همراه <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="مثال: 09123456789"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500 dir-ltr text-right"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">استان</label>
                  <input
                    type="text"
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">شهر</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">کد پستی ۱۰ رقمی</label>
                  <input
                    type="text"
                    placeholder="مثال: 1985732145"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500 font-mono dir-ltr text-right"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  آدرس دقیق پستی <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="نام خیابان، کوچه، پلاک، زنگ و طبقه..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                ></textarea>
              </div>
            </div>

            {/* Delivery Method */}
            <div className="space-y-3">
              <label className="block text-xs font-black text-slate-800 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-amber-500" />
                <span>شیوه ارسال سفارش:</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <label className={`p-3.5 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                  deliveryMethod === 'express' ? 'border-amber-500 bg-amber-50/50' : 'border-slate-200 bg-white'
                }`}>
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="delivery"
                      checked={deliveryMethod === 'express'}
                      onChange={() => setDeliveryMethod('express')}
                      className="text-amber-500"
                    />
                    <div>
                      <span className="font-bold text-slate-900 block">پیک اختصاصی اکسپرس تهران</span>
                      <span className="text-[11px] text-slate-500">تحویل فوری حداکثر ظرف ۲ ساعت</span>
                    </div>
                  </div>
                  <span className="font-bold text-amber-700 text-xs">
                    {cartTotal > 700000 ? 'رایگان' : '۴۵,۰۰۰ ت'}
                  </span>
                </label>

                <label className={`p-3.5 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                  deliveryMethod === 'post' ? 'border-amber-500 bg-amber-50/50' : 'border-slate-200 bg-white'
                }`}>
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="delivery"
                      checked={deliveryMethod === 'post'}
                      onChange={() => setDeliveryMethod('post')}
                      className="text-amber-500"
                    />
                    <div>
                      <span className="font-bold text-slate-900 block">پست پیشتاز هوایی سراسری</span>
                      <span className="text-[11px] text-slate-500">تحویل ۲۴ تا ۴۸ ساعته تمام ایران</span>
                    </div>
                  </div>
                  <span className="font-bold text-emerald-600 text-xs">رایگان</span>
                </label>
              </div>
            </div>

            {/* Payment Options */}
            <div className="space-y-3">
              <label className="block text-xs font-black text-slate-800 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-amber-500" />
                <span>روش پرداخت:</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <label className={`p-3 rounded-2xl border-2 cursor-pointer text-center transition-all ${
                  paymentMethod === 'online' ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-200'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'online'}
                    onChange={() => setPaymentMethod('online')}
                    className="sr-only"
                  />
                  <span className="font-black text-slate-900 block text-xs">درگاه پرداخت اینترنتی</span>
                  <span className="text-[10px] text-emerald-700 font-bold">کلیه کارت‌های عضو شتاب</span>
                </label>

                <label className={`p-3 rounded-2xl border-2 cursor-pointer text-center transition-all ${
                  paymentMethod === 'cod' ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-200'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="sr-only"
                  />
                  <span className="font-black text-slate-900 block text-xs">پرداخت در محل (تهران)</span>
                  <span className="text-[10px] text-slate-500">کارتخوان سیار سفیر</span>
                </label>

                <label className={`p-3 rounded-2xl border-2 cursor-pointer text-center transition-all ${
                  paymentMethod === 'card' ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-200'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="sr-only"
                  />
                  <span className="font-black text-slate-900 block text-xs">کارت به کارت شتاب</span>
                  <span className="text-[10px] text-slate-500">ارسال فیش به پشتیبانی</span>
                </label>
              </div>
            </div>

            {/* Coupon Code Section */}
            <div className="border-t border-slate-100 pt-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="کد تخفیف (مثال: SMOKE10 یا WELCOME50)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none focus:border-amber-500 uppercase"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-black text-xs"
                >
                  اعمال کد
                </button>
              </div>
              {couponMessage && (
                <p className={`text-[11px] mt-1.5 font-bold ${couponMessage.success ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {couponMessage.text}
                </p>
              )}
            </div>

            {/* Summary Box */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>جمع کل اقلام سبد خرید ({cartItems.reduce((s, i) => s + i.quantity, 0)} کالا):</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>هزینه بسته‌بندی و ارسال:</span>
                <span>{shippingCost === 0 ? <strong className="text-emerald-600">رایگان</strong> : formatPrice(shippingCost)}</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-rose-600 font-bold">
                  <span>تخفیف کوپن:</span>
                  <span>- {formatPrice(appliedDiscount)}</span>
                </div>
              )}
              <div className="border-t border-slate-200 pt-2 flex justify-between font-black text-sm text-slate-900">
                <span>مبلغ قابل پرداخت نهایی:</span>
                <span className="text-amber-600 text-base">{formatPrice(finalPayable)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              <span>تکمیل نهایی سفارش و صدور فاکتور رسمی</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </form>
        ) : (
          /* Order Completed Confirmation Slip */
          <div className="text-center space-y-6 py-4 animate-fade-in">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                پرداخت و ثبت با موفقیت انجام شد
              </span>
              <h2 className="text-2xl font-black text-slate-900">از اعتماد و خرید شما سپاسگزاریم!</h2>
              <p className="text-xs text-slate-500">
                سفارش شما در انبار مرکزی اسموک سیتی تایید گردید و فرآیند تست اصالت و بسته‌بندی آغاز شد.
              </p>
            </div>

            {/* Digital Order Voucher */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-right space-y-3 text-xs">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2.5">
                <span className="text-slate-400">کد رهگیری اختصاصی سفارش شما:</span>
                <span className="font-mono font-black text-sm text-amber-700 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200">
                  {generatedOrderId}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>نام تحویل‌گیرنده:</span>
                <span className="font-bold text-slate-900">{fullName}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>شماره تماس:</span>
                <span className="font-mono text-slate-900">{phone}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>روش ارسال:</span>
                <span className="font-bold text-slate-900">
                  {deliveryMethod === 'express' ? 'پیک اکسپرس ۲ ساعته تهران' : 'پست پیشتاز هوایی سراسری'}
                </span>
              </div>
              <div className="flex justify-between font-black text-slate-900 border-t border-slate-200 pt-2.5">
                <span>مبلغ پرداختی:</span>
                <span className="text-amber-600 text-sm">{formatPrice(finalPayable)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateTracking(generatedOrderId);
                }}
                className="flex-1 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Truck className="w-4 h-4" />
                <span>رهگیری لحظه‌ای این مرسوله</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>چاپ فاکتور رسمی</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                بستن پنجره
              </button>
            </div>

          </div>
        )}

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
