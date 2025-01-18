import { BiError } from 'react-icons/bi';
import { MdEmail } from 'react-icons/md';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Failure = () => {
    const location = useLocation();
    const { state } = location;
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect to home if no order_id is present
        if (!state?.order_id) {
            navigate('/home');
        }
    }, [state, navigate]);

    if (!state?.order_id) {
        return null;
    }

    return (
        <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-neutral-800 rounded-xl p-8 border border-neutral-700/30 hover:border-neutral-600/50 transition-all">
                <div className="flex flex-col items-center text-center space-y-6">
                    <BiError className="text-red-500 text-7xl" /> 
                    <h1 className="text-white text-2xl font-bold">
                        Payment Failed
                    </h1>

                    <div className="space-y-4">
                        <p className="text-neutral-400">
                            We apologize for the inconvenience. Don't worry if money was deducted from your account - we're here to help!
                        </p>

                        <div className="bg-neutral-700/50 p-4 rounded-lg">
                            <p className="text-neutral-400">
                                Please contact us at{' '}
                                <a 
                                    href="mailto:cpflashnoter@gmail.com"
                                    className="text-blue-500 hover:text-blue-400 flex items-center justify-center gap-2 mt-2"
                                >
                                    <MdEmail />
                                    cpflashnoter@gmail.com
                                </a>
                            </p>
                        </div>
                    </div>

                    <Link
                        to="/"
                        className="bg-yellow-500 hover:bg-yellow-400 text-neutral-900 font-semibold px-6 py-3 rounded-lg transition-all"
                    >
                        Try Again
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Failure;