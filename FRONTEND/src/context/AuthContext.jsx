/* eslint-disable react/prop-types */
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  getAuth,
} from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "../services/Auth";
import { api } from "../api/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "./UserContext";
import { setAuthGetters } from "../api/axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const { setUserData } = useContext(UserContext);
  const server_url = import.meta.env.VITE_SERVER_URL;
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadLogin, setLoadLogin] = useState(0);
  const [idToken, setIdToken] = useState(null);
  const [, setCurrentUser] = useState(null);
  
  function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  }

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken(true); // Force token refresh
          setIdToken(token);
          setCurrentUser(user);
          setUser(user);
          
          // Set auth headers immediately after getting token
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          const storedUserData = localStorage.getItem("userData");
          if (storedUserData) {
            setUserData(JSON.parse(storedUserData));
          }
        } catch (error) {
          console.error("Error getting token:", error);
          toast.error("Authentication error");
        }
      } else {
        setIdToken(null);
        setCurrentUser(null);
        setUser(null);
        // Clear auth header when logged out
        delete api.defaults.headers.common['Authorization'];
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [setUserData]);

  useEffect(() => {
    setAuthGetters(
      // Token getter
      async () => {
        if (user) {
          const token = await user.getIdToken();
          setIdToken(token);
          return token;
        }
        return null;
      },
  
      // Refresh token getter
      async () => {
        if (user) {
          const newToken = await user.getIdToken(true);
          setIdToken(newToken);
          return newToken;
        }
        return null;
      }
    );
  }, [user]);

  async function handleLogin() {
    setLoadLogin(1);
    try {
      const result = await loginWithGoogle();
      setLoadLogin(2);
      
      // Get fresh token
      const token = await result.user.getIdToken(true);
      setIdToken(token);
      
      // Set auth header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const response = await api.post(`${server_url}/user_login`, {
        name: result.user.displayName,
        email: result.user.email,
        photo: result.user.photoURL,
      });

      if (response.data.status) {
        // set the user data in the context
        setUserData(response.data.userData);
        localStorage.setItem(
          "userData",
          JSON.stringify(response.data.userData)
        );

        // navigate based on the new user or not
        if (response.data.newUser) {
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
        toast.error(response.data.reason);
        console.log(response.data);
      }
    } catch (error) {
      toast.error("login failed : /");
      console.error("Error signing in with Google", error);
    }
    setLoadLogin(0);
  }

const logOut = () => {
    setLoading(true);
    setUserData(null);
    localStorage.removeItem("userData");
    toast.success("You logged out : (");
    return signOut(auth);
  };

  const authValue = {
    handleLogin,
    user,
    logOut,
    loading,
    loadLogin,
    idToken
  };

  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
};

export {AuthProvider, AuthContext};