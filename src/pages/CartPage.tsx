import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Tag,
  CheckCircle,
  Truck,
  ShieldCheck,
  X
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartSubtotal,
    appliedDiscount,
    discountAmount,
    shippingFee,
    cartTotal,
    applyDiscountCode,
    removeDiscountCode,
    discountError,
    settings
  } = useStore();

  const [promoInput, setPromoInput] = useState('');

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoInput.trim()) {
      applyDiscountCode(promoInput.trim());
      setPromoInput('');
    }
  };

  const freeShippingNeeded = Math.max(0, settings.freeShippingThreshold - (cartSubtotal - discountAmount));

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900">Your Cart is Empty</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
          Looks like you haven't added any home or kitchen essentials to your cart yet. Explore our top picks today!
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-6 py-3 rounded-xl transition shadow-xs"
        >
          <span>Start Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Your Shopping Cart</h1>
        <p className="text-xs text-slate-500 mt-1">
          Review your items before proceeding to guest or account checkout
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs divide-y divide-slate-100">
            {cart.map((item) => {
              const product = item.product;
              const img = product.images[0] || 'https://via.placeholder.com/150';

              return (
                <div key={item.id} className="p-4 sm:p-5 flex gap-4 items-center">
                  <img
                    src={img}
                    alt={product.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl bg-slate-100 shrink-0"
                  />

                  <div className="flex-1 min-w-0 space-y-1">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                      {product.category}
                    </span>
                    <Link
                      to={`/product/${product.id}`}
                      className="block font-bold text-slate-900 hover:text-emerald-700 text-xs sm:text-sm truncate"
                    >
                      {product.name}
                    </Link>

                    {item.selectedVariant && (
                      <div className="text-[11px] font-medium text-slate-500">
                        Option: <span className="text-slate-800">{item.selectedVariant.name}</span>
                      </div>
                    )}

                    <div className="text-xs font-extrabold text-slate-900 pt-1">
                      Rs {item.price.toLocaleString()}{' '}
                      <span className="text-[10px] text-slate-400 font-normal">each</span>
                    </div>
                  </div>

                  {/* Quantity Controls & Total */}
                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
                    <div className="flex items-center border border-slate-300 rounded-lg bg-slate-50">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 text-slate-600 hover:bg-slate-200"
                        title="Decrease"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-slate-900">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 text-slate-600 hover:bg-slate-200"
                        title="Increase"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right min-w-[80px]">
                      <div className="text-sm font-extrabold text-slate-900">
                        Rs {(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                      title="Remove Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={clearCart}
              className="text-xs font-semibold text-rose-600 hover:text-rose-800 transition"
            >
              Clear Cart
            </button>
            <Link
              to="/shop"
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 underline"
            >
              + Add More Products
            </Link>
          </div>
        </div>

        {/* Order Summary & Promo Code */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <h3 className="font-extrabold text-base text-slate-900 border-b border-slate-100 pb-3">
              Order Summary
            </h3>

            {/* Free Shipping Progress */}
            <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl space-y-1.5 text-xs text-emerald-950">
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-emerald-700" /> Shipping Status
                </span>
                <span>
                  {freeShippingNeeded === 0 ? 'FREE Shipping' : `Rs ${settings.shippingFee}`}
                </span>
              </div>
              {freeShippingNeeded > 0 ? (
                <p className="text-[11px] text-emerald-800">
                  Add <strong>Rs {freeShippingNeeded.toLocaleString()}</strong> more to get FREE nationwide delivery!
                </p>
              ) : (
                <p className="text-[11px] text-emerald-800 flex items-center gap-1 font-semibold">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-700" /> You qualify for FREE delivery in Pakistan!
                </p>
              )}
            </div>

            {/* Promo Code Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Have a Discount Promo Code?
              </label>

              {appliedDiscount ? (
                <div className="bg-amber-50 border border-amber-300 text-amber-900 p-3 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-amber-700" />
                    <div>
                      <div className="font-bold">{appliedDiscount.code} Applied</div>
                      <div className="text-[10px] text-amber-800">
                        {appliedDiscount.discountType === 'percentage'
                          ? `${appliedDiscount.value}% discount`
                          : `Rs ${appliedDiscount.value} discount`}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={removeDiscountCode}
                    className="text-amber-800 hover:text-rose-700 p-1"
                    title="Remove code"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. WELCOME10"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600 uppercase"
                  />
                  <button
                    type="submit"
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition"
                  >
                    Apply
                  </button>
                </form>
              )}

              {discountError && (
                <p className="text-[11px] text-rose-600 font-semibold mt-1.5">{discountError}</p>
              )}
            </div>

            {/* Pricing Rows */}
            <div className="space-y-2 text-xs border-t border-slate-100 pt-4">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">Rs {cartSubtotal.toLocaleString()}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Discount ({appliedDiscount?.code})</span>
                  <span>- Rs {discountAmount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Delivery Charge</span>
                <span className="font-bold text-slate-900">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-700 font-extrabold uppercase">FREE</span>
                  ) : (
                    `Rs ${shippingFee}`
                  )}
                </span>
              </div>

              <div className="flex justify-between text-base font-extrabold text-slate-900 border-t border-slate-200 pt-3">
                <span>Grand Total</span>
                <span className="text-emerald-800">Rs {cartTotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm transition"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-600 text-xs flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-700 shrink-0" />
            <p>Guaranteed secure checkout with Cash on Delivery, JazzCash & Easypaisa options.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
