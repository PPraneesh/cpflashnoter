import { BsCheckCircleFill } from 'react-icons/bs';
import { FaCrown } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
const Success = () => {
    const location = useLocation();
    const { state } = location;
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect to home if no payment data is present
        if (!state?.order_id || !state?.payment_id) {
            navigate('/home');
        }
    }, [state, navigate]);

    if (!state?.order_id || !state?.payment_id) {
        return null;
    }

    return (
        <div className="min-h-screen w-full bg-neutral-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-neutral-800 rounded-xl p-8 border border-neutral-700/30 hover:border-neutral-600/50 transition-all">
                <div className="flex flex-col items-center text-center space-y-6">
                    {/* Success Icon */}
                    <div className="flex items-center justify-center w-20 h-20 bg-neutral-700/50 rounded-full">
                        <BsCheckCircleFill className="w-12 h-12 text-green-500" />
                    </div>

                    {/* Premium Badge */}
                    <div className="flex items-center gap-2 bg-neutral-700/50 px-4 py-2 rounded-full">
                        <FaCrown className="text-yellow-500" />
                        <span className="text-white font-medium">Premium Activated</span>
                    </div>

                    {/* Message */}
                    <div className="space-y-3">
                        <h1 className="text-2xl font-bold text-white">All Set!</h1>
                        <p className="text-neutral-400">
                            You now have access to premium tier services for the next 30 days.
                        </p>
                    </div>

                    {/* Transaction Details */}
                    <div className="w-full bg-neutral-700/50 rounded-lg p-4 text-left">
                        <h3 className="text-white font-medium mb-2">Transaction Details:</h3>
                        <div className="space-y-2 text-neutral-400">
                            <p className="text-sm">Order ID: {state?.order_id}</p>
                            <p className="text-sm">Payment ID: {state?.payment_id}</p>
                        </div>
                    </div>

                    {/* Benefits Card */}
                    <div className="w-full bg-neutral-700/50 rounded-lg p-4 text-left">
                        <h3 className="text-white font-medium mb-2">Your Premium Benefits:</h3>
                        <ul className="space-y-2 text-neutral-400">
                            <li className="flex items-center gap-2">
                                <span className="text-green-500">✓</span> Unlimited Flashcards
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-green-500">✓</span> Advanced Analytics
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-green-500">✓</span> Priority Support
                            </li>
                        </ul>
                    </div>

                    {/* Back to Dashboard Button */}
                    <Link 
                        to="/home" 
                        className="w-full bg-yellow-500 hover:bg-yellow-400 text-neutral-900 font-medium py-3 rounded-lg transition-colors"
                    >
                        Go to Home
                    </Link>

                    {/* Support Link */}
                    <p className="text-neutral-400 text-sm">
                        Need help? {' '}
                        <Link to="/contact" className="text-blue-500 hover:text-blue-400 transition-colors">
                            Contact Support
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Success;