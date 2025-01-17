import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { UserContext } from "../context/UserContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import Profile from "./Profile";
import { api } from "../api/axios";
import { toast } from "react-hot-toast";
import { PiStarFourBold } from "react-icons/pi";
import { LuNotebookPen } from "react-icons/lu";
import { LuBrain } from "react-icons/lu";
import { TbBrandGoogleAnalytics } from "react-icons/tb";
import { RiLoopRightLine } from "react-icons/ri";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleLogin, idToken } = useContext(AuthContext);
  const {
    userData,
    setUserData,
    setUserDataCp,
    deleteActionState,
    category,
    initialLoad,
    setInitialLoad,
    setUserAnalytics
  } = useContext(UserContext);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { path: "/generation", label: "Generate", icon: PiStarFourBold },
    { path: "/home/questions", label: "Questions", icon: LuNotebookPen },
    { path: "/prep", label: "Prep", icon: LuBrain },
    { path: "/rev", label: "Rev", icon: RiLoopRightLine },
    {path:"/analytics", label:"Analytics", icon: TbBrandGoogleAnalytics}
  ];

  useEffect(() => {
    if (location.pathname.slice(0, 6) === "/share") return;
    if (userData) navigate("/home");
    else navigate("/");
  }, []);

  useEffect(() => {
    setInitialLoad(true);
  }, [userData?.saves, userData?.publicLinks, deleteActionState, category, setInitialLoad]);

  useEffect(() => {
    if (initialLoad && idToken) {
      const fetchCp = async () => {
        try {
          const config = { headers: { Authorization: `Bearer ${idToken}` } };
          if (category === "all") {
            const res = await api.get("/get_cp", config);
            setUserDataCp(res.data.cp_docs);
          } else {
            const res = await api.post(
              "/get_cp_category",
              { email: userData?.email, category },
              config
            );
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
  }, [idToken, initialLoad]);

  useEffect(() => {
    if (userData?.email && idToken) {
      api
        .get("/get_user_data")
        .then((res) => {
          if (res.data.status) {
            console.log(res.data)
            setUserData(res.data.userData);
            localStorage.setItem("userData", JSON.stringify(res.data.userData));
            if(res.data.newUser){
              navigate("/onboarding")
            }
          } else {
            toast.error(res.data.reason);
          }
        })
        .catch(() => {
          toast.error("Couldn't fetch your data");
        });
    }
  }, [userData?.email, idToken, setUserData]);

  useEffect(()=>{
    if(idToken){
    api.get("/analytics")
    .then((res)=>{
      if(res.data.status){
      setUserAnalytics(res.data.analytics)
      }else{
        toast.error(res.data.reason)
      }
    })}
  },[idToken])
  return (
    <>
      {!userData ? (
        <nav className="fixed w-full z-50 bg-neutral-900 border-b border-neutral-700/30 hover:border-neutral-600/50 transition-all">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-white">CPFlashNoter</span>
              </div>
              <div className="hidden md:flex items-center space-x-8">
                <a href="#features" className="text-neutral-400 hover:text-white">
                  Features
                </a>
                <a href="#howItWorks" className="text-neutral-400 hover:text-white">
                  How it Works
                </a>
                <a href="#pricing" className="text-neutral-400 hover:text-white">
                  Pricing
                </a>
                <a href="#testimonials" className="text-neutral-400 hover:text-white">
                  Testimonials
                </a>
                <button
                  onClick={handleLogin}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-400 transition duration-150 flex items-center"
                >
                  <FaGoogle className="w-4 h-4 mr-2" />
                  <span>Sign in</span>
                </button>
              </div>
              <div className="md:hidden flex items-center">
                <button
                  className="text-neutral-400 hover:text-white focus:outline-none"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          {isMobileMenuOpen && (
            <div className="md:hidden px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a href="#features" className="block text-neutral-400 hover:text-white py-2">
                Features
              </a>
              <a href="#howItWorks" className="block text-neutral-400 hover:text-white py-2">
                How it Works
              </a>
              <a href="#pricing" className="block text-neutral-400 hover:text-white py-2">
                Pricing
              </a>
              <a href="#testimonials" className="block text-neutral-400 hover:text-white py-2">
                Testimonials
              </a>
              <button
                onClick={handleLogin}
                className="w-full bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-400 transition duration-150 flex items-center justify-center"
              >
                <FaGoogle className="w-4 h-4 mr-2" />
                <span>Sign in</span>
              </button>
            </div>
          )}
        </nav>
      ) : (
        <header className="w-full z-50 bg-neutral-900 border-b border-neutral-700/30 hover:border-neutral-600/50 transition-all">
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link to="/home">
                <div className="flex-shrink-0 flex items-center">
                  <img src="/logo.png" alt="Logo" className="h-8 w-auto mr-2" />
                  <span className="text-xl font-bold text-white">CPFlashNoter</span>
                </div>
              </Link>
              <nav className="hidden md:flex items-center space-x-6">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center px-4 py-2 rounded-md transition duration-150 ${
                        isActive(item.path)
                          ? "bg-neutral-800 text-white"
                          : "text-neutral-400 hover:text-white hover:bg-neutral-700/50"
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-2" />
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
                  {isProfileOpen && (
                    <Profile userData={userData} onClose={() => setIsProfileOpen(false)} />
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Bottom navigation on mobile */}
          <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-neutral-900 border-t border-neutral-700/30 hover:border-neutral-600/50 transition-all">
            <div className="flex justify-around items-center h-14">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex flex-col items-center space-y-1 px-2 py-1 ${
                      isActive(item.path) ? "text-blue-500" : "text-neutral-400 hover:text-blue-400"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
        </header>
      )}
    </>
  );
}
