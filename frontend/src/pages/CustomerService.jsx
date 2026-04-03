import { FiHelpCircle, FiSearch } from 'react-icons/fi';

const CustomerService = () => {
    return (
        <div className="animate-fade-in max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold mb-2">Hello. What can we help you with?</h1>
            
            <div className="relative mb-12">
                <input 
                    type="text" 
                    placeholder="Search help topics..." 
                    className="w-full p-4 pl-12 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:outline-none shadow-sm text-lg"
                />
                <FiSearch size={24} className="absolute left-4 top-4 text-gray-400" />
            </div>

            <h2 className="text-2xl font-bold mb-6 border-b border-gray-200 pb-2">Some things you can do here</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <img src="https://m.media-amazon.com/images/G/01/x-locale/cs/help/images/gateway/self-service/order._CB660668735_.png" alt="Orders" className="h-16 mb-4 object-contain" />
                    <h3 className="font-bold text-lg">Your Orders</h3>
                    <p className="text-sm text-gray-500">Track packages, edit or cancel orders</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <img src="https://m.media-amazon.com/images/G/01/x-locale/cs/help/images/gateway/self-service/return._CB660668735_.png" alt="Returns" className="h-16 mb-4 object-contain" />
                    <h3 className="font-bold text-lg">Returns & Refunds</h3>
                    <p className="text-sm text-gray-500">Return or exchange items</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <img src="https://m.media-amazon.com/images/G/01/x-locale/cs/help/images/gateway/self-service/payment._CB660668735_.png" alt="Payment" className="h-16 mb-4 object-contain" />
                    <h3 className="font-bold text-lg">Payment Settings</h3>
                    <p className="text-sm text-gray-500">Add or edit payment methods</p>
                </div>
            </div>

            <div className="bg-amber-50 p-8 rounded-2xl border border-amber-200 flex items-center justify-between mt-12">
                <div>
                    <h3 className="text-xl font-bold flex items-center gap-2 mb-2"><FiHelpCircle /> Need more help?</h3>
                    <p className="text-gray-700">Get support right away through our 24/7 dedicated chat service.</p>
                </div>
                <button className="bg-slate-900 text-white px-8 py-3 rounded-full font-bold shadow-md hover:bg-black transition-colors">
                    Start Chatting
                </button>
            </div>
        </div>
    );
};

export default CustomerService;
