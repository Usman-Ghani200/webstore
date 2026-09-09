import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Tag,
  Star,
  Image,
  BarChart3,
  LogOut,
  AlertTriangle,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  XCircle,
  ShieldCheck
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import type { OrderStatus, PaymentStatus, Product } from '../types';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    isAdminLoggedIn,
    adminLogout,
    products,
    orders,
    customers,
    discounts,
    reviews,
    settings,
    updateOrderStatus,
    updateOrderPaymentStatus,
    addProduct,
    updateProduct,
    deleteProduct,
    addDiscountCode,
    toggleDiscountCode,
    approveReview,
    rejectReview,
    updateSettings
  } = useStore();

  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'products' | 'orders' | 'customers' | 'discounts' | 'reviews' | 'banner' | 'analytics'
  >('dashboard');

  // Product modal / edit state
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [prodForm, setProdForm] = useState({
    name: '',
    category: 'Home',
    price: 1000,
    salePrice: '',
    description: '',
    shortDescription: '',
    stock: 20,
    featured: false,
    isNewArrival: true,
    images: [
      'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=80'
    ],
    newImageUrl: '',
    variantName: '',
    variantPriceAdj: 0
  });

  // Discount form state
  const [discountForm, setDiscountForm] = useState({
    code: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: 10,
    minSpend: 0
  });

  // Banner settings state
  const [bannerForm, setBannerForm] = useState({
    title: settings.heroBanner.title,
    subtitle: settings.heroBanner.subtitle,
    buttonText: settings.heroBanner.buttonText,
    imageUrl: settings.heroBanner.imageUrl,
    shippingFee: settings.shippingFee,
    freeShippingThreshold: settings.freeShippingThreshold
  });

  if (!isAdminLoggedIn) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Admin Sign In Required</h2>
        <p className="text-xs text-slate-500">You must be logged in as an administrator to access this area.</p>
        <Link to="/admin/login" className="inline-block bg-slate-900 text-white font-bold text-xs px-6 py-2.5 rounded-xl">
          Go to Admin Sign In
        </Link>
      </div>
    );
  }

  // Dashboard Stats Calculations
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrdersCount = orders.length;
  const lowStockProducts = products.filter((p) => p.stock <= 5);
  const pendingReviews = reviews.filter((r) => !r.approved);

  const openNewProductModal = () => {
    setEditingProductId(null);
    setProdForm({
      name: '',
      category: 'Home',
      price: 1000,
      salePrice: '',
      description: '',
      shortDescription: '',
      stock: 20,
      featured: false,
      isNewArrival: true,
      images: [
        'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=80'
      ],
      newImageUrl: '',
      variantName: 'Default',
      variantPriceAdj: 0
    });
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (product: Product) => {
    setEditingProductId(product.id);
    setProdForm({
      name: product.name,
      category: product.category,
      price: product.price,
      salePrice: product.salePrice ? String(product.salePrice) : '',
      description: product.description,
      shortDescription: product.shortDescription,
      stock: product.stock,
      featured: product.featured,
      isNewArrival: product.isNewArrival,
      images: product.images.length > 0 ? [...product.images] : ['https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=80'],
      newImageUrl: '',
      variantName: product.variants[0]?.name || '',
      variantPriceAdj: product.variants[0]?.priceAdjustment || 0
    });
    setIsProductModalOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          const resultStr = reader.result;
          setProdForm((prev) => ({
            ...prev,
            images: [...prev.images, resultStr]
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddImageUrl = () => {
    if (!prodForm.newImageUrl.trim()) return;
    setProdForm((prev) => ({
      ...prev,
      images: [...prev.images, prev.newImageUrl.trim()],
      newImageUrl: ''
    }));
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setProdForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const saleVal = prodForm.salePrice ? Number(prodForm.salePrice) : undefined;
    const finalImages = prodForm.images.filter((img) => img.trim() !== '');
    if (finalImages.length === 0) {
      finalImages.push('https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=80');
    }

    const variants = prodForm.variantName
      ? [
          {
            id: 'var-' + Date.now(),
            name: prodForm.variantName,
            type: 'option' as const,
            stock: prodForm.stock,
            priceAdjustment: Number(prodForm.variantPriceAdj) || 0
          }
        ]
      : [];

    if (editingProductId) {
      updateProduct(editingProductId, {
        name: prodForm.name,
        category: prodForm.category,
        price: Number(prodForm.price),
        salePrice: saleVal,
        description: prodForm.description,
        shortDescription: prodForm.shortDescription,
        stock: Number(prodForm.stock),
        featured: prodForm.featured,
        isNewArrival: prodForm.isNewArrival,
        images: finalImages,
        variants
      });
    } else {
      addProduct({
        name: prodForm.name,
        slug: prodForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category: prodForm.category,
        price: Number(prodForm.price),
        salePrice: saleVal,
        description: prodForm.description,
        shortDescription: prodForm.shortDescription,
        stock: Number(prodForm.stock),
        featured: prodForm.featured,
        isNewArrival: prodForm.isNewArrival,
        images: finalImages,
        variants
      });
    }

    setIsProductModalOpen(false);
  };

  const handleCreateDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!discountForm.code.trim()) return;

    addDiscountCode({
      code: discountForm.code.trim().toUpperCase(),
      discountType: discountForm.type,
      value: Number(discountForm.value),
      minSpend: Number(discountForm.minSpend) || 0,
      active: true
    });

    setDiscountForm({ code: '', type: 'percentage', value: 10, minSpend: 0 });
  };

  const handleSaveBannerSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      heroBanner: {
        title: bannerForm.title,
        subtitle: bannerForm.subtitle,
        buttonText: bannerForm.buttonText,
        buttonLink: '/shop',
        imageUrl: bannerForm.imageUrl
      },
      shippingFee: Number(bannerForm.shippingFee),
      freeShippingThreshold: Number(bannerForm.freeShippingThreshold)
    });
    alert('Banner and store delivery settings updated!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-6 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-xs font-bold mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-700" /> Admin Control Panel
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            everydayessential Admin
          </h1>
        </div>

        <button
          onClick={() => {
            adminLogout();
            navigate('/');
          }}
          className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl transition self-start sm:self-auto"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-2 text-xs font-bold border-b border-slate-200">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 whitespace-nowrap transition ${
            activeTab === 'dashboard'
              ? 'bg-slate-900 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" /> Overview
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 whitespace-nowrap transition ${
            activeTab === 'products'
              ? 'bg-slate-900 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Package className="w-4 h-4" /> Products ({products.length})
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 whitespace-nowrap transition ${
            activeTab === 'orders'
              ? 'bg-slate-900 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <ShoppingBag className="w-4 h-4" /> Orders ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('customers')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 whitespace-nowrap transition ${
            activeTab === 'customers'
              ? 'bg-slate-900 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Users className="w-4 h-4" /> Customers ({customers.length})
        </button>

        <button
          onClick={() => setActiveTab('discounts')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 whitespace-nowrap transition ${
            activeTab === 'discounts'
              ? 'bg-slate-900 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Tag className="w-4 h-4" /> Promo Codes ({discounts.length})
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 whitespace-nowrap transition ${
            activeTab === 'reviews'
              ? 'bg-slate-900 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Star className="w-4 h-4" /> Reviews Moderation{' '}
          {pendingReviews.length > 0 && (
            <span className="bg-amber-400 text-slate-900 px-1.5 py-0.2 rounded-full font-bold">
              {pendingReviews.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('banner')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 whitespace-nowrap transition ${
            activeTab === 'banner'
              ? 'bg-slate-900 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Image className="w-4 h-4" /> Hero Banner
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 whitespace-nowrap transition ${
            activeTab === 'analytics'
              ? 'bg-slate-900 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" /> Analytics
        </button>
      </div>

      {/* TAB 1: OVERVIEW DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Sales Revenue</span>
              <div className="text-2xl font-extrabold text-slate-900">
                Rs {totalRevenue.toLocaleString()}
              </div>
              <p className="text-[10px] text-emerald-700 font-semibold">From {totalOrdersCount} processed orders</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Products</span>
              <div className="text-2xl font-extrabold text-slate-900">{products.length}</div>
              <p className="text-[10px] text-slate-500 font-semibold">In active catalog</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Low Stock Alerts</span>
              <div className="text-2xl font-extrabold text-rose-600">{lowStockProducts.length}</div>
              <p className="text-[10px] text-rose-700 font-semibold">Items with stock ≤ 5</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Reviews</span>
              <div className="text-2xl font-extrabold text-amber-600">{pendingReviews.length}</div>
              <p className="text-[10px] text-amber-700 font-semibold">Awaiting approval</p>
            </div>
          </div>

          {/* Low Stock Alerts Box */}
          {lowStockProducts.length > 0 && (
            <div className="bg-rose-50 border border-rose-200 p-6 rounded-2xl space-y-4">
              <h3 className="font-extrabold text-rose-900 text-sm flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" /> Low Stock Inventory Warning
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {lowStockProducts.map((p) => (
                  <div key={p.id} className="bg-white p-3 rounded-xl border border-rose-200 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{p.name}</div>
                      <div className="text-slate-500 text-[10px]">{p.category}</div>
                    </div>
                    <span className="bg-rose-100 text-rose-800 font-extrabold px-2 py-0.5 rounded">
                      Qty: {p.stock}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Orders Overview */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900">Recent Customer Orders</h3>
              <button onClick={() => setActiveTab('orders')} className="text-xs font-bold text-emerald-700 hover:underline">
                View All Orders →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase font-bold text-[10px]">
                    <th className="py-3 px-2">Order Tracking</th>
                    <th className="py-3 px-2">Customer</th>
                    <th className="py-3 px-2">Total</th>
                    <th className="py-3 px-2">Payment</th>
                    <th className="py-3 px-2">Fulfillment</th>
                    <th className="py-3 px-2">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {orders.slice(0, 5).map((o) => (
                    <tr key={o.id}>
                      <td className="py-3 px-2 font-mono font-bold text-emerald-800">{o.trackingNumber}</td>
                      <td className="py-3 px-2">{o.shippingAddress.fullName} ({o.shippingAddress.city})</td>
                      <td className="py-3 px-2 font-extrabold text-slate-900">Rs {o.total.toLocaleString()}</td>
                      <td className="py-3 px-2">
                        <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-bold uppercase text-[10px]">
                          {o.paymentMethod} ({o.paymentStatus})
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-bold uppercase text-[10px]">
                          {o.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-slate-400">{new Date(o.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS MANAGER */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Products Catalog</h2>
              <p className="text-xs text-slate-500">Add, edit, price, update sale tags and stock counts</p>
            </div>

            <button
              onClick={openNewProductModal}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition shadow-xs"
            >
              <Plus className="w-4 h-4" /> Add New Product
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-400 uppercase font-bold text-[10px]">
                    <th className="py-3 px-4">Item</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price / Sale</th>
                    <th className="py-3 px-4">Stock</th>
                    <th className="py-3 px-4">Featured / New</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td className="py-3 px-4 flex items-center gap-3">
                        <img src={p.images[0]} alt={p.name} className="w-10 h-10 object-cover rounded-lg bg-slate-100" />
                        <div>
                          <div className="font-bold text-slate-900">{p.name}</div>
                          <div className="text-[10px] text-slate-400">{p.slug}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">{p.category}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        Rs {p.price.toLocaleString()}
                        {p.salePrice && (
                          <span className="block text-[10px] text-rose-600 font-extrabold">
                            Sale: Rs {p.salePrice.toLocaleString()}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded font-extrabold text-[10px] ${
                          p.stock <= 5 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {p.stock} in stock
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {p.featured && <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded mr-1">Featured</span>}
                        {p.isNewArrival && <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded">New</span>}
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button onClick={() => openEditProductModal(p)} className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => deleteProduct(p.id)} className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg">
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* TAB 3: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Orders Management</h2>
            <p className="text-xs text-slate-500">Filter orders, mark as shipped/fulfilled, and update payment statuses</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase font-bold text-[10px]">
                    <th className="py-3 px-3">Tracking / ID</th>
                    <th className="py-3 px-3">Customer & Address</th>
                    <th className="py-3 px-3">Items</th>
                    <th className="py-3 px-3">Total Payable</th>
                    <th className="py-3 px-3">Payment Status</th>
                    <th className="py-3 px-3">Fulfillment Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {orders.map((o) => (
                    <tr key={o.id}>
                      <td className="py-3 px-3 font-mono font-bold text-emerald-800">
                        {o.trackingNumber}
                        <div className="text-[10px] text-slate-400 font-sans">{new Date(o.createdAt).toLocaleDateString()}</div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{o.shippingAddress.fullName}</div>
                        <div className="text-[10px] text-slate-500">{o.shippingAddress.phone}</div>
                        <div className="text-[10px] text-slate-400">{o.shippingAddress.city}, {o.shippingAddress.address}</div>
                      </td>
                      <td className="py-3 px-3">
                        {o.items.map((i) => (
                          <div key={i.id} className="text-[11px]">
                            {i.product.name} (x{i.quantity})
                          </div>
                        ))}
                      </td>
                      <td className="py-3 px-3 font-extrabold text-slate-900">Rs {o.total.toLocaleString()}</td>
                      <td className="py-3 px-3">
                        <select
                          value={o.paymentStatus}
                          onChange={(e) => updateOrderPaymentStatus(o.id, e.target.value as PaymentStatus)}
                          className="bg-slate-50 border border-slate-200 rounded-lg p-1 font-bold text-[11px] text-slate-800"
                        >
                          <option value="unpaid">UNPAID</option>
                          <option value="paid">PAID</option>
                          <option value="refunded">REFUNDED</option>
                        </select>
                      </td>
                      <td className="py-3 px-3">
                        <select
                          value={o.status}
                          onChange={(e) => updateOrderStatus(o.id, e.target.value as OrderStatus)}
                          className="bg-emerald-50 border border-emerald-200 rounded-lg p-1 font-bold text-[11px] text-emerald-900"
                        >
                          <option value="pending">PENDING</option>
                          <option value="processing">PROCESSING</option>
                          <option value="shipped">SHIPPED</option>
                          <option value="fulfilled">FULFILLED</option>
                          <option value="cancelled">CANCELLED</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CUSTOMERS */}
      {activeTab === 'customers' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Customer Records</h2>
            <p className="text-xs text-slate-500">Customer directory, order counts and total spent</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-400 uppercase font-bold text-[10px]">
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email / Phone</th>
                  <th className="py-3 px-4">Total Orders</th>
                  <th className="py-3 px-4">Total Spend</th>
                  <th className="py-3 px-4">Saved Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {customers.map((c) => (
                  <tr key={c.id}>
                    <td className="py-3 px-4 font-bold text-slate-900">{c.name}</td>
                    <td className="py-3 px-4">
                      <div>{c.email}</div>
                      <div className="text-[10px] text-slate-400">{c.phone}</div>
                    </td>
                    <td className="py-3 px-4 font-bold">{c.totalOrders} order(s)</td>
                    <td className="py-3 px-4 font-extrabold text-emerald-800">Rs {c.totalSpent.toLocaleString()}</td>
                    <td className="py-3 px-4 text-[11px] text-slate-500">
                      {c.addresses[0]?.city}, {c.addresses[0]?.address}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: DISCOUNT PROMO CODES */}
      {activeTab === 'discounts' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Discount List */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-extrabold text-base text-slate-900">Active Promo Codes</h3>
              <div className="divide-y divide-slate-100">
                {discounts.map((d) => (
                  <div key={d.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-mono font-extrabold text-slate-900 text-sm flex items-center gap-2">
                        <span>{d.code}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded ${
                          d.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {d.active ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {d.discountType === 'percentage' ? `${d.value}% OFF` : `Rs ${d.value} OFF`}{' '}
                        • Used {d.usageCount} times
                      </div>
                    </div>

                    <button
                      onClick={() => toggleDiscountCode(d.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                        d.active ? 'bg-rose-50 text-rose-700 hover:bg-rose-100' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      }`}
                    >
                      {d.active ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Create Code Form */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-extrabold text-base text-slate-900">Create New Promo Code</h3>
              <form onSubmit={handleCreateDiscount} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Code Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FLASH20"
                    value={discountForm.code}
                    onChange={(e) => setDiscountForm({ ...discountForm, code: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-mono uppercase font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Discount Type</label>
                  <select
                    value={discountForm.type}
                    onChange={(e) => setDiscountForm({ ...discountForm, type: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold text-slate-800"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed PKR Amount (Rs)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Discount Value</label>
                  <input
                    type="number"
                    required
                    value={discountForm.value}
                    onChange={(e) => setDiscountForm({ ...discountForm, value: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-xl transition"
                >
                  Save Code
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: REVIEWS MODERATION */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Review Approvals & Moderation</h2>
            <p className="text-xs text-slate-500">Approve authentic customer reviews before they display on product pages</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="divide-y divide-slate-100">
              {reviews.map((r) => {
                const prod = products.find((p) => p.id === r.productId);

                return (
                  <div key={r.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{r.customerName}</span>
                        <span className="text-amber-500 font-bold">{'★'.repeat(r.rating)}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.2 rounded ${
                          r.approved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {r.approved ? 'Approved' : 'Pending Approval'}
                        </span>
                      </div>
                      <p className="text-slate-700">{r.comment}</p>
                      <div className="text-[10px] text-slate-400">
                        Product: <strong>{prod?.name || r.productId}</strong> • Submitted: {r.date}
                      </div>
                    </div>

                    {!r.approved ? (
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => approveReview(r.id)}
                          className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button
                          onClick={() => rejectReview(r.id)}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => rejectReview(r.id)}
                        className="text-rose-600 hover:underline text-xs shrink-0"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: HERO BANNER & PICK EDITOR */}
      {activeTab === 'banner' && (
        <div className="space-y-6 max-w-2xl">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Hero Banner & Shipping Editor</h2>
            <p className="text-xs text-slate-500">Edit homepage title, subtitle, image URL and delivery rate settings</p>
          </div>

          <form onSubmit={handleSaveBannerSettings} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Banner Headline</label>
              <input
                type="text"
                required
                value={bannerForm.title}
                onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Banner Subtitle</label>
              <textarea
                rows={2}
                required
                value={bannerForm.subtitle}
                onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Banner Button Text</label>
              <input
                type="text"
                required
                value={bannerForm.buttonText}
                onChange={(e) => setBannerForm({ ...bannerForm, buttonText: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Background Image URL</label>
              <input
                type="text"
                required
                value={bannerForm.imageUrl}
                onChange={(e) => setBannerForm({ ...bannerForm, imageUrl: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Standard Shipping Fee (Rs)</label>
                <input
                  type="number"
                  required
                  value={bannerForm.shippingFee}
                  onChange={(e) => setBannerForm({ ...bannerForm, shippingFee: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Free Shipping Min Order (Rs)</label>
                <input
                  type="number"
                  required
                  value={bannerForm.freeShippingThreshold}
                  onChange={(e) => setBannerForm({ ...bannerForm, freeShippingThreshold: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-bold"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition"
            >
              Update Banner & Store Settings
            </button>
          </form>
        </div>
      )}

      {/* TAB 8: REVENUE & TOP PRODUCT ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Store Analytics & Insights</h2>
            <p className="text-xs text-slate-500">Sales performance and top products statistics</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-extrabold text-sm text-slate-900">Revenue Breakdown</h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                  <span>Gross Sales Volume</span>
                  <span className="font-extrabold text-emerald-800">Rs {totalRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                  <span>Total Fulfilled Orders</span>
                  <span className="font-bold text-slate-900">{orders.length} orders</span>
                </div>
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                  <span>Average Order Value (AOV)</span>
                  <span className="font-bold text-slate-900">
                    Rs {orders.length > 0 ? Math.round(totalRevenue / orders.length).toLocaleString() : 0}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-extrabold text-sm text-slate-900">Top Performing Categories</h3>
              <div className="space-y-2 text-xs">
                {['Home', 'Kitchen', 'Personal Care', 'Wellness'].map((cat) => {
                  const catProds = products.filter((p) => p.category.toLowerCase() === cat.toLowerCase());
                  return (
                    <div key={cat} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                      <span className="font-bold text-slate-800">{cat}</span>
                      <span className="text-slate-500">{catProds.length} active products</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <h3 className="font-extrabold text-lg text-slate-900 border-b border-slate-100 pb-3">
              {editingProductId ? 'Edit Product' : 'Add New Product'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={prodForm.name}
                  onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={prodForm.category}
                    onChange={(e) => setProdForm({ ...prodForm, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-semibold"
                  >
                    <option value="Home">Home</option>
                    <option value="Kitchen">Kitchen</option>
                    <option value="Personal Care">Personal Care</option>
                    <option value="Wellness">Wellness</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Inventory Stock</label>
                  <input
                    type="number"
                    required
                    value={prodForm.stock}
                    onChange={(e) => setProdForm({ ...prodForm, stock: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Regular Price (Rs)</label>
                  <input
                    type="number"
                    required
                    value={prodForm.price}
                    onChange={(e) => setProdForm({ ...prodForm, price: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sale Price (Rs Optional)</label>
                  <input
                    type="number"
                    placeholder="e.g. 1499"
                    value={prodForm.salePrice}
                    onChange={(e) => setProdForm({ ...prodForm, salePrice: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold"
                  />
                </div>
              </div>

              <div className="space-y-3 bg-slate-50 border border-slate-200 p-3.5 rounded-2xl">
                <label className="block font-bold text-slate-800">Product Pictures</label>

                {/* Image Thumbnails List */}
                {prodForm.images.length > 0 && (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {prodForm.images.map((imgUrl, idx) => (
                      <div key={idx} className="relative group rounded-lg overflow-hidden border border-slate-300 bg-white aspect-square">
                        <img src={imgUrl} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1 right-1 bg-rose-600 text-white p-1 rounded-full opacity-90 hover:opacity-100 transition shadow-xs"
                          title="Remove picture"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Local File Upload Option */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Upload Picture File from Device</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                    className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-100 file:text-emerald-800 hover:file:bg-emerald-200 transition"
                  />
                </div>

                {/* Image URL Input Option */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Or Add Picture via Web URL</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="https://..."
                      value={prodForm.newImageUrl}
                      onChange={(e) => setProdForm({ ...prodForm, newImageUrl: e.target.value })}
                      className="flex-1 bg-white border border-slate-300 rounded-xl p-2 text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-3 py-2 rounded-xl text-xs"
                    >
                      Add URL
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Short Description</label>
                <input
                  type="text"
                  required
                  value={prodForm.shortDescription}
                  onChange={(e) => setProdForm({ ...prodForm, shortDescription: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Detailed Description</label>
                <textarea
                  rows={3}
                  required
                  value={prodForm.description}
                  onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5"
                />
              </div>

              <div className="flex gap-4 border-t border-slate-100 pt-2 font-semibold">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodForm.featured}
                    onChange={(e) => setProdForm({ ...prodForm, featured: e.target.checked })}
                    className="rounded text-emerald-700"
                  />
                  <span>Featured Pick</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodForm.isNewArrival}
                    onChange={(e) => setProdForm({ ...prodForm, isNewArrival: e.target.checked })}
                    className="rounded text-emerald-700"
                  />
                  <span>New Arrival</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 text-white font-bold hover:bg-emerald-800"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
