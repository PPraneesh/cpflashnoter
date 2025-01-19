import { Link } from "react-router-dom";
import Analytics from "./Analytics";
import BuyPremium from "../components/BuyPremium";

export default function Dashboard() {
    return (
        <div className="p-6 bg-neutral-900 text-[#E0E0E0]">
            <h1 className="text-4xl font-semibold mb-4">Welcome back to cpnoter!</h1>
            <p className="mb-6">Choose an option to get started:</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Generate Notes Card */}
                <div className="bg-neutral-800 border border-neutral-700/30 rounded-xl p-6 hover:border-neutral-600/50 transition-all">
                    <div className="h-8 w-8 lg:h-12 lg:w-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Generate Notes</h3>
                    <p className="text-neutral-400 mb-4">Create AI-powered personalized DSA notes with just a few clicks</p>
                    <Link to="/generation" className="inline-flex items-center text-purple-500 hover:text-purple-400">
                        Get Started <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                    </Link>
                </div>

                {/* View Notes Card */}
                <div className="bg-neutral-800 border border-neutral-700/30 rounded-xl p-6 hover:border-neutral-600/50 transition-all">
                    <div className="h-8 w-8 lg:h-12 lg:w-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Saved Notes</h3>
                    <p className="text-neutral-400 mb-4">Access your generated notes anytime, anywhere</p>
                    <Link to="/home/questions" className="inline-flex items-center text-blue-500 hover:text-blue-400">
                        View Notes <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                    </Link>
                </div>

                {/* Prep Mode Card */}
                <div className="bg-neutral-800 border border-neutral-700/30 rounded-xl p-6 hover:border-neutral-600/50 transition-all">
                    <div className="h-8 w-8 lg:h-12 lg:w-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Prep Mode</h3>
                    <p className="text-neutral-400 mb-4">Evaluate yourself with the power of AI-powered</p>
                    <Link to="/prep" className="inline-flex items-center text-green-500 hover:text-green-400">
                        Start Prep <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                    </Link>
                </div>

                {/* Revision Tracker Card */}
                <div className="bg-neutral-800 border border-neutral-700/30 rounded-xl p-6 hover:border-neutral-600/50 transition-all">
                    <div className="h-8 w-8 lg:h-12 lg:w-12 bg-yellow-500/10 rounded-lg flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Revise Mode</h3>
                    <p className="text-neutral-400 mb-4">Stay on top of your revision schedule</p>
                    <Link to="/rev" className="inline-flex items-center text-yellow-500 hover:text-yellow-400">
                        Revise Now <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                    </Link>
                </div>
            </div>
            <BuyPremium />
            <Analytics short={true} />
        </div>
    );
}
