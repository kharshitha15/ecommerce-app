import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('search');

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                let url = '/api/v1/products';
                if (searchQuery) {
                    url = `/api/v1/products/search?query=${searchQuery}`;
                }
                const res = await axios.get(url);
                setProducts(res.data);
            } catch (err) {
                console.error("Failed to fetch products", err);
            }
            setLoading(false);
        };

        fetchProducts();
    }, [searchQuery]);

    return (
        <div className="animate-fade-in pb-12">
            {!searchQuery && (
                <div className="relative rounded-2xl overflow-hidden mb-12 h-64 md:h-96 shadow-xl">
                    <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=80" alt="Banner" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-900/40 flex items-center">
                        <div className="p-8 md:p-16 text-white max-w-xl">
                            <h1 className="text-4xl md:text-6xl font-bold mb-4">Discover the Future</h1>
                            <p className="text-lg md:text-xl text-gray-200 mb-8">Premium products curated just for you. Upgrade your lifestyle today.</p>
                            <button className="bg-amber-500 text-black px-8 py-3 rounded-full font-bold hover:bg-amber-400 transition-colors hover:scale-105 transform inline-block">Shop Now</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="mb-8 flex items-center justify-between">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {searchQuery ? `Search Results for "${searchQuery}"` : 'Featured Products'}
                </h2>
                {!loading && <span className="text-gray-500">{products.length} products found</span>}
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
                </div>
            ) : products.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-xl text-gray-600">No products found. Please try another search term.</h3>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;
