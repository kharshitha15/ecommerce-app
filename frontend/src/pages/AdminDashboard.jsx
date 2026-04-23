import { useState, useEffect } from 'react';
import axios from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FiBox, FiShoppingBag, FiUsers, FiPieChart, FiPlus, FiTrash2, FiEdit, FiCheckCircle, FiXCircle } from 'react-icons/fi';

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState('dashboard'); // dashboard | products | orders | users
    
    // Data states
    const [stats, setStats] = useState({ totalProducts: 0, totalOrders: 0, totalUsers: 0 });
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    
    // Form states
    const [formProduct, setFormProduct] = useState({ id: null, name: '', description: '', price: '', stockQuantity: '', category: '' });
    const [imageFile, setImageFile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (!user) return;
        if (user.role !== 'ADMIN') {
            navigate('/');
            return;
        }
        fetchStats();
        if (view === 'products') fetchProducts();
        if (view === 'orders') fetchOrders();
        if (view === 'users') fetchUsers();
    }, [user, view]);

    const fetchStats = async () => {
        try {
            const res = await axios.get('/api/v1/admin/dashboard/stats');
            setStats(res.data);
        } catch (err) { console.error(err); }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/v1/products');
            setProducts(res.data);
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/v1/admin/orders');
            setOrders(res.data);
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/v1/admin/users');
            setUsers(res.data);
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    // Product Handlers
    const handleProductSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            Object.keys(formProduct).forEach(key => {
                if (formProduct[key] !== null) formData.append(key, formProduct[key]);
            });
            if (imageFile) formData.append('image', imageFile);

            const config = {
                headers: { 
                    'Content-Type': 'multipart/form-data' 
                }
            };

            if (isEditing) {
                await axios.put(`/api/v1/admin/products/${formProduct.id}`, formData, config);
            } else {
                await axios.post('/api/v1/admin/products', formData, config);
            }
            
            resetProductForm();
            fetchProducts();
            alert("Product saved successfully!");
        } catch (err) {
            console.error(err);
            alert("Error saving product");
        }
        setLoading(false);
    };

    const resetProductForm = () => {
        setFormProduct({ id: null, name: '', description: '', price: '', stockQuantity: '', category: '' });
        setImageFile(null);
        setIsEditing(false);
    };

    const deleteProduct = async (id) => {
        if (!window.confirm("Delete this product?")) return;
        try {
            await axios.delete(`/api/v1/admin/products/${id}`);
            fetchProducts();
        } catch (err) { alert("Delete failed"); }
    };

    // Order Handlers
    const updateOrderStatus = async (id, status) => {
        try {
            await axios.put(`/api/v1/admin/orders/${id}/status?status=${status}`, {});
            fetchOrders();
        } catch (err) { alert("Status update failed"); }
    };

    // User Handlers
    const toggleUserBlock = async (id, currentStatus) => {
        try {
            await axios.put(`/api/v1/admin/users/${id}/block?enabled=${!currentStatus}`, {});
            fetchUsers();
        } catch (err) { alert("Action failed"); }
    };

    const deleteUser = async (id) => {
        if (!window.confirm("Delete this user?")) return;
        try {
            await axios.delete(`/api/v1/admin/users/${id}`);
            fetchUsers();
        } catch (err) { alert("Delete failed"); }
    };

    if (!user || user.role !== 'ADMIN') return null;

    return (
        <div className="flex min-h-[calc(100vh-120px)] bg-gray-50 rounded-3xl overflow-hidden shadow-xl border border-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white p-6 flex flex-col gap-2">
                <div className="mb-8 px-2">
                    <h2 className="text-xl font-bold text-amber-500">Admin Control</h2>
                    <p className="text-xs text-slate-400">EmoStore Management</p>
                </div>
                
                <SidebarItem active={view === 'dashboard'} icon={<FiPieChart/>} label="Dashboard" onClick={() => setView('dashboard')} />
                <SidebarItem active={view === 'products'} icon={<FiBox/>} label="Products" onClick={() => setView('products')} />
                <SidebarItem active={view === 'orders'} icon={<FiShoppingBag/>} label="Orders" onClick={() => setView('orders')} />
                <SidebarItem active={view === 'users'} icon={<FiUsers/>} label="Users" onClick={() => setView('users')} />
            </aside>

            {/* Main Content */}
            <main className="flex-grow p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-10">
                    <h1 className="text-3xl font-extrabold capitalize">{view} View</h1>
                    <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 text-sm font-medium">
                        Welcome, {user.firstName} (Admin)
                    </div>
                </header>

                {loading && <div className="text-center py-10 text-gray-500 animate-pulse">Loading data...</div>}

                {/* Dashboard View */}
                {view === 'dashboard' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                        <StatCard icon={<FiBox className="text-blue-500"/>} label="Total Products" value={stats.totalProducts} color="bg-blue-50" />
                        <StatCard icon={<FiShoppingBag className="text-green-500"/>} label="Total Orders" value={stats.totalOrders} color="bg-green-50" />
                        <StatCard icon={<FiUsers className="text-purple-500"/>} label="Total Users" value={stats.totalUsers} color="bg-purple-50" />
                    </div>
                )}

                {/* Products View */}
                {view === 'products' && (
                    <div className="grid lg:grid-cols-3 gap-8 animate-fade-in">
                        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit sticky top-0">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                {isEditing ? <FiEdit/> : <FiPlus/>} {isEditing ? 'Edit Product' : 'Add Product'}
                            </h2>
                            <form onSubmit={handleProductSubmit} className="space-y-4">
                                <input type="text" placeholder="Product Name" required className="input-field" value={formProduct.name} onChange={e => setFormProduct({...formProduct, name: e.target.value})} />
                                <textarea placeholder="Description" required className="input-field" rows="3" value={formProduct.description} onChange={e => setFormProduct({...formProduct, description: e.target.value})}></textarea>
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="number" placeholder="Price" required className="input-field" value={formProduct.price} onChange={e => setFormProduct({...formProduct, price: e.target.value})} />
                                    <input type="number" placeholder="Stock" required className="input-field" value={formProduct.stockQuantity} onChange={e => setFormProduct({...formProduct, stockQuantity: e.target.value})} />
                                </div>
                                <input type="text" placeholder="Category" required className="input-field" value={formProduct.category} onChange={e => setFormProduct({...formProduct, category: e.target.value})} />
                                <div className="pt-2">
                                    <label className="text-xs font-bold text-gray-400 block mb-2 uppercase">Image Upload</label>
                                    <input type="file" onChange={e => setImageFile(e.target.files[0])} className="text-sm w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 cursor-pointer" />
                                </div>
                                <div className="pt-4 flex gap-2">
                                    <button type="submit" className="flex-grow bg-amber-500 text-black font-bold py-3 rounded-xl hover:bg-amber-400 transition-colors shadow-md">Save Product</button>
                                    {isEditing && <button onClick={resetProductForm} type="button" className="bg-gray-200 px-4 rounded-xl font-bold">Cancel</button>}
                                </div>
                            </form>
                        </div>
                        <div className="lg:col-span-2 overflow-hidden rounded-2xl border border-gray-100 bg-white">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="p-4 text-xs font-bold text-gray-400 uppercase">Product</th>
                                        <th className="p-4 text-xs font-bold text-gray-400 uppercase">Price</th>
                                        <th className="p-4 text-xs font-bold text-gray-400 uppercase">Stock</th>
                                        <th className="p-4 text-xs font-bold text-gray-400 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map(p => (
                                        <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <img src={p.imageUrl} alt="" className="w-10 h-10 object-contain rounded bg-gray-50" />
                                                    <span className="font-semibold text-sm line-clamp-1">{p.name}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 font-mono text-sm">${p.price.toFixed(2)}</td>
                                            <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-bold ${p.stockQuantity < 10 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>{p.stockQuantity}</span></td>
                                            <td className="p-4 flex gap-2">
                                                <button onClick={() => { setIsEditing(true); setFormProduct(p); }} className="p-2 hover:bg-blue-50 text-blue-500 rounded-lg transition-colors"><FiEdit/></button>
                                                <button onClick={() => deleteProduct(p.id)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"><FiTrash2/></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Orders View */}
                {view === 'orders' && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-fade-in">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="p-4 text-xs font-bold text-gray-400 uppercase">Order ID</th>
                                    <th className="p-4 text-xs font-bold text-gray-400 uppercase">Customer</th>
                                    <th className="p-4 text-xs font-bold text-gray-400 uppercase">Amount</th>
                                    <th className="p-4 text-xs font-bold text-gray-400 uppercase">Status</th>
                                    <th className="p-4 text-xs font-bold text-gray-400 uppercase">Payment</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(o => (
                                    <tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-mono text-sm font-bold text-indigo-600">#{o.id}</td>
                                        <td className="p-4 text-sm">{o.user?.email}</td>
                                        <td className="p-4 text-sm font-bold">${o.totalAmount.toFixed(2)}</td>
                                        <td className="p-4">
                                            <select 
                                                value={o.status} 
                                                onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                                                className="bg-gray-50 border border-gray-200 rounded-lg p-1.5 text-xs font-bold outline-none focus:ring-2 focus:ring-amber-500"
                                            >
                                                <option value="PROCESSING">Processing</option>
                                                <option value="SHIPPED">Shipped</option>
                                                <option value="OUT FOR DELIVERY">Out For Delivery</option>
                                                <option value="DELIVERED">Delivered</option>
                                            </select>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase shadow-sm ${o.paymentStatus === 'SUCCESS' || o.paymentStatus === 'PAID' ? 'bg-green-500 text-white' : 'bg-amber-400 text-black'}`}>
                                                {o.paymentStatus || 'PENDING'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Users View */}
                {view === 'users' && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-fade-in">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="p-4 text-xs font-bold text-gray-400 uppercase">User</th>
                                    <th className="p-4 text-xs font-bold text-gray-400 uppercase">Role</th>
                                    <th className="p-4 text-xs font-bold text-gray-400 uppercase">Status</th>
                                    <th className="p-4 text-xs font-bold text-gray-400 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                        <td className="p-4">
                                            <div className="text-sm font-bold">{u.firstName} {u.lastName}</div>
                                            <div className="text-xs text-gray-400 font-mono">{u.email}</div>
                                        </td>
                                        <td className="p-4"><span className="text-[10px] font-bold px-2 py-1 bg-gray-100 rounded text-gray-600">{u.role}</span></td>
                                        <td className="p-4">
                                            <span className={`flex items-center gap-1 text-xs font-bold ${u.enabled ? 'text-green-500' : 'text-red-500'}`}>
                                                {u.enabled ? <FiCheckCircle/> : <FiXCircle/>} {u.enabled ? 'Active' : 'Blocked'}
                                            </span>
                                        </td>
                                        <td className="p-4 flex gap-2">
                                            <button onClick={() => toggleUserBlock(u.id, u.enabled)} className={`px-3 py-1 rounded text-[10px] font-bold transition-colors ${u.enabled ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
                                                {u.enabled ? 'Block' : 'Unblock'}
                                            </button>
                                            <button onClick={() => deleteUser(u.id)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"><FiTrash2/></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>

            <style>{`
                .sidebar-item { @apply flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer hover:bg-slate-800; }
                .sidebar-item.active { @apply bg-amber-500 text-black font-bold shadow-lg shadow-amber-500/20; }
                .input-field { @apply w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all; }
                @keyframes slide-up { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .animate-slide-up { animation: slide-up 0.3s ease-out; }
            `}</style>
        </div>
    );
};

const SidebarItem = ({ icon, label, active, onClick }) => (
    <div onClick={onClick} className={`sidebar-item ${active ? 'active' : 'text-slate-400'}`}>
        <span className="text-lg">{icon}</span>
        <span className="text-sm tracking-wide">{label}</span>
    </div>
);

const StatCard = ({ icon, label, value, color }) => (
    <div className={`p-8 rounded-3xl ${color} border border-white shadow-sm flex flex-col gap-2 transition-transform hover:scale-105 duration-300`}>
        <div className="bg-white w-12 h-12 rounded-2xl shadow-sm flex items-center justify-center text-xl mb-2">{icon}</div>
        <p className="text-gray-500 text-sm font-medium">{label}</p>
        <p className="text-4xl font-black text-slate-800">{value}</p>
    </div>
);

export default AdminDashboard;
