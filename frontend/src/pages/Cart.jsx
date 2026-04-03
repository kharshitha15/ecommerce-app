import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiTrash2, FiArrowRight, FiArrowLeft } from 'react-icons/fi';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

    if (cart.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-20 animate-fade-in bg-white rounded-2xl shadow-sm border border-gray-100">
                <img src="https://cdni.iconscout.com/illustration/premium/thumb/empty-cart-2130356-1800917.png" alt="Empty Cart" className="w-64 h-64 object-contain mb-8 opacity-50" />
                <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
                <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
                <Link to="/" className="bg-amber-500 text-black px-8 py-3 rounded-full font-bold hover:bg-amber-400 transition-colors flex items-center gap-2">
                    <FiArrowLeft /> Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    {cart.map((item) => (
                        <div key={item.product.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-6 items-center flex-wrap sm:flex-nowrap">
                            <img src={item.product.imageUrl || `https://via.placeholder.com/150?text=${item.product.name}`} alt={item.product.name} className="w-24 h-24 object-contain rounded-md bg-gray-50 mix-blend-multiply" />
                            <div className="flex-grow">
                                <Link to={`/product/${item.product.id}`}>
                                    <h3 className="font-semibold text-lg hover:text-amber-600 transition-colors">{item.product.name}</h3>
                                </Link>
                                <p className="text-amber-600 text-sm font-semibold uppercase">{item.product.category}</p>
                                <div className="flex items-center gap-4 mt-4">
                                    <div className="flex items-center border border-gray-300 rounded-lg bg-white overflow-hidden">
                                        <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors">-</button>
                                        <span className="px-3 py-1 border-l border-r border-gray-300 font-medium text-sm">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors">+</button>
                                    </div>
                                    <button onClick={() => removeFromCart(item.product.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition-colors" title="Remove item">
                                        <FiTrash2 size={18} />
                                    </button>
                                </div>
                            </div>
                            <div className="text-right sm:w-32">
                                <p className="text-xl font-bold">${(item.product.price * item.quantity).toFixed(2)}</p>
                                <p className="text-xs text-gray-500">${item.product.price.toFixed(2)} each</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
                        <h3 className="text-xl font-bold mb-4">Order Summary</h3>
                        <div className="space-y-3 text-sm text-gray-600 mb-6">
                            <div className="flex justify-between">
                                <span>Items ({cart.reduce((total, item) => total + item.quantity, 0)}):</span>
                                <span>${cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping:</span>
                                <span>Free</span>
                            </div>
                            <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between font-bold text-lg text-gray-900">
                                <span>Order Total:</span>
                                <span>${cartTotal.toFixed(2)}</span>
                            </div>
                        </div>
                        <Link to="/checkout" className="w-full bg-amber-500 hover:bg-amber-400 text-black py-4 rounded-full font-bold flex justify-center items-center gap-2 transition-transform hover:scale-105 shadow-md">
                            Proceed to Checkout <FiArrowRight />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
