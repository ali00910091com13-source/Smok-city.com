import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  RotateCcw, 
  ShoppingBag, 
  ExternalLink, 
  ChevronLeft, 
  HelpCircle,
  MessageSquare,
  Check,
  Flame,
  Zap
} from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS, formatPrice } from '../data/products';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  recommendedProducts?: Product[];
  followUpQuestions?: string[];
}

interface ProductAdvisorBotProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  currentProduct?: Product | null;
}

const STARTER_QUESTIONS = [
  'می‌خوام سیگار رو ترک کنم، چی پیشنهاد می‌دی؟',
  'فرق پاد سیستم با ویپ چیه؟',
  'بهترین سالت میوه‌ای و خنک کدومه؟',
  'یه سالت تنباکویی سنگین معرفی کن',
  'کارتریج ۰.۶ اهم بهتره یا ۰.۸ اهم؟'
];

export const ProductAdvisorBot: React.FC<ProductAdvisorBotProps> = ({
  isOpen,
  onClose,
  onOpen,
  onSelectProduct,
  onAddToCart,
  currentProduct
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'سلام! 👋 من **اسموک بات**، مشاور هوشمند و تخصصی فروشگاه اسموک سیتی هستم.\n\nبرای انتخاب بهترین پاد سیستم، ویپ، سالت نیکوتین یا جویس متناسب با نیاز و سلیقه‌تان آماده‌ام. چه سوالی دارید؟',
      timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
      recommendedProducts: [PRODUCTS[0], PRODUCTS[2]], // OXVA Xlim Pro & Nasty Cush Man
      followUpQuestions: [
        'می‌خوام سیگار رو ترک کنم، چی پیشنهاد می‌دی؟',
        'فرق پاد با ویپ معمولی چیه؟'
      ]
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [addedItemIds, setAddedItemIds] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen]);

  // If current product changes, offer guidance
  useEffect(() => {
    if (currentProduct && isOpen) {
      const alreadyHasContext = messages.some(m => m.text.includes(currentProduct.name));
      if (!alreadyHasContext) {
        const time = new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
        setMessages(prev => [
          ...prev,
          {
            id: `ctx-${Date.now()}`,
            sender: 'bot',
            text: `شما در حال بررسی **${currentProduct.name}** هستید. آیا مایلید درباره نحوه کام‌دهی، سالت‌های مناسب، یا انتخاب مقاومت کارتریج این دستگاه راهنماییتان کنم؟`,
            timestamp: time,
            recommendedProducts: [currentProduct],
            followUpQuestions: [
              `بهترین سالت برای ${currentProduct.name} چیه؟`,
              'کارتریج این محصول تا چند روز دوام داره؟'
            ]
          }
        ]);
      }
    }
  }, [currentProduct?.id, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    const userTime = new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: userTime
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          conversationHistory: messages.slice(-5).map(m => ({
            role: m.sender === 'bot' ? 'assistant' : 'user',
            content: m.text
          })),
          currentProductId: currentProduct?.id
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      const botTime = new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });

      // Match recommended products from database
      const matchedProducts: Product[] = [];
      if (Array.isArray(data.recommendedProductIds)) {
        for (const pid of data.recommendedProductIds) {
          const p = PRODUCTS.find(prod => prod.id === pid);
          if (p && !matchedProducts.some(mp => mp.id === p.id)) {
            matchedProducts.push(p);
          }
        }
      }

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: data.reply || 'پاسخی دریافت نشد. لطفاً سوال دیگری بپرسید.',
        timestamp: botTime,
        recommendedProducts: matchedProducts,
        followUpQuestions: data.followUpQuestions || []
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.warn('API error, providing fallback response:', err);
      // Client-side instant fallback for smooth offline UX
      const botTime = new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
      let fallbackText = 'با تشکر از پیام شما. برای مشاوره مستقیم و انتخاب دقیق‌ترین دستگاه می‌توانید از گزینه‌های پرطرفدار زیر استفاده کنید:';
      let fallbackProducts: Product[] = [PRODUCTS[0], PRODUCTS[2]];

      if (query.includes('سیگار') || query.includes('ترک')) {
        fallbackText = 'برای ترک سیگار، بهترین گزینه **پاد اکسوا ایکسلیم پرو** با کام‌دهی MTL و سنسور اتوماتیک همراه با یک سالت تنباکویی یا میوه‌ای خنک است.';
        fallbackProducts = [PRODUCTS[0], PRODUCTS[5]];
      } else if (query.includes('ویپ') && query.includes('پاد')) {
        fallbackText = 'پاد برای ترک سیگار با سالت نیکوتین بالاست، درحالی‌که ویپ برای کام‌دهی سنگین و دود غلیظ با جویس کم‌نیکوتین طراحی شده است.';
        fallbackProducts = [PRODUCTS[0], PRODUCTS[1]];
      }

      setMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: fallbackText,
          timestamp: botTime,
          recommendedProducts: fallbackProducts,
          followUpQuestions: ['سوالی در مورد نحوه ارسال و اصالت کالا دارید؟']
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'bot',
        text: 'گفتگو بازنشانی شد 🔄\nمن آماده‌ام تا به هر سوالی درباره محصولات، ترک سیگار یا انتخاب سالت و جویس پاسخ دهم.',
        timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
        recommendedProducts: [PRODUCTS[0], PRODUCTS[1]],
        followUpQuestions: STARTER_QUESTIONS.slice(0, 3)
      }
    ]);
  };

  const handleQuickAdd = (product: Product) => {
    onAddToCart(product);
    setAddedItemIds(prev => [...prev, product.id]);
    setTimeout(() => {
      setAddedItemIds(prev => prev.filter(id => id !== product.id));
    }, 2000);
  };

  // Helper to render basic markdown formatting (bold, lists)
  const renderFormattedText = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      // Process bold markers **word**
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const parsedLine = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={pIdx} className="font-black text-amber-900 bg-amber-100/50 px-1 py-0.5 rounded">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
        return (
          <div key={idx} className="flex items-start gap-1.5 my-1 text-slate-800">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
            <span className="leading-relaxed">{parsedLine}</span>
          </div>
        );
      }

      if (line.trim().match(/^\d+\./)) {
        return (
          <div key={idx} className="my-1.5 font-medium leading-relaxed text-slate-800">
            {parsedLine}
          </div>
        );
      }

      return (
        <p key={idx} className="my-1 leading-relaxed text-slate-800">
          {parsedLine}
        </p>
      );
    });
  };

  return (
    <>
      {/* Floating Trigger Button (Bottom-Left) */}
      <div className="fixed bottom-6 left-6 z-40 flex items-center gap-3">
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0, x: -15, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -15, scale: 0.9 }}
              onClick={onOpen}
              className="hidden sm:flex items-center gap-2 bg-white/95 border border-amber-300/80 text-slate-800 text-xs font-black px-3.5 py-2 rounded-2xl shadow-xl cursor-pointer hover:bg-amber-50 transition-colors select-none"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>مشاور هوشمند خرید</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.93 }}
          onClick={isOpen ? onClose : onOpen}
          aria-label="گفتگو با دستیار هوشمند خرید"
          className={`relative w-13 h-13 rounded-2xl flex items-center justify-center shadow-2xl transition-all cursor-pointer ${
            isOpen 
              ? 'bg-slate-900 text-white' 
              : 'bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 shadow-amber-500/30'
          }`}
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <>
              <Bot className="w-6 h-6 stroke-[2.2]" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
            </>
          )}
        </motion.button>
      </div>

      {/* Main Bot Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-22 left-4 sm:left-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] h-[580px] max-h-[82vh] bg-white rounded-3xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden text-right font-['Vazirmatn',sans-serif] transform-gpu"
          >
            {/* Header */}
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800 select-none">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 flex items-center justify-center shadow-md">
                  <Bot className="w-5 h-5" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-black text-white">اسموک بات</h3>
                    <span className="text-[9px] font-black bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded border border-amber-400/30">
                      مشاور هوشمند
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    آنلاین و آماده راهنمایی ۲۴/۷
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleResetChat}
                  title="شروع مجدد گفتگو"
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={onClose}
                  title="بستن"
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat Body */}
            <div 
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/70"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {messages.map((msg) => {
                const isBot = msg.sender === 'bot';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}
                  >
                    {/* Message Bubble */}
                    <div
                      className={`max-w-[88%] rounded-2xl p-3.5 text-xs shadow-xs transition-all ${
                        isBot
                          ? 'bg-white text-slate-800 border border-slate-200/90 rounded-tr-xs'
                          : 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-medium rounded-tl-xs shadow-amber-500/10'
                      }`}
                    >
                      {isBot ? renderFormattedText(msg.text) : <p className="leading-relaxed">{msg.text}</p>}
                    </div>

                    {/* Timestamp */}
                    <span className="text-[10px] text-slate-400 px-1 mt-1 font-mono">
                      {msg.timestamp}
                    </span>

                    {/* Rich Product Recommendation Cards */}
                    {isBot && msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                      <div className="w-full mt-2 space-y-2">
                        <span className="text-[10px] font-black text-slate-400 block px-1">
                          محصولات پیشنهادی مرتبط:
                        </span>
                        <div className="grid grid-cols-1 gap-2">
                          {msg.recommendedProducts.map((prod) => {
                            const isAdded = addedItemIds.includes(prod.id);
                            return (
                              <div
                                key={prod.id}
                                className="bg-white rounded-2xl p-2.5 border border-slate-200 shadow-xs flex items-center justify-between gap-3 hover:border-amber-400/80 transition-all"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <img
                                    src={prod.image}
                                    alt={prod.name}
                                    className="w-12 h-12 rounded-xl object-contain bg-slate-50 p-1 border border-slate-100 shrink-0"
                                  />
                                  <div className="min-w-0">
                                    <h4 className="text-xs font-black text-slate-900 truncate">
                                      {prod.name}
                                    </h4>
                                    <div className="flex items-center gap-2 mt-0.5">
                                      <span className="text-[11px] font-black text-amber-700 font-mono">
                                        {formatPrice(prod.price)}
                                      </span>
                                      {prod.badge && (
                                        <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-1 rounded truncate">
                                          {prod.badge}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0">
                                  <button
                                    onClick={() => {
                                      onSelectProduct(prod);
                                      onClose();
                                    }}
                                    title="مشاهده صفحه محصول"
                                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-black flex items-center gap-1 cursor-pointer transition-colors"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">بررسی</span>
                                  </button>

                                  <button
                                    onClick={() => handleQuickAdd(prod)}
                                    title="افزودن مستقیم به سبد"
                                    className={`p-2 rounded-xl text-[10px] font-black flex items-center gap-1 cursor-pointer transition-all ${
                                      isAdded
                                        ? 'bg-emerald-500 text-white'
                                        : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-xs'
                                    }`}
                                  >
                                    {isAdded ? (
                                      <>
                                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                                        <span>افزوده شد</span>
                                      </>
                                    ) : (
                                      <>
                                        <ShoppingBag className="w-3.5 h-3.5" />
                                        <span>خرید</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Follow-up Quick Action Pills */}
                    {isBot && msg.followUpQuestions && msg.followUpQuestions.length > 0 && (
                      <div className="w-full mt-2 flex flex-wrap gap-1.5">
                        {msg.followUpQuestions.map((fq, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSend(fq)}
                            disabled={isLoading}
                            className="text-[11px] font-bold bg-white hover:bg-amber-50 active:bg-amber-100 border border-slate-200 hover:border-amber-300 text-slate-700 px-2.5 py-1.5 rounded-xl transition-all flex items-center gap-1 cursor-pointer text-right shadow-2xs"
                          >
                            <span>{fq}</span>
                            <ChevronLeft className="w-3 h-3 text-slate-400 shrink-0" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Typing indicator */}
              {isLoading && (
                <div className="flex items-start gap-2">
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-tr-xs p-3 shadow-xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                    <span className="text-[11px] text-slate-400 font-bold mr-1">در حال نگارش پاسخ تخصصی...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Starter Suggestion Pills (if few messages) */}
            {messages.length <= 2 && (
              <div className="p-2.5 bg-slate-100 border-t border-slate-200/80 overflow-x-auto scrollbar-none flex gap-1.5">
                {STARTER_QUESTIONS.map((sq, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(sq)}
                    disabled={isLoading}
                    className="whitespace-nowrap bg-white border border-slate-200 hover:border-amber-400 text-slate-700 text-[10px] font-bold px-2.5 py-1.5 rounded-xl shadow-2xs hover:bg-amber-50 transition-all cursor-pointer shrink-0"
                  >
                    {sq}
                  </button>
                ))}
              </div>
            )}

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="سوال یا نیاز خود را بنویسید (مثلاً: پاد برای ترک سیگار)..."
                disabled={isLoading}
                className="flex-1 bg-slate-100 border border-slate-200 focus:border-amber-500 focus:bg-white rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition-all text-right"
              />

              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
                  inputText.trim() && !isLoading
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4 rotate-180" />
              </button>
            </form>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
