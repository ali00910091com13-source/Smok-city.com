import React from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  BadgePercent, 
  Headphones, 
  Sparkles 
} from 'lucide-react';

export const TrustFeatures: React.FC = () => {
  const features = [
    {
      icon: ShieldCheck,
      title: 'ضمانت ۱۰۰٪ اصالت فیزیکی',
      desc: 'تمامی دستگاه‌ها و سالت‌ها دارای کد اسکرچ معتبر شرکتی جهت استعلام مستقیم در وبسایت سازنده می‌باشند.',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 border-emerald-200'
    },
    {
      icon: Truck,
      title: 'ارسال فوری و اختصاصی',
      desc: 'تحویل با پیک اکسپرس کمتر از ۲ ساعت در تهران و ارسال همان روز با پست پیشتاز و تیپاکس به تمام شهرهای کشور.',
      color: 'text-amber-600',
      bg: 'bg-amber-50 border-amber-200'
    },
    {
      icon: RotateCcw,
      title: '۷ روز ضمانت طلایی تعویض',
      desc: 'در صورت هرگونه نقص فنی در دستگاه خریداری شده، ظرف ۷ روز کالا بدون فوت وقت برای شما تعویض می‌گردد.',
      color: 'text-blue-600',
      bg: 'bg-blue-50 border-blue-200'
    },
    {
      icon: BadgePercent,
      title: 'تضمین بهترین قیمت بازار',
      desc: 'واردات مستقیم و بدون واسطه از معتبرترین کمپانی‌های جهانی به همراه کوپن‌های تخفیف هفتگی.',
      color: 'text-rose-600',
      bg: 'bg-rose-50 border-rose-200'
    },
    {
      icon: Sparkles,
      title: 'مشاوره تخصصی انتخاب نیکوتین',
      desc: 'راهنمایی دقیق توسط کارشناسان برای انتخاب مقاومت بهینه کویل، طعم دلخواه و میزان نیکوتین مناسب شما.',
      color: 'text-purple-600',
      bg: 'bg-purple-50 border-purple-200'
    },
    {
      icon: Headphones,
      title: 'پشتیبانی همه روزه ۹ تا ۲۱',
      desc: 'پاسخگویی سریع کارشناسان فروش و فنی از طریق تماس تلفنی و پیام‌رسان در تمامی روزهای کاری و تعطیلات.',
      color: 'text-orange-600',
      bg: 'bg-orange-50 border-orange-200'
    }
  ];

  return (
    <section className="py-14 bg-slate-50 border-y border-slate-200/90 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-10 space-y-2"
        >
          <span className="text-xs font-black text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-300 inline-block">
            استانداردهای فروشگاهی اسموک سیتی
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            چرا هزاران مشتری به اسموک سیتی اعتماد کرده‌اند؟
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            خرید مطمئن و بدون دغدغه تجهیزات ویپینگ با تضمین کتبی اصالت، گارانتی و پشتیبانی تخصصی
          </p>
        </motion.div>

        {/* 6 Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const IconComp = feat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                whileHover={{ y: -6, scale: 1.01 }}
                className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-amber-400 shadow-sm hover:shadow-lg transition-colors text-right flex flex-col justify-between group cursor-default"
              >
                <div>
                  <motion.div 
                    whileHover={{ rotate: 8, scale: 1.08 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 border ${feat.bg} ${feat.color}`}
                  >
                    <IconComp className="w-6 h-6" />
                  </motion.div>
                  <h3 className="text-base font-black text-slate-900 group-hover:text-amber-600 transition-colors mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-normal">
                    {feat.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
