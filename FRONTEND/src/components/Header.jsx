import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { UserContext } from "../context/UserContext";
// import { FaChevronLeft } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import Profile from "./Profile";
import { api } from "../api/axios";
import { toast } from "react-hot-toast";

export default function Header() {
  const navigate = useNavigate();

  const { handleLogin, idToken } = useContext(AuthContext);
  const { userData,setUserData,setUserDataCp,deleteActionState, category,initialLoad, setInitialLoad } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);


  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  
  let location = useLocation();
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
  }, []); // Empty dependency array ensures it only runs once
  
  useEffect(()=>{
    setInitialLoad(true);
  },[userData?.saves, userData?.publicLinks,deleteActionState, category])

  useEffect(() => {
    if (initialLoad && idToken) {
      console.info("fetching CP")
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
  }, [initialLoad, category,idToken, setInitialLoad]);

  useEffect(() => {
    if (userData?.email && idToken) {
      console.info("fetching your data")
      api.get(`/get_user_data`)
      .then((response) => {
        if (response.data.status) {
          setUserData(response.data.userData);
          localStorage.setItem("userData", JSON.stringify(response.data.userData));
        }else{
          toast.error(response.data.reason);
        }
      })
      .catch((error) => {
        console.error("User data fetch error:", error);
        toast.error("Couldn't fetch your data");
      });
    }
  }, [userData?.email,idToken]);

  return (
    <header className="header border-b border-white/20 bg-[#010409] text-white/50 py-4 px-6 flex items-center justify-between flex-wrap">
      <div className="flex items-center gap-2 order-1">
        <img src="/logo.png" alt="" className="w-24" />
      </div>

      {(userData) ? (
        <>
          <div className="flex items-center justify-center order-3 md:order-2 px-2 py-4 mt-6 mx-auto sm:m-0 w-full sm:w-fit border-white/20 sm:border-0">
            <nav>
              <button
                className={
                  location.pathname !== "/home"
                    ? "text-[#247ce8] bg-[#2240646d] hover:bg-[#22406493] border-[#247ce889] py-1 px-2 rounded-md w-fit mx-1"
                    : "text-[#247ce8] bg-[#2240646d] hover:bg-[#22406493] border border-[#247ce889] py-1 px-2 rounded-md w-fit mx-1"
                }
              >
                <Link to="/home">Home</Link>
              </button>
              <button
                className={
                  location.pathname !== "/home/questions"
                    ? "text-[#247ce8] bg-[#2240646d] hover:bg-[#22406493] border-[#247ce889] py-1 px-2 rounded-md w-fit mx-1"
                    : "text-[#247ce8] bg-[#2240646d] hover:bg-[#22406493] border border-[#247ce889] py-1 px-2 rounded-md w-fit mx-1"
                }
              >
                <Link to="/home/questions">Questions</Link>
              </button>
              <button
                className={
                  location.pathname !== "/prep"
                    ? "text-[#247ce8] bg-[#2240646d] hover:bg-[#22406493] border-[#247ce889] py-1 px-2 rounded-md w-fit mx-1"
                    : "text-[#247ce8] bg-[#2240646d] hover:bg-[#22406493] border border-[#247ce889] py-1 px-2 rounded-md w-fit mx-1"
                }
              >
                <Link to="/prep">Prep</Link>
              </button>
            </nav>
          </div>
          <div className="flex items-center gap-4 sm:order-3 order-2">
            <div className="relative flex items-center transition-all duration-100 ease-in-out"> 
              <img
                src={userData?.photo}
                alt={userData?.name}
                className="w-8 h-8 rounded-full cursor-pointer"
                onClick={toggleDropdown}
              />
              {isOpen && <Profile userData={userData} onClose={toggleDropdown} />}
            </div>
          </div>
        </>
      ) : (
        <button
          onClick={handleLogin}
          className=" bg-[#113023b7] text-[#1c9f5b]  hover:bg-[#113023f3] px-6 py-3 rounded-lg text-md font-bold transition duration-300 order-last"
        >
          Sign in with Google <FaGoogle className="inline" />
        </button>
      )}
    </header>
  );
}
