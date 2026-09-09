export interface ProductVariant {
  id: string;
  name: string; // e.g. "500ml", "1 Liter", "Lavender", "Jasmine"
  type: 'size' | 'scent' | 'option';
  priceAdjustment?: number; // adjustment from base price
  stock: number;
}

export interface ProductReview {
  id: string;
  productId: string;
  customerName: string;
  rating: number; // 1-5
  comment: string;
  date: string;
  approved: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string; // "Home", "Kitchen", "Personal Care", "Wellness"
  price: number; // in PKR (Rs)
  salePrice?: number; // optional sale price
  images: string[];
  description: string;
  shortDescription: string;
  featured: boolean;
  isNewArrival: boolean;
  stock: number;
  variants: ProductVariant[];
  rating: number;
  reviewCount: number;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  itemCount: number;
}

export interface CartItem {
  id: string; // unique cart item id (product.id + variant.id)
  productId: string;
  product: Product;
  selectedVariant?: ProductVariant;
  quantity: number;
  price: number; // effective unit price
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  province: string;
  postalCode?: string;
  notes?: string;
}

export type PaymentMethod = 'cod' | 'jazzcash' | 'easypaisa';
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'fulfilled' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded';

export interface Order {
  id: string;
  trackingNumber: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  discountTotal: number;
  discountCodeApplied?: string;
  shippingFee: number;
  total: number;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  guestCheckout: boolean;
  customerEmail: string;
}

export interface DiscountCode {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number; // e.g. 10 for 10% or 500 for Rs 500
  minSpend?: number;
  active: boolean;
  usageCount: number;
}

export interface StoreSettings {
  heroBanner: {
    title: string;
    subtitle: string;
    buttonText: string;
    buttonLink: string;
    imageUrl: string;
  };
  featuredPickIds: string[];
  shippingFee: number;
  freeShippingThreshold: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  addresses: ShippingAddress[];
  createdAt: string;
}
