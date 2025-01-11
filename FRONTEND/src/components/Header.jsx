import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { UserContext } from "../context/UserContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { Home, BookOpen, Brain, RefreshCw } from "lucide-react";
import Profile from "./Profile";
import { api } from "../api/axios";
import { toast } from "react-hot-toast";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleLogin, idToken } = useContext(AuthContext);
  const { userData, setUserData, setUserDataCp, deleteActionState, category, initialLoad, setInitialLoad } = useContext(UserContext);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { path: "/home", label: "Home", icon: Home },
    { path: "/home/questions", label: "Questions", icon: BookOpen },
    { path: "/prep", label: "Prep", icon: Brain },
    { path: "/rev", label: "Rev", icon: RefreshCw }
  ];
  useEffect(() => {
    const initialNavigation = () => {
      if (location.pathname.slice(0, 6) === "/share") {
        return;
      } else if (userData) {
        navigate("/home");
      } else {
        navigate("/");
      }
    };
    initialNavigation();
  }, []);

  useEffect(() => {
    setInitialLoad(true);
  }, [userData?.saves, userData?.publicLinks, deleteActionState, category]);

  useEffect(() => {
    if (initialLoad && idToken) {
      console.info("fetching CP");
      const fetchCp = async () => {
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          };
          if (category === "all") {
            const res = await api.get(`/get_cp`, config);
            setUserDataCp(res.data.cp_docs);
          } else {
            const res = await api.post(`/get_cp_category`, {
              email: userData?.email,
              category,
            }, config);
            setUserDataCp(res.data.cp_docs);
          }
        } catch (error) {
          console.error("Error fetching CP:", error);
        } finally {
          setInitialLoad(false);
        }
      };
      fetchCp();
    }
  }, [initialLoad, category, idToken, setInitialLoad, setUserDataCp, userData?.email]);

  useEffect(() => {
    if (userData?.email && idToken) {
      console.info("fetching your data");
      api.get(`/get_user_data`)
        .then((response) => {
          if (response.data.status) {
            setUserData(response.data.userData);
            localStorage.setItem("userData", JSON.stringify(response.data.userData));
          } else {
            toast.error(response.data.reason);
          }
        })
        .catch((error) => {
          console.error("User data fetch error:", error);
          toast.error("Couldn't fetch your data");
        });
    }
  }, [userData?.email, idToken, setUserData]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {!userData ? (
        // Landing page header when user is not logged in
        <nav className="fixed w-full z-50 bg-neutral-900 border-b border-neutral-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-white">CPFlashNoter</span>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                <a href="#features" className="text-gray-300 hover:text-white">Features</a>
                <a href="#howItWorks" className="text-gray-300 hover:text-white">How it Works</a>
                <a href="#pricing" className="text-gray-300 hover:text-white">Pricing</a>
                <a href="#testimonials" className="text-gray-300 hover:text-white">Testimonials</a>
                <button
                  onClick={handleLogin}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-150 flex items-center"
                >
                  <FaGoogle className="w-4 h-4 mr-2" />
                  <span>Sign in</span>
                </button>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden flex items-center">
                <button
                  className="text-gray-400 hover:text-white focus:outline-none"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a href="#features" className="block text-gray-300 hover:text-white py-2">Features</a>
              <a href="#howItWorks" className="block text-gray-300 hover:text-white py-2">How it Works</a>
              <a href="#pricing" className="block text-gray-300 hover:text-white py-2">Pricing</a>
              <a href="#testimonials" className="block text-gray-300 hover:text-white py-2">Testimonials</a>
              <button
                onClick={handleLogin}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-150 flex items-center justify-center"
              >
                <FaGoogle className="w-4 h-4 mr-2" />
                <span>Sign in</span>
              </button>
            </div>
          )}
        </nav>
      ) : (
        // Existing header when user is logged in
        <header className="w-full z-50 bg-neutral-900 border-b border-neutral-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex-shrink-0 flex items-center">
                <img 
                  src="/logo.png" 
                  alt="Logo" 
                  className="h-8 w-auto mr-2"
                />
                <span className="text-xl font-bold text-white">CPFlashNoter</span>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-6">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center px-4 py-2 rounded-md transition duration-150
                        ${isActive(item.path)
                          ? "bg-blue-600 text-white"
                          : "text-gray-300 hover:text-white hover:bg-neutral-800"
                        }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="flex items-center">
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center focus:outline-none"
                  >
                    <img
                      src={userData.photo}
                      alt={userData.name}
                      className="w-9 h-9 rounded-full ring-2 ring-blue-500 hover:ring-blue-400 transition duration-150"
                    />
                  </button>
                  {isProfileOpen && <Profile userData={userData} onClose={() => setIsProfileOpen(false)} />}
                </div>

                {/* Mobile menu button */}
                <div className="md:hidden ml-4">
                  <button
                    className="text-gray-400 hover:text-white focus:outline-none"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Navigation */}
            {isMobileMenuOpen && (
              <div className="md:hidden px-2 pt-2 pb-3 space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center px-3 py-2 rounded-md ${
                        isActive(item.path)
                          ? "bg-blue-600 text-white"
                          : "text-gray-300 hover:text-white hover:bg-neutral-800"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </header>
      )}
    </>
  );
}