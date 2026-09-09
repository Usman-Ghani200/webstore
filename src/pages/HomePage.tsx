import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  ArrowRight,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import type { Product } from '../types';

export const HomePage: React.FC = () => {
  const { products, categories, settings, addToCart } = useStore();
  const navigate = useNavigate();

  // Featured products
  const featuredProducts = products.filter(
    (p) => settings.featuredPickIds.includes(p.id) || p.featured
  );

  // New arrivals
  const newArrivals = products.filter((p) => p.isNewArrival);

  const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
    const mainImage = product.images[0] || 'https://via.placeholder.com/300';
    const effectivePrice = product.salePrice ?? product.price;

    return (
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition group flex flex-col">
        <div className="relative aspect-square bg-slate-100 overflow-hidden">
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
          {product.salePrice && (
            <span className="absolute top-3 left-3 bg-rose-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Sale
            </span>
          )}
          {product.isNewArrival && !product.salePrice && (
            <span className="absolute top-3 left-3 bg-emerald-700 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
              New
            </span>
          )}
          {product.stock <= 5 && product.stock > 0 && (
            <span className="absolute bottom-3 right-3 bg-amber-500 text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded">
              Only {product.stock} left
            </span>
          )}
        </div>

        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">
              {product.category}
            </span>
            <Link
              to={`/product/${product.id}`}
              className="block font-semibold text-slate-900 hover:text-emerald-700 text-sm mt-1 line-clamp-2"
            >
              {product.name}
            </Link>

            <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="font-bold text-slate-700">{product.rating.toFixed(1)}</span>
              <span>({product.reviewCount})</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <div>
              <div className="text-base font-extrabold text-slate-900">
                Rs {effectivePrice.toLocaleString()}
              </div>
              {product.salePrice && (
                <div className="text-xs text-slate-400 line-through">
                  Rs {product.price.toLocaleString()}
                </div>
              )}
            </div>

            <button
              onClick={() => addToCart(product)}
              disabled={product.stock === 0}
              className={`p-2.5 rounded-xl flex items-center justify-center transition ${
                product.stock === 0
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-emerald-700 text-white hover:bg-emerald-800 shadow-xs'
              }`}
              title={product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-12">
      {/* Hero Banner */}
      <section className="relative bg-slate-900 rounded-3xl overflow-hidden shadow-lg mx-4 sm:mx-6 lg:mx-8 mt-4">
        <div className="absolute inset-0 z-0">
          <img
            src={settings.heroBanner.imageUrl}
            alt="Hero background"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-transparent" />
        </div>

        <div className="relative z-10 max-w-2xl px-6 py-16 sm:px-12 sm:py-24 text-white">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Direct to Doorstep in Pakistan
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-4">
            {settings.heroBanner.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 mb-8 leading-relaxed">
            {settings.heroBanner.subtitle}
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => navigate(settings.heroBanner.buttonLink || '/shop')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 shadow-md transition"
            >
              <span>{settings.heroBanner.buttonText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <Link
              to="/shop"
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl border border-white/20 transition backdrop-blur-xs"
            >
              Browse Catalog
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Badges Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-emerald-50 border border-emerald-100 p-4 sm:p-6 rounded-2xl text-emerald-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Fast Dispatch Across PK</h4>
              <p className="text-xs text-emerald-800">Flat Rs 250 fee, FREE over Rs 3,000</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Safe Payment Options</h4>
              <p className="text-xs text-emerald-800">Cash on Delivery, JazzCash, Easypaisa</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Verified Products</h4>
              <p className="text-xs text-emerald-800">Inspected quality & customer reviews</p>
            </div>
          </div>
        </div>
      </section>

      {/* Shop By Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Shop by Category</h2>
            <p className="text-xs text-slate-500 mt-1">Explore our everyday essentials collection</p>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?category=${encodeURIComponent(cat.slug)}`}
              className="group relative rounded-2xl overflow-hidden aspect-4/3 border border-slate-200 shadow-xs hover:shadow-md transition"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent flex flex-col justify-end p-4 text-white">
                <h3 className="font-bold text-base group-hover:text-amber-300 transition">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-slate-300 line-clamp-1">{cat.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Featured Picks</h2>
            <p className="text-xs text-slate-500 mt-1">Handpicked daily customer favorites</p>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>Browse All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {featuredProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* New Arrivals Banner & Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-100 p-6 sm:p-8 rounded-3xl border border-slate-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div>
              <span className="bg-emerald-700 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                Just Arrived
              </span>
              <h2 className="text-2xl font-bold text-slate-900 mt-2">New Arrivals</h2>
              <p className="text-xs text-slate-500 mt-0.5">Fresh items added to our store inventory</p>
            </div>
            <Link
              to="/shop"
              className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold px-4 py-2 rounded-xl text-xs self-start md:self-auto transition"
            >
              See All Products
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {newArrivals.slice(0, 3).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
