import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Package, 
  BookOpen, 
  Flame, 
  ShoppingBag, 
  Truck, 
  Tag, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  LogOut, 
  Search, 
  Eye, 
  Shield, 
  KeyRound, 
  Sparkles, 
  Clock, 
  Settings, 
  Check, 
  X, 
  ArrowRight,
  TrendingUp,
  Boxes,
  Percent,
  Sliders,
  Store,
  ExternalLink
} from 'lucide-react';
import { 
  Product, 
  Article, 
  TrackingOrder, 
  TrackingStep, 
  FlashSaleConfig, 
  CouponItem, 
  PageType 
} from '../types';
import { formatPrice } from '../data/products';
import { 
  saveStoredProducts, 
  saveStoredArticles, 
  saveStoredOrders, 
  saveStoredFlashSaleConfig, 
  saveStoredCoupons, 
  saveAdminPin, 
  getAdminPin, 
  setAdminLoggedIn, 
  resetAllToDefault 
} from '../utils/adminStorage';

interface AdminPanelProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  articles: Article[];
  setArticles: React.Dispatch<React.SetStateAction<Article[]>>;
  orders: Record<string, TrackingOrder>;
  setOrders: React.Dispatch<React.SetStateAction<Record<string, TrackingOrder>>>;
  flashConfig: FlashSaleConfig;
  setFlashConfig: React.Dispatch<React.SetStateAction<FlashSaleConfig>>;
  coupons: CouponItem[];
  setCoupons: React.Dispatch<React.SetStateAction<CouponItem[]>>;
  onExitAdmin: () => void;
  onNavigatePage: (page: PageType) => void;
  onSelectProductForView?: (product: Product) => void;
}

type AdminTab = 'dashboard' | 'products' | 'articles' | 'deals' | 'orders' | 'settings';

export const AdminPanel: React.FC<AdminPanelProps> = ({
  products,
  setProducts,
  articles,
  setArticles,
  orders,
  setOrders,
  flashConfig,
  setFlashConfig,
  coupons,
  setCoupons,
  onExitAdmin,
  onNavigatePage,
  onSelectProductForView
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Search & Filters
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [articleSearch, setArticleSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');

  // Modals state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isNewProduct, setIsNewProduct] = useState(false);

  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [isNewArticle, setIsNewArticle] = useState(false);

  const [selectedOrderDetails, setSelectedOrderDetails] = useState<TrackingOrder | null>(null);

  // Coupon modal
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [newCoupon, setNewCoupon] = useState<CouponItem>({
    code: '',
    title: '',
    desc: '',
    minOrder: 'بدون سقف',
    discountType: 'percent',
    discountValue: 10,
    active: true
  });

  // Admin PIN management
  const [newPinInput, setNewPinInput] = useState('');
  const [pinChangeMsg, setPinChangeMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleLogout = () => {
    setAdminLoggedIn(false);
    onExitAdmin();
  };

  // ==========================================
  // PRODUCT ACTIONS
  // ==========================================
  const handleOpenNewProduct = () => {
    const freshProduct: Product = {
      id: 'prod-' + Date.now(),
      name: '',
      nameEn: '',
      brand: 'OXVA',
      category: 'pod',
      categoryLabel: 'پاد سیستم',
      price: 1200000,
      originalPrice: 1400000,
      discountPercent: 14,
      rating: 5,
      reviewCount: 1,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQW_EAWpp8_fdwNmNTpY-5qIJzr8VHbuIwOdzAw0Q0TraFWFhJ-HDLkmct1i5rzzhlxaVyqsm75qNxrx_mb0yxj_MgswOYpZevRsPr1Gupmx3WPCUHUCteHPUNXvIAsAY3A2-cDCTlYOTjwkKyZ4THC3gi55aPapCuLF-f1HSfbxm1PGdXxHCezKHOimrviat6XMVIuLaI3DeLYDhbQo-y5UVijnUmF0u-0uN1gl4cicetsAYczsYB8A',
      galleryImages: [],
      inStock: true,
      stockCount: 10,
      salesCount: 0,
      badge: 'جدید',
      badgeColor: 'bg-emerald-500',
      shortDesc: 'توضیح کوتاه محصول جدید برای نمایش در کارت...',
      fullDesc: 'توضیحات تکمیلی و مشخصات دستگاه برای صفحه جزئیات کالا...',
      colors: [
        { id: 'c1', name: 'مشکی کلاسیک', hex: '#1c1c1e' }
      ],
      specs: [
        { label: 'توان خروجی', value: '۳۰ وات' },
        { label: 'ظرفیت باتری', value: '۱۰۰۰ میلی‌آمپر' }
      ],
      boxContents: ['یک عدد دستگاه اورجینال', 'دفترچه راهنما'],
      reviews: []
    };
    setEditingProduct(freshProduct);
    setIsNewProduct(true);
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct({ ...prod });
    setIsNewProduct(false);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.name.trim()) {
      alert('لطفاً نام محصول را وارد کنید.');
      return;
    }

    setProducts(prev => {
      let updated: Product[];
      if (isNewProduct) {
        updated = [editingProduct, ...prev];
      } else {
        updated = prev.map(p => p.id === editingProduct.id ? editingProduct : p);
      }
      saveStoredProducts(updated);
      return updated;
    });

    setIsProductModalOpen(false);
    setEditingProduct(null);
    showToast(isNewProduct ? 'محصول جدید با موفقیت اضافه شد.' : 'تغییرات محصول با موفقیت ذخیره شد.');
  };

  const handleDeleteProduct = (productId: string, productName: string) => {
    if (confirm(`آیا از حذف محصول "${productName}" مطمئن هستید؟`)) {
      setProducts(prev => {
        const updated = prev.filter(p => p.id !== productId);
        saveStoredProducts(updated);
        return updated;
      });
      showToast('محصول با موفقیت حذف شد.');
    }
  };

  const handleToggleProductStock = (productId: string) => {
    setProducts(prev => {
      const updated = prev.map(p => {
        if (p.id === productId) {
          return { ...p, inStock: !p.inStock };
        }
        return p;
      });
      saveStoredProducts(updated);
      return updated;
    });
    showToast('وضعیت موجودی کالا بروزرسانی شد.');
  };

  const handleToggleProductFlashSale = (productId: string) => {
    setProducts(prev => {
      const updated = prev.map(p => {
        if (p.id === productId) {
          const hasDiscount = p.discountPercent > 0;
          return {
            ...p,
            discountPercent: hasDiscount ? 0 : 20,
            originalPrice: hasDiscount ? p.price : Math.round(p.price * 1.25)
          };
        }
        return p;
      });
      saveStoredProducts(updated);
      return updated;
    });
    showToast('وضعیت تخفیف حراج محصول بروز شد.');
  };

  // ==========================================
  // ARTICLE ACTIONS
  // ==========================================
  const handleOpenNewArticle = () => {
    const freshArticle: Article = {
      id: 'art-' + Date.now(),
      title: '',
      category: 'راهنمای خرید',
      readTime: '۴ دقیقه مطالعه',
      date: 'امروز',
      author: 'کارشناس اسموک سیتی',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC34pywzelW5aOE9ynSMmdpwSCfbMeH9nskcfpSWK6iQMV1xg8RuFj2DYHryWuldSS6MbDbiZ0kFvne8zDEOcutJQ0npgqquuHk_J3FABmAT6RyzOna_rRA8bpMBj_O6aupmw3Xa0CWDF-z0Dwmvpzf3qthFjh6xAAhhIN-UQvV7K8Ze6HzWjNOkPU86SYA5zg20o29kON5VQIyEdc6TL3bXzyHGa8pMvYyxZwLC055a8MbWrw_QcFZ3Q',
      summary: '',
      content: ['پاراگراف اول متن مقاله...'],
      tags: ['ویپ', 'سالت', 'راهنما']
    };
    setEditingArticle(freshArticle);
    setIsNewArticle(true);
    setIsArticleModalOpen(true);
  };

  const handleOpenEditArticle = (art: Article) => {
    setEditingArticle({ ...art });
    setIsNewArticle(false);
    setIsArticleModalOpen(true);
  };

  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle || !editingArticle.title.trim()) {
      alert('لطفاً عنوان مقاله را وارد کنید.');
      return;
    }

    setArticles(prev => {
      let updated: Article[];
      if (isNewArticle) {
        updated = [editingArticle, ...prev];
      } else {
        updated = prev.map(a => a.id === editingArticle.id ? editingArticle : a);
      }
      saveStoredArticles(updated);
      return updated;
    });

    setIsArticleModalOpen(false);
    setEditingArticle(null);
    showToast(isNewArticle ? 'مقاله جدید با موفقیت منتشر شد.' : 'مقاله با موفقیت ویرایش شد.');
  };

  const handleDeleteArticle = (articleId: string, title: string) => {
    if (confirm(`آیا از حذف مقاله "${title}" اطمینان دارید؟`)) {
      setArticles(prev => {
        const updated = prev.filter(a => a.id !== articleId);
        saveStoredArticles(updated);
        return updated;
      });
      showToast('مقاله با موفقیت حذف شد.');
    }
  };

  // ==========================================
  // ORDER ACTIONS & STAGE TRACKING
  // ==========================================
  const handleUpdateOrderStatus = (
    orderId: string, 
    newStatus: 'pending' | 'processing' | 'packaging' | 'shipped' | 'delivered' | 'cancelled'
  ) => {
    setOrders(prev => {
      const existing = prev[orderId];
      if (!existing) return prev;

      // Automatically craft stage description and update steps
      let statusText = '';
      const steps: TrackingStep[] = [
        { title: 'ثبت سفارش و پرداخت اینترنتی', desc: 'تراکنش با موفقیت تایید شد', completed: true, current: false },
        { title: 'بررسی اصالت و صدور فاکتور', desc: 'کارت طلایی گارانتی الحاق گردید', completed: false, current: false },
        { title: 'بسته‌بندی ضربه‌گیر انبار مرکزی', desc: 'وکیوم پلمپ و آماده‌سازی مرسوله', completed: false, current: false },
        { title: 'تحویل به ناوگان حمل و نقل', desc: 'سفیر اختصاصی یا باجه پست پیشتاز', completed: false, current: false },
        { title: 'تحویل نهایی به خریدار محترم', desc: 'دریافت حضوری بسته با امضا', completed: false, current: false },
      ];

      switch (newStatus) {
        case 'pending':
          statusText = 'در انتظار تایید پرداخت و بررسی مالی';
          steps[0].current = true;
          break;
        case 'processing':
          statusText = 'در حال بررسی تخصصی اصالت و تایید فاکتور در انبار';
          steps[0].completed = true;
          steps[1].completed = true;
          steps[1].current = true;
          break;
        case 'packaging':
          statusText = 'سفارش در حال بسته‌بندی ایمن ضد ضربه در انبار مرکزی';
          steps[0].completed = true;
          steps[1].completed = true;
          steps[2].completed = true;
          steps[2].current = true;
          break;
        case 'shipped':
          statusText = 'سفارش به سفیر پیک اختصاصی / پست پیشتاز تحویل داده شد و در مسیر است';
          steps[0].completed = true;
          steps[1].completed = true;
          steps[2].completed = true;
          steps[3].completed = true;
          steps[3].current = true;
          break;
        case 'delivered':
          statusText = 'سفارش با موفقیت به مشتری گرامی تحویل داده شد';
          steps.forEach(s => {
            s.completed = true;
            s.current = false;
          });
          steps[4].current = true;
          break;
        case 'cancelled':
          statusText = 'این سفارش بنا به درخواست لغو گردیده است';
          break;
      }

      const updatedOrder: TrackingOrder = {
        ...existing,
        status: newStatus,
        statusText,
        steps
      };

      const updatedMap = {
        ...prev,
        [orderId]: updatedOrder
      };
      saveStoredOrders(updatedMap);

      if (selectedOrderDetails?.orderId === orderId) {
        setSelectedOrderDetails(updatedOrder);
      }

      return updatedMap;
    });

    showToast(`مرحله سفارش ${orderId} تغییر کرد.`);
  };

  const handleUpdateCourier = (orderId: string, courierName: string, courierPhone: string) => {
    setOrders(prev => {
      const existing = prev[orderId];
      if (!existing) return prev;
      const updatedOrder = {
        ...existing,
        courier: courierName,
        courierPhone
      };
      const updatedMap = {
        ...prev,
        [orderId]: updatedOrder
      };
      saveStoredOrders(updatedMap);
      if (selectedOrderDetails?.orderId === orderId) {
        setSelectedOrderDetails(updatedOrder);
      }
      return updatedMap;
    });
    showToast('اطلاعات سفیر ارسال بروز شد.');
  };

  const handleCreateSampleOrder = () => {
    const randomId = 'SMC-' + Math.floor(1000 + Math.random() * 9000);
    const newSample: TrackingOrder = {
      orderId: randomId,
      customerName: 'کامران یزدانی',
      phone: '09129876543',
      date: 'هم‌اکنون',
      status: 'processing',
      statusText: 'در حال بررسی تخصصی اصالت و بسته‌بندی در انبار مرکزی',
      courier: 'پیک ۲ ساعته اکسپرس تهران',
      courierPhone: '09351234567',
      shippingAddress: 'تهران، فرمانیه، خیابان لواسانی، پلاک ۳۲، واحد ۴',
      totalAmount: 1850000,
      items: [
        { productName: products[0]?.name || 'پاد اکسوا ایکسلیم پرو', quantity: 1, price: 1189000 },
        { productName: 'سالت تنباکویی ویگاد کوبانو', quantity: 1, price: 610000 }
      ],
      steps: [
        { title: 'ثبت سفارش و پرداخت اینترنتی', desc: 'تراکنش آنلاین تایید شد', completed: true, current: false },
        { title: 'بررسی اصالت و صدور فاکتور', desc: 'گارانتی الصاق شد', completed: true, current: true },
        { title: 'بسته‌بندی ضربه‌گیر انبار مرکزی', desc: 'در صف بسته‌بندی', completed: false, current: false },
        { title: 'تحویل به ناوگان حمل و نقل', desc: 'در انتظار اعزام پیک', completed: false, current: false },
        { title: 'تحویل نهایی به خریدار محترم', desc: 'تحویل حضوری', completed: false, current: false }
      ]
    };

    setOrders(prev => {
      const updated = { [randomId]: newSample, ...prev };
      saveStoredOrders(updated);
      return updated;
    });
    showToast(`سفارش تستی جدید ${randomId} افزوده شد.`);
  };

  // ==========================================
  // DEALS & FLASH SALE ACTIONS
  // ==========================================
  const handleSaveFlashConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredFlashSaleConfig(flashConfig);
    showToast('تنظیمات بخش حراج شگفت‌انگیز ذخیره شد.');
  };

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code.trim()) {
      alert('لطفاً کد کوپن را وارد کنید.');
      return;
    }

    const formattedCode = newCoupon.code.trim().toUpperCase();
    const existing = coupons.find(c => c.code === formattedCode);
    if (existing) {
      alert('کد تخفیف با این نام قبلاً ثبت شده است.');
      return;
    }

    setCoupons(prev => {
      const updated = [...prev, { ...newCoupon, code: formattedCode }];
      saveStoredCoupons(updated);
      return updated;
    });

    setIsCouponModalOpen(false);
    setNewCoupon({
      code: '',
      title: '',
      desc: '',
      minOrder: 'بدون سقف',
      discountType: 'percent',
      discountValue: 10,
      active: true
    });
    showToast(`کد تخفیف ${formattedCode} فعال شد.`);
  };

  const handleDeleteCoupon = (code: string) => {
    setCoupons(prev => {
      const updated = prev.filter(c => c.code !== code);
      saveStoredCoupons(updated);
      return updated;
    });
    showToast(`کد تخفیف ${code} حذف شد.`);
  };

  const handleToggleCoupon = (code: string) => {
    setCoupons(prev => {
      const updated = prev.map(c => c.code === code ? { ...c, active: !c.active } : c);
      saveStoredCoupons(updated);
      return updated;
    });
  };

  // ==========================================
  // SECURITY & SETTINGS
  // ==========================================
  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPinInput.trim() || newPinInput.trim().length < 3) {
      setPinChangeMsg('رمز عبور باید حداقل ۳ رقم باشد.');
      return;
    }
    saveAdminPin(newPinInput.trim());
    setNewPinInput('');
    setPinChangeMsg('رمز عبور مدیریت با موفقیت به روز شد.');
    setTimeout(() => setPinChangeMsg(null), 3000);
  };

  const handleResetData = () => {
    if (confirm('آیا مطمئن هستید که می‌خواهید تمام داده‌های محصولات، مقالات، سفارشات و حراج را به تنظیمات کارخانه بازگردانید؟')) {
      resetAllToDefault();
      window.location.reload();
    }
  };

  // Filtered lists
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) || 
                          p.nameEn.toLowerCase().includes(productSearch.toLowerCase()) ||
                          p.brand.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCat = productCategoryFilter === 'all' || p.category === productCategoryFilter;
    return matchesSearch && matchesCat;
  });

  const filteredArticles = articles.filter(a => {
    return a.title.toLowerCase().includes(articleSearch.toLowerCase()) ||
           a.author.toLowerCase().includes(articleSearch.toLowerCase()) ||
           a.category.toLowerCase().includes(articleSearch.toLowerCase());
  });

  const orderList: TrackingOrder[] = (Object.values(orders) || []) as TrackingOrder[];
  const filteredOrders = orderList.filter(o => {
    return o.orderId.toLowerCase().includes(orderSearch.toLowerCase()) ||
           o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
           o.phone.includes(orderSearch);
  });

  // Calculate quick stats
  const totalRevenue = orderList.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.totalAmount : 0), 0);
  const flashSaleProductsCount = products.filter(p => p.discountPercent > 0).length;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-['Vazirmatn',sans-serif] text-right" dir="rtl">
      
      {/* Toast */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-slate-950 font-black px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-amber-300"
          >
            <CheckCircle2 className="w-5 h-5 text-slate-950" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Admin Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/20">
              <Shield className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-white">
                  پنل مدیریت هوشمند اسموک سیتی
                </h1>
                <span className="text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full">
                  Admin Master
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                مدیریت زنده محصولات، مجله مقالات، حراج شگفت‌انگیز و پیگیری سفارشات
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onNavigatePage(PageType.HOME)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors cursor-pointer"
            >
              <Store className="w-4 h-4 text-amber-400" />
              <span>مشاهده سایت</span>
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold border border-rose-500/30 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>خروج از ادمین</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-8 bg-slate-950 p-2 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>داشبورد و آمار</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'products'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>مدیریت محصولات ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('articles')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'articles'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>مدیریت مقالات ({articles.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('deals')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'deals'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>مدیریت بخش حراج و کوپن‌ها</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>سفارشات و پیگیری مرحله ({orderList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>امنیت و تنظیمات</span>
          </button>
        </div>

        {/* ========================================== */}
        {/* TAB 1: DASHBOARD OVERVIEW */}
        {/* ========================================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Quick Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-slate-950 border border-slate-800 p-5 rounded-3xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-slate-400 font-bold">تعداد کل محصولات</span>
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                    <Package className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-black text-white">{products.length} کالا</div>
                <p className="text-[11px] text-slate-500 mt-1">
                  {products.filter(p => p.inStock).length} محصول موجود در انبار
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-5 rounded-3xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-slate-400 font-bold">مقالات منتشر شده</span>
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                    <BookOpen className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-black text-white">{articles.length} مقاله</div>
                <p className="text-[11px] text-slate-500 mt-1">آموزش، راهنمای خرید و نقد</p>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-5 rounded-3xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-slate-400 font-bold">سفارشات ثبت شده</span>
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <Truck className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-black text-white">{orderList.length} سفارش</div>
                <p className="text-[11px] text-slate-500 mt-1">
                  مجموع فاکتور: {formatPrice(totalRevenue)}
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-5 rounded-3xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-slate-400 font-bold">کالاهای حراج شگفت‌انگیز</span>
                  <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
                    <Flame className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-black text-white">{flashSaleProductsCount} کالا</div>
                <p className="text-[11px] text-slate-500 mt-1">
                  {flashConfig.enabled ? 'بخش حراج فعال است' : 'بخش حراج غیرفعال است'}
                </p>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="bg-slate-950 border border-slate-800 p-6 rounded-3xl">
              <h3 className="text-sm font-black text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>دسترسی‌های سریع و فوری</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  onClick={handleOpenNewProduct}
                  className="p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 text-right transition-all flex items-center gap-3 cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white">افزودن محصول جدید</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">پاد، ویپ، سالت، کویل</p>
                  </div>
                </button>

                <button
                  onClick={handleOpenNewArticle}
                  className="p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 text-right transition-all flex items-center gap-3 cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white">انتشار مقاله در مجله</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">راهنمای تخصصی جدید</p>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('deals')}
                  className="p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 text-right transition-all flex items-center gap-3 cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Flame className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white">تنظیم حراج و کوپن‌ها</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">تایمر و کدهای تخفیف</p>
                  </div>
                </button>

                <button
                  onClick={handleCreateSampleOrder}
                  className="p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 text-right transition-all flex items-center gap-3 cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white">افزودن سفارش تستی</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">برای تست پیگیری مرسوله</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="bg-slate-950 border border-slate-800 p-6 rounded-3xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-400" />
                  <span>آخرین سفارش‌های ثبت شده</span>
                </h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-amber-400 hover:text-amber-300"
                >
                  مشاهده و تغییر مرحله همه سفارش‌ها ←
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-800 pb-2">
                      <th className="py-2.5 px-3 font-bold">کد سفارش</th>
                      <th className="py-2.5 px-3 font-bold">مشتری</th>
                      <th className="py-2.5 px-3 font-bold">مبلغ</th>
                      <th className="py-2.5 px-3 font-bold">وضعیت مرحله</th>
                      <th className="py-2.5 px-3 font-bold">اقدام سریع</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {orderList.slice(0, 4).map(o => (
                      <tr key={o.orderId} className="hover:bg-slate-900/50 transition-colors">
                        <td className="py-3 px-3 font-mono font-bold text-amber-400">{o.orderId}</td>
                        <td className="py-3 px-3 text-slate-200">{o.customerName}</td>
                        <td className="py-3 px-3 text-white font-bold">{formatPrice(o.totalAmount)}</td>
                        <td className="py-3 px-3">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black ${
                            o.status === 'delivered' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                            o.status === 'shipped' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                            o.status === 'packaging' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                            o.status === 'cancelled' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                            'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}>
                            {o.status === 'delivered' ? 'تحویل داده شده' :
                             o.status === 'shipped' ? 'تحویل به پیک/پست' :
                             o.status === 'packaging' ? 'بسته‌بندی در انبار' :
                             o.status === 'processing' ? 'در حال پردازش' :
                             o.status === 'cancelled' ? 'لغو شده' : 'در انتظار تایید'}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <button
                            onClick={() => {
                              setSelectedOrderDetails(o);
                              setActiveTab('orders');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[11px]"
                          >
                            جزئیات و تغییر مرحله
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 2: PRODUCTS MANAGEMENT */}
        {/* ========================================== */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            
            {/* Header & Controls */}
            <div className="bg-slate-950 border border-slate-800 p-5 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <input
                    type="text"
                    placeholder="جستجوی محصول، برند..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 pr-9 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>

                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="all">همه دسته‌ها</option>
                  <option value="pod">پاد سیستم</option>
                  <option value="vape">ویپ حرفه‌ای</option>
                  <option value="salt">سالت نیکوتین</option>
                  <option value="disposable">یکبار مصرف</option>
                  <option value="coil">کویل و کارتریج</option>
                </select>
              </div>

              <button
                onClick={handleOpenNewProduct}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-amber-500/20"
              >
                <Plus className="w-4 h-4" />
                <span>افزودن محصول جدید</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="bg-slate-900/60 text-slate-400 border-b border-slate-800">
                      <th className="py-3 px-4 font-bold">تصویر</th>
                      <th className="py-3 px-4 font-bold">نام محصول</th>
                      <th className="py-3 px-4 font-bold">دسته‌بندی</th>
                      <th className="py-3 px-4 font-bold">قیمت فروش</th>
                      <th className="py-3 px-4 font-bold">تخفیف</th>
                      <th className="py-3 px-4 font-bold">موجودی</th>
                      <th className="py-3 px-4 font-bold text-center">عملیات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredProducts.map(prod => (
                      <tr key={prod.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="py-3 px-4">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-12 h-12 rounded-xl object-cover bg-slate-900 border border-slate-800"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-white max-w-xs truncate">{prod.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">{prod.nameEn}</div>
                          <span className="text-[10px] text-amber-400 font-bold">{prod.brand}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="bg-slate-900 border border-slate-800 px-2 py-1 rounded-lg text-[10px] text-slate-300 font-bold">
                            {prod.categoryLabel || prod.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold text-white">
                          {formatPrice(prod.price)}
                        </td>
                        <td className="py-3 px-4">
                          {prod.discountPercent > 0 ? (
                            <span className="bg-rose-500/20 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded-md text-[11px] font-black">
                              {prod.discountPercent}٪ تخفیف
                            </span>
                          ) : (
                            <span className="text-slate-500 text-[11px]">بدون تخفیف</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleToggleProductStock(prod.id)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-black cursor-pointer transition-colors ${
                              prod.inStock
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            }`}
                          >
                            {prod.inStock ? `موجود (${prod.stockCount})` : 'ناموجود'}
                          </button>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleToggleProductFlashSale(prod.id)}
                              title={prod.discountPercent > 0 ? 'حذف از حراج' : 'افزودن به حراج با ۲۰٪ تخفیف'}
                              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                                prod.discountPercent > 0
                                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-rose-400'
                              }`}
                            >
                              <Flame className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleOpenEditProduct(prod)}
                              title="ویرایش محصول"
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 transition-colors cursor-pointer"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleDeleteProduct(prod.id, prod.name)}
                              title="حذف محصول"
                              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ========================================== */}
        {/* TAB 3: ARTICLES MANAGEMENT */}
        {/* ========================================== */}
        {activeTab === 'articles' && (
          <div className="space-y-6">
            
            {/* Header Controls */}
            <div className="bg-slate-950 border border-slate-800 p-5 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  placeholder="جستجوی مقالات..."
                  value={articleSearch}
                  onChange={(e) => setArticleSearch(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 pr-9 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>

              <button
                onClick={handleOpenNewArticle}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-amber-500/20"
              >
                <Plus className="w-4 h-4" />
                <span>نگارش و انتشار مقاله جدید</span>
              </button>
            </div>

            {/* Articles Grid / List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map(art => (
                <div
                  key={art.id}
                  className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden flex flex-col justify-between p-5 hover:border-slate-700 transition-colors"
                >
                  <div className="space-y-3">
                    <div className="relative h-44 rounded-2xl overflow-hidden bg-slate-900">
                      <img
                        src={art.image}
                        alt={art.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md text-amber-400 border border-amber-500/30 text-[10px] font-black px-2.5 py-1 rounded-xl">
                        {art.category}
                      </span>
                    </div>

                    <h4 className="text-sm font-black text-white line-clamp-2 leading-snug">
                      {art.title}
                    </h4>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {art.summary || art.content[0]}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/60">
                      <span>{art.author}</span>
                      <span>{art.readTime}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-4 mt-3 border-t border-slate-800">
                    <button
                      onClick={() => handleOpenEditArticle(art)}
                      className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-400 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>ویرایش مقاله</span>
                    </button>

                    <button
                      onClick={() => handleDeleteArticle(art.id, art.title)}
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ========================================== */}
        {/* TAB 4: DEALS & FLASH SALE MANAGEMENT */}
        {/* ========================================== */}
        {activeTab === 'deals' && (
          <div className="space-y-8">
            
            {/* Flash Sale Global Settings Form */}
            <div className="bg-slate-950 border border-slate-800 p-6 rounded-3xl">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
                    <Flame className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-white">
                      مدیریت جشنواره و بخش حراج شگفت‌انگیز
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      کنترل فعال بودن بنر حراج صفحه اصلی، تیتر و شمارنده زمان معکوس
                    </p>
                  </div>
                </div>

                {/* Enable / Disable Switch */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-xs font-bold text-slate-300">
                    {flashConfig.enabled ? 'بخش حراج فعال است' : 'بخش حراج غیرفعال است'}
                  </span>
                  <input
                    type="checkbox"
                    checked={flashConfig.enabled}
                    onChange={(e) => {
                      const updated = { ...flashConfig, enabled: e.target.checked };
                      setFlashConfig(updated);
                      saveStoredFlashSaleConfig(updated);
                      showToast(e.target.checked ? 'بخش حراج فعال شد.' : 'بخش حراج غیرفعال شد.');
                    }}
                    className="w-5 h-5 accent-amber-500 cursor-pointer"
                  />
                </label>
              </div>

              <form onSubmit={handleSaveFlashConfig} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    عنوان بخش حراج در صفحه اصلی
                  </label>
                  <input
                    type="text"
                    value={flashConfig.title}
                    onChange={(e) => setFlashConfig({ ...flashConfig, title: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    متن نشان ویژه (Badge)
                  </label>
                  <input
                    type="text"
                    value={flashConfig.badgeText}
                    onChange={(e) => setFlashConfig({ ...flashConfig, badgeText: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    ساعت باقی‌مانده تایمر
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="72"
                    value={flashConfig.hoursLeft}
                    onChange={(e) => setFlashConfig({ ...flashConfig, hoursLeft: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition-colors cursor-pointer"
                  >
                    ذخیره تنظیمات حراج
                  </button>
                </div>
              </form>
            </div>

            {/* Quick Flash Deal Products Selector */}
            <div className="bg-slate-950 border border-slate-800 p-6 rounded-3xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Flame className="w-4 h-4 text-rose-400" />
                  <span>محصولات دارای تخفیف حراج</span>
                </h3>
                <span className="text-xs text-slate-400">
                  برای تغییر سریع تخفیف هر کالا، روی درصد آن کلیک کنید یا در تب محصولات ویرایش نمایید.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {products.map(prod => {
                  const isDeal = prod.discountPercent > 0;
                  return (
                    <div
                      key={prod.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        isDeal
                          ? 'bg-rose-500/5 border-rose-500/40'
                          : 'bg-slate-900 border-slate-800 opacity-70'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <img src={prod.image} alt={prod.name} className="w-10 h-10 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-black text-white truncate">{prod.name}</h4>
                          <span className="text-[10px] text-slate-400">{formatPrice(prod.price)}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                        <button
                          onClick={() => handleToggleProductFlashSale(prod.id)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-black cursor-pointer ${
                            isDeal
                              ? 'bg-rose-500 text-white'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          {isDeal ? `${prod.discountPercent}٪ تخفیف فعال` : '+ فعال‌سازی تخفیف'}
                        </button>
                        
                        {isDeal && (
                          <span className="text-[10px] text-rose-400 font-bold">در بخش حراج</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Coupons Management */}
            <div className="bg-slate-950 border border-slate-800 p-6 rounded-3xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Tag className="w-5 h-5 text-amber-400" />
                  <h3 className="text-sm font-black text-white">مدیریت کدهای تخفیف و کوپن‌ها</h3>
                </div>
                <button
                  onClick={() => setIsCouponModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>افزودن کوپن جدید</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {coupons.map(c => (
                  <div
                    key={c.code}
                    className={`p-4 rounded-2xl border transition-all ${
                      c.active
                        ? 'bg-slate-900 border-amber-500/30'
                        : 'bg-slate-900/50 border-slate-800 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-sm font-black text-amber-400 tracking-wider">
                        {c.code}
                      </span>
                      <button
                        onClick={() => handleToggleCoupon(c.code)}
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          c.active
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {c.active ? 'فعال' : 'غیرفعال'}
                      </button>
                    </div>

                    <div className="text-xs font-bold text-white mb-1">{c.title}</div>
                    <div className="text-[11px] text-slate-400 mb-2">{c.desc}</div>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[10px] text-slate-500">
                      <span>حداقل سفارش: {c.minOrder}</span>
                      <button
                        onClick={() => handleDeleteCoupon(c.code)}
                        className="text-rose-400 hover:text-rose-300 font-bold cursor-pointer"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ========================================== */}
        {/* TAB 5: ORDERS & STAGE MANAGEMENT */}
        {/* ========================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            
            {/* Header & Search */}
            <div className="bg-slate-950 border border-slate-800 p-5 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  placeholder="جستجوی کد سفارش، نام مشتری یا شماره..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 pr-9 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  onClick={handleCreateSampleOrder}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-emerald-400" />
                  <span>ثبت سفارش تستی</span>
                </button>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="bg-slate-900/60 text-slate-400 border-b border-slate-800">
                      <th className="py-3.5 px-4 font-bold">کد پیگیری سفارش</th>
                      <th className="py-3.5 px-4 font-bold">مشخصات خریدار</th>
                      <th className="py-3.5 px-4 font-bold">مبلغ سفارش</th>
                      <th className="py-3.5 px-4 font-bold">تاریخ</th>
                      <th className="py-3.5 px-4 font-bold">مرحله فعلی</th>
                      <th className="py-3.5 px-4 font-bold">تغییر سریع مرحله</th>
                      <th className="py-3.5 px-4 font-bold text-center">جزئیات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredOrders.map(ord => (
                      <tr key={ord.orderId} className="hover:bg-slate-900/40 transition-colors">
                        <td className="py-4 px-4 font-mono font-black text-amber-400 text-sm">
                          {ord.orderId}
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-bold text-white">{ord.customerName}</div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">{ord.phone}</div>
                        </td>
                        <td className="py-4 px-4 font-black text-white">
                          {formatPrice(ord.totalAmount)}
                        </td>
                        <td className="py-4 px-4 text-slate-400 text-[11px]">
                          {ord.date}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black ${
                            ord.status === 'delivered' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                            ord.status === 'shipped' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                            ord.status === 'packaging' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                            ord.status === 'cancelled' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                            'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}>
                            {ord.status === 'delivered' ? 'تحویل داده شده' :
                             ord.status === 'shipped' ? 'تحویل به سفیر/پست' :
                             ord.status === 'packaging' ? 'بسته‌بندی در انبار' :
                             ord.status === 'processing' ? 'در حال پردازش' :
                             ord.status === 'cancelled' ? 'لغو شده' : 'در انتظار تایید'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <select
                            value={ord.status}
                            onChange={(e) => handleUpdateOrderStatus(ord.orderId, e.target.value as any)}
                            className="bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 font-bold focus:outline-none focus:border-amber-500 cursor-pointer"
                          >
                            <option value="pending">در انتظار تایید و پرداخت</option>
                            <option value="processing">در حال پردازش و اصالت‌سنجی</option>
                            <option value="packaging">بسته‌بندی در انبار مرکزی</option>
                            <option value="shipped">تحویل به پست / پیک اکسپرس</option>
                            <option value="delivered">تحویل نهایی به خریدار</option>
                            <option value="cancelled">لغو سفارش</option>
                          </select>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <button
                            onClick={() => setSelectedOrderDetails(ord)}
                            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
                            title="مشاهده فاکتور و اطلاعات کامل"
                          >
                            <Eye className="w-4 h-4 text-amber-400" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Order Details & Courier Edit Card */}
            {selectedOrderDetails && (
              <div className="bg-slate-950 border border-amber-500/40 p-6 rounded-3xl shadow-xl">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white">
                        جزئیات فاکتور و وضعیت سفارش <span className="font-mono text-amber-400">{selectedOrderDetails.orderId}</span>
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        آدرس: {selectedOrderDetails.shippingAddress}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedOrderDetails(null)}
                    className="text-xs font-bold text-slate-400 hover:text-white"
                  >
                    بستن جزئیات ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Items list */}
                  <div>
                    <h5 className="text-xs font-black text-slate-300 mb-2">اقلام فاکتور سفارش:</h5>
                    <div className="space-y-2 bg-slate-900 p-3 rounded-2xl border border-slate-800">
                      {selectedOrderDetails.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-slate-800 last:border-none">
                          <span className="text-slate-200 font-bold">{item.productName} ({item.quantity} عدد)</span>
                          <span className="text-amber-400 font-mono font-bold">{formatPrice(item.price)}</span>
                        </div>
                      ))}
                      <div className="flex items-center justify-between text-xs pt-2 font-black text-white">
                        <span>مجموع پرداختی:</span>
                        <span className="text-amber-400 text-sm font-mono">{formatPrice(selectedOrderDetails.totalAmount)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Courier info updater */}
                  <div>
                    <h5 className="text-xs font-black text-slate-300 mb-2">اطلاعات سفیر ارسال و پیگیری:</h5>
                    <div className="space-y-3 bg-slate-900 p-3.5 rounded-2xl border border-slate-800">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">
                          نام سفیر / شرکت پستی (کد رهگیری)
                        </label>
                        <input
                          type="text"
                          defaultValue={selectedOrderDetails.courier}
                          onBlur={(e) => handleUpdateCourier(selectedOrderDetails.orderId, e.target.value, selectedOrderDetails.courierPhone)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">
                          شماره تماس سفیر یا مرکز توزیع
                        </label>
                        <input
                          type="text"
                          defaultValue={selectedOrderDetails.courierPhone}
                          onBlur={(e) => handleUpdateCourier(selectedOrderDetails.orderId, selectedOrderDetails.courier, e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white dir-ltr font-mono"
                        />
                      </div>
                      <p className="text-[10px] text-emerald-400">
                        ✓ با خروج از هر فیلد (Blur)، اطلاعات سفیر خودکار ذخیره شده و در صفحه پیگیری سفارش برای خریدار نمایش داده می‌شود.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ========================================== */}
        {/* TAB 6: SECURITY & SETTINGS */}
        {/* ========================================== */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl mx-auto space-y-6">
            
            {/* Change Admin PIN */}
            <div className="bg-slate-950 border border-slate-800 p-6 rounded-3xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">تغییر رمز عبور پنل مدیریت (PIN)</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    رمز عبور فعلی: <span className="font-mono text-amber-400">{getAdminPin()}</span>
                  </p>
                </div>
              </div>

              <form onSubmit={handleChangePin} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    رمز عبور جدید
                  </label>
                  <input
                    type="password"
                    placeholder="مثلاً: 5678"
                    value={newPinInput}
                    onChange={(e) => setNewPinInput(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono dir-ltr"
                  />
                </div>

                {pinChangeMsg && (
                  <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-bold">
                    {pinChangeMsg}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition-colors cursor-pointer"
                >
                  ذخیره رمز عبور جدید
                </button>
              </form>
            </div>

            {/* Factory Reset */}
            <div className="bg-slate-950 border border-rose-500/30 p-6 rounded-3xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">بازنشانی کامل به داده‌های اولیه (Factory Reset)</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    بازگردانی تمام محصولات، مقالات و سفارشات به حالت اولیه اولیه فروشگاه
                  </p>
                </div>
              </div>

              <button
                onClick={handleResetData}
                className="w-full py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-black text-xs transition-colors cursor-pointer"
              >
                بازنشانی کلیه داده‌ها به پیش‌فرض
              </button>
            </div>

          </div>
        )}

      </div>

      {/* ========================================== */}
      {/* MODAL: ADD / EDIT PRODUCT */}
      {/* ========================================== */}
      <AnimatePresence>
        {isProductModalOpen && editingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsProductModalOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-7 shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                <h3 className="text-base font-black text-white">
                  {isNewProduct ? 'افزودن محصول جدید به ویترین فروشگاه' : `ویرایش محصول: ${editingProduct.name}`}
                </h3>
                <button
                  onClick={() => setIsProductModalOpen(false)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">نام فارسی کالا *</label>
                    <input
                      type="text"
                      required
                      value={editingProduct.name}
                      onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">نام انگلیسی کالا</label>
                    <input
                      type="text"
                      value={editingProduct.nameEn}
                      onChange={(e) => setEditingProduct({ ...editingProduct, nameEn: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 dir-ltr font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">برند</label>
                    <input
                      type="text"
                      value={editingProduct.brand}
                      onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">دسته‌بندی</label>
                    <select
                      value={editingProduct.category}
                      onChange={(e) => {
                        const cat = e.target.value as any;
                        const labelMap: Record<string, string> = {
                          pod: 'پاد سیستم',
                          vape: 'ویپ حرفه‌ای',
                          salt: 'سالت نیکوتین',
                          disposable: 'پاد یکبار مصرف',
                          coil: 'کویل و کارتریج'
                        };
                        setEditingProduct({
                          ...editingProduct,
                          category: cat,
                          categoryLabel: labelMap[cat] || 'پاد سیستم'
                        });
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="pod">پاد سیستم</option>
                      <option value="vape">ویپ حرفه‌ای</option>
                      <option value="salt">سالت نیکوتین</option>
                      <option value="disposable">پاد یکبار مصرف</option>
                      <option value="coil">کویل و کارتریج</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">تعداد موجودی انبار</label>
                    <input
                      type="number"
                      min="0"
                      value={editingProduct.stockCount}
                      onChange={(e) => setEditingProduct({ ...editingProduct, stockCount: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">قیمت نهایی فروش (تومان) *</label>
                    <input
                      type="number"
                      step="1000"
                      required
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">قیمت اصلی قبل از تخفیف</label>
                    <input
                      type="number"
                      step="1000"
                      value={editingProduct.originalPrice}
                      onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">درصد تخفیف (حراج)</label>
                    <input
                      type="number"
                      min="0"
                      max="90"
                      value={editingProduct.discountPercent}
                      onChange={(e) => setEditingProduct({ ...editingProduct, discountPercent: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">لینک تصویر اصلی محصول</label>
                  <input
                    type="text"
                    value={editingProduct.image}
                    onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 dir-ltr font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">توضیح کوتاه</label>
                  <textarea
                    rows={2}
                    value={editingProduct.shortDesc}
                    onChange={(e) => setEditingProduct({ ...editingProduct, shortDesc: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">نشان ویژه (Badge)</label>
                  <input
                    type="text"
                    placeholder="مثلاً: پرفروش‌ترین، پیشنهاد ویژه"
                    value={editingProduct.badge || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProduct.inStock}
                      onChange={(e) => setEditingProduct({ ...editingProduct, inStock: e.target.checked })}
                      className="w-4 h-4 accent-amber-500 cursor-pointer"
                    />
                    <span className="text-xs font-bold text-slate-300">محصول موجود و قابل سفارش است</span>
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black cursor-pointer shadow-md shadow-amber-500/20"
                  >
                    ذخیره تغییرات محصول
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================== */}
      {/* MODAL: ADD / EDIT ARTICLE */}
      {/* ========================================== */}
      <AnimatePresence>
        {isArticleModalOpen && editingArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsArticleModalOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-7 shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                <h3 className="text-base font-black text-white">
                  {isNewArticle ? 'نگارش مقاله جدید در مجله اسموک سیتی' : `ویرایش مقاله: ${editingArticle.title}`}
                </h3>
                <button
                  onClick={() => setIsArticleModalOpen(false)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveArticle} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">عنوان کامل مقاله *</label>
                  <input
                    type="text"
                    required
                    value={editingArticle.title}
                    onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">دسته‌بندی مقاله</label>
                    <select
                      value={editingArticle.category}
                      onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="راهنمای خرید">راهنمای خرید</option>
                      <option value="نگهداری و آموزش">نگهداری و آموزش</option>
                      <option value="نقد و بررسی">نقد و بررسی</option>
                      <option value="اخبار ویپینگ">اخبار ویپینگ</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">نویسنده</label>
                    <input
                      type="text"
                      value={editingArticle.author}
                      onChange={(e) => setEditingArticle({ ...editingArticle, author: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">زمان مطالعه</label>
                    <input
                      type="text"
                      value={editingArticle.readTime}
                      onChange={(e) => setEditingArticle({ ...editingArticle, readTime: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">لینک تصویر کاور مقاله</label>
                  <input
                    type="text"
                    value={editingArticle.image}
                    onChange={(e) => setEditingArticle({ ...editingArticle, image: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 dir-ltr font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">چکیده و خلاصه مقاله</label>
                  <textarea
                    rows={2}
                    value={editingArticle.summary}
                    onChange={(e) => setEditingArticle({ ...editingArticle, summary: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    متن اصلی مقاله (هر پاراگراف در یک خط جدید)
                  </label>
                  <textarea
                    rows={5}
                    value={editingArticle.content.join('\n\n')}
                    onChange={(e) => setEditingArticle({
                      ...editingArticle,
                      content: e.target.value.split('\n\n').filter(p => p.trim())
                    })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsArticleModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black cursor-pointer shadow-md shadow-amber-500/20"
                  >
                    انتشار مقاله در مجله
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================== */}
      {/* MODAL: ADD COUPON */}
      {/* ========================================== */}
      <AnimatePresence>
        {isCouponModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCouponModalOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl z-10"
            >
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                <h3 className="text-sm font-black text-white">افزودن کد تخفیف جدید</h3>
                <button
                  onClick={() => setIsCouponModalOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddCoupon} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">کد کوپن (مثلاً: OFF20) *</label>
                  <input
                    type="text"
                    required
                    placeholder="SMOKE20"
                    value={newCoupon.code}
                    onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono tracking-wider dir-ltr"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">عنوان فارسی تخفیف</label>
                  <input
                    type="text"
                    placeholder="مثلاً: ۲۰٪ تخفیف ویژه عید"
                    value={newCoupon.title}
                    onChange={(e) => setNewCoupon({ ...newCoupon, title: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">نوع تخفیف</label>
                    <select
                      value={newCoupon.discountType}
                      onChange={(e) => setNewCoupon({ ...newCoupon, discountType: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="percent">درصدی (٪)</option>
                      <option value="fixed">مبلغ ثابت (تومان)</option>
                      <option value="free_shipping">ارسال رایگان</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">مقدار تخفیف</label>
                    <input
                      type="number"
                      value={newCoupon.discountValue}
                      onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">شرط حداقل خرید</label>
                  <input
                    type="text"
                    placeholder="مثلاً: ۸۰۰,۰۰۰ ت"
                    value={newCoupon.minOrder}
                    onChange={(e) => setNewCoupon({ ...newCoupon, minOrder: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsCouponModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-black shadow-md"
                  >
                    افزودن کوپن
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
