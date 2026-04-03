import { Link } from 'react-router-dom';
import { FiTool } from 'react-icons/fi';

const ComingSoon = () => {
    return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center animate-fade-in text-center px-4">
            <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 max-w-lg w-full">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-100 text-amber-500 mb-6">
                    <FiTool size={40} />
                </div>
                <h1 className="text-3xl font-bold mb-4">Feature Coming Soon</h1>
                <p className="text-gray-500 mb-8">
                    We are working hard to bring this feature to you as soon as possible. Stay tuned for exciting updates!
                </p>
                <Link to="/" className="inline-block bg-slate-900 text-white font-bold px-8 py-3 rounded-full hover:bg-black transition-colors">
                    Back to Home
                </Link>
            </div>
        </div>
    );
};

export default ComingSoon;
