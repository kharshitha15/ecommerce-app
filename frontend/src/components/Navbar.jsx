import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FiShoppingCart, FiSearch, FiUser, FiLogOut } from 'react-icons/fi';
import { useState } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cart } = useCart();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/?search=${searchQuery}`);
        } else {
            navigate('/');
        }
    };

    return (
        <nav className="bg-slate-900 text-white sticky top-0 z-50 shadow-lg">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="flex items-center justify-between h-16 md:h-20">
                    <Link to="/" className="flex items-center gap-2">
                        <span className="text-2xl font-bold tracking-tighter text-amber-500">Emo</span>
                        <span className="text-2xl font-medium tracking-tighter hidden sm:block">Store</span>
                    </Link>

                    <form onSubmit={handleSearch} className="flex-grow max-w-2xl mx-4 lg:mx-12 hidden sm:flex">
                        <div className="relative w-full flex items-center">
                            <input 
                                type="text" 
                                placeholder="Search products..." 
                                className="w-full h-10 pl-4 pr-10 rounded-l-md text-black focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all border-none"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button type="submit" className="h-10 px-4 bg-amber-500 hover:bg-amber-600 rounded-r-md transition-colors text-black flex items-center justify-center">
                                <FiSearch size={20} />
                            </button>
                        </div>
                    </form>

                    <div className="flex items-center gap-4 sm:gap-6">
                        {user ? (
                            <div className="flex items-center gap-2 sm:gap-4">
                                <Link to="/orders" className="hidden md:flex flex-col items-start leading-tight hover:text-amber-500">
                                    <span className="text-xs text-gray-300">Returns</span>
                                    <span className="text-sm font-semibold">& Orders</span>
                                </Link>
                                <Link to="/account" className="flex flex-col items-start leading-tight md:pl-2 md:border-l border-gray-600 hover:text-amber-500">
                                    <span className="text-xs text-gray-300 hidden md:inline">Hello, {user.firstName || 'User'}</span>
                                    <span className="text-sm font-semibold hidden md:inline">Account</span>
                                    <FiUser size={22} className="md:hidden" />
                                </Link>
                                <button onClick={logout} className="hover:text-amber-500 transition-colors flex items-center gap-2 bg-slate-800 px-2 sm:px-3 py-1.5 rounded text-xs sm:text-sm font-bold ml-1 sm:ml-2" title="Logout">
                                    <FiLogOut size={18} /> <span className="hidden xs:inline">Logout</span>
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className="flex items-center gap-2 hover:text-amber-500 transition-colors">
                                <FiUser size={22} />
                                <div className="hidden md:flex flex-col items-start leading-tight">
                                    <span className="text-xs text-gray-300">Hello, sign in</span>
                                    <span className="text-sm font-semibold">Account & Lists</span>
                                </div>
                            </Link>
                        )}

                        <Link to="/cart" className="relative flex items-center hover:text-amber-400 transition-colors">
                            <FiShoppingCart size={24} />
                            <span className="ml-2 font-bold hidden sm:inline">Cart</span>
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -left-2 bg-amber-500 text-slate-900 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>
            
            <div className="bg-slate-800 text-sm py-2 px-4 shadow-md z-10 relative">
                <div className="container mx-auto max-w-7xl flex gap-6 overflow-x-auto whitespace-nowrap">
                    {user?.role === 'ADMIN' && (
                        <Link to="/admin" className="font-semibold text-amber-400 hover:text-amber-300">Admin Dashboard</Link>
                    )}
                    <Link to="/" className="hover:text-amber-400">All</Link>
                    <Link to="/" className="hover:text-amber-400">Today's Deals</Link>
                    <Link to="/customer-service" className="hover:text-amber-400">Customer Service</Link>
                    <Link to="/registry" className="hover:text-amber-400">Registry</Link>
                    <Link to={user?.role === 'ADMIN' ? '/admin' : '/coming-soon'} className="hover:text-amber-400">Sell</Link>
                </div>
            </div>
            {/* Mobile Search Bar */}
            <div className="px-4 pb-3 sm:hidden">
                <form onSubmit={handleSearch} className="flex">
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        className="w-full h-10 pl-4 pr-10 rounded-l-md text-black focus:outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit" className="h-10 px-4 bg-amber-500 rounded-r-md text-black">
                        <FiSearch size={20} />
                    </button>
                </form>
            </div>
        </nav>
    );
};

export default Navbar;
