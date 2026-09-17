import React, { useState } from 'react';
import { 
  PhoneCall, 
  Mail, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  HelpCircle
} from 'lucide-react';

interface ContactPageProps {
  onShowToast: (msg: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onShowToast }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [topic, setTopic] = useState('consultation');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) {
      onShowToast('لطفاً تمامی فیلدهای الزامی را تکمیل نمایید.');
      return;
    }

    setIsSubmitted(true);
    onShowToast('پیام شما با موفقیت دریافت شد. کارشناسان ما به زودی با شما تماس خواهند گرفت.');
    setTimeout(() => {
      setName('');
      setPhone('');
      setMessage('');
      setIsSubmitted(false);
    }, 4000);
  };

  const branches = [
    {
      name: 'شعبه مرکزی و شو‌روم ولیعصر',
      address: 'تهران، خیابان ولیعصر، بالاتر از پارک ساعی، نبش کوچه ساعی، پلاک ۲۱۴، ساختمان اسموک سیتی',
      phone: '021-88223344',
      hours: 'همه روزه از ساعت ۹:۳۰ الی ۲۱:۳۰ (حتی جمعه‌ها)',
      features: ['تست رایگان بیش از ۴۰ طعم سالت', 'مشاوره حضوری ترک سیگار', 'تحویل آنی سفارشات اینترنتی']
    },
    {
      name: 'شعبه غرب تهران (سعادت‌آباد)',
      address: 'تهران، سعادت‌آباد، میدان کاج، مرکز تجاری مروارید، طبقه همکف، واحد ۱۸',
      phone: '021-22119988',
      hours: 'همه روزه از ساعت ۱۰:۰۰ الی ۲۲:۰۰',
      features: ['جدیدترین پادهای اکسوا و وپرسو', 'سرویس کویل و تعویض کارتریج']
    },
    {
      name: 'انبار ارسال سریع و لجستیک اکسپرس',
      address: 'تهران، بزرگراه فتح، خیابان هفدهم شهریور، مجتمع لجستیک پیشتاز، واحد ۴',
      phone: '021-66554433',
      hours: 'واحد بسته‌بندی ۲۴ ساعته',
      features: ['ارسال ۲ ساعته پایتخت با پیک اختصاصی', 'پکینگ ضد ضربه و وکیوم']
    }
  ];

  return (
    <div className="bg-slate-50 py-8 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 border border-amber-300 px-4 py-1.5 rounded-full text-xs font-black">
            <PhoneCall className="w-4 h-4 text-amber-600" />
            <span>پشتیبانی، مشاوره رایگان و شعب حضوری</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
            همراه شما در انتخاب بهترین دستگاه و طعم سالت
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            کارشناسان مجرب ما در تمام روزهای هفته آماده ارائه مشاوره تخصصی جهت انتخاب نیکوتین مناسب، مقاومت کویل و خدمات گارانتی هستند.
          </p>
        </div>

        {/* Contact Form + Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-4 text-right">
            
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3">
                اطلاعات تماس مستقیم
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">مرکز تلفن ۶ رقمی:</span>
                    <span className="font-mono text-sm font-black text-slate-900">021-88223344</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">مشاوره آنلاین در واتس‌اپ و بله:</span>
                    <span className="font-mono text-sm font-black text-slate-900">09123456789</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-200">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">پست الکترونیکی سازمانی:</span>
                    <span className="font-mono text-xs font-bold text-slate-900">support@smokecity.ir</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-200">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">ساعات پاسخگویی:</span>
                    <span className="font-bold text-slate-900">همه روزه از ۹:۰۰ صبح تا ۲۱:۰۰ شب</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Quick Consultation Badge */}
            <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-3xl p-6 text-slate-950 space-y-2 shadow-md">
              <div className="flex items-center gap-2 font-black text-xs">
                <Sparkles className="w-4 h-4 fill-slate-950" />
                <span>نمی‌دانید از کجا شروع کنید؟</span>
              </div>
              <h4 className="font-black text-base text-slate-950">مشاوره ترک سیگار با متخصصین</h4>
              <p className="text-xs text-slate-900/90 leading-relaxed">
                با ارسال کلمه «مشاوره» به سامانه پیامکی ۱۰۰۰۸۸۲۲، مشاورین ما به صورت رایگان دستگاه مناسب با میزان مصرف روزانه شما را پیشنهاد خواهند داد.
              </p>
            </div>

          </div>

          {/* Interactive Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm text-right space-y-6">
              
              <div>
                <h3 className="text-xl font-black text-slate-900">فرم ارسال پیام و درخواست مشاوره</h3>
                <p className="text-xs text-slate-500 mt-1">
                  پیام شما مستقیماً توسط کارشناس مربوطه بررسی و ظرف حداکثر ۲ ساعت پاسخ داده می‌شود.
                </p>
              </div>

              {isSubmitted ? (
                <div className="bg-emerald-50 border-2 border-emerald-400 rounded-2xl p-6 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="text-base font-black text-emerald-950">پیام شما با موفقیت ثبت گردید</h4>
                  <p className="text-xs text-emerald-800">
                    همکاران ما در واحد پشتیبانی پس از بررسی با شماره درج شده تماس خواهند گرفت.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        نام و نام خانوادگی <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="مثال: علی احمدی"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:bg-white transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        شماره تماس موبایل <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="مثال: 09123456789"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:bg-white transition-all dir-ltr text-right"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">موضوع درخواست</label>
                    <select
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:bg-white transition-all"
                    >
                      <option value="consultation">مشاوره برای خرید دستگاه و سالت</option>
                      <option value="tracking">پیگیری ارسال و وضعیت سفارش پستی</option>
                      <option value="warranty">درخواست گارانتی و خدمات پس از فروش</option>
                      <option value="cooperation">همکاری در فروش و خرید عمده</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      متن پیام یا پرسش شما <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      placeholder="متن پیام خود را بنویسید..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 rounded-xl p-4 text-xs text-slate-800 focus:outline-none focus:bg-white transition-all leading-relaxed"
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="px-8 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-md flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>ارسال پیام و ثبت درخواست</span>
                  </button>

                </form>
              )}

            </div>
          </div>

        </div>

        {/* Branches Grid */}
        <div className="space-y-6">
          <div className="text-right">
            <h2 className="text-xl font-black text-slate-900">شعب حضوری و مراکز تحویل سفارش اسموک سیتی</h2>
            <p className="text-xs text-slate-500 mt-1">جهت خرید حضوری، تست طعم‌ها و دریافت سفارشات اینترنتی می‌توانید به شعب زیر مراجعه نمایید.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {branches.map((b, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 text-right hover:border-amber-400 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs border border-amber-200">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <h3 className="font-black text-slate-900 text-sm">{b.name}</h3>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed min-h-[48px]">
                  {b.address}
                </p>

                <div className="text-xs text-slate-500 space-y-1.5 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <PhoneCall className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-mono font-bold text-slate-800">{b.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{b.hours}</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-1.5">
                  {b.features.map((f, i) => (
                    <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                      ✓ {f}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
