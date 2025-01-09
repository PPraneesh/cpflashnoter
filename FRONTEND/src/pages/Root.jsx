import {Outlet} from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {AuthProvider} from "../context/AuthContext";

export default function Root() {
    return (<>
    <AuthProvider>
        <div className='flex flex-col min-h-screen'>
            <Header />
                <div className='flex-grow bg-gradient-to-br from-gray-900 to-gray-800'>
                    <Outlet />
                </div>
            <Footer />
    </div>
    </AuthProvider>
    </>);
}