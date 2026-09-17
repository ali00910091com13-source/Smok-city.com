import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowLeft, 
  Truck, 
  CheckCircle2, 
  Tag, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { CartItem } from '../types';
import { formatPrice } from '../data/products';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
  onProceedCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedCheckout
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [couponError, setCouponError] = useState('');

  // Calculate items subtotal
  const subtotal = cartItems.reduce((acc, item) => {
    let itemPrice = item.product.price;
    if (item.withAddon) {
      itemPrice += 464000;
    }
    return acc + (itemPrice * item.quantity);
  }, 0);

  const freeShippingThreshold = 700000;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const shippingAmount = isFreeShipping || subtotal === 0 ? 0 : 45000;
  const discountAmount = discountApplied ? Math.round(subtotal * 0.1) : 0;
  const totalPayable = Math.max(0, subtotal - discountAmount + shippingAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'SMOKE10') {
      setDiscountApplied(true);
      setCouponError('');
    } else {
      setCouponError('کد تخفیف نامعتبر است (کد تستی: SMOKE10)');
    }
  };

  // Lock body scroll when cart drawer is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-['Vazirmatn',sans-serif]">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <div className="fixed inset-y-0 left-0 max-w-full flex pl-0 sm:pl-10">
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="w-screen max-w-md bg-white border-r border-slate-200 flex flex-col shadow-2xl text-slate-900 text-right"
            >
              
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center border border-amber-200">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-slate-900">سبد خرید شما</h2>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {cartItems.length} ردیف کالا انتخاب شده
                    </span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-slate-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-slate-50 p-3.5 border-b border-slate-200 text-xs">
            <div className="flex items-center justify-between mb-1.5 font-medium">
              <span className="flex items-center gap-1.5 text-slate-700">
                <Truck className="w-4 h-4 text-amber-600" />
                {isFreeShipping ? (
                  <span className="text-emerald-700 font-bold">تبریک! سفارش شما مشمول ارسال رایگان شد.</span>
                ) : (
                  <span>
                    تنها <strong className="text-amber-700">{formatPrice(freeShippingThreshold - subtotal)}</strong> تا ارسال رایگان
                  </span>
                )}
              </span>
              <span className="text-[10px] text-slate-500 font-bold">حداقل: ۷۰۰,۰۰۰ تومان</span>
            </div>

            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-slate-100 space-y-4">
            {cartItems.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-16 text-center space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-black text-slate-800">سبد خرید شما در حال حاضر خالی است</h4>
                  <p className="text-xs text-slate-500">دستگاه یا سالت مورد نظر خود را به سبد اضافه کنید.</p>
                </div>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs shadow-md hover:bg-amber-400 transition-colors"
                >
                  مشاهده محصولات فروشگاه
                </button>
              </motion.div>
            ) : (
              <AnimatePresence initial={false}>
                {cartItems.map((item, idx) => {
                  const itemSinglePrice = item.product.price + (item.withAddon ? 464000 : 0);
                  const colorObj = item.product.colors?.find(c => c.id === item.colorId);

                  return (
                    <motion.div 
                      key={`${item.product.id}-${item.colorId || ''}-${item.resistanceId || ''}-${item.withAddon ? 'with-addon' : 'no-addon'}-${idx}`}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0, scale: 0.9, overflow: 'hidden' }}
                      transition={{ duration: 0.2 }}
                      className="pt-4 first:pt-0 flex gap-3.5 items-start"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 object-contain bg-slate-50 rounded-2xl p-1.5 border border-slate-200 shrink-0"
                      />

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex justify-between items-start">
                          <h4 className="text-xs font-black text-slate-900 truncate">
                            {item.product.name}
                          </h4>
                          <motion.button
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.85 }}
                            onClick={() => onRemoveItem(idx)}
                            className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                            title="حذف از سبد"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>

                        {/* Variant tags */}
                        <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-slate-500">
                          {colorObj && (
                            <span className="bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colorObj.hex }} />
                              {colorObj.name}
                            </span>
                          )}
                          {item.resistanceId && (
                            <span className="bg-slate-100 px-2 py-0.5 rounded-md">
                              کویل: {item.resistanceId}
                            </span>
                          )}
                          {item.withAddon && (
                            <span className="bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">
                              + سالت مکمل نستی
                            </span>
                          )}
                        </div>

                        {/* Price & Quantity Controls */}
                        <div className="flex items-center justify-between pt-1.5">
                          <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-0.5">
                            <motion.button
                              whileTap={{ scale: 0.8 }}
                              onClick={() => onUpdateQuantity(idx, item.quantity - 1)}
                              className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-slate-700 shadow-xs hover:bg-slate-50"
                            >
                              <Minus className="w-3 h-3" />
                            </motion.button>
                            <span className="text-xs font-mono font-black text-slate-900 px-2.5">
                              {item.quantity}
                            </span>
                            <motion.button
                              whileTap={{ scale: 0.8 }}
                              onClick={() => onUpdateQuantity(idx, item.quantity + 1)}
                              className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-slate-700 shadow-xs hover:bg-slate-50"
                            >
                              <Plus className="w-3 h-3" />
                            </motion.button>
                          </div>

                          <span className="text-xs font-black text-slate-900">
                            {formatPrice(itemSinglePrice * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cartItems.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 space-y-3.5">
              
              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="کد تخفیف (مثال: SMOKE10)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 uppercase font-mono"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-black text-xs transition-colors"
                >
                  اعمال
                </button>
              </form>

              {discountApplied && (
                <div className="text-[11px] font-bold text-emerald-700 bg-emerald-100/70 border border-emerald-300 p-2 rounded-xl flex items-center justify-between">
                  <span>کوپن ۱۰٪ تخفیف اعمال شد</span>
                  <span>- {formatPrice(discountAmount)}</span>
                </div>
              )}

              {couponError && (
                <div className="text-[11px] text-rose-600 font-bold">
                  {couponError}
                </div>
              )}

              {/* Cost Lines */}
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>جمع سبد خرید:</span>
                  <span className="font-bold text-slate-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>هزینه بسته‌بندی و ارسال:</span>
                  <span className="font-bold">
                    {shippingAmount === 0 ? (
                      <span className="text-emerald-700">رایگان</span>
                    ) : (
                      formatPrice(shippingAmount)
                    )}
                  </span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-black text-slate-900">
                  <span>مبلغ قابل پرداخت نهایی:</span>
                  <span className="text-amber-700 text-base">{formatPrice(totalPayable)}</span>
                </div>
              </div>

              {/* Proceed to Checkout Button */}
              <motion.button
                id="checkout-btn"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  onClose();
                  onProceedCheckout();
                }}
                className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>تکمیل خرید و انتخاب آدرس تحویل</span>
                <ArrowLeft className="w-4 h-4" />
              </motion.button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>ضمانت سلامت فیزیکی و پرداخت امن از طریق درگاه شاپرک</span>
              </div>

            </div>
          )}

            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
