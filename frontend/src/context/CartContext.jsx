import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from '../api/axiosInstance';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);

    // Initial load: either from backend (if logged in) or localStorage (if guest)
    useEffect(() => {
        if (user) {
            fetchBackendCart();
        } else {
            const saved = localStorage.getItem('cart');
            setCart(saved ? JSON.parse(saved) : []);
        }
    }, [user]);

    // Handle cart merging on login
    useEffect(() => {
        const handleLoginMerge = async () => {
            const guestCart = JSON.parse(localStorage.getItem('cart') || '[]');
            if (user && guestCart.length > 0) {
                setLoading(true);
                try {
                    // Merge guest cart items into backend
                    for (const item of guestCart) {
                        await axios.post(`/api/v1/cart/add`, {
                            productId: item.product.id,
                            quantity: item.quantity
                        });
                    }
                    localStorage.removeItem('cart');
                    await fetchBackendCart();
                } catch (error) {
                    console.error("Failed to merge cart:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        if (user) {
            handleLoginMerge();
        }
    }, [user]);

    // Persist guest cart to localStorage
    useEffect(() => {
        if (!user) {
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    }, [cart, user]);

    const fetchBackendCart = async () => {
        try {
            const res = await axios.get('/api/v1/cart');
            // Backend wraps response in ApiResponse, so data is in res.data.data
            const cartData = res.data.data.items.map(item => ({
                product: {
                    id: item.productId,
                    name: item.productName,
                    price: item.productPrice,
                    imageUrl: item.productImageUrl
                },
                quantity: item.quantity
            }));
            setCart(cartData);
        } catch (error) {
            console.error("Error fetching cart from backend:", error);
        }
    };

    const addToCart = async (product, quantity = 1) => {
        if (user) {
            try {
                await axios.post('/api/v1/cart/add', { productId: product.id, quantity });
                await fetchBackendCart();
            } catch (error) {
                console.error("Error adding to backend cart:", error);
            }
        } else {
            setCart(prev => {
                const existing = prev.find(item => item.product.id === product.id);
                if (existing) {
                    return prev.map(item => 
                        item.product.id === product.id 
                            ? { ...item, quantity: item.quantity + quantity }
                            : item
                    );
                }
                return [...prev, { product, quantity }];
            });
        }
    };

    const removeFromCart = async (productId) => {
        if (user) {
            try {
                await axios.delete(`/api/v1/cart/remove/${productId}`);
                await fetchBackendCart();
            } catch (error) {
                console.error("Error removing from backend cart:", error);
            }
        } else {
            setCart(prev => prev.filter(item => item.product.id !== productId));
        }
    };

    const updateQuantity = async (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }

        if (user) {
            try {
                // Find current quantity to calculate diff for /add endpoint
                const currentItem = cart.find(i => i.product.id === productId);
                const currentQty = currentItem ? currentItem.quantity : 0;
                const diff = quantity - currentQty;
                
                if (diff !== 0) {
                    await axios.post('/api/v1/cart/add', { productId, quantity: diff });
                    await fetchBackendCart();
                }
            } catch (error) {
                console.error("Error updating quantity in backend:", error);
            }
        } else {
            setCart(prev => prev.map(item => 
                item.product.id === productId ? { ...item, quantity } : item
            ));
        }
    };

    const clearCart = async () => {
        if (user) {
            try {
                await axios.delete('/api/v1/cart/clear');
                setCart([]);
            } catch (error) {
                console.error("Error clearing backend cart:", error);
            }
        } else {
            setCart([]);
        }
    };

    const cartTotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, loading }}>
            {children}
        </CartContext.Provider>
    );
};
