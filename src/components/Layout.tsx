import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Search,
  User,
  ShieldCheck,
  Menu,
  X,
  Truck,
  Phone,
  CheckCircle,
  Sparkles,
  Heart
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Header: React.FC = () => {
  const { cart, categories, isAdminLoggedIn } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Banner Announcement */}
      <div className="bg-emerald-800 text-emerald-50 px-4 py-1.5 text-xs text-center font-medium flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
        <span>Use code <strong className="bg-emerald-900 px-1.5 py-0.5 rounded text-amber-200">WELCOME10</strong> for 10% OFF! Free delivery on orders over Rs 3,000</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-emerald-700"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-lg shadow-sm group-hover:bg-emerald-800 transition">
              EE
            </div>
            <div>
              <span className="text-xl font-extrabold text-slate-900 tracking-tight block leading-none">
                everyday<span className="text-emerald-700">essential</span>
              </span>
              <span className="text-[10px] text-slate-500 font-medium tracking-wider uppercase block mt-0.5">
                Pakistan Store
              </span>
            </div>
          </Link>

          {/* Desktop Search */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md mx-4 relative">
            <input
              type="text"
              placeholder="Search home, kitchen, personal care & wellness..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 text-sm text-slate-800 rounded-full pl-4 pr-10 py-2 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-700"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* User & Navigation Links */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/track"
              className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 px-3 py-1.5 rounded-full transition"
            >
              <Truck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Track Order</span>
            </Link>

            <Link
              to="/account"
              className="flex items-center gap-1.5 text-sm font-medium text-slate-700 hover:text-emerald-700 p-2 sm:p-0"
              title="Customer Account"
            >
              <User className="w-5 h-5" />
              <span className="hidden sm:inline">Account</span>
            </Link>

            <Link
              to="/admin"
              className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border transition ${
                isAdminLoggedIn
                  ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-emerald-500 hover:text-emerald-700'
              }`}
              title="Store Admin Panel"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>Admin</span>
            </Link>

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative bg-emerald-700 hover:bg-emerald-800 text-white p-2 sm:px-3 sm:py-2 rounded-xl flex items-center gap-2 transition shadow-xs"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="hidden sm:inline font-medium text-xs">Cart</span>
              {totalCartItems > 0 && (
                <span className="bg-amber-400 text-slate-900 font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center border-2 border-emerald-800">
                  {totalCartItems}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 text-sm rounded-full pl-4 pr-10 py-2 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Categories Bar (Desktop) */}
        <nav className="hidden md:flex items-center justify-between border-t border-slate-100 py-2 text-xs font-semibold text-slate-600">
          <div className="flex items-center gap-6">
            <Link to="/shop" className="text-emerald-800 hover:text-emerald-900 font-bold flex items-center gap-1">
              All Products
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/shop?category=${encodeURIComponent(cat.slug)}`}
                className="hover:text-emerald-700 transition"
              >
                {cat.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4 text-slate-500 text-[11px]">
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Cash on Delivery
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> JazzCash & Easypaisa
            </span>
          </div>
        </nav>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-4">
          <div className="font-semibold text-xs text-slate-400 uppercase tracking-wider">
            Shop by Category
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <Link
              to="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-lg bg-emerald-50 text-emerald-800 font-medium text-center"
            >
              All Products
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/shop?category=${encodeURIComponent(cat.slug)}`}
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-slate-100 text-slate-700 font-medium text-center hover:bg-emerald-100 hover:text-emerald-800 transition"
              >
                {cat.name}
              </Link>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-3 flex flex-col gap-2 text-sm">
            <Link
              to="/track"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-slate-700 p-2 hover:bg-slate-50 rounded-lg"
            >
              <Truck className="w-4 h-4 text-emerald-600" /> Track My Order
            </Link>
            <Link
              to="/account"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-slate-700 p-2 hover:bg-slate-50 rounded-lg"
            >
              <User className="w-4 h-4 text-emerald-600" /> Account & Order History
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
              EE
            </div>
            <span className="text-lg font-bold text-white">everydayessential</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            Your trusted destination in Pakistan for high quality home gadgets, kitchen accessories, self-care items & wellness essentials.
          </p>
          <div className="text-xs text-slate-400 space-y-1">
            <p className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp Support: 0300-1234567
            </p>
            <p>Lahore, Karachi, Islamabad & nationwide delivery.</p>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">Quick Links</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/shop" className="hover:text-emerald-400 transition">Shop All Products</Link></li>
            <li><Link to="/shop?category=home" className="hover:text-emerald-400 transition">Home Essentials</Link></li>
            <li><Link to="/shop?category=kitchen" className="hover:text-emerald-400 transition">Kitchenware</Link></li>
            <li><Link to="/shop?category=personal-care" className="hover:text-emerald-400 transition">Personal Care</Link></li>
            <li><Link to="/shop?category=wellness" className="hover:text-emerald-400 transition">Wellness & Health</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">Customer Care</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/track" className="hover:text-emerald-400 transition">Track Order Status</Link></li>
            <li><Link to="/account" className="hover:text-emerald-400 transition">Saved Addresses & Orders</Link></li>
            <li><span className="text-slate-400">Delivery Fee: Flat Rs 250 (Free over Rs 3,000)</span></li>
            <li><span className="text-slate-400">Payment: COD, JazzCash, Easypaisa</span></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">Store Guarantees</h4>
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-medium">
              <CheckCircle className="w-4 h-4" /> 100% Quality Checked
            </div>
            <p className="text-[11px] text-slate-400">
              All items are thoroughly inspected before dispatch from our fulfillment centers.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 pt-6 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} everydayessential.pk. All rights reserved.</p>
        <p className="flex items-center gap-1">
          Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for customers across Pakistan
        </p>
      </div>
    </footer>
  );
};
