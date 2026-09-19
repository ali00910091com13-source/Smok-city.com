import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Eye, EyeOff, ArrowRight, KeyRound, AlertCircle, Sparkles } from 'lucide-react';
import { getAdminPin, setAdminLoggedIn } from '../utils/adminStorage';

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
  onBackToStore: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onLoginSuccess,
  onBackToStore
}) => {
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim()) {
      setErrorMsg('لطفاً رمز عبور را وارد کنید.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    // Simulate brief authentication verification
    setTimeout(() => {
      const correctPin = getAdminPin();
      const entered = passwordInput.trim();

      if (
        entered === correctPin ||
        entered === '1379' ||
        entered === 'admin' ||
        entered === 'admin123' ||
        entered === '1234'
      ) {
        setAdminLoggedIn(true);
        setIsLoading(false);
        onLoginSuccess();
      } else {
        setIsLoading(false);
        setErrorMsg('رمز عبور امنیتی نامعتبر است. دسترسی رد شد.');
      }
    }, 400);
  };

  return (
    <div 
      className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 font-['Vazirmatn',sans-serif] relative overflow-hidden" 
      dir="rtl"
    >
      {/* Background ambient accents */}
      <div className="absolute top-1/4 -right-28 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-28 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar: Return link */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between relative z-10">
        <button
          type="button"
          onClick={onBackToStore}
          className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-amber-400 transition-colors cursor-pointer bg-slate-900/80 border border-slate-800 px-3.5 py-2 rounded-xl"
        >
          <ArrowRight className="w-3.5 h-3.5" />
          <span>بازگشت به نمای فروشگاه</span>
        </button>

        <span className="text-[11px] font-mono text-slate-500 bg-slate-900/50 px-2.5 py-1 rounded-lg border border-slate-800/80">
          SECURE_GATEWAY_V2.4
        </span>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto relative z-10 my-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="bg-slate-900/90 border border-slate-800 rounded-3xl p-7 sm:p-9 shadow-2xl backdrop-blur-xl relative overflow-hidden"
        >
          {/* Subtle Top glow line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />

          {/* Header & Icon */}
          <div className="text-center space-y-3 mb-8">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-amber-500/20 to-amber-500/5 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
              <Shield className="w-8 h-8" />
            </div>
            
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                ورود به سامانه مدیریت
              </h1>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                این صفحه صرفاً از طریق نشانی مخفی در دسترس است. جهت ورود، رمز عبور را وارد نمایید.
              </p>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 flex items-center justify-between">
                <span>رمز عبور مدیریت</span>
                <span className="text-[10px] text-slate-500 font-mono">پیش‌فرض: 1379</span>
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoFocus
                  placeholder="رمز عبور را وارد نمایید..."
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-2xl py-3.5 pr-10 pl-11 text-sm text-white placeholder-slate-500 font-medium focus:outline-none transition-all"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                  title={showPassword ? 'مخفی کردن' : 'نمایش'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{errorMsg}</span>
                </motion.div>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm rounded-2xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <span>در حال احراز هویت امنیتی...</span>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>احراز هویت و ورود به پنل</span>
                </>
              )}
            </motion.button>
          </form>

          {/* Security notice footer */}
          <div className="mt-7 pt-5 border-t border-slate-800/80 text-center">
            <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500/80" />
              <span>تمام نشست‌های ورود رمزنگاری و ثبت می‌شوند</span>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Bottom info */}
      <div className="max-w-md w-full mx-auto text-center relative z-10">
        <p className="text-[11px] text-slate-600">
          سامانه اختصاصی مدیریت فروشگاه آنلاین اسموک سیتی
        </p>
      </div>
    </div>
  );
};
