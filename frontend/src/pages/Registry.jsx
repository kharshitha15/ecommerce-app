import { Link } from 'react-router-dom';
import { FiGift, FiSearch } from 'react-icons/fi';

const Registry = () => {
    return (
        <div className="animate-fade-in text-center max-w-4xl mx-auto py-12">
            <FiGift size={80} className="mx-auto text-amber-500 mb-6" />
            <h1 className="text-5xl font-extrabold mb-6 tracking-tight">Gift Registry</h1>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
                Easily create, manage, and share your perfect gift lists for weddings, baby showers, or any special occasion directly with your friends and family.
            </p>

            <div className="flex gap-4 justify-center mb-16">
                <button className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-10 py-4 rounded-full shadow-md text-lg transition-colors">
                    Create a Registry
                </button>
                <button className="bg-white border-2 border-slate-900 hover:bg-gray-50 text-slate-900 font-bold px-10 py-4 rounded-full shadow-sm text-lg transition-colors">
                    Manage your Lists
                </button>
            </div>

            <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-200 text-left">
                <h2 className="text-2xl font-bold mb-6">Find a Registry</h2>
                <div className="flex gap-4">
                    <input 
                        type="text" 
                        placeholder="Search by Registrant Name" 
                        className="flex-grow p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-lg"
                    />
                    <button className="bg-slate-900 text-white font-bold px-8 rounded-lg flex items-center justify-center gap-2 hover:bg-black transition-colors">
                        <FiSearch size={20} /> Search
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Registry;
