import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Star,
  ShoppingBag,
  X
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ProductListingPage: React.FC = () => {
  const { products, categories, addToCart } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedCategorySlug = searchParams.get('category') || 'all';
  const searchQuery = searchParams.get('search') || '';
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high'>('newest');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filter products based on search and category
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category match
      if (selectedCategorySlug !== 'all') {
        const cat = categories.find((c) => c.slug === selectedCategorySlug);
        if (cat && product.category.toLowerCase() !== cat.name.toLowerCase() && product.category.toLowerCase() !== selectedCategorySlug.toLowerCase()) {
          return false;
        }
      }

      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = product.name.toLowerCase().includes(q);
        const matchDesc = product.description.toLowerCase().includes(q);
        const matchCat = product.category.toLowerCase().includes(q);
        if (!matchName && !matchDesc && !matchCat) {
          return false;
        }
      }

      return true;
    });
  }, [products, categories, selectedCategorySlug, searchQuery]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === 'price-low') {
      list.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
    } else {
      // newest
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return list;
  }, [filteredProducts, sortBy]);

  const handleCategoryChange = (slug: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (slug === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', slug);
    }
    setSearchParams(newParams);
  };

  const clearSearch = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('search');
    setSearchParams(newParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Heading & Breadcrumb */}
      <div className="mb-8">
        <div className="text-xs text-slate-500 mb-2">
          <Link to="/" className="hover:text-emerald-700">Home</Link> / <span className="text-slate-800 font-semibold">Shop Catalog</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {selectedCategorySlug === 'all'
            ? 'All Everyday Products'
            : categories.find((c) => c.slug === selectedCategorySlug)?.name || 'Category'}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Showing {sortedProducts.length} items for your home and personal needs
        </p>
      </div>

      {/* Active Filters / Search Indicator */}
      {(searchQuery || selectedCategorySlug !== 'all') && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Active Filters:</span>
          {searchQuery && (
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1.5">
              <span>Search: "{searchQuery}"</span>
              <button onClick={clearSearch} className="hover:text-rose-600">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
          {selectedCategorySlug !== 'all' && (
            <span className="bg-slate-100 text-slate-800 border border-slate-200 text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1.5">
              <span>Category: {selectedCategorySlug}</span>
              <button onClick={() => handleCategoryChange('all')} className="hover:text-rose-600">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block w-64 shrink-0 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="font-bold text-sm text-slate-900 mb-4 flex items-center gap-2">
              <Filter className="w-4 h-4 text-emerald-700" /> Categories
            </h3>
            <ul className="space-y-1.5 text-xs font-medium">
              <li>
                <button
                  onClick={() => handleCategoryChange('all')}
                  className={`w-full text-left px-3 py-2 rounded-xl transition ${
                    selectedCategorySlug === 'all'
                      ? 'bg-emerald-700 text-white font-bold'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  All Categories ({products.length})
                </button>
              </li>
              {categories.map((cat) => {
                const count = products.filter(
                  (p) => p.category.toLowerCase() === cat.name.toLowerCase() || p.category.toLowerCase() === cat.slug.toLowerCase()
                ).length;
                return (
                  <li key={cat.id}>
                    <button
                      onClick={() => handleCategoryChange(cat.slug)}
                      className={`w-full text-left px-3 py-2 rounded-xl transition flex items-center justify-between ${
                        selectedCategorySlug === cat.slug
                          ? 'bg-emerald-700 text-white font-bold'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-[10px] opacity-75">({count})</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 space-y-6">
          {/* Top Sort Bar & Mobile Filter Trigger */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-100 px-3.5 py-2 rounded-xl border border-slate-200"
            >
              <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
              <span>Filters</span>
            </button>

            <div className="flex items-center gap-2 text-xs font-medium ml-auto">
              <span className="text-slate-500 hidden sm:inline">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2 font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {sortedProducts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
              <Search className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-slate-800">No products found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                We couldn't find any products matching your current filters or search terms.
              </p>
              <button
                onClick={() => {
                  handleCategoryChange('all');
                  clearSearch();
                }}
                className="bg-emerald-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-emerald-800 transition"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {sortedProducts.map((product) => {
                const mainImage = product.images[0] || 'https://via.placeholder.com/300';
                const effectivePrice = product.salePrice ?? product.price;

                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition group flex flex-col justify-between"
                  >
                    <div>
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
                        {product.stock <= 5 && product.stock > 0 && (
                          <span className="absolute bottom-3 right-3 bg-amber-500 text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded">
                            Only {product.stock} left
                          </span>
                        )}
                      </div>

                      <div className="p-4">
                        <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">
                          {product.category}
                        </span>
                        <Link
                          to={`/product/${product.id}`}
                          className="block font-semibold text-slate-900 hover:text-emerald-700 text-sm mt-1 line-clamp-2"
                        >
                          {product.name}
                        </Link>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                          {product.shortDescription}
                        </p>

                        <div className="flex items-center gap-1 mt-2 text-xs text-slate-500">
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          <span className="font-bold text-slate-700">{product.rating.toFixed(1)}</span>
                          <span>({product.reviewCount} reviews)</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 pt-0 flex items-center justify-between border-t border-slate-100 mt-3">
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

                      <div className="flex items-center gap-2">
                        <Link
                          to={`/product/${product.id}`}
                          className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 underline px-2 py-1"
                        >
                          Details
                        </Link>
                        <button
                          onClick={() => addToCart(product)}
                          disabled={product.stock === 0}
                          className={`p-2.5 rounded-xl flex items-center justify-center transition ${
                            product.stock === 0
                              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                              : 'bg-emerald-700 text-white hover:bg-emerald-800 shadow-xs'
                          }`}
                        >
                          <ShoppingBag className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filters Modal */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-xs bg-white h-full p-6 space-y-6 overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <h3 className="font-bold text-base text-slate-900">Filter Products</h3>
              <button onClick={() => setMobileFiltersOpen(false)} className="text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h4 className="font-semibold text-xs text-slate-400 uppercase tracking-wider mb-3">
                Categories
              </h4>
              <ul className="space-y-1.5 text-xs font-medium">
                <li>
                  <button
                    onClick={() => {
                      handleCategoryChange('all');
                      setMobileFiltersOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl ${
                      selectedCategorySlug === 'all'
                        ? 'bg-emerald-700 text-white font-bold'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    All Categories
                  </button>
                </li>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => {
                        handleCategoryChange(cat.slug);
                        setMobileFiltersOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-xl ${
                        selectedCategorySlug === cat.slug
                          ? 'bg-emerald-700 text-white font-bold'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
