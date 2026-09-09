import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  CheckCircle,
  ArrowLeft,
  CreditCard,
  Building,
  User,
  ShoppingBag
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import type { PaymentMethod, ShippingAddress } from '../types';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    cart,
    cartSubtotal,
    discountAmount,
    shippingFee,
    cartTotal,
    createOrder,
    appliedDiscount
  } = useStore();

  const [isGuest, setIsGuest] = useState(true);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Lahore');
  const [province, setProvince] = useState('Punjab');
  const [postalCode, setPostalCode] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
        <h2 className="text-2xl font-bold text-slate-800">Your cart is empty</h2>
        <p className="text-xs text-slate-500">Please add products to your cart before proceeding to checkout.</p>
        <Link to="/shop" className="inline-block bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl">
          Return to Shop
        </Link>
      </div>
    );
  }

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    const shippingInfo: ShippingAddress = {
      fullName,
      phone,
      email,
      address,
      city,
      province,
      postalCode,
      notes
    };

    const newOrder = createOrder(shippingInfo, paymentMethod, isGuest, email);
    navigate(`/order-confirmation/${newOrder.id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb / Back link */}
      <div className="flex items-center justify-between text-xs">
        <button
          onClick={() => navigate('/cart')}
          className="flex items-center gap-1.5 font-semibold text-slate-600 hover:text-emerald-700 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Cart
        </button>
        <div className="text-slate-400 font-medium">Checkout - Fast Nationwide Shipping</div>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 Columns: Delivery & Payment Details */}
        <div className="lg:col-span-7 space-y-6">
          {/* Customer Account or Guest Toggle */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-700" /> Customer Information
            </h2>

            <div className="flex gap-4 border-b border-slate-100 pb-4 text-xs font-semibold">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="checkoutType"
                  checked={isGuest}
                  onChange={() => setIsGuest(true)}
                  className="text-emerald-700 focus:ring-emerald-600"
                />
                <span>Checkout as Guest</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="checkoutType"
                  checked={!isGuest}
                  onChange={() => setIsGuest(false)}
                  className="text-emerald-700 focus:ring-emerald-600"
                />
                <span>Save Info for Account</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ali Hassan"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone Number (WhatsApp) *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 03001234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Delivery Address Details */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Truck className="w-5 h-5 text-emerald-700" /> Delivery Address in Pakistan
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Street Address, House #, Sector / Block *</label>
                <input
                  type="text"
                  required
                  placeholder="House 123, Street 4, Sector F-8/2"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">City *</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-semibold text-slate-800"
                >
                  <option value="Lahore">Lahore</option>
                  <option value="Karachi">Karachi</option>
                  <option value="Islamabad">Islamabad</option>
                  <option value="Rawalpindi">Rawalpindi</option>
                  <option value="Faisalabad">Faisalabad</option>
                  <option value="Peshawar">Peshawar</option>
                  <option value="Multan">Multan</option>
                  <option value="Quetta">Quetta</option>
                  <option value="Sialkot">Sialkot</option>
                  <option value="Gujranwala">Gujranwala</option>
                  <option value="Other">Other City</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Province *</label>
                <select
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-semibold text-slate-800"
                >
                  <option value="Punjab">Punjab</option>
                  <option value="Sindh">Sindh</option>
                  <option value="KPK">Khyber Pakhtunkhwa (KPK)</option>
                  <option value="Balochistan">Balochistan</option>
                  <option value="Gilgit-Baltistan">Gilgit-Baltistan</option>
                  <option value="AJK">Azad Jammu & Kashmir</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Postal / ZIP Code (Optional)</label>
                <input
                  type="text"
                  placeholder="54000"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Delivery Notes / Landmark (Optional)</label>
                <input
                  type="text"
                  placeholder="Near Main Park / Gate # 2"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-700" /> Select Payment Method
            </h2>

            <div className="space-y-3 text-xs">
              {/* COD */}
              <label
                className={`flex items-start gap-3 p-4 rounded-xl border-2 transition cursor-pointer ${
                  paymentMethod === 'cod'
                    ? 'border-emerald-700 bg-emerald-50/50'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="mt-0.5 text-emerald-700 focus:ring-emerald-600"
                />
                <div className="space-y-1">
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span>Cash on Delivery (COD)</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                      Most Popular
                    </span>
                  </div>
                  <p className="text-slate-500">
                    Pay with physical cash when the courier rider delivers the package to your home address.
                  </p>
                </div>
              </label>

              {/* JazzCash */}
              <label
                className={`flex items-start gap-3 p-4 rounded-xl border-2 transition cursor-pointer ${
                  paymentMethod === 'jazzcash'
                    ? 'border-emerald-700 bg-emerald-50/50'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'jazzcash'}
                  onChange={() => setPaymentMethod('jazzcash')}
                  className="mt-0.5 text-emerald-700 focus:ring-emerald-600"
                />
                <div className="space-y-1">
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Building className="w-4 h-4 text-amber-600" />
                    <span>JazzCash Mobile Account / Wallet</span>
                  </div>
                  <p className="text-slate-500">
                    Transfer payment to our official JazzCash Till / Merchant ID after order placement.
                  </p>
                </div>
              </label>

              {/* Easypaisa */}
              <label
                className={`flex items-start gap-3 p-4 rounded-xl border-2 transition cursor-pointer ${
                  paymentMethod === 'easypaisa'
                    ? 'border-emerald-700 bg-emerald-50/50'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'easypaisa'}
                  onChange={() => setPaymentMethod('easypaisa')}
                  className="mt-0.5 text-emerald-700 focus:ring-emerald-600"
                />
                <div className="space-y-1">
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Building className="w-4 h-4 text-emerald-600" />
                    <span>Easypaisa Account / QR</span>
                  </div>
                  <p className="text-slate-500">
                    Instant transfer via Easypaisa mobile app. Account details will be shown on confirmation screen.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right 5 Columns: Order Summary & Place Order */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 sticky top-20">
            <h3 className="font-extrabold text-base text-slate-900 border-b border-slate-100 pb-3">
              Order Review
            </h3>

            {/* Items Summary */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1 divide-y divide-slate-100">
              {cart.map((item) => (
                <div key={item.id} className="pt-2 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-10 h-10 object-cover rounded-lg bg-slate-100"
                    />
                    <div>
                      <div className="font-bold text-slate-900 line-clamp-1">{item.product.name}</div>
                      <div className="text-[10px] text-slate-500">
                        Qty: {item.quantity} {item.selectedVariant ? `(${item.selectedVariant.name})` : ''}
                      </div>
                    </div>
                  </div>
                  <div className="font-extrabold text-slate-900">
                    Rs {(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
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
                <span>Shipping Fee</span>
                <span className="font-bold text-slate-900">
                  {shippingFee === 0 ? <span className="text-emerald-700 font-bold uppercase">FREE</span> : `Rs ${shippingFee}`}
                </span>
              </div>

              <div className="flex justify-between text-base font-extrabold text-slate-900 border-t border-slate-200 pt-3">
                <span>Total Payable</span>
                <span className="text-emerald-800">Rs {cartTotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 shadow-md transition"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Confirm & Place Order</span>
            </button>

            <p className="text-[11px] text-slate-400 text-center">
              By clicking place order, you agree to everydayessential store delivery & privacy terms.
            </p>
          </div>

          <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-emerald-950 text-xs space-y-2">
            <div className="font-bold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>100% Satisfaction Guarantee</span>
            </div>
            <p className="text-emerald-800 text-[11px] leading-relaxed">
              Our support team verifies all orders before dispatch. We will contact you via phone or WhatsApp if any address confirmation is needed.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};
