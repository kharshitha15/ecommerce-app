import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../api/axiosInstance';
import { useCart } from '../context/CartContext';
import { FiCheck, FiTruck, FiShield, FiArrowLeft } from 'react-icons/fi';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();
    const [added, setAdded] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`/api/v1/products/${id}`);
                // Extract data from ApiResponse wrapper
                const data = res.data.success ? res.data.data : res.data;
                setProduct(data);
            } catch (err) {
                console.error("Failed to fetch product", err);
            }
            setLoading(false);
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        addToCart(product, quantity);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    if (loading) return <div className="flex justify-center p-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div></div>;
    if (!product) return <div className="text-center p-20 text-xl">Product not found</div>;

    return (
        <div className="animate-fade-in bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-gray-100">
            <Link to="/" className="inline-flex items-center text-gray-500 hover:text-amber-600 mb-6 transition-colors group">
                <FiArrowLeft className="mr-2 transform group-hover:-translate-x-1 transition-transform" /> Back to products
            </Link>
            
            <div className="grid md:grid-cols-2 gap-12">
                <div className="rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center p-8 aspect-square relative">
                    <img 
                        src={product.imageUrl || `https://via.placeholder.com/600?text=${product.name}`} 
                        alt={product.name} 
                        className="mix-blend-multiply w-full h-full object-contain"
                    />
                </div>
                <div className="flex flex-col">
                    <p className="text-amber-600 font-semibold uppercase tracking-wider mb-2">{product.categoryName || product.category}</p>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
                    
                    <div className="mb-6 flex items-baseline gap-4">
                        <span className="text-4xl font-extrabold text-gray-900">${product.price.toFixed(2)}</span>
                    </div>

                    <p className="text-gray-600 text-lg leading-relaxed mb-8 border-b border-gray-100 pb-8">{product.description}</p>
                    
                    <div className="mb-8">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity</label>
                        <div className="flex items-center border border-gray-300 rounded-lg w-32 bg-white">
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 hover:bg-gray-100 text-gray-600 w-1/3 rounded-l-lg transition-colors">-</button>
                            <span className="w-1/3 text-center border-l border-r border-gray-300 py-2 font-medium">{quantity}</span>
                            <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-2 hover:bg-gray-100 text-gray-600 w-1/3 rounded-r-lg transition-colors">+</button>
                        </div>
                        <p className="text-sm mt-3 text-green-600 flex items-center gap-1">
                            <FiCheck /> In Stock.
                        </p>
                    </div>

                    <div className="flex gap-4 mb-10">
                        <button 
                            onClick={handleAddToCart}
                            className={`flex-grow py-4 px-6 rounded-full font-bold transition-all shadow-md flex justify-center items-center gap-2 ${added ? 'bg-green-500 text-white' : 'bg-amber-500 hover:bg-amber-400 text-black'}`}
                        >
                            {added ? <><FiCheck size={20}/> Added to Cart</> : 'Add to Cart'}
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-auto">
                        <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-4 rounded-lg">
                            <FiTruck size={24} className="text-amber-500" />
                            <div className="text-sm">
                                <p className="font-semibold text-gray-900">Free Delivery</p>
                                <p>For all orders over $50</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-4 rounded-lg">
                            <FiShield size={24} className="text-amber-500" />
                            <div className="text-sm">
                                <p className="font-semibold text-gray-900">1 Year Warranty</p>
                                <p>Guaranteed replacement</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
