import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// Product catalog metadata for bot guidance
const STORE_PRODUCTS = [
  {
    id: 'oxva-xlim-pro',
    name: 'پاد سیستم اکسوا ایکسلیم پرو (OXVA Xlim Pro 30W)',
    category: 'پاد سیستم',
    price: '۱,۱۸۹,۰۰۰ تومان',
    summary: 'پرفروش‌ترین پاد سیستم با باتری ۱۰۰۰ میلی‌آمپر، توان ۵ تا ۳۰ وات هوشمند، کارتریج‌های ضد لیکیج V3 Top-Fill و صفحه نمایش OLED. ایده‌آل‌ترین دستگاه برای ترک سیگار و مصرف سالت نیکوتین با کام‌دهی نرم شبیه سیگار (MTL).'
  },
  {
    id: 'geekvape-spirit',
    name: 'ویپ دوکاره گیک‌ویپ اسپریت B100 (Geekvape Aegis B100)',
    category: 'ویپ حرفه‌ای',
    price: '۲,۴۵۰,۰۰۰ تومان',
    summary: 'ویپ قدرتمند با توان ۱۰۰ وات، استاندارد ضد آب، ضد گرد و غبار و ضد ضربه IP68. مخصوص افرادی که به دنبال حجم دود فراوان (Cloud Chasing)، طعم‌دهی عمیق و جویس‌های کم‌نیکوتین (۰ تا ۶ میلی‌گرم) هستند.'
  },
  {
    id: 'nasty-mango-salt',
    name: 'سالت نیکوتین نستی انبه کشمن (Nasty Cush Man Mango 30ml)',
    category: 'سالت نیکوتین',
    price: '۵۸۰,۰۰۰ تومان',
    summary: 'محبوب‌ترین سالت میوه‌ای خنک دنیا ساخت مالزی با طعم انبه رسیده استوایی به همراه نسیم خنک لو-مینت (Low Mint). در نیکوتین‌های ۳۵ و ۵۰ میلی‌گرم مناسب پاد سیستم‌ها.'
  },
  {
    id: 'elfbar-bc10000',
    name: 'پاد یکبار مصرف الف بار ۱۰۰۰۰ پاف (Elf Bar BC10000)',
    category: 'پاد یکبار مصرف',
    price: '۷۹۰,۰۰۰ تومان',
    summary: 'پاد آماده مصرف بدون نیاز به تعویض کویل یا پرکردن جویس با ۱۰,۰۰۰ پاف واقعی، نمایشگر دیجیتال درصد باتری و حجم مایع، شارژی Type-C و نیکوتین ۵۰ میلی‌گرم.'
  },
  {
    id: 'oxva-cartridges-pack',
    name: 'بسته ۳ عددی کارتریج اکسوا ایکسلیم V3 Top-Fill',
    category: 'کویل و کارتریج',
    price: '۴۹۰,۰۰۰ تومان',
    summary: 'کارتریج‌های ضد لیکیج با تکنولوژی پرکردن از بالا (Top-Fill) بدون نشتی، مقاومت‌های ۰.۶ و ۰.۸ اهم با طول عمر بالا تا ۲۵ روز.'
  },
  {
    id: 'vgod-cubano-silver',
    name: 'سالت نیکوتین ویگاد کوبانو سیلور (VGOD Cubano Silver)',
    category: 'سالت نیکوتین',
    price: '۶۱۰,۰۰۰ تومان',
    summary: 'طعم سیگار برگ کوبایی معطر در کنار نت‌های وانیل خامه‌ای، عسل و چوب دودی. بهترین پیشنهاد برای کسانی که سیگار سنتی می‌کشیدند و از طعم میوه‌ای خوششان نمی‌آید.'
  },
  {
    id: 'blvk-spearmint',
    name: 'سالت نیکوتین بی‌ال‌وی‌کی نعناع تند (BLVK Spearmint)',
    category: 'سالت نیکوتین',
    price: '۵۹۰,۰۰۰ تومان',
    summary: 'طعم خنک، باطراوت و خالص برگ‌های تازه نعناع تند بدون شیرینی زننده، ساخت کالیفرنیا آمریکا.'
  }
];

// Fallback intelligent response generator
function generateFallbackResponse(query: string, currentProductId?: string): {
  reply: string;
  recommendedProductIds: string[];
  followUpQuestions: string[];
} {
  const q = query.toLowerCase();

  // 1. Quitting smoking
  if (q.includes('سیگار') || q.includes('ترک') || q.includes('شروع') || q.includes('مبتدی')) {
    return {
      reply: `برای ترک سیگار، بهترین و موفق‌ترین روش استفاده از **پاد سیستم (Pod System)** همراه با **سالت نیکوتین (Salt Nicotine)** است.\n\n` +
        `• **دستگاه پیشنهادی:** **پاد اکسوا ایکسلیم پرو (OXVA Xlim Pro)** با توان ۳۰ وات و سنسور اتوماتیک دقیقاً حسی شبیه پک زدن به سیگار (کام‌دهی MTL) دارد و به‌هیچ‌وجه نشتی مایع ندارد.\n` +
        `• **انتخاب سالت نیکوتین:**\n` +
        `  - اگر روزی بیشتر از یک پاکت سیگار می‌کشید: سالت ۵۰ میلی‌گرم (مثل سالت تنباکویی ویگاد کوبانو یا سالت نستی انبه).\n` +
        `  - اگر کمتر از یک پاکت می‌کشید: نیکوتین ۲۵ الی ۳۵ میلی‌گرم برای شما مناسب‌تر است.`,
      recommendedProductIds: ['oxva-xlim-pro', 'vgod-cubano-silver', 'nasty-mango-salt'],
      followUpQuestions: [
        'روزی چند نخ سیگار می‌کشید؟',
        'طعم تنباکویی سنتی دوست دارید یا طعم میوه‌ای و خنک؟',
        'پاد شارژی با کارتریج می‌خواهید یا پاد یکبار مصرف آماده؟'
      ]
    };
  }

  // 2. Pod vs Vape difference
  if (q.includes('فرق') || q.includes('تفاوت') || q.includes('پاد یا ویپ') || (q.includes('پاد') && q.includes('ویپ'))) {
    return {
      reply: `تفاوت اصلی بین **پاد سیستم** و **ویپ** در ۲ فاکتور اساسی است:\n\n` +
        `۱. **پاد سیستم (Pod):** اندازه کوچک، دود ملایم، کام‌دهی مشابه سیگار، مخصوص **سالت نیکوتین** (نیکوتین ۲۰ تا ۵۰ میلی‌گرم). هدف اصلی: **ترک سیگار و رفع خماری نیکوتین** (مانند اکسوا ایکسلیم پرو).\n\n` +
        `۲. **ویپ معمولی (Vape):** توان بالا (تا ۱۰۰ وات)، دود بسیار غلیظ، مخصوص **جویس معمولی** (نیکوتین ۰ تا ۶ میلی‌گرم). هدف اصلی: **حجم دود زیاد و تفریح** (مانند گیک‌ویپ B100).`,
      recommendedProductIds: ['oxva-xlim-pro', 'geekvape-spirit'],
      followUpQuestions: [
        'آیا هدفتان ترک سیگار است یا تولید دود زیاد؟',
        'می‌خواهید دستگاه کوچک جیبی باشد یا با باتری خارجی پرقدرت؟'
      ]
    };
  }

  // 3. Salt nicotine / Juice flavors
  if (q.includes('سالت') || q.includes('جویس') || q.includes('طعم') || q.includes('میوه') || q.includes('تنباکو') || q.includes('خنک') || q.includes('انبه')) {
    if (q.includes('تنباکو') || q.includes('کلاسیک') || q.includes('گرم')) {
      return {
        reply: `برای علاقه‌مندان به طعم‌های دودی و سنگین شبیه به سیگار، **سالت ویگاد کوبانو سیلور (VGOD Cubano Silver)** با عطر سیگار برگ کوبایی معطر و نت‌های لطیف وانیل کرمی و عسل بالاترین امتیاز رضایت خریداران را دارد. این سالت هیچ طعم شیرین میوه‌ای زننده‌ای ندارد.`,
        recommendedProductIds: ['vgod-cubano-silver', 'oxva-xlim-pro'],
        followUpQuestions: [
          'نیکوتین ۲۵ میلی‌گرم ترجیح می‌دهید یا ۵۰ میلی‌گرم؟',
          'آیا نیاز به کویل یدکی هم دارید؟'
        ]
      };
    }

    return {
      reply: `پرفروش‌ترین و پرطرفدارترین سالت‌های فروشگاه ما:\n\n` +
        `• **سالت انبه کش‌من نستی (Nasty Cush Man):** شاهکار انبه استوایی با خنکی بسیار ملایم (طعم شماره ۱ بازار جهانی).\n` +
        `• **سالت نعناع تند BLVK Spearmint:** حس شادابی و طراوت بی‌نظیر برای هواداران طعم‌های نعنایی خنک و تمیز.\n` +
        `• **سالت تنباکو وانیل VGOD Cubano:** تلخی بالانس‌شده سیگار برگ با عطر وانیل.`,
      recommendedProductIds: ['nasty-mango-salt', 'blvk-spearmint', 'vgod-cubano-silver'],
      followUpQuestions: [
        'طعم میوه‌ای دوست دارید یا تنباکویی؟',
        'دستگاه پاد دارید یا پاد یکبار مصرف می‌خواهید؟'
      ]
    };
  }

  // 4. Disposable
  if (q.includes('یکبار') || q.includes('یک بار') || q.includes('الف بار') || q.includes('پاف') || q.includes('بی دردسر')) {
    return {
      reply: `اگر حوصله تعویض کویل، کارتریج یا ریختن جویس را ندارید، **پاد یکبار مصرف الف‌بار BC10000** بهترین انتخاب است:\n\n` +
        `• ۱۰,۰۰۰ پاف واقعی با طعم پایدار\n` +
        `• نمایشگر دیجیتالی درصد باتری و حجم مایع باقی‌مانده\n` +
        `• باتری قابل شارژ با درگاه Type-C و کویل مش نسل جدید Quaq`,
      recommendedProductIds: ['elfbar-bc10000'],
      followUpQuestions: [
        'کدام طعم الف‌بار را می‌پسندید (هندوانه یخ یا تمشک آبی)؟',
        'آیا دستگاه‌های قابل شارژ مجدد دائمی را هم بررسی کرده‌اید؟'
      ]
    };
  }

  // 5. Coils / Cartridges
  if (q.includes('کارتریج') || q.includes('کویل') || q.includes('اهم') || q.includes('لیکیج') || q.includes('نشتی')) {
    return {
      reply: `برای انتخاب مقاومت کارتریج یا کویل:\n\n` +
        `• **۰.۶ اهم:** کام‌دهی بازتر، طعم‌دهی بسیار غلیظ‌تر و دود بیشتر (مناسب سالت‌های با نیکوتین ۲۰ تا ۳۵ یا جویس‌های سبک).\n` +
        `• **۰.۸ اهم (پیشنهادی همه‌کاره):** بهترین تعادل بین طعم، ضربه گلو و مصرف بهینه باتری.\n` +
        `• **۱.۲ اهم:** کام‌دهی کاملاً تنگ و شبیه سیگار، ایده‌آل برای سالت‌های سنگین ۵۰ میلی‌گرم.\n\n` +
        `کارتریج‌های ورژن ۳ اکسوا ایکسلیم از بالا (Top-Fill) پر می‌شوند و کاملاً ضد نشتی هستند.`,
      recommendedProductIds: ['oxva-cartridges-pack', 'oxva-xlim-pro'],
      followUpQuestions: [
        'چه دستگاهی دارید؟',
        'از چه نوع سالتی (چند میلی‌گرم) استفاده می‌کنید؟'
      ]
    };
  }

  // 6. Current product context if provided
  if (currentProductId) {
    const matched = STORE_PRODUCTS.find(p => p.id === currentProductId);
    if (matched) {
      return {
        reply: `درباره **${matched.name}**:\n\n${matched.summary}\n\nقیمت روز: ${matched.price}\nتمامی دستگاه‌ها و سالت‌ها با ضمانت ۱۰۰٪ اصالت فیزیکی و کد رجیستری شرکتی تقدیم می‌شوند.`,
        recommendedProductIds: [matched.id],
        followUpQuestions: [
          `آیا مایلید رنگ‌ها و کارتریج‌های مناسب این محصول را بررسی کنید؟`,
          `بهترین سالت یا مکمل سازگار با این کالا را می‌خواهید ببینید؟`
        ]
      };
    }
  }

  // Default helpful overview
  return {
    reply: `سلام! من **دستیار هوشمند و مشاور تخصصی اسموک سیتی** هستم. خوشحال می‌شم کمکتون کنم تا بهترین محصول مناسب سلیقه و نیازتون رو انتخاب کنید.\n\n` +
      `می‌تونید در موارد زیر از من راهنمایی بخواهید:\n` +
      `۱. **ترک سیگار** و انتخاب دستگاه پاد مناسب با مقدار نیکوتین دقیق\n` +
      `۲. **تفاوت ویپ و پاد** و اینکه کدام برای شما مناسب‌تر است\n` +
      `۳. **پیشنهاد بهترین سالت یا جویس** (خنک، میوه‌ای، تنباکویی یا دسری)\n` +
      `۴. **انتخاب کویل و کارتریج** (۰.۶ یا ۰.۸ اهم)`,
    recommendedProductIds: ['oxva-xlim-pro', 'nasty-mango-salt', 'geekvape-spirit'],
    followUpQuestions: [
      'می‌خواهم سیگار را ترک کنم، از کجا شروع کنم؟',
      'تفاوت پاد سیستم و ویپ معمولی چیست؟',
      'پرفروش‌ترین سالت نیکوتین شما کدام است؟'
    ]
  };
}

// AI Advisor API Endpoint
app.post('/api/advisor', async (req, res) => {
  try {
    const { message, conversationHistory = [], currentProductId } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    const ai = getGenAI();

    // If Gemini is available, use gemini-3.8-flash
    if (ai) {
      try {
        const catalogContext = STORE_PRODUCTS.map(p => 
          `- ID: "${p.id}", نام: "${p.name}", دسته‌بندی: "${p.category}", قیمت: "${p.price}", توضیحات: "${p.summary}"`
        ).join('\n');

        const systemPrompt = `شما "اسموک بات" (دستیار و کارشناس تخصصی خرید در فروشگاه آنلاین اسموک سیتی) هستید.
وظیفه شما راهنمایی حرفه‌ای، صادقانه، علمی و صمیمی به خریداران در زمینه انتخاب ویپ، پاد سیستم، سالت نیکوتین، جویس، کویل و کارتریج است.

کاتالوگ محصولات موجود فروشگاه:
${catalogContext}

قوانین مهم:
۱. همواره به زبان فارسی سلیس، بسیار محترمانه، راهنما و شفاف پاسخ دهید.
۲. اگر کاربر قصد ترک سیگار دارد، پاد سیستم (مثل اکسوا ایکسلیم پرو) همراه با سالت نیکوتین (۲۵ تا ۵۰ میلی‌گرم) را پیشنهاد دهید.
۳. اگر کاربر دنبال دود زیاد و تفریح است، ویپ قدرتمند (مثل گیک‌ویپ B100) و جویس کم‌نیکوتین را پیشنهاد دهید.
۴. اگر کاربر راحتی بدون دردسر می‌خواهد، پاد یکبار مصرف الف‌بار BC10000 را پیشنهاد دهید.
۵. خروجی شما باید حتماً یک شیء JSON با ساختار زیر باشد:
{
  "reply": "متن پاسخ جامع و کاربردی به زبان فارسی با ساختار زیبا (شامل بولت‌پوینت، نکات کلیدی و توصیه مشخص)",
  "recommendedProductIds": ["شناسه محصولات پیشنهاد شده از کاتالوگ مانند oxva-xlim-pro یا nasty-mango-salt"],
  "followUpQuestions": ["۲ تا ۳ سوال پیشنهادی کوتاه که کاربر می‌تواند برای ادامه بپرسد"]
}`;

        const promptText = `تاریخچه گفتگو:\n${JSON.stringify(conversationHistory.slice(-6))}\n\nمحصول فعلی مشاهده شده: ${currentProductId || 'ندارد'}\n\nپیام جدید کاربر: "${message}"`;

        const callModel = (modelName: string) =>
          ai.models.generateContent({
            model: modelName,
            contents: promptText,
            config: {
              systemInstruction: systemPrompt,
              responseMimeType: 'application/json'
            }
          });

        let response: any = null;

        // Try gemini-3.8-flash first with reasonable 12s timeout
        try {
          const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('timeout')), 12000)
          );
          response = await Promise.race([callModel('gemini-3.8-flash'), timeoutPromise]);
        } catch {
          // Fallback to gemini-3.6-flash if 3.8 is busy or times out
          try {
            const timeoutPromise = new Promise<never>((_, reject) =>
              setTimeout(() => reject(new Error('timeout')), 9000)
            );
            response = await Promise.race([callModel('gemini-3.6-flash'), timeoutPromise]);
          } catch {
            // Proceed to curated Persian domain advisor fallback
          }
        }

        if (response) {
          const rawText = response.text || '';
          try {
            const parsed = JSON.parse(rawText);
            if (parsed && parsed.reply) {
              res.json({
                reply: parsed.reply,
                recommendedProductIds: Array.isArray(parsed.recommendedProductIds) ? parsed.recommendedProductIds : [],
                followUpQuestions: Array.isArray(parsed.followUpQuestions) ? parsed.followUpQuestions : []
              });
              return;
            }
          } catch {
            if (rawText.trim()) {
              res.json({
                reply: rawText,
                recommendedProductIds: [],
                followUpQuestions: ['سوالی درباره مشخصات فنی دارید؟', 'نحوه ارسال چطور است؟']
              });
              return;
            }
          }
        }
      } catch {
        // Silently proceed to domain fallback generator
      }
    }

    // Fallback response generator
    const fallback = generateFallbackResponse(message, currentProductId);
    res.json(fallback);
  } catch (err: any) {
    console.error('Advisor endpoint error:', err);
    res.status(500).json({
      reply: 'متاسفانه در برقراری ارتباط موقتاً اختلالی رخ داد. مشاوران اسموک سیتی همواره آماده راهنمایی شما هستند.',
      recommendedProductIds: ['oxva-xlim-pro'],
      followUpQuestions: ['پاد سیستم پیشنهادی چیست؟', 'بهترین سالت میوه‌ای کدام است؟']
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'SmokeCity API', timestamp: new Date().toISOString() });
});

// Vite middleware for dev or static serving for prod
async function setupViteOrStatic() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

setupViteOrStatic().catch((err) => {
  console.error('Failed to start server:', err);
});
