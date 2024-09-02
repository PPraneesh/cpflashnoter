import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

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
    <header className="header border-b border-white/20 bg-black text-white/50 py-4 px-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <img src="logo.png" alt="" className="w-28 " />
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
            className="button"
          >
            Logout
          </button>
        </div>
      ) : (
        <button
            onClick={handleLogin}
            className="inline-block bg-cactus-500 text-white px-6 py-3 rounded-lg text-lg font-bold hover:bg-cactus-600 transition duration-300"
          >
            Sign in with Google
          </button>
      )}
    </header>
  );
}
