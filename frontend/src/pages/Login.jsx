import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            console.error("Login attempt failed:", err);
            const msg = err.response?.data?.error || err.response?.data?.message || 'Invalid email or password.';
            setError(msg);
        }
        setLoading(false);
    };

    return (
        <div className="flex justify-center items-center min-h-[70vh] animate-fade-in">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full max-w-md">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
                    <p className="text-gray-500">Sign in to continue shopping</p>
                </div>
                
                {error && <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6 border border-red-100">{error}</div>}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                        <input 
                            type="email" 
                            required 
                            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none transition-shadow"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                        <input 
                            type="password" 
                            required 
                            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none transition-shadow"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-slate-900 text-white font-bold py-4 rounded-full hover:bg-black transition-colors disabled:bg-gray-400"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                    
                    <div className="text-center mt-6">
                        <Link to="/register" className="text-amber-600 hover:text-amber-700 font-semibold transition-colors">
                            Don't have an account? Sign up
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
