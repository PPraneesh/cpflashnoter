/* eslint-disable react/prop-types */
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "../services/Auth";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const server_url = import.meta.env.VITE_SERVER_URL;
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  }
  
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
  const logOut = () => {
    setLoading(true);
    toast.success("You logged out : (");
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const authValue = {
    handleLogin,
    user,
    logOut,
    loading,
  };

  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
