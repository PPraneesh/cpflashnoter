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
import { FaInfoCircle } from "react-icons/fa";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const { setUserData } = useContext(UserContext);
  const server_url = import.meta.env.VITE_SERVER_URL;
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  }

  async function handleLogin() {
    //for adsense
    await axios
      .post(`${server_url}/user_login`, {
        name: "Praneesh Parshi",
        email: "parshipraneesh8@gmail.com",
        photo: `https://lh3.googleusercontent.com/a/ACg8ocKpZRDLyG_rAHDLutbFr41uJmkZ8JOk-Cp2gi98BqFqRiUajS907A=s96-c`,
      })
      .then((res) => {
        if (res.data.status) {
          setUserData(res.data.userData);
          navigate("/home");
          localStorage.setItem("userData", JSON.stringify(res.data.userData));
          toast.success("logged in successful : )");
        } else {
          navigate("/");
          toast.error("login failed : /");
        }
      });
    //for adsense uncomment below

    // loginWithGoogle()
    //   .then(async (u) => {
    //     await axios
    //       .post(`${server_url}/user_login`, {
    //         name: u.user.displayName,
    //         email: u.user.email,
    //         photo: u.user.photoURL,
    //       })
    //       .then((res) => {
    //         if (res.data.status) {
    //           setUserData(res.data.userData);
    //           navigate("/home");
    //           localStorage.setItem("userData", JSON.stringify(res.data.userData));
    //           toast.success("logged in successful : )");
    //         } else {
    //           navigate("/");
    //           toast.error("login failed : /");
    //         }
    //       });
    //   })
    //   .catch((error) => {
    //     toast.error("login failed : /");
    //     console.error("Error signing in with Google", error);
    //   });
  }

  const logOut = () => {
    setLoading(true);
    setUserData(null);
    localStorage.removeItem("userData");
    toast.success("You logged out : (");
    //for adsense
    navigate("/");
    //for adsense
    // return signOut(auth);
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
  };

  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
