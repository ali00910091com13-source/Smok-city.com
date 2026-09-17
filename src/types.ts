export interface Product {
  id: string;
  name: string;
  nameEn: string;
  brand: string;
  category: 'pod' | 'vape' | 'salt' | 'disposable' | 'coil';
  categoryLabel: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviewCount: number;
  image: string;
  galleryImages: string[];
  inStock: boolean;
  stockCount: number;
  salesCount: number;
  badge?: string;
  badgeColor?: string;
  shortDesc: string;
  fullDesc: string;
  colors: {
    id: string;
    name: string;
    hex: string;
    imagePreview?: string;
  }[];
  resistances?: {
    id: string;
    label: string;
    ohms: string;
    desc: string;
  }[];
  specs: {
    label: string;
    value: string;
  }[];
  boxContents: string[];
  reviews: {
    id: string;
    author: string;
    rating: number;
    date: string;
    comment: string;
    verified: boolean;
    recommended: boolean;
  }[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedResistance?: string;
  withAddon?: boolean;
}

export enum PageType {
  HOME = 'home',
  SHOP = 'shop',
  DEALS = 'deals',
  PRODUCT_DETAIL = 'product-detail',
  AUTHENTICITY = 'authenticity',
  TRACKING = 'tracking',
  BLOG = 'blog',
  WISHLIST = 'wishlist',
  CONTACT = 'contact',
  CHECKOUT = 'checkout',
}

export interface Article {
  id: string;
  title: string;
  category: string;
  readTime: string;
  date: string;
  author: string;
  image: string;
  summary: string;
  content: string[];
  tags: string[];
}

export interface TrackingStep {
  title: string;
  desc: string;
  time?: string;
  completed: boolean;
  current: boolean;
}

export interface TrackingOrder {
  orderId: string;
  customerName: string;
  phone: string;
  date: string;
  status: 'processing' | 'shipped' | 'delivered';
  statusText: string;
  courier: string;
  courierPhone: string;
  shippingAddress: string;
  totalAmount: number;
  items: {
    productName: string;
    quantity: number;
    color?: string;
    price: number;
  }[];
  steps: TrackingStep[];
}

export interface AuthenticityResult {
  code: string;
  brand: string;
  productName: string;
  status: 'genuine' | 'invalid' | 'already_checked';
  checkCount: number;
  firstCheckDate: string;
  productionBatch: string;
  factoryLocation: string;
  certificateId: string;
}
