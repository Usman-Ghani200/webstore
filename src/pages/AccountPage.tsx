import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, MapPin, ExternalLink, ShoppingBag, Truck } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const AccountPage: React.FC = () => {
  const { orders } = useStore();
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses'>('orders');

  // Extract saved addresses from existing orders
  const savedAddresses = Array.from(
    new Set(orders.map((o) => JSON.stringify(o.shippingAddress)))
  ).map((str) => JSON.parse(str));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Customer Account</h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your recent Everyday Essential order history and saved delivery addresses
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 text-sm font-bold">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 px-4 border-b-2 flex items-center gap-2 transition ${
            activeTab === 'orders'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Order History ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('addresses')}
          className={`pb-3 px-4 border-b-2 flex items-center gap-2 transition ${
            activeTab === 'addresses'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Saved Delivery Addresses ({savedAddresses.length})</span>
        </button>
      </div>

      {/* Tab 1: Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
              <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-slate-800">No Orders Yet</h3>
              <p className="text-xs text-slate-500">You have not placed any orders with us yet.</p>
              <Link
                to="/shop"
                className="inline-block bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-emerald-800 transition"
              >
                Browse Shop
              </Link>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Tracking #</span>
                    <div className="font-mono font-bold text-emerald-800 text-sm">
                      {order.trackingNumber}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold px-2.5 py-1 rounded-full uppercase">
                      Status: {order.status}
                    </span>
                    <span className="text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                    <Link
                      to={`/order-confirmation/${order.id}`}
                      className="font-bold text-emerald-700 hover:underline flex items-center gap-1"
                    >
                      <span>Receipt</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>

                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{item.product.name}</span>
                        <span className="text-slate-500">x{item.quantity}</span>
                      </div>
                      <span className="font-bold text-slate-800">
                        Rs {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs font-bold text-slate-900">
                  <span>Total Amount Paid / COD:</span>
                  <span className="text-emerald-800 text-sm">Rs {order.total.toLocaleString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Saved Addresses */}
      {activeTab === 'addresses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedAddresses.length === 0 ? (
            <div className="md:col-span-2 bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-2 text-slate-500 text-xs">
              <MapPin className="w-10 h-10 text-slate-300 mx-auto" />
              <p>No addresses saved yet. Addresses are saved automatically when you place an order!</p>
            </div>
          ) : (
            savedAddresses.map((addr: any, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2 text-xs"
              >
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <Truck className="w-4 h-4 text-emerald-700" />
                  <span>{addr.fullName}</span>
                </div>
                <p className="text-slate-600">{addr.address}</p>
                <p className="text-slate-600">
                  {addr.city}, {addr.province} {addr.postalCode ? `(${addr.postalCode})` : ''}
                </p>
                <p className="text-slate-500 font-medium">Phone: {addr.phone}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
