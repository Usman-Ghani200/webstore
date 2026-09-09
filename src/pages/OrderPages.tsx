import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle,
  PackageCheck,
  Truck,
  ArrowRight,
  Copy,
  ShoppingBag,
  Clock
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { orders } = useStore();

  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Order Not Found</h2>
        <p className="text-xs text-slate-500">We could not locate this order ID in our records.</p>
        <Link to="/" className="inline-block bg-emerald-700 text-white text-xs font-bold px-6 py-2 rounded-xl">
          Return Home
        </Link>
      </div>
    );
  }

  const copyTracking = () => {
    navigator.clipboard.writeText(order.trackingNumber);
    alert('Tracking ID copied: ' + order.trackingNumber);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Top Banner */}
      <div className="bg-emerald-800 text-white p-8 rounded-3xl shadow-md text-center space-y-3">
        <div className="w-16 h-16 bg-emerald-700 rounded-full flex items-center justify-center mx-auto border-4 border-emerald-600">
          <CheckCircle className="w-10 h-10 text-amber-300" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Order Placed Successfully!</h1>
        <p className="text-emerald-100 text-xs sm:text-sm max-w-md mx-auto">
          Thank you for shopping with everydayessential.pk! We have received your order and are preparing it for dispatch.
        </p>
      </div>

      {/* Tracking Box */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Your Order Tracking Code</div>
        <div className="flex items-center justify-between bg-slate-50 border border-slate-200 p-3 rounded-xl">
          <div className="font-mono text-lg font-extrabold text-emerald-800 tracking-wider">
            {order.trackingNumber}
          </div>
          <button
            onClick={copyTracking}
            className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition"
          >
            <Copy className="w-3.5 h-3.5" /> Copy
          </button>
        </div>
        <p className="text-[11px] text-slate-500">
          Keep this tracking number safe! You can use it anytime on our{' '}
          <Link to="/track" className="text-emerald-700 font-bold underline">
            Order Tracking Page
          </Link>{' '}
          to monitor live delivery status.
        </p>
      </div>

      {/* Order Summary Details */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">Order Summary</h3>
            <p className="text-[11px] text-slate-400">Placed on {new Date(order.createdAt).toLocaleString()}</p>
          </div>
          <span className="bg-amber-100 text-amber-800 font-bold text-xs px-3 py-1 rounded-full uppercase flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Status: {order.status}
          </span>
        </div>

        {/* Items */}
        <div className="space-y-3 divide-y divide-slate-100">
          {order.items.map((item) => (
            <div key={item.id} className="pt-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-12 h-12 object-cover rounded-xl bg-slate-100"
                />
                <div>
                  <div className="font-bold text-slate-900">{item.product.name}</div>
                  <div className="text-[11px] text-slate-500">
                    Qty: {item.quantity} {item.selectedVariant ? `• ${item.selectedVariant.name}` : ''}
                  </div>
                </div>
              </div>
              <div className="font-extrabold text-slate-900">
                Rs {(item.price * item.quantity).toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        {/* Pricing Summary */}
        <div className="border-t border-slate-200 pt-4 space-y-2 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal</span>
            <span className="font-bold text-slate-900">Rs {order.subtotal.toLocaleString()}</span>
          </div>
          {order.discountTotal > 0 && (
            <div className="flex justify-between text-emerald-700 font-semibold">
              <span>Discount</span>
              <span>- Rs {order.discountTotal.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between text-slate-600">
            <span>Shipping</span>
            <span className="font-bold text-slate-900">
              {order.shippingFee === 0 ? 'FREE' : `Rs ${order.shippingFee}`}
            </span>
          </div>
          <div className="flex justify-between text-base font-extrabold text-slate-900 border-t border-slate-200 pt-3">
            <span>Total Paid / Due</span>
            <span className="text-emerald-800">Rs {order.total.toLocaleString()}</span>
          </div>
        </div>

        {/* Customer Address & Payment Method */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-200 pt-4 text-xs">
          <div>
            <h4 className="font-bold text-slate-800 mb-1 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-emerald-700" /> Shipping Address
            </h4>
            <div className="text-slate-600 space-y-0.5">
              <p className="font-bold text-slate-900">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.address}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.province}</p>
              <p>Phone: {order.shippingAddress.phone}</p>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-800 mb-1 flex items-center gap-1.5">
              <PackageCheck className="w-4 h-4 text-emerald-700" /> Payment Info
            </h4>
            <div className="text-slate-600 space-y-1">
              <p className="font-bold text-slate-900 uppercase">
                Method: {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}
              </p>
              <p>
                Payment Status:{' '}
                <span className="font-bold text-amber-700 uppercase">{order.paymentStatus}</span>
              </p>
              {order.paymentMethod !== 'cod' && (
                <div className="bg-amber-50 p-2 rounded-lg border border-amber-200 text-[11px] text-amber-900">
                  Please complete transfer to our account and reference tracking ID #{order.trackingNumber}.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-6 py-3 rounded-xl transition shadow-xs"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Continue Shopping</span>
        </Link>

        <Link
          to="/account"
          className="text-xs font-bold text-slate-700 hover:text-emerald-700 flex items-center gap-1"
        >
          <span>View Account History</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export const OrderTrackingPage: React.FC = () => {
  const { orders } = useStore();
  const [inputTracking, setInputTracking] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<any | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputTracking.trim()) return;

    const queryClean = inputTracking.trim().toUpperCase();
    const found = orders.find(
      (o) => o.trackingNumber.toUpperCase() === queryClean || o.id.toUpperCase() === queryClean
    );

    setSearchedOrder(found || null);
    setHasSearched(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="text-center space-y-2 max-w-lg mx-auto">
        <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto">
          <Truck className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Track Your Package</h1>
        <p className="text-xs text-slate-500">
          Enter your Everyday Essential order tracking ID (e.g. EE-123456) to check realtime fulfillment status.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs max-w-lg mx-auto">
        <form onSubmit={handleTrackSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tracking Number / Order ID
            </label>
            <input
              type="text"
              required
              placeholder="e.g. EE-482910"
              value={inputTracking}
              onChange={(e) => setInputTracking(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm font-mono font-bold text-slate-900 uppercase focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl text-xs transition"
          >
            Track Order Status
          </button>
        </form>

        {hasSearched && (
          <div className="mt-6 pt-6 border-t border-slate-100">
            {!searchedOrder ? (
              <div className="bg-rose-50 text-rose-800 p-4 rounded-xl text-xs text-center">
                No active order found with tracking number "{inputTracking}". Please verify your order number and try again.
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Tracking ID</span>
                    <span className="font-mono font-bold text-emerald-800">{searchedOrder.trackingNumber}</span>
                  </div>
                  <span className="bg-emerald-100 text-emerald-900 font-bold px-3 py-1 rounded-full uppercase">
                    Status: {searchedOrder.status}
                  </span>
                </div>

                <div className="space-y-2 text-slate-600">
                  <div className="flex justify-between">
                    <span>Customer Name:</span>
                    <span className="font-bold text-slate-900">{searchedOrder.shippingAddress.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Destination City:</span>
                    <span className="font-bold text-slate-900">{searchedOrder.shippingAddress.city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Items Count:</span>
                    <span className="font-bold text-slate-900">{searchedOrder.items.length} item(s)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Method:</span>
                    <span className="font-bold text-slate-900 uppercase">{searchedOrder.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between text-sm font-extrabold text-slate-900 border-t border-slate-200 pt-2">
                    <span>Total Amount:</span>
                    <span className="text-emerald-800">Rs {searchedOrder.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
