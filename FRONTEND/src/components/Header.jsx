import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FaGoogle } from "react-icons/fa";

export default function Header() {
  const navigate = useNavigate();
  const { loginWithGoogle } = useContext(AuthContext);
  const server_url = import.meta.env.VITE_SERVER_URL;
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
              toast.success("logged in successful : )")
              navigate("/home");
            } else {
              navigate("/login");
              toast.error("login failed : /");
            }
          });
      })
      .catch((error) => {
        toast.error("login failed : )")
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
          <div className="flex flex-col items-end">
            <div className="font-medium">{user?.displayName}</div>
            <div className="text-sm">{user?.email}</div>
          </div>
          <img
            src={user?.photoURL}
            alt={user?.displayName}
            className="w-8 h-8 rounded-full"
          />
          <button
            onClick={() => logOut()}
            className="button text-[#a41727] bg-[#a4172768] hover:bg-[#a417277a] border-0"
          >
            Logout
          </button>
        </div>
      ) : (
        <button
            onClick={handleLogin}
            className=" bg-[#113023b7] text-[#1c9f5b]  hover:bg-[#113023f3] px-6 py-3 rounded-lg text-lg font-bold transition duration-300 "
          >
            Sign in with Google <FaGoogle className="inline" /> 
          </button>
      )}
    </header>
  );
}
