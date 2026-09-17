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
import { Footer } from './components/Footer';
import { Product, CartItem, PageType } from './types';
import { PRODUCTS } from './data/products';
import { CheckCircle2, MessageCircle, ArrowUp } from 'lucide-react';

export default function App() {
  const [activePage, setActivePage] = useState<PageType>(PageType.HOME);
  const [selectedProduct, setSelectedProduct] = useState<Product>(PRODUCTS[0]);
  
  // Pre-populate with sample product to let user experience cart immediately
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      product: PRODUCTS[0],
      quantity: 1,
      selectedColor: PRODUCTS[0].colors[0]?.id,
      selectedResistance: PRODUCTS[0].resistances?.[0]?.id,
      withAddon: false
    }
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(['oxva-xlim-pro', 'nasty-mango-salt', 'geekvape-aegis-legend-3']);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Monitor scroll for back-to-top button
  useEffect(() => {
    const checkScroll = () => {
      setShowScrollTop(window.scrollY > 350);
    };
    window.addEventListener('scroll', checkScroll);
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
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          handleNavigate(PageType.SHOP);
        }}
      />

      {/* Main Dynamic Viewport with Smooth Page Transitions */}
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
                  featuredProduct={PRODUCTS[0]}
                  onFilterCategory={(cat) => {
                    setSelectedCategory(cat);
                    handleNavigate(PageType.SHOP);
                  }}
                />

                <FlashSale
                  products={PRODUCTS}
                  onSelectProduct={handleSelectProduct}
                  onAddToCart={(p) => handleAddToCart(p, 1)}
                  favorites={favorites}
                  onToggleFavorite={handleToggleFavorite}
                />

                <FeaturedProducts
                  products={PRODUCTS}
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
                products={PRODUCTS}
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
                products={PRODUCTS}
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
              <OrderTrackingPage />
            )}

            {activePage === PageType.BLOG && (
              <BlogPage onSelectProduct={handleSelectProduct} />
            )}

            {activePage === PageType.WISHLIST && (
              <WishlistPage
                products={PRODUCTS}
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
        onOrderCompleted={(orderId) => {
          handleClearCart();
          showToast(`سفارش شماره ${orderId} با موفقیت ثبت شد.`);
        }}
        onNavigateTracking={(orderId) => {
          setIsCheckoutOpen(false);
          handleNavigate(PageType.TRACKING);
        }}
      />

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 left-6 z-30 flex flex-col gap-3">
        
        {/* Support consultation button */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => alert('مشاوران پشتیبانی آنلاین اسموک سیتی همه روزه از ۹ الی ۲۱ آماده راهنمایی شما هستند: 021-88223344 یا پشتیبانی واتس‌اپ: 09120000000')}
          className="w-12 h-12 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-xl shadow-emerald-500/30 transition-colors"
          title="مشاوره رایگان خرید"
        >
          <MessageCircle className="w-6 h-6 stroke-[2.2]" />
        </motion.button>

        {/* Back to top */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.7, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.7, y: 15 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="w-12 h-12 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 flex items-center justify-center shadow-xl transition-colors"
              title="رفتن به بالای صفحه"
            >
              <ArrowUp className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Global Footer */}
      <Footer onNavigate={handleNavigate} />

    </div>
  );
}
