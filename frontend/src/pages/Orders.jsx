import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { FiPackage, FiTruck, FiCheck, FiClock } from 'react-icons/fi';

const Orders = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('/api/v1/orders', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOrders(res.data.sort((a,b) => new Date(b.orderDate) - new Date(a.orderDate)));
            } catch (err) {
                console.error("Failed to fetch orders", err);
            }
            setLoading(false);
        };
        fetchOrders();
    }, [user]);

    const getStatusIcon = (status) => {
        const s = status ? status.toUpperCase() : '';
        if (s.includes('DELIVERED')) return <FiCheck className="text-green-500" size={24} />;
        if (s.includes('SHIPPED') || s.includes('WAY')) return <FiTruck className="text-blue-500" size={24} />;
        if (s.includes('PROCESSING') || s.includes('PAID')) return <FiPackage className="text-amber-500" size={24} />;
        return <FiClock className="text-gray-500" size={24} />;
    };

    if (loading) return <div className="p-8 text-center">Loading orders...</div>;

    if (orders.length === 0) {
        return (
            <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
                <h2 className="text-2xl font-bold mb-4">You have no orders</h2>
                <Link to="/" className="inline-block bg-amber-500 text-black font-bold px-6 py-2 rounded-full hover:bg-amber-400">Shop Now</Link>
            </div>
        );
    }

    return (
        <div className="animate-fade-in space-y-6">
            <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
            {orders.map(order => (
                <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 border-b border-gray-200 p-4 md:p-6 flex flex-wrap gap-4 items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Order Placed</p>
                            <p className="font-semibold">{new Date(order.orderDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Total</p>
                            <p className="font-semibold">${order.totalAmount.toFixed(2)}</p>
                        </div>
                        <div className="flex-grow text-right md:text-left">
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Order #</p>
                            <p className="font-mono text-sm">{order.razorpayOrderId || `ORD-${order.id}`}</p>
                        </div>
                    </div>
                    
                    <div className="p-4 md:p-6">
                        <div className="flex items-center gap-3 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                            {getStatusIcon(order.status)}
                            <div>
                                <h3 className="font-bold text-lg leading-none">{order.status || 'Processing'}</h3>
                                <p className="text-sm text-gray-500 mt-1">Currently being handled by our fulfillment center.</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {order.items.map(item => (
                                <div key={item.id} className="flex gap-4 items-center">
                                    <img src={item.product?.imageUrl || 'https://via.placeholder.com/100'} alt="" className="w-20 h-20 object-cover rounded-lg bg-gray-100" />
                                    <div className="flex-grow">
                                        <Link to={`/product/${item.product?.id}`} className="font-semibold hover:text-amber-500 transition-colors">{item.product?.name}</Link>
                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                    <div className="font-bold text-lg">${(item.price * item.quantity).toFixed(2)}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Orders;
