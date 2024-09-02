import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import { FaGoogle } from "react-icons/fa";
import { RxCrossCircled } from "react-icons/rx";

export default function Header() {
  const navigate = useNavigate();
  const { loginWithGoogle } = useContext(AuthContext);
  const { userData } = useContext(UserContext);
  const server_url = import.meta.env.VITE_SERVER_URL;
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  function handleLogin() {
    loginWithGoogle()
      .then(async (u) => {
        await axios
          .post(`${server_url}/user_login`, {
            name: u.user.displayName,
            email: u.user.email,
            photo: u.user.photoURL,
          })
          .then((res) => {
            console.log(res);
            if (res.data.status) {
              toast.success("logged in successful : )");
              navigate("/home");
            } else {
              navigate("/login");
              toast.error("login failed : /");
            }
          });
      })
      .catch((error) => {
        toast.error("login failed : )");
        console.error("Error signing in with Google", error);
      });
  }
  const { logOut, user } = useContext(AuthContext);

  return (
    <header className="header border-b border-white/20 bg-[#010409] text-white/50 py-4 px-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <img src="logo.png" alt="" className="w-24 " />
      </div>
      {user ? (
        <div className="flex items-center gap-4">
          <div className="relative flex items-center transition-all duration-100 ease-in-out">
            <FaChevronLeft
              size={24}
              className={`cursor-pointer transition-all duration-100 ease-in-out ${
                isOpen ? "mr-1" : ""
              }`}
              onClick={toggleDropdown}
            />
            <img
              src={user?.photoURL}
              alt={user?.displayName}
              className="w-8 h-8 rounded-full cursor-pointer"
              onClick={toggleDropdown}
            />
            {isOpen && (
              <div className="w-72 absolute right-0 top-10 flex flex-col p-2 rounded-lg bg-[#151b23] border border-white/20">
                <div className="flex flex-row justify-between">
                  <h1 className="font-bold text-xl text-center bg-blue-500/10 rounded-md px-1 my-1 text-blue-900">Profile</h1>
                  <button
                    onClick={toggleDropdown}
                    className="text-sm font-bold text-red-500"
                  >
                    <RxCrossCircled size={24} />
                  </button>
                </div>
                  <h1 className="font-medium pt-1">{user?.displayName}</h1>
                <h1 className="pb-1">{user?.email}</h1>
                <h1 className="border-t border-white/20 pt-1">Generations left: {userData?.generations?.count}</h1>
                <h1 className="pb-1">
                  Revives at {new Date(userData?.generations?.last_gen).toLocaleString()}
                </h1>
                <h1 className="border-t border-white/20 pt-1">Saves left: {userData?.saves?.quests}</h1>
                <h1 className="pb-1">Revives at {new Date(userData?.saves?.last_save).toLocaleString()}</h1>
              </div>
            )}
          </div>

          <button
            onClick={() => logOut()}
            className="button text-[#de2036] bg-[#a417274b] hover:bg-[#a4172769] border-0"
          >
            Logout
          </button>
        </div>
      ) : (
        <button
          onClick={handleLogin}
          className=" bg-[#113023b7] text-[#1c9f5b]  hover:bg-[#113023f3] px-6 py-3 rounded-lg text-md font-bold transition duration-300 "
        >
          Sign in with Google <FaGoogle className="inline" />
        </button>
      )}
    </header>
  );
}
