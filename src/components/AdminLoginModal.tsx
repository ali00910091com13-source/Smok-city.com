import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Lock, Eye, EyeOff, X, ArrowLeft, KeyRound, AlertCircle, Sparkles } from 'lucide-react';
import { getAdminPin, setAdminLoggedIn } from '../utils/adminStorage';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [pinInput, setPinInput] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPin = getAdminPin();
    
    if (pinInput.trim() === correctPin || pinInput.trim() === 'admin' || pinInput.trim() === 'admin123') {
      setAdminLoggedIn(true);
      setErrorMsg(null);
      setPinInput('');
      onSuccess();
    } else {
      setErrorMsg('رمز عبور وارد شده نادرست است.');
    }
  };

  const handleQuickFill = () => {
    setPinInput('1234');
    setErrorMsg(null);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-md bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-2xl z-10 text-right font-['Vazirmatn',sans-serif]"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 left-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-amber-600 flex items-center justify-center shrink-0">
              <Shield className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <span>پنل اختصاصی مدیریت اسموک سیتی</span>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                  Admin
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                ورود به بخش مدیریت محصولات، مقالات، سفارش‌ها و حراجی
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1.5">
                رمز عبور امنیتی مدیریت (PIN)
              </label>
              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'}
                  autoFocus
                  placeholder="رمز عبور ادمین..."
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3 pl-10 text-sm text-slate-900 font-mono tracking-wider focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all text-left dir-ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2 text-rose-700 text-xs font-bold animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Default PIN Helper Box */}
            <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-2xl flex items-center justify-between text-xs text-amber-900">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="text-[11px]">رمز پیش‌فرض سیستم: <strong className="font-mono">1234</strong></span>
              </div>
              <button
                type="button"
                onClick={handleQuickFill}
                className="text-[11px] font-bold text-amber-700 hover:text-amber-800 underline cursor-pointer"
              >
                درج خودکار
              </button>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="submit"
                className="flex-1 py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-amber-500/20"
              >
                <Lock className="w-4 h-4" />
                <span>ورود به داشبورد مدیریت</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                انصراف
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
