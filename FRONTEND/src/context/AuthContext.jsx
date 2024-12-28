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
import { useContext } from "react";
import { UserContext } from "./UserContext";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const { setUserData } = useContext(UserContext);
  const server_url = import.meta.env.VITE_SERVER_URL;
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadLogin, setLoadLogin] = useState(0);

  function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  }

  async function handleLogin() {
    setLoadLogin(1);
    await loginWithGoogle()
      .then(async (u) => {
        setLoadLogin(2);
        await axios
          .post(`${server_url}/user_login`, {
            name: u.user.displayName,
            email: u.user.email,
            photo: u.user.photoURL,
          })
          .then(async (res) => {
            if (res.data.status) {
              // set the user data in the context
              setUserData(res.data.userData);
              localStorage.setItem(
                "userData",
                JSON.stringify(res.data.userData)
              );

              // navigate based on the new user or not
              if (res.data.newUser) {
                toast.success("Welcome to CPFlashNoter : )");
                navigate("/onboarding");
              } else {
                navigate("/home");
                toast.success("logged in successful : )");
              }
            } else {
              // failed login
              navigate("/");
              toast.error("login failed : /");
              toast.error(res.data.reason);
              console.log(res.data);
            }
          });
      })
      .catch((error) => {
        toast.error("login failed : /");
        console.error("Error signing in with Google", error);
      });
    setLoadLogin(0);
  }

  const logOut = () => {
    setLoading(true);
    setUserData(null);
    localStorage.removeItem("userData");
    toast.success("You logged out : (");
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const storedUserData = localStorage.getItem("userData");
        if (storedUserData) {
          setUserData(JSON.parse(storedUserData));
        }
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [setUserData]);

  const authValue = {
    handleLogin,
    user,
    logOut,
    loading,
    loadLogin,
  };

  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
};


export {AuthProvider, AuthContext};
