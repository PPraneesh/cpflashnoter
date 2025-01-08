import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { UserContext } from "../context/UserContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import {  Home, BookOpen, Brain, RefreshCw } from "lucide-react";
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

  return (
    <>
      <header className="bg-gradient-to-r from-gray-900 to-gray-800 text-white border-b border-gray-700/50 h-[9vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex md:justify-between items-center py-3 md:py-2">
            <div className="">
              <img src="/logo.png" alt="Logo" className="h-8 w-auto sm:h-10" />
            </div>
            {userData && (
              <nav className="hidden md:flex items-center space-x-4 flex-1 justify-center">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                        isActive(item.path)
                          ? "bg-blue-600/20 text-blue-400 border border-blue-500/50"
                          : "text-gray-300 hover:bg-gray-700/50 hover:text-blue-400"
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            )}
            <div className="">
              {userData ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 focus:outline-none"
                  >
                    <img
                      src={userData.photo}
                      alt={userData.name}
                      className="w-8 h-8 rounded-full ring-2 ring-blue-500/50 transition-all duration-200 hover:ring-blue-400"
                    />
                  </button>
                  {isProfileOpen && <Profile userData={userData} onClose={() => setIsProfileOpen(false)} />}
                </div>
              ) : (
                <button
                  onClick={handleLogin}
                  className="flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white transition-all duration-200 shadow-lg shadow-emerald-900/30"
                >
                  <FaGoogle className="w-4 h-4 mr-2" />
                  <span className="font-medium">Sign in</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {userData && (
        <>
          <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-gray-900 to-gray-800 border-t border-gray-700/50 h-[9vh]">
            <div className="flex justify-around items-center py-0 px-4">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${
                      active ? "text-blue-400" : "text-gray-400 hover:text-blue-400"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${active ? "stroke-2" : "stroke-1"}`} />
                    <span className={`text-xs mt-1 ${active ? "font-medium" : ""}`}>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
          <div className="mb-[5rem] md:m-0"></div>
        </>
      )}
    </>
  );
}
