import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axiosInstance';
import { FiCheckCircle } from 'react-icons/fi';

const Checkout = () => {
    const { cart, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const [paymentMethod, setPaymentMethod] = useState('ONLINE'); // ONLINE | COD
    const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvc: '', name: '' });

    if (!user) {
        return (
            <div className="text-center p-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold mb-4">Account Required</h2>
                <p className="mb-6 text-gray-600">Please sign in to complete your purchase.</p>
                <Link to="/login" className="bg-amber-500 px-8 py-3 rounded-full font-bold text-black hover:bg-amber-400">Sign In</Link>
            </div>
        );
    }

    if (cart.length === 0 && !success) {
        navigate('/cart');
        return null;
    }

    const placeOrder = async () => {
        setLoading(true);
        try {
            const items = cart.map(item => ({
                productId: item.product.id,
                quantity: item.quantity
            }));
            
            // Create order first
            const res = await axios.post('/api/v1/orders', { items, paymentMethod });

            if (paymentMethod === 'COD') {
                clearCart();
                setSuccess(true);
                setLoading(false);
                return;
            }

            // ONLINE payment flow (Razorpay)
            const { razorpayOrderId, amount } = res.data;
            const options = {
                key: "rzp_test_YourTestKeyHere",
                amount: amount * 100, 
                currency: "INR",
                name: "EmoStore",
                description: "Purchase Order",
                order_id: razorpayOrderId,
                handler: async function (response) {
                    try {
                        const verifyRes = await axios.post('/api/v1/payment/verify', {
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature
                        });
                        if (verifyRes.data.status === 'success') {
                            clearCart();
                            setSuccess(true);
                        }
                    } catch (err) {
                        alert("Payment verification failed!");
                    }
                },
                prefill: {
                    name: `${user.firstName} ${user.lastName}`,
                    email: user.email,
                },
                theme: { color: "#f59e0b" }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response){
                alert("Payment Failed. Reason: " + response.error.description);
            });
            rzp.open();

        } catch (error) {
            console.error('FATAL ERROR DURING ORDER PLACEMENT:', error);
            const msg = error.response?.data?.error || error.response?.data?.message || error.message || "Unknown error";
            alert(`Order placement failed: ${msg}`);
        }
        setLoading(false);
    };

    if (success) {
        return (
            <div className="text-center p-20 animate-fade-in bg-white rounded-2xl shadow-sm border border-gray-100">
                <FiCheckCircle className="mx-auto text-green-500 mb-6" size={80} />
                <h2 className="text-3xl font-bold mb-4">Order Placed Successfully!</h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    {paymentMethod === 'COD' 
                        ? 'Your order has been placed. Please pay $'+cartTotal.toFixed(2)+' upon delivery.' 
                        : 'Payment completed. Thank you for your purchase, '+user.firstName + '.'}
                </p>
                <Link to="/" className="bg-slate-900 text-white px-8 py-3 rounded-full font-bold hover:bg-black transition-colors inline-block shadow-md">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="grid lg:grid-cols-2 gap-12 animate-fade-in">
            <div className="space-y-8">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-bold mb-6 border-b border-gray-100 pb-4">Checkout details</h2>
                    
                    <h3 className="font-semibold text-lg mb-4">Shipping Information</h3>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <input type="text" placeholder="First Name" defaultValue={user?.firstName} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
                        <input type="text" placeholder="Last Name" defaultValue={user?.lastName} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
                        <input type="text" placeholder="Address" className="w-full p-3 border border-gray-300 rounded-lg col-span-2 focus:ring-2 focus:ring-amber-500 outline-none" />
                        <input type="text" placeholder="City" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
                        <input type="text" placeholder="Postal Code" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" />
                    </div>
                    
                    <h3 className="font-semibold text-lg mb-4 mt-8">Payment Method</h3>
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <button 
                            onClick={() => setPaymentMethod('ONLINE')}
                            className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'ONLINE' ? 'border-amber-500 bg-amber-50 text-amber-900' : 'border-gray-100 hover:border-gray-300'}`}
                        >
                            <span className="font-bold">Pay Online</span>
                            <span className="text-xs opacity-75 text-center">Credit/Debit, UPI, Netbanking</span>
                        </button>
                        <button 
                            onClick={() => setPaymentMethod('COD')}
                            className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'COD' ? 'border-amber-500 bg-amber-50 text-amber-900' : 'border-gray-100 hover:border-gray-300'}`}
                        >
                            <span className="font-bold">Cash on Delivery</span>
                            <span className="text-xs opacity-75 text-center">Pay when you receive the order</span>
                        </button>
                    </div>

                    {paymentMethod === 'ONLINE' && (
                        <div className="space-y-4 animate-slide-up">
                            <h3 className="font-semibold text-lg mb-4">Card Details</h3>
                            <div className="space-y-4">
                                <input 
                                    type="text" 
                                    placeholder="Cardholder Name" 
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" 
                                    value={cardDetails.name}
                                    onChange={e => setCardDetails({...cardDetails, name: e.target.value})}
                                />
                                <input 
                                    type="text" 
                                    placeholder="Card Number" 
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" 
                                    value={cardDetails.number}
                                    onChange={e => setCardDetails({...cardDetails, number: e.target.value})}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <input 
                                        type="text" 
                                        placeholder="MM/YY" 
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" 
                                        value={cardDetails.expiry}
                                        onChange={e => setCardDetails({...cardDetails, expiry: e.target.value})}
                                    />
                                    <input 
                                        type="text" 
                                        placeholder="CVC" 
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" 
                                        value={cardDetails.cvc}
                                        onChange={e => setCardDetails({...cardDetails, cvc: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <button 
                        onClick={placeOrder} 
                        disabled={loading}
                        className="w-full bg-slate-900 text-white font-bold py-4 rounded-full transition-all shadow-lg mt-8 hover:bg-black disabled:bg-gray-400"
                    >
                        {loading ? 'Processing...' : paymentMethod === 'COD' ? 'Place Order (COD)' : `Pay $${cartTotal.toFixed(2)} Now`}
                    </button>
                </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-2xl">
                <h2 className="text-2xl font-bold mb-6">Order summary</h2>
                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2">
                    {cart.map((item) => (
                        <div key={item.product.id} className="flex gap-4 items-center bg-white p-3 rounded-lg shadow-sm">
                            <div className="relative">
                                <img src={item.product.imageUrl} alt={item.product.name} className="w-16 h-16 object-contain mix-blend-multiply bg-gray-50 rounded" />
                                <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-xs w-5 h-5 flex justify-center items-center rounded-full font-bold">{item.quantity}</span>
                            </div>
                            <div className="flex-grow">
                                <p className="font-semibold text-sm line-clamp-1">{item.product.name}</p>
                                <p className="text-gray-500 text-xs">${item.product.price.toFixed(2)} each</p>
                            </div>
                            <div className="font-bold text-sm">
                                ${(item.product.price * item.quantity).toFixed(2)}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="border-t border-gray-200 mt-6 pt-6 space-y-3">
                    <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>Shipping</span>
                        <span>Free</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-gray-900 mt-4 border-t border-gray-200 pt-4">
                        <span>Order Total</span>
                        <span>${cartTotal.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
