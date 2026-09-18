import { Product, Article, TrackingOrder, FlashSaleConfig, CouponItem } from '../types';
import { PRODUCTS } from '../data/products';
import { ARTICLES, SAMPLE_TRACKING_ORDERS } from '../data/extraData';

const STORAGE_KEYS = {
  PRODUCTS: 'smokecity_products_v1',
  ARTICLES: 'smokecity_articles_v1',
  ORDERS: 'smokecity_orders_v1',
  FLASH_SALE: 'smokecity_flash_sale_v1',
  COUPONS: 'smokecity_coupons_v1',
  ADMIN_PIN: 'smokecity_admin_pin_v1',
  IS_AUTH: 'smokecity_admin_is_auth_v1',
};

export const DEFAULT_FLASH_SALE_CONFIG: FlashSaleConfig = {
  enabled: true,
  title: 'حراج شگفت‌انگیز و تخفیف‌های امروز',
  subtitle: 'تخفیف‌های استثنایی با انقضای محدود تا پایان امشب',
  badgeText: 'تعداد محدود',
  hoursLeft: 7,
  minutesLeft: 42,
  featuredProductIds: ['oxva-xlim-pro', 'geekvape-aegis-legend-3', 'vgod-cubano-silver', 'nasty-mango-salt']
};

export const DEFAULT_COUPONS: CouponItem[] = [
  {
    code: 'SMOKE10',
    title: '۱۰٪ تخفیف کل فاکتور',
    desc: 'برای خریدهای بالای ۸۰۰ هزار تومان',
    minOrder: '۸۰۰,۰۰۰ ت',
    discountType: 'percent',
    discountValue: 10,
    active: true
  },
  {
    code: 'WELCOME50',
    title: '۵۰,۰۰۰ تومان هدیه خرید اول',
    desc: 'بدون محدودیت حداقل خرید برای کاربران جدید',
    minOrder: 'بدون سقف',
    discountType: 'fixed',
    discountValue: 50000,
    active: true
  },
  {
    code: 'FREESHIP',
    title: 'ارسال اکسپرس کاملاً رایگان',
    desc: 'تحویل ۲ ساعته پایتخت یا پست پیشتاز سراسری',
    minOrder: '۶۰۰,۰۰۰ ت',
    discountType: 'free_shipping',
    discountValue: 45000,
    active: true
  }
];

export const DEFAULT_ADMIN_PIN = '1234';

// Helper for safe localStorage reading
function safeGet<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch {
    return fallback;
  }
}

// Helper for safe localStorage writing
function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to save key ${key} to localStorage`, e);
  }
}

// =================== PRODUCTS ===================
export function getStoredProducts(): Product[] {
  return safeGet<Product[]>(STORAGE_KEYS.PRODUCTS, PRODUCTS);
}

export function saveStoredProducts(products: Product[]): void {
  safeSet(STORAGE_KEYS.PRODUCTS, products);
}

// =================== ARTICLES ===================
export function getStoredArticles(): Article[] {
  return safeGet<Article[]>(STORAGE_KEYS.ARTICLES, ARTICLES);
}

export function saveStoredArticles(articles: Article[]): void {
  safeSet(STORAGE_KEYS.ARTICLES, articles);
}

// =================== ORDERS ===================
export function getStoredOrders(): Record<string, TrackingOrder> {
  return safeGet<Record<string, TrackingOrder>>(STORAGE_KEYS.ORDERS, SAMPLE_TRACKING_ORDERS);
}

export function saveStoredOrders(orders: Record<string, TrackingOrder>): void {
  safeSet(STORAGE_KEYS.ORDERS, orders);
}

// =================== FLASH SALE ===================
export function getStoredFlashSaleConfig(): FlashSaleConfig {
  return safeGet<FlashSaleConfig>(STORAGE_KEYS.FLASH_SALE, DEFAULT_FLASH_SALE_CONFIG);
}

export function saveStoredFlashSaleConfig(config: FlashSaleConfig): void {
  safeSet(STORAGE_KEYS.FLASH_SALE, config);
}

// =================== COUPONS ===================
export function getStoredCoupons(): CouponItem[] {
  return safeGet<CouponItem[]>(STORAGE_KEYS.COUPONS, DEFAULT_COUPONS);
}

export function saveStoredCoupons(coupons: CouponItem[]): void {
  safeSet(STORAGE_KEYS.COUPONS, coupons);
}

// =================== AUTH & SECURITY ===================
export function getAdminPin(): string {
  return safeGet<string>(STORAGE_KEYS.ADMIN_PIN, DEFAULT_ADMIN_PIN);
}

export function saveAdminPin(newPin: string): void {
  safeSet(STORAGE_KEYS.ADMIN_PIN, newPin);
}

export function isAdminLoggedIn(): boolean {
  return safeGet<boolean>(STORAGE_KEYS.IS_AUTH, false);
}

export function setAdminLoggedIn(status: boolean): void {
  safeSet(STORAGE_KEYS.IS_AUTH, status);
}

// =================== RESET ALL DATA ===================
export function resetAllToDefault(): void {
  safeSet(STORAGE_KEYS.PRODUCTS, PRODUCTS);
  safeSet(STORAGE_KEYS.ARTICLES, ARTICLES);
  safeSet(STORAGE_KEYS.ORDERS, SAMPLE_TRACKING_ORDERS);
  safeSet(STORAGE_KEYS.FLASH_SALE, DEFAULT_FLASH_SALE_CONFIG);
  safeSet(STORAGE_KEYS.COUPONS, DEFAULT_COUPONS);
  safeSet(STORAGE_KEYS.ADMIN_PIN, DEFAULT_ADMIN_PIN);
}
