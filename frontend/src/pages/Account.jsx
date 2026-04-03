import { Link } from 'react-router-dom';
import { FiPackage, FiLock, FiMapPin, FiCreditCard, FiHeadphones, FiGift } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Account = () => {
    const { user } = useAuth();

    if (!user) {
        return <div className="text-center p-8">Please log in to view your account.</div>;
    }

    return (
        <div className="animate-fade-in max-w-5xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold mb-8">Your Account</h1>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Link to="/orders" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:bg-gray-50 flex gap-4 transition-colors">
                    <FiPackage size={48} className="text-amber-500 flex-shrink-0" />
                    <div>
                        <h2 className="text-xl font-bold">Your Orders</h2>
                        <p className="text-sm text-gray-500">Track, return, or buy things again</p>
                    </div>
                </Link>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:bg-gray-50 flex gap-4 transition-colors cursor-pointer">
                    <FiLock size={48} className="text-amber-500 flex-shrink-0" />
                    <div>
                        <h2 className="text-xl font-bold">Login & Security</h2>
                        <p className="text-sm text-gray-500">Edit login, name, and mobile number</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:bg-gray-50 flex gap-4 transition-colors cursor-pointer">
                    <FiMapPin size={48} className="text-amber-500 flex-shrink-0" />
                    <div>
                        <h2 className="text-xl font-bold">Your Addresses</h2>
                        <p className="text-sm text-gray-500">Edit addresses for orders and gifts</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:bg-gray-50 flex gap-4 transition-colors cursor-pointer">
                    <FiCreditCard size={48} className="text-amber-500 flex-shrink-0" />
                    <div>
                        <h2 className="text-xl font-bold">Payment Options</h2>
                        <p className="text-sm text-gray-500">Edit or add payment methods</p>
                    </div>
                </div>

                <Link to="/customer-service" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:bg-gray-50 flex gap-4 transition-colors">
                    <FiHeadphones size={48} className="text-amber-500 flex-shrink-0" />
                    <div>
                        <h2 className="text-xl font-bold">Contact Us</h2>
                        <p className="text-sm text-gray-500">Reach out to customer service</p>
                    </div>
                </Link>

                <Link to="/registry" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:bg-gray-50 flex gap-4 transition-colors">
                    <FiGift size={48} className="text-amber-500 flex-shrink-0" />
                    <div>
                        <h2 className="text-xl font-bold">Your Lists</h2>
                        <p className="text-sm text-gray-500">View and manage registry or wishlists</p>
                    </div>
                </Link>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mt-12">
                <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
                <div className="space-y-4">
                    <div className="flex border-b border-gray-100 pb-4">
                        <span className="w-48 font-semibold text-gray-500">Email Address:</span>
                        <span className="font-medium text-lg">{user.email}</span>
                    </div>
                    <div className="flex border-b border-gray-100 pb-4">
                        <span className="w-48 font-semibold text-gray-500">Name:</span>
                        <span className="font-medium text-lg">{user.firstName} {user.lastName || ''}</span>
                    </div>
                    <div className="flex border-b border-gray-100 pb-4">
                        <span className="w-48 font-semibold text-gray-500">Account Type:</span>
                        <span className="font-bold text-amber-500">{user.role}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Account;
