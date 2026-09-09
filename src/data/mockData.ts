import type { Category, Product, DiscountCode, StoreSettings, Customer, ProductReview } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-home',
    name: 'Home Essentials',
    slug: 'home',
    image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=80',
    description: 'Storage, decor, organization and daily utilities for every room.',
    itemCount: 8
  },
  {
    id: 'cat-kitchen',
    name: 'Kitchen & Dining',
    slug: 'kitchen',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
    description: 'Cookware, organizers, dispensers, and modern tableware.',
    itemCount: 10
  },
  {
    id: 'cat-personal-care',
    name: 'Personal Care',
    slug: 'personal-care',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
    description: 'Skincare, grooming, hygiene, and daily body care essentials.',
    itemCount: 7
  },
  {
    id: 'cat-wellness',
    name: 'Wellness & Health',
    slug: 'wellness',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80',
    description: 'Aromatherapy, herbal teas, supplements and relaxation products.',
    itemCount: 6
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Automatic Soap Dispenser Touchless',
    slug: 'automatic-soap-dispenser-touchless',
    category: 'Home',
    price: 1850,
    salePrice: 1499,
    images: [
      'https://images.unsplash.com/photo-1608248597260-264639912061?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Infrared motion sensor automatic foam soap dispenser. Sleek waterproof design suitable for kitchen and bathroom countertops. Uses 4x AA batteries or USB rechargeable.',
    shortDescription: 'Touchless infrared foaming soap dispenser for modern homes.',
    featured: true,
    isNewArrival: false,
    stock: 24,
    variants: [
      { id: 'v-1-1', name: 'Matt White', type: 'scent', stock: 12 },
      { id: 'v-1-2', name: 'Chrome Silver', type: 'scent', stock: 12, priceAdjustment: 150 }
    ],
    rating: 4.8,
    reviewCount: 19,
    createdAt: '2026-01-10T10:00:00Z'
  },
  {
    id: 'prod-2',
    name: 'Stainless Steel Oil Spray Dispenser 500ml',
    slug: 'stainless-steel-oil-spray-dispenser',
    category: 'Kitchen',
    price: 1200,
    salePrice: 950,
    images: [
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Food grade 304 stainless steel oil sprayer bottle. Ideal for air fryers, salads, cooking, and roasting. Gives an even fine mist spray saving oil and reducing excess calories.',
    shortDescription: 'Precision cooking oil sprayer for air fryers and healthy meals.',
    featured: true,
    isNewArrival: true,
    stock: 45,
    variants: [
      { id: 'v-2-1', name: '350ml Standard', type: 'size', stock: 20 },
      { id: 'v-2-2', name: '500ml Large', type: 'size', stock: 25, priceAdjustment: 200 }
    ],
    rating: 4.7,
    reviewCount: 31,
    createdAt: '2026-02-01T12:00:00Z'
  },
  {
    id: 'prod-3',
    name: 'Pure Organic Lavender Essential Oil',
    slug: 'pure-organic-lavender-essential-oil',
    category: 'Wellness',
    price: 1650,
    images: [
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80'
    ],
    description: '100% pure steam-distilled French lavender essential oil. Perfect for aroma diffusers, bath water, sleep aid, and stress relief.',
    shortDescription: 'Pure therapeutic grade lavender essential oil for sleep and relaxation.',
    featured: true,
    isNewArrival: false,
    stock: 18,
    variants: [
      { id: 'v-3-1', name: '10ml Bottle', type: 'size', stock: 10 },
      { id: 'v-3-2', name: '30ml Bottle', type: 'size', stock: 8, priceAdjustment: 850 }
    ],
    rating: 4.9,
    reviewCount: 42,
    createdAt: '2026-01-15T09:00:00Z'
  },
  {
    id: 'prod-4',
    name: 'Bamboo Fibre Face & Body Towels Set of 4',
    slug: 'bamboo-fibre-face-body-towels-set',
    category: 'Personal Care',
    price: 2400,
    salePrice: 1990,
    images: [
      'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Ultra-soft, ultra-absorbent eco-friendly bamboo fiber towel set. Naturally antibacterial and gentle on sensitive skin. Quick drying.',
    shortDescription: 'Ultra-soft antibacterial bamboo towel set gentle on all skin types.',
    featured: false,
    isNewArrival: true,
    stock: 5,
    variants: [
      { id: 'v-4-1', name: 'Pastel Beige & Grey', type: 'scent', stock: 2 },
      { id: 'v-4-2', name: 'Ocean Blue & White', type: 'scent', stock: 3 }
    ],
    rating: 4.6,
    reviewCount: 14,
    createdAt: '2026-02-10T14:00:00Z'
  },
  {
    id: 'prod-5',
    name: 'Aroma Ultrasonic Air Humidifier 300ml',
    slug: 'aroma-ultrasonic-air-humidifier',
    category: 'Wellness',
    price: 3200,
    salePrice: 2850,
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Whisper-quiet ultrasonic cool mist humidifier with 7 LED mood light colors. Ideal for bedroom, office desk, and room aromatherapy.',
    shortDescription: 'Cool mist ultrasonic humidifier with RGB LED ambiance lighting.',
    featured: true,
    isNewArrival: false,
    stock: 14,
    variants: [
      { id: 'v-5-1', name: 'Dark Wood Grain', type: 'scent', stock: 7 },
      { id: 'v-5-2', name: 'Light Wood Grain', type: 'scent', stock: 7 }
    ],
    rating: 4.9,
    reviewCount: 28,
    createdAt: '2026-01-20T11:00:00Z'
  },
  {
    id: 'prod-6',
    name: 'Multi-function Kitchen Organizer Rack',
    slug: 'multi-function-kitchen-organizer-rack',
    category: 'Kitchen',
    price: 2990,
    images: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Heavy duty carbon steel 2-tier countertop storage shelf for spices, condiments, and kitchen jars. Rust-proof coating.',
    shortDescription: '2-tier space saving kitchen countertop spice organizer shelf.',
    featured: false,
    isNewArrival: true,
    stock: 30,
    variants: [],
    rating: 4.5,
    reviewCount: 9,
    createdAt: '2026-02-15T08:00:00Z'
  }
];

export const INITIAL_DISCOUNTS: DiscountCode[] = [
  {
    id: 'disc-1',
    code: 'WELCOME10',
    discountType: 'percentage',
    value: 10,
    minSpend: 0,
    active: true,
    usageCount: 48
  },
  {
    id: 'disc-2',
    code: 'SAVE500',
    discountType: 'fixed',
    value: 500,
    minSpend: 3500,
    active: true,
    usageCount: 12
  }
];

export const INITIAL_SETTINGS: StoreSettings = {
  heroBanner: {
    title: 'Everyday Essentials for Your Modern Pakistani Home',
    subtitle: 'Quality kitchenware, home organizers, personal care & wellness products delivered fast across Pakistan.',
    buttonText: 'Shop New Arrivals',
    buttonLink: '/shop',
    imageUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80'
  },
  featuredPickIds: ['prod-1', 'prod-2', 'prod-3', 'prod-5'],
  shippingFee: 250,
  freeShippingThreshold: 3000
};

export const INITIAL_REVIEWS: ProductReview[] = [
  {
    id: 'rev-1',
    productId: 'prod-1',
    customerName: 'Ayesha Khan',
    rating: 5,
    comment: 'SubhanAllah! Delivery was so quick to Lahore. The soap dispenser works perfectly and looks very premium on our sink.',
    date: '2026-02-01',
    approved: true
  },
  {
    id: 'rev-2',
    productId: 'prod-2',
    customerName: 'Muhammad Rizwan',
    rating: 5,
    comment: 'Great oil sprayer for my air fryer! Saves so much oil during frying. Highly recommended product from Everyday Essential.',
    date: '2026-02-05',
    approved: true
  },
  {
    id: 'rev-3',
    productId: 'prod-3',
    customerName: 'Saima Ali',
    rating: 5,
    comment: 'The scent of this lavender oil is authentic and pure. Works really well with my diffuser at night.',
    date: '2026-02-08',
    approved: true
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Ayesha Khan',
    email: 'ayesha.khan@example.com',
    phone: '03001234567',
    totalOrders: 3,
    totalSpent: 6450,
    addresses: [
      {
        fullName: 'Ayesha Khan',
        phone: '03001234567',
        email: 'ayesha.khan@example.com',
        address: 'House 45, Block C, Model Town',
        city: 'Lahore',
        province: 'Punjab',
        postalCode: '54000'
      }
    ],
    createdAt: '2026-01-05'
  },
  {
    id: 'cust-2',
    name: 'Bilal Ahmed',
    email: 'bilal.a@example.com',
    phone: '03219876543',
    totalOrders: 1,
    totalSpent: 2850,
    addresses: [
      {
        fullName: 'Bilal Ahmed',
        phone: '03219876543',
        email: 'bilal.a@example.com',
        address: 'Flat 302, Falcon Complex, Gulshan-e-Iqbal',
        city: 'Karachi',
        province: 'Sindh',
        postalCode: '75300'
      }
    ],
    createdAt: '2026-01-20'
  }
];
