import { Article, TrackingOrder, AuthenticityResult } from '../types';

export const ARTICLES: Article[] = [
  {
    id: 'salt-vs-juice-guide',
    title: 'راهنمای جامع تفاوت سالت نیکوتین با جویس معمولی؛ کدام برای شما مناسب‌تر است؟',
    category: 'راهنمای خرید',
    readTime: '۵ دقیقه مطالعه',
    date: '۲ روز پیش',
    author: 'تیم فنی اسموک سیتی',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC34pywzelW5aOE9ynSMmdpwSCfbMeH9nskcfpSWK6iQMV1xg8RuFj2DYHryWuldSS6MbDbiZ0kFvne8zDEOcutJQ0npgqquuHk_J3FABmAT6RyzOna_rRA8bpMBj_O6aupmw3Xa0CWDF-z0Dwmvpzf3qthFjh6xAAhhIN-UQvV7K8Ze6HzWjNOkPU86SYA5zg20o29kON5VQIyEdc6TL3bXzyHGa8pMvYyxZwLC055a8MbWrw_QcFZ3Q',
    summary: 'بررسی علمی و تجربی تفاوت‌های فرمولاسیون اسید بنزوئیک، میزان جذب نیکوتین در خون، دستگاه مناسب هر مایع و نحوه انتخاب صحیح برای جایگزینی سیگار.',
    content: [
      'سالت نیکوتین (Nicotine Salt) شکل طبیعی‌تری از نیکوتین است که مستقیماً از برگ تنباکو استخراج شده و با اسید بنزوئیک ترکیب می‌شود. این ترکیب باعث کاهش pH مایع شده و امکان جذب سریع‌تر و بسیار نرم‌تر نیکوتین را بدون ایجاد سوزش شدید در گلو فراهم می‌سازد.',
      'در مقابل، جویس معمولی (Freebase E-liquid) دارای نیکوتین قلیایی با درصد پایین (معمولاً ۳ یا ۶ میلی‌گرم) است که نیازمند دستگاه‌های پرقدرت ساب‌اهم با توان ۵۰ تا ۱۰۰ وات بوده و حجم بخار بسیار متراکمی تولید می‌کند.',
      'اگر هدف شما ترک سیگار سنتی است، پاد سیستم همراه با سالت نیکوتین با دوز ۲۵ تا ۵۰ میلی‌گرم بیشترین شباهت رفتاری و ارضای نیکوتین را ایجاد خواهد کرد.'
    ],
    tags: ['سالت نیکوتین', 'جویس معمولی', 'ترک سیگار', 'پاد سیستم']
  },
  {
    id: 'prevent-coil-burn',
    title: 'چگونه مانع از سوختن زودهنگام کارتریج و کویل شویم؟ (آموزش پرایم اصولی)',
    category: 'نگهداری و آموزش',
    readTime: '۴ دقیقه مطالعه',
    date: 'هفته گذشته',
    author: 'مهندس آرشام صبوری',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPnt2gUKW7GRrj48K9Emk40YX2Q3StffU0mnaW-DMIiNY4BRMFHP3L0hzm6LOmdNNPns-c-tC7pIbA5_berq2GmGWTv8HCOE8iXAVyQJvAH5k6E-zwLMF8oehN4DpSxBVA1l3WbpX-oxhdDDWNKFTYJGWQRy9Zrofywfv2_q86-QkXL40q1LPRcUF5HteWS_bnA1MghNq_epdZ1DBCCKnVJHB7I-gY6s8K5usQmJdo5naMhvYORBnCrg',
    summary: '۵ ترفند کلیدی برای رساندن طول عمر کارتریج از ۵ روز به ۲۵ روز، آموزش زمان‌بندی خیساندن پنبه و تنظیم صحیح توان دستگاه.',
    content: [
      'بزرگ‌ترین اشتباه کاربران تازه وارد، کام گرفتن بلافاصله پس از ریختن سالت در کارتریج نو است. پنبه داخل کویل در حالت اولیه کاملاً خشک است و حتی ۱ ثانیه کام‌دهی می‌تواند الیاف پنبه را بسوزاند.',
      'همیشه پس از پر کردن مخزن، حداقل ۱۰ تا ۱۵ دقیقه صبر کنید تا الیاف پنبه کاملاً اشباع شوند. همچنین می‌توانید بدون روشن کردن دستگاه یا بدون فعال‌سازی کام، چند کام ملایم بگیرید تا فشار منفی ایجاد شده جویس را به عمق کویل بکشد.',
      'هرگز نگذارید مخزن کاملاً خالی شود؛ زمانی که سطح مایع به زیر سوراخ‌های پنبه رسید بلافاصله آن را شارژ کنید.'
    ],
    tags: ['کویل', 'کارتریج', 'طول عمر پاد', 'پرایم کردن']
  },
  {
    id: 'best-pods-2025',
    title: 'برترین پاد سیستم‌های سال ۲۰۲۵ از دید کارشناسان و خریداران',
    category: 'نقد و بررسی',
    readTime: '۶ دقیقه مطالعه',
    date: '۲ هفته پیش',
    author: 'تحریریه اسموک سیتی',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQW_EAWpp8_fdwNmNTpY-5qIJzr8VHbuIwOdzAw0Q0TraFWFhJ-HDLkmct1i5rzzhlxaVyqsm75qNxrx_mb0yxj_MgswOYpZevRsPr1Gupmx3WPCUHUCteHPUNXvIAsAY3A2-cDCTlYOTjwkKyZ4THC3gi55aPapCuLF-f1HSfbxm1PGdXxHCezKHOimrviat6XMVIuLaI3DeLYDhbQo-y5UVijnUmF0u-0uN1gl4cicetsAYczsYB8A',
    summary: 'مقایسه عملکرد، باتری، عدم نشتی کارتریج و کیفیت طعم‌دهی در مدل‌های پرچمدار اکسوا، وپرسو و گیک‌ویپ.',
    content: [
      'در سال جاری، تکنولوژی کارتریج‌های ضد لیکیج به تکامل رسید. اکسوا با سری ایکسلیم پرو ۲ و کارتریج‌های Top-Fill استاندارد جدیدی در طعم‌دهی ماندگار تعریف کرد.',
      'همچنین اضافه شدن نمایشگرهای هوشمند رنگی و باتری‌های فراتر از ۱۰۰۰ میلی‌آمپر ساعت باعث شد کاربران بدون نگرانی از اتمام شارژ روز کاری خود را سپری کنند.'
    ],
    tags: ['اکسوا', 'ایکسلیم پرو', 'مقایسه پاد', 'خرید پاد']
  }
];

export const SAMPLE_TRACKING_ORDERS: Record<string, TrackingOrder> = {
  'SMC-9941': {
    orderId: 'SMC-9941',
    customerName: 'نوید علیزاده',
    phone: '0912***4421',
    date: 'امروز، ساعت ۱۰:۳۰',
    status: 'shipped',
    statusText: 'تحویل به سفیر پیک اکسپرس و در مسیر تحویل',
    courier: 'پیک ویژه ۲ ساعته تهران (سفیر: علی رحمانی)',
    courierPhone: '09351234567',
    shippingAddress: 'تهران، سعادت‌آباد، میدان کاج، خیابان سرو غربی، پلاک ۴۲، واحد ۵',
    totalAmount: 1679000,
    items: [
      { productName: 'پاد سیستم اکسوا ایکسلیم پرو (کربن بلک)', quantity: 1, color: 'مشکی فیبر کربن', price: 1189000 },
      { productName: 'بسته ۳ عددی کارتریج اکسوا V3', quantity: 1, price: 490000 }
    ],
    steps: [
      { title: 'ثبت سفارش و پرداخت اینترنتی', desc: 'تراکنش با موفقیت در شاپرک تایید شد', time: '۱۰:۳۰', completed: true, current: false },
      { title: 'تایید اصالت کالا و صدور فاکتور', desc: 'کارت گارانتی و بارکد الصاق گردید', time: '۱۰:۴۵', completed: true, current: false },
      { title: 'بسته‌بندی ضربه‌گیر در انبار مرکزی', desc: 'بسته با وکیوم پلمپ آماده خروج شد', time: '۱۱:۱۰', completed: true, current: false },
      { title: 'تحویل به سفیر اختصاصی اسموک سیتی', desc: 'مرسوله در دست سفیر پیک اکسپرس است', time: '۱۱:۳۵', completed: true, current: true },
      { title: 'تحویل نهایی به خریدار محترم', desc: 'تحویل حضوری با دریافت کد تحویل پیامکی', time: 'تخمین: ۱۲:۳۰', completed: false, current: false }
    ]
  },
  'SMC-8820': {
    orderId: 'SMC-8820',
    customerName: 'مهرداد شریفی',
    phone: '0936***8812',
    date: 'دیروز، ساعت ۱۵:۲۰',
    status: 'delivered',
    statusText: 'سفارش با موفقیت به مشتری گرامی تحویل گردید',
    courier: 'پست پیشتاز سراسری (کد رهگیری: 8920194820129)',
    courierPhone: '193',
    shippingAddress: 'اصفهان، خیابان چهارباغ بالا، کوچه بهار، پلاک ۱۸',
    totalAmount: 1190000,
    items: [
      { productName: 'سالت نیکوتین نستی انبه کشمن ۳۰ میل', quantity: 1, price: 580000 },
      { productName: 'سالت نیکوتین ویگاد کوبانو سیلور', quantity: 1, price: 610000 }
    ],
    steps: [
      { title: 'ثبت سفارش و پرداخت اینترنتی', desc: 'تراکنش با موفقیت تایید شد', time: '۱۵:۲۰', completed: true, current: false },
      { title: 'تایید اصالت کالا و صدور فاکتور', desc: 'پلمپ و بررسی اصالت', time: '۱۵:۴۰', completed: true, current: false },
      { title: 'بسته‌بندی در انبار مرکزی', desc: 'تحویل به باجه پست مرکزی', time: '۱۶:۳۰', completed: true, current: false },
      { title: 'در مسیر توزیع پستی', desc: 'رسیده به باجه توزیع مقصد', time: '۰۹:۱۵', completed: true, current: false },
      { title: 'تحویل نهایی به خریدار محترم', desc: 'با امضای مشتری تحویل شد', time: '۱۳:۴۰', completed: true, current: false }
    ]
  }
};

export const AUTHENTICITY_DATABASE: Record<string, AuthenticityResult> = {
  '8492-1102-9938-7711': {
    code: '8492-1102-9938-7711',
    brand: 'OXVA Tech Global',
    productName: 'پاد سیستم اورجینال اکسوا ایکسلیم پرو ۳۰ وات',
    status: 'genuine',
    checkCount: 1,
    firstCheckDate: 'هم‌اکنون (اولین استعلام اصالت توسط شما)',
    productionBatch: 'OX-2025/B94-Shenzhen',
    factoryLocation: 'کارخانه رسمی OXVA در شنزن تحت لایسنس بین‌المللی',
    certificateId: 'CERT-OXVA-984021'
  },
  '5519-8830-4412-2291': {
    code: '5519-8830-4412-2291',
    brand: 'Geekvape Co., Ltd',
    productName: 'ویپ گیک‌ویپ ایجیس اسپریت B100 صد وات',
    status: 'genuine',
    checkCount: 1,
    firstCheckDate: 'هم‌اکنون (استعلام رسمی)',
    productionBatch: 'GV-IP68-2025Q1',
    factoryLocation: 'خط تولید گیک‌ویپ با استاندارد نظامی IP68',
    certificateId: 'CERT-GV-551922'
  },
  '3318-7742-9910-4482': {
    code: '3318-7742-9910-4482',
    brand: 'Nasty Worldwide Malaysia',
    productName: 'سالت نیکوتین نستی انبه کش‌من Cush Man ۳۰ میل',
    status: 'genuine',
    checkCount: 1,
    firstCheckDate: 'هم‌اکنون',
    productionBatch: 'NW-MY-CUSH-2025-02',
    factoryLocation: 'لابراتوار انحصاری Nasty در تامپین مالزی',
    certificateId: 'CERT-NASTY-331877'
  }
};
