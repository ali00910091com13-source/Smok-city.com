import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { FlashSale } from './components/FlashSale';
import { FeaturedProducts } from './components/FeaturedProducts';
import { TrustFeatures } from './components/TrustFeatures';
import { FaqSection } from './components/FaqSection';
import { ShopPage } from './components/ShopPage';
import { DealsPage } from './components/DealsPage';
import { AuthenticityPage } from './components/AuthenticityPage';
import { OrderTrackingPage } from './components/OrderTrackingPage';
import { BlogPage } from './components/BlogPage';
import { WishlistPage } from './components/WishlistPage';
import { ContactPage } from './components/ContactPage';
import { ProductDetailPage } from './components/ProductDetailPage';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ProductAdvisorBot } from './components/ProductAdvisorBot';
import { Footer } from './components/Footer';
import { AdminPanel } from './components/AdminPanel';
import { AdminLoginModal } from './components/AdminLoginModal';
import { Product, CartItem, PageType, Article, TrackingOrder, FlashSaleConfig, CouponItem } from './types';
import { PRODUCTS } from './data/products';
import { CheckCircle2, ArrowUp, Shield } from 'lucide-react';
import { 
  getStoredProducts, 
  getStoredArticles, 
  getStoredOrders, 
  getStoredFlashSaleConfig, 
  getStoredCoupons,
  isAdminLoggedIn,
  saveStoredOrders
} from './utils/adminStorage';

export default function App() {
  const [activePage, setActivePage] = useState<PageType>(PageType.HOME);
  
  // Dynamic persistent states managed by Admin Panel
  const [products, setProducts] = useState<Product[]>(getStoredProducts);
  const [articles, setArticles] = useState<Article[]>(getStoredArticles);
  const [orders, setOrders] = useState<Record<string, TrackingOrder>>(getStoredOrders);
  const [flashConfig, setFlashConfig] = useState<FlashSaleConfig>(getStoredFlashSaleConfig);
  const [coupons, setCoupons] = useState<CouponItem[]>(getStoredCoupons);

  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isAdminLogged, setIsAdminLogged] = useState(isAdminLoggedIn);

  const [selectedProduct, setSelectedProduct] = useState<Product>(() => products[0] || PRODUCTS[0]);
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  
  // Pre-populate with sample product to let user experience cart immediately
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      product: products[0] || PRODUCTS[0],
      quantity: 1,
      selectedColor: (products[0] || PRODUCTS[0]).colors?.[0]?.id,
      selectedResistance: (products[0] || PRODUCTS[0]).resistances?.[0]?.id,
      withAddon: false
    }
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(['oxva-xlim-pro', 'nasty-mango-salt', 'geekvape-aegis-legend-3']);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Secret keyboard shortcut (Alt+A) and hash (#admin) trigger for Admin access
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 'a' || e.key === 'A' || e.key === 'ش' || e.key === 'م')) {
        e.preventDefault();
        setIsAdminModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    if (window.location.hash === '#admin') {
      setIsAdminModalOpen(true);
    }

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Monitor scroll for back-to-top button with 60/120fps throttle
  useEffect(() => {
    let ticking = false;
    const checkScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setShowScrollTop(window.scrollY > 350);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', checkScroll, { passive: true });
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleNavigate = (page: PageType) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart Management
  const handleAddToCart = (
    product: Product, 
    quantity: number = 1, 
    colorId?: string, 
    resistanceId?: string, 
    withAddon: boolean = false
  ) => {
    setCartItems(prev => {
      const existingIdx = prev.findIndex(item => 
        item.product.id === product.id && 
        item.selectedColor === colorId && 
        item.selectedResistance === resistanceId &&
        item.withAddon === withAddon
      );

      if (existingIdx > -1) {
        const copy = [...prev];
        copy[existingIdx].quantity += quantity;
        return copy;
      } else {
        return [...prev, {
          product,
          quantity,
          selectedColor: colorId || product.colors?.[0]?.id,
          selectedResistance: resistanceId || product.resistances?.[0]?.id,
          withAddon
        }];
      }
    });

    showToast(`کالای "${product.name}" به سبد خرید اضافه شد.`);
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(index);
    } else {
      setCartItems(prev => {
        const copy = [...prev];
        copy[index].quantity = newQty;
        return copy;
      });
    }
  };

  const handleRemoveItem = (index: number) => {
    setCartItems(prev => prev.filter((_, i) => i !== index));
    showToast('کالا از سبد خرید برداشته شد.');
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleToggleFavorite = (id: string) => {
    setFavorites(prev => {
      const exists = prev.includes(id);
      if (exists) {
        showToast('کالا از لیست نشان‌ها برداشته شد.');
        return prev.filter(item => item !== id);
      } else {
        showToast('کالا به لیست علاقه‌مندی‌ها افزوده شد.');
        return [...prev, id];
      }
    });
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setActivePage(PageType.PRODUCT_DETAIL);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart Calculations
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => {
    const itemPrice = item.product.price + (item.withAddon ? 464000 : 0);
    return sum + (itemPrice * item.quantity);
  }, 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-['Vazirmatn',sans-serif]">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 bg-white/95 border border-amber-400 text-slate-900 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-md"
          >
            <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-300">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span className="text-xs font-black">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Global Header */}
      <Header
        activePage={activePage}
        onNavigate={handleNavigate}
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        onSelectProduct={handleSelectProduct}
        favoritesCount={favorites.length}
        onOpenWishlist={() => handleNavigate(PageType.WISHLIST)}
        onOpenAdvisor={() => setIsAdvisorOpen(true)}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          handleNavigate(PageType.SHOP);
        }}
      />

      {/* Quick Admin floating badge when logged in */}
      {isAdminLogged && activePage !== PageType.ADMIN && (
        <motion.button
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleNavigate(PageType.ADMIN)}
          className="fixed top-3 left-4 z-50 bg-slate-900/90 backdrop-blur-md text-amber-400 hover:text-white border border-amber-500/40 text-xs px-3.5 py-1.5 rounded-full shadow-xl flex items-center gap-1.5 cursor-pointer font-black"
          title="ورود به پنل مدیریت"
        >
          <Shield className="w-3.5 h-3.5 text-amber-400" />
          <span>پنل مدیریت</span>
        </motion.button>
      )}

      {/* Main Dynamic Viewport */}
      {activePage === PageType.ADMIN ? (
        <AdminPanel
          products={products}
          onUpdateProducts={(newProducts) => {
            setProducts(newProducts);
            showToast('محصولات با موفقیت به‌روزرسانی شدند');
          }}
          articles={articles}
          onUpdateArticles={(newArticles) => {
            setArticles(newArticles);
            showToast('مقالات با موفقیت به‌روزرسانی شدند');
          }}
          orders={orders}
          onUpdateOrders={(newOrders) => {
            setOrders(newOrders);
            showToast('سفارش‌ها با موفقیت به‌روزرسانی شدند');
          }}
          flashConfig={flashConfig}
          onUpdateFlashConfig={(newConfig) => {
            setFlashConfig(newConfig);
            showToast('تنظیمات حراج شگفت‌انگیز ذخیره شد');
          }}
          coupons={coupons}
          onUpdateCoupons={(newCoupons) => {
            setCoupons(newCoupons);
            showToast('کدهای تخفیف با موفقیت ذخیره شدند');
          }}
          onBackToStore={() => handleNavigate(PageType.HOME)}
        />
      ) : (
        <>
          <main className="flex-1 overflow-x-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePage}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
              >
                {activePage === PageType.HOME && (
                  <>
                    <HeroBanner
                      onExploreClick={() => handleNavigate(PageType.DEALS)}
                      onSelectFeatured={handleSelectProduct}
                      featuredProduct={products[0] || PRODUCTS[0]}
                      onFilterCategory={(cat) => {
                        setSelectedCategory(cat);
                        handleNavigate(PageType.SHOP);
                      }}
                    />

                    <FlashSale
                      products={products}
                      onSelectProduct={handleSelectProduct}
                      onAddToCart={(p) => handleAddToCart(p, 1)}
                      favorites={favorites}
                      onToggleFavorite={handleToggleFavorite}
                      onViewAllDeals={() => handleNavigate(PageType.DEALS)}
                      flashConfig={flashConfig}
                    />

                    <FeaturedProducts
                      products={products}
                      selectedCategory={selectedCategory}
                      onSelectCategory={setSelectedCategory}
                      onSelectProduct={handleSelectProduct}
                      onAddToCart={(p) => handleAddToCart(p, 1)}
                      favorites={favorites}
                      onToggleFavorite={handleToggleFavorite}
                      onNavigateShop={() => handleNavigate(PageType.SHOP)}
                    />

                    <TrustFeatures />
                    <FaqSection />
                  </>
                )}

                {activePage === PageType.SHOP && (
                  <ShopPage
                    products={products}
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                    onSelectProduct={handleSelectProduct}
                    onAddToCart={(p) => handleAddToCart(p, 1)}
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                  />
                )}

                {activePage === PageType.DEALS && (
                  <DealsPage
                    products={products}
                    onSelectProduct={handleSelectProduct}
                    onAddToCart={(p) => handleAddToCart(p, 1)}
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                  />
                )}

                {activePage === PageType.AUTHENTICITY && (
                  <AuthenticityPage />
                )}

                {activePage === PageType.TRACKING && (
                  <OrderTrackingPage orders={orders} />
                )}

                {activePage === PageType.BLOG && (
                  <BlogPage 
                    articles={articles}
                    onSelectProduct={handleSelectProduct} 
                  />
                )}

                {activePage === PageType.WISHLIST && (
                  <WishlistPage
                    products={products}
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                    onSelectProduct={handleSelectProduct}
                    onAddToCart={(p) => handleAddToCart(p, 1)}
                    onNavigateShop={() => handleNavigate(PageType.SHOP)}
                  />
                )}

                {activePage === PageType.CONTACT && (
                  <ContactPage />
                )}

                {activePage === PageType.PRODUCT_DETAIL && (
                  <ProductDetailPage
                    product={selectedProduct}
                    onBack={() => handleNavigate(PageType.HOME)}
                    onAddToCart={handleAddToCart}
                    onSelectProduct={handleSelectProduct}
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                    onOpenAdvisor={() => setIsAdvisorOpen(true)}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </main>

          {/* Cart Drawer */}
          <CartDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
            onProceedCheckout={() => {
              setIsCartOpen(false);
              setIsCheckoutOpen(true);
            }}
          />

          {/* Multi-Step Checkout Modal */}
          <CheckoutModal
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
            cartItems={cartItems}
            cartTotal={cartTotal}
            coupons={coupons}
            onOrderCompleted={(orderId, orderData) => {
              handleClearCart();
              if (orderData) {
                setOrders(prev => {
                  const updated = { [orderId]: orderData, ...prev };
                  saveStoredOrders(updated);
                  return updated;
                });
              }
              showToast(`سفارش شماره ${orderId} با موفقیت ثبت شد.`);
            }}
            onNavigateTracking={(orderId) => {
              setIsCheckoutOpen(false);
              handleNavigate(PageType.TRACKING);
            }}
          />

          {/* Back to top floating button */}
          <AnimatePresence>
            {showScrollTop && !isAdvisorOpen && (
              <motion.button
                initial={{ opacity: 0, scale: 0.7, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.7, y: 15 }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="fixed bottom-22 left-6 z-30 w-12 h-12 rounded-2xl bg-white/95 hover:bg-slate-100 text-slate-800 border border-slate-200 flex items-center justify-center shadow-xl transition-colors cursor-pointer"
                title="رفتن به بالای صفحه"
              >
                <ArrowUp className="w-5 h-5" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* AI Smart Product Advisor Bot */}
          <ProductAdvisorBot
            isOpen={isAdvisorOpen}
            onOpen={() => setIsAdvisorOpen(true)}
            onClose={() => setIsAdvisorOpen(false)}
            onSelectProduct={handleSelectProduct}
            onAddToCart={(prod) => handleAddToCart(prod, 1)}
            currentProduct={activePage === PageType.PRODUCT_DETAIL ? selectedProduct : null}
          />

          {/* Global Footer */}
          <Footer 
            onNavigate={handleNavigate} 
            onOpenAdminModal={() => setIsAdminModalOpen(true)}
          />
        </>
      )}

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onLoginSuccess={() => {
          setIsAdminLogged(true);
          setIsAdminModalOpen(false);
          handleNavigate(PageType.ADMIN);
          showToast('ورود مدیر با موفقیت انجام شد');
        }}
      />

    </div>
  );
}
