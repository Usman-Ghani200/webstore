import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  Product,
  Category,
  CartItem,
  Order,
  DiscountCode,
  StoreSettings,
  Customer,
  ProductReview,
  ProductVariant,
  ShippingAddress,
  PaymentMethod
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_DISCOUNTS,
  INITIAL_SETTINGS,
  INITIAL_REVIEWS,
  INITIAL_CUSTOMERS
} from '../data/mockData';

interface StoreContextType {
  products: Product[];
  categories: Category[];
  cart: CartItem[];
  orders: Order[];
  discounts: DiscountCode[];
  settings: StoreSettings;
  reviews: ProductReview[];
  customers: Customer[];
  appliedDiscount: DiscountCode | null;
  discountError: string | null;
  isAdminLoggedIn: boolean;
  
  // Cart Actions
  addToCart: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  applyDiscountCode: (code: string) => boolean;
  removeDiscountCode: () => void;
  
  // Calculations
  cartSubtotal: number;
  discountAmount: number;
  shippingFee: number;
  cartTotal: number;
  
  // Order Actions
  createOrder: (
    shippingAddress: ShippingAddress,
    paymentMethod: PaymentMethod,
    isGuest: boolean,
    email: string
  ) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  updateOrderPaymentStatus: (orderId: string, paymentStatus: Order['paymentStatus']) => void;
  
  // Product Actions (Admin)
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewCount'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  // Settings Actions (Admin)
  updateSettings: (newSettings: Partial<StoreSettings>) => void;
  
  // Discount Actions (Admin)
  addDiscountCode: (discount: Omit<DiscountCode, 'id' | 'usageCount'>) => void;
  toggleDiscountCode: (id: string) => void;
  
  // Review Actions
  addReview: (review: Omit<ProductReview, 'id' | 'date' | 'approved'>) => void;
  approveReview: (reviewId: string) => void;
  rejectReview: (reviewId: string) => void;
  
  // Auth
  adminLogin: (password: string) => boolean;
  adminLogout: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const LOCAL_STORAGE_PREFIX = 'everydayessential_';

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from localStorage or initial mock data
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_PREFIX + 'products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_PREFIX + 'cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_PREFIX + 'orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [discounts, setDiscounts] = useState<DiscountCode[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_PREFIX + 'discounts');
    return saved ? JSON.parse(saved) : INITIAL_DISCOUNTS;
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_PREFIX + 'settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [reviews, setReviews] = useState<ProductReview[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_PREFIX + 'reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_PREFIX + 'customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [appliedDiscount, setAppliedDiscount] = useState<DiscountCode | null>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_PREFIX + 'appliedDiscount');
    return saved ? JSON.parse(saved) : null;
  });

  const [discountError, setDiscountError] = useState<string | null>(null);

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem(LOCAL_STORAGE_PREFIX + 'adminLoggedIn') === 'true';
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + 'products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + 'cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + 'orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + 'discounts', JSON.stringify(discounts));
  }, [discounts]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + 'settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + 'reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + 'customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + 'appliedDiscount', JSON.stringify(appliedDiscount));
  }, [appliedDiscount]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + 'adminLoggedIn', String(isAdminLoggedIn));
  }, [isAdminLoggedIn]);

  // Cart operations
  const addToCart = (product: Product, variant?: ProductVariant, quantity = 1) => {
    setCart((prevCart) => {
      const variantKey = variant ? variant.id : 'default';
      const cartItemId = `${product.id}-${variantKey}`;
      
      const effectivePrice = (product.salePrice ?? product.price) + (variant?.priceAdjustment ?? 0);
      
      const existingIndex = prevCart.findIndex((item) => item.id === cartItemId);
      
      if (existingIndex > -1) {
        const updated = [...prevCart];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty
        };
        return updated;
      } else {
        return [
          ...prevCart,
          {
            id: cartItemId,
            productId: product.id,
            product,
            selectedVariant: variant,
            quantity,
            price: effectivePrice
          }
        ];
      }
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedDiscount(null);
  };

  // Calculations
  const cartSubtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  let discountAmount = 0;
  if (appliedDiscount) {
    if (appliedDiscount.discountType === 'percentage') {
      discountAmount = Math.round((cartSubtotal * appliedDiscount.value) / 100);
    } else {
      discountAmount = Math.min(cartSubtotal, appliedDiscount.value);
    }
  }

  const effectiveSubtotalAfterDiscount = Math.max(0, cartSubtotal - discountAmount);
  const shippingFee = cart.length === 0
    ? 0
    : effectiveSubtotalAfterDiscount >= settings.freeShippingThreshold
      ? 0
      : settings.shippingFee;

  const cartTotal = effectiveSubtotalAfterDiscount + shippingFee;

  const applyDiscountCode = (code: string): boolean => {
    setDiscountError(null);
    const codeClean = code.trim().toUpperCase();
    const found = discounts.find((d) => d.code.toUpperCase() === codeClean);

    if (!found) {
      setDiscountError('Invalid promo code');
      return false;
    }

    if (!found.active) {
      setDiscountError('This promo code is no longer active');
      return false;
    }

    if (found.minSpend && cartSubtotal < found.minSpend) {
      setDiscountError(`Minimum order amount of Rs ${found.minSpend.toLocaleString()} required for this code`);
      return false;
    }

    setAppliedDiscount(found);
    return true;
  };

  const removeDiscountCode = () => {
    setAppliedDiscount(null);
    setDiscountError(null);
  };

  // Orders
  const createOrder = (
    shippingAddress: ShippingAddress,
    paymentMethod: PaymentMethod,
    isGuest: boolean,
    email: string
  ): Order => {
    const trackingNumber = 'EE-' + Math.floor(100000 + Math.random() * 900000);
    const orderId = 'ord-' + Date.now();

    const newOrder: Order = {
      id: orderId,
      trackingNumber,
      createdAt: new Date().toISOString(),
      items: [...cart],
      subtotal: cartSubtotal,
      discountTotal: discountAmount,
      discountCodeApplied: appliedDiscount?.code,
      shippingFee,
      total: cartTotal,
      shippingAddress,
      paymentMethod,
      paymentStatus: 'unpaid',
      status: 'pending',
      guestCheckout: isGuest,
      customerEmail: email
    };

    // Update product stock levels
    setProducts((prevProducts) =>
      prevProducts.map((p) => {
        const itemInCart = cart.filter((c) => c.productId === p.id);
        if (!itemInCart.length) return p;

        let totalQtyDeducted = 0;
        const updatedVariants = p.variants ? [...p.variants] : [];

        itemInCart.forEach((ci) => {
          totalQtyDeducted += ci.quantity;
          if (ci.selectedVariant) {
            const vIndex = updatedVariants.findIndex((v) => v.id === ci.selectedVariant!.id);
            if (vIndex > -1) {
              updatedVariants[vIndex] = {
                ...updatedVariants[vIndex],
                stock: Math.max(0, updatedVariants[vIndex].stock - ci.quantity)
              };
            }
          }
        });

        return {
          ...p,
          stock: Math.max(0, p.stock - totalQtyDeducted),
          variants: updatedVariants
        };
      })
    );

    // Update promo usage count if applied
    if (appliedDiscount) {
      setDiscounts((prev) =>
        prev.map((d) => (d.id === appliedDiscount.id ? { ...d, usageCount: d.usageCount + 1 } : d))
      );
    }

    // Add or update customer info
    setCustomers((prev) => {
      const existing = prev.find((c) => c.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        return prev.map((c) =>
          c.email.toLowerCase() === email.toLowerCase()
            ? {
                ...c,
                totalOrders: c.totalOrders + 1,
                totalSpent: c.totalSpent + cartTotal,
                addresses: [shippingAddress, ...c.addresses.filter((a) => a.address !== shippingAddress.address)]
              }
            : c
        );
      } else {
        const newCust: Customer = {
          id: 'cust-' + Date.now(),
          name: shippingAddress.fullName,
          email,
          phone: shippingAddress.phone,
          totalOrders: 1,
          totalSpent: cartTotal,
          addresses: [shippingAddress],
          createdAt: new Date().toISOString()
        };
        return [newCust, ...prev];
      }
    });

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
  };

  const updateOrderPaymentStatus = (orderId: string, paymentStatus: Order['paymentStatus']) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, paymentStatus } : o)));
  };

  // Product Admin Actions
  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewCount'>) => {
    const newProduct: Product = {
      ...productData,
      id: 'prod-' + Date.now(),
      createdAt: new Date().toISOString(),
      rating: 5.0,
      reviewCount: 0
    };
    setProducts((prev) => [newProduct, ...prev]);
  };

  const updateProduct = (id: string, productData: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...productData } : p)));
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // Settings
  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  // Discounts
  const addDiscountCode = (discountData: Omit<DiscountCode, 'id' | 'usageCount'>) => {
    const newDisc: DiscountCode = {
      ...discountData,
      id: 'disc-' + Date.now(),
      usageCount: 0
    };
    setDiscounts((prev) => [newDisc, ...prev]);
  };

  const toggleDiscountCode = (id: string) => {
    setDiscounts((prev) =>
      prev.map((d) => (d.id === id ? { ...d, active: !d.active } : d))
    );
  };

  // Reviews
  const addReview = (reviewData: Omit<ProductReview, 'id' | 'date' | 'approved'>) => {
    const newReview: ProductReview = {
      ...reviewData,
      id: 'rev-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      approved: false // Needs admin approval
    };
    setReviews((prev) => [newReview, ...prev]);
  };

  const approveReview = (reviewId: string) => {
    setReviews((prev) => {
      const target = prev.find((r) => r.id === reviewId);
      if (!target) return prev;

      const updated = prev.map((r) => (r.id === reviewId ? { ...r, approved: true } : r));

      // Recalculate product rating
      const prodReviews = updated.filter((r) => r.productId === target.productId && r.approved);
      const avgRating = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;

      setProducts((pList) =>
        pList.map((p) =>
          p.id === target.productId
            ? { ...p, rating: Number(avgRating.toFixed(1)), reviewCount: prodReviews.length }
            : p
        )
      );

      return updated;
    });
  };

  const rejectReview = (reviewId: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
  };

  // Auth
  const adminLogin = (password: string) => {
    // Simple admin password check
    if (password === 'admin123' || password === 'admin') {
      setIsAdminLoggedIn(true);
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdminLoggedIn(false);
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        cart,
        orders,
        discounts,
        settings,
        reviews,
        customers,
        appliedDiscount,
        discountError,
        isAdminLoggedIn,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        applyDiscountCode,
        removeDiscountCode,
        cartSubtotal,
        discountAmount,
        shippingFee,
        cartTotal,
        createOrder,
        updateOrderStatus,
        updateOrderPaymentStatus,
        addProduct,
        updateProduct,
        deleteProduct,
        updateSettings,
        addDiscountCode,
        toggleDiscountCode,
        addReview,
        approveReview,
        rejectReview,
        adminLogin,
        adminLogout
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
