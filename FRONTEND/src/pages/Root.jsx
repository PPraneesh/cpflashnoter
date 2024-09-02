import {Outlet} from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AuthProvider from "../context/AuthContext";

export default function Root() {
    return (<>
    <AuthProvider>
        <Header />
            <div>
                <Outlet />
            </div>
        <Footer />
    </AuthProvider>
    </>);
}