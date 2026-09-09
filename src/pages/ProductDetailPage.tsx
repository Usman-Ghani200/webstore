import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  ShoppingBag,
  Truck,
  ShieldCheck,
  CheckCircle,
  ArrowLeft,
  ThumbsUp,
  MessageSquarePlus,
  AlertCircle
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import type { ProductVariant } from '../types';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, reviews, addToCart, addReview } = useStore();

  const product = products.find((p) => p.id === id);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product?.variants && product.variants.length > 0 ? product.variants[0] : undefined
  );
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  // Review Form State
  const [reviewerName, setReviewerName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmittedMsg, setReviewSubmittedMsg] = useState(false);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-2xl font-bold text-slate-800">Product Not Found</h2>
        <p className="text-slate-500 text-xs">
          The product you are looking for might have been removed or is temporarily unavailable.
        </p>
        <Link
          to="/shop"
          className="inline-block bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl hover:bg-emerald-800 transition"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const approvedProductReviews = reviews.filter((r) => r.productId === product.id && r.approved);

  const effectiveBasePrice = product.salePrice ?? product.price;
  const variantAdjustment = selectedVariant?.priceAdjustment ?? 0;
  const finalUnitPrice = effectiveBasePrice + variantAdjustment;

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 3000);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim()) return;

    addReview({
      productId: product.id,
      customerName: reviewerName.trim(),
      rating: reviewRating,
      comment: reviewComment.trim()
    });

    setReviewerName('');
    setReviewComment('');
    setReviewRating(5);
    setReviewSubmittedMsg(true);
    setTimeout(() => setReviewSubmittedMsg(false), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb & Back */}
      <div className="flex items-center justify-between text-xs">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 font-semibold text-slate-600 hover:text-emerald-700 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </button>
        <div className="text-slate-400">
          <Link to="/" className="hover:text-emerald-700">Home</Link> /{' '}
          <Link to={`/shop?category=${encodeURIComponent(product.category.toLowerCase())}`} className="hover:text-emerald-700">
            {product.category}
          </Link>{' '}
          / <span className="text-slate-800 font-semibold">{product.name}</span>
        </div>
      </div>

      {/* Main Grid: Gallery + Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left: Photos Gallery */}
        <div className="space-y-4">
          <div className="aspect-square bg-slate-100 rounded-3xl overflow-hidden border border-slate-200 relative shadow-xs">
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.salePrice && (
              <span className="absolute top-4 left-4 bg-rose-600 text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                Sale Price
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition shrink-0 ${
                    selectedImageIndex === idx
                      ? 'border-emerald-700 ring-2 ring-emerald-600/30'
                      : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info, Price, Variants & Add to Cart */}
        <div className="space-y-6">
          <div>
            <span className="inline-block bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
              {product.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-2 text-xs">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                ))}
              </div>
              <span className="font-bold text-slate-800">{product.rating.toFixed(1)}</span>
              <span className="text-slate-500">({approvedProductReviews.length} customer reviews)</span>
            </div>
          </div>

          {/* Price Box */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-slate-900">
              Rs {finalUnitPrice.toLocaleString()}
            </span>
            {product.salePrice && (
              <span className="text-base text-slate-400 line-through">
                Rs {(product.price + variantAdjustment).toLocaleString()}
              </span>
            )}
            {product.salePrice && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                Save Rs {((product.price - product.salePrice)).toLocaleString()}
              </span>
            )}
          </div>

          {/* Short Description */}
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {product.description}
          </p>

          {/* Variant Selector (if any) */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Select {product.variants[0].type === 'size' ? 'Size' : 'Option / Scent'}
              </label>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-4 py-2.5 rounded-xl border text-xs font-semibold transition ${
                      selectedVariant?.id === v.id
                        ? 'border-emerald-700 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-600/20'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{v.name}</span>
                    {v.priceAdjustment ? (
                      <span className="ml-1 text-[10px] opacity-75">
                        (+Rs {v.priceAdjustment})
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock Status Indicator */}
          <div className="flex items-center gap-2 text-xs font-semibold">
            {product.stock > 0 ? (
              <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <CheckCircle className="w-3.5 h-3.5" /> In Stock ({product.stock} available)
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                Out of Stock
              </span>
            )}
          </div>

          {/* Add to Cart Controls */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              {/* Quantity */}
              <div className="flex items-center border border-slate-300 rounded-xl bg-white overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2.5 text-slate-600 hover:bg-slate-100 font-bold"
                >
                  -
                </button>
                <span className="px-4 py-2 text-xs font-bold text-slate-900">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="px-3 py-2.5 text-slate-600 hover:bg-slate-100 font-bold"
                >
                  +
                </button>
              </div>

              {/* Add Button */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 py-3 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition ${
                  product.stock === 0
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-emerald-700 text-white hover:bg-emerald-800'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart - Rs {(finalUnitPrice * quantity).toLocaleString()}</span>
              </button>
            </div>

            {addedNotice && (
              <div className="bg-emerald-800 text-white text-xs font-bold p-3 rounded-xl flex items-center justify-between animate-fade-in">
                <span>✓ Added to cart! Check your cart or proceed to checkout.</span>
                <Link to="/cart" className="underline hover:text-amber-300">
                  View Cart
                </Link>
              </div>
            )}
          </div>

          {/* Guarantee Badges */}
          <div className="border-t border-slate-200 pt-6 grid grid-cols-2 gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Rs 250 Delivery (Free over Rs 3,000)</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>COD / JazzCash / Easypaisa Accepted</span>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="border-t border-slate-200 pt-10 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900">Customer Reviews</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Real feedback from verified everydayessential buyers in Pakistan
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Reviews List */}
          <div className="lg:col-span-2 space-y-4">
            {approvedProductReviews.length === 0 ? (
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-slate-500 text-xs text-center">
                No approved reviews yet for this product. Be the first to share your experience!
              </div>
            ) : (
              approvedProductReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center uppercase">
                        {rev.customerName[0]}
                      </div>
                      <span className="font-bold text-xs text-slate-900">{rev.customerName}</span>
                      <span className="bg-emerald-50 text-emerald-800 text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-0.5">
                        <ThumbsUp className="w-2.5 h-2.5" /> Verified Buyer
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">{rev.date}</span>
                  </div>

                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">{rev.comment}</p>
                </div>
              ))
            )}
          </div>

          {/* Right: Submit Review Form */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 h-fit space-y-4">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <MessageSquarePlus className="w-4 h-4 text-emerald-700" /> Write a Review
            </h4>

            {reviewSubmittedMsg ? (
              <div className="bg-emerald-100 border border-emerald-300 text-emerald-900 p-4 rounded-xl text-xs space-y-1">
                <p className="font-bold">Thank you for your review!</p>
                <p>Your feedback has been submitted for moderation and will appear once approved.</p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sana Usman"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Rating</label>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-800"
                  >
                    <option value={5}>★★★★★ (5 Stars - Excellent)</option>
                    <option value={4}>★★★★☆ (4 Stars - Good)</option>
                    <option value={3}>★★★☆☆ (3 Stars - Average)</option>
                    <option value={2}>★★☆☆☆ (2 Stars - Below Average)</option>
                    <option value={1}>★☆☆☆☆ (1 Star - Poor)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Your Experience</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Tell us about product quality, packaging, or delivery..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-xl transition"
                >
                  Submit Review
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
