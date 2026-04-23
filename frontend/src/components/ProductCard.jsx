import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiPlus, FiShoppingCart } from 'react-icons/fi';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

    return (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col h-full border border-gray-100 relative">
            {product.stockQuantity < 50 && (
                 <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                     Low Stock
                 </div>
            )}
            <Link to={`/product/${product.id}`} className="block relative pt-[100%] bg-gray-50 overflow-hidden">
                <img 
                    src={product.imageUrl || `https://via.placeholder.com/300?text=${product.name}`} 
                    alt={product.name} 
                    className="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
            </Link>
            <div className="p-5 flex flex-col flex-grow">
                <p className="text-xs text-amber-600 font-semibold mb-1 uppercase tracking-wider">{product.categoryName || product.category}</p>
                <Link to={`/product/${product.id}`}>
                    <h3 className="font-semibold text-lg text-gray-800 line-clamp-2 hover:text-amber-600 transition-colors">{product.name}</h3>
                </Link>
                <div className="mt-auto pt-4 flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">${(product.price || 0).toFixed(2)}</span>
                    <button 
                        onClick={() => addToCart(product)}
                        className="bg-slate-900 hover:bg-amber-500 text-white hover:text-black w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-md group/btn"
                        title="Add to cart"
                    >
                        <FiShoppingCart className="group-hover/btn:scale-110 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
