import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { UserContext } from "../context/UserContext";
// import { FaChevronLeft } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { RxCrossCircled } from "react-icons/rx";

export default function Header() {
  const navigate = useNavigate();
  const { handleLogin } = useContext(AuthContext);
  const { userData } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  
  useEffect(()=>{
    if(userData){
      navigate("/home");
    }else{
      navigate("/");
    }
  },[])
  
  let location = useLocation();

  const { logOut, user } = useContext(AuthContext);

  return (
    <header className="header border-b border-white/20 bg-[#010409] text-white/50 py-4 px-6 flex items-center justify-between flex-wrap">
      <div className="flex items-center gap-2 order-1">
        <img src="/logo.png" alt="" className="w-24" />
      </div>

      {(userData?.userData) ? (
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
            </nav>
          </div>
          <div className="flex items-center gap-4 sm:order-3 order-2">
            <div className="relative flex items-center transition-all duration-100 ease-in-out">
              {/* <FaChevronLeft
                size={24}
                className={`cursor-pointer transition-all duration-100 ease-in-out ${
                  isOpen ? "mr-1" : ""
                }`}
                onClick={toggleDropdown}
              /> */}
              <img
                src={userData?.userData?.photo}
                alt={userData?.userData?.name}
                className="w-8 h-8 rounded-full cursor-pointer"
                onClick={toggleDropdown}
              />
              {isOpen && (
                <div className="w-72 absolute right-0 top-10 flex flex-col p-2 rounded-lg bg-[#151b23] border border-white/20">
                  <div className="flex flex-row justify-between">
                    <h1 className="font-bold text-xl text-center bg-blue-500/10 rounded-md px-1 my-1 text-[#247ce8]">
                      Profile
                    </h1>
                    <button
                      onClick={toggleDropdown}
                      className="text-sm font-bold text-red-500"
                    >
                      <RxCrossCircled size={24} />
                    </button>
                  </div>
                  <h1 className="font-medium pt-1">
                    {userData?.userData?.name}
                  </h1>
                  <h1 className="pb-1">{userData?.userData?.email}</h1>
                  <h1 className="border-t border-white/20 pt-1">
                    Generations left: {userData.userData?.generations?.count}
                  </h1>
                  <h1 className="pb-1">
                    Revives at{" "}
                    {new Date(
                      userData?.userData?.generations?.last_gen
                    ).toLocaleString()}
                  </h1>
                  <h1 className="border-t border-white/20 pt-1">
                    Saves left: {userData?.userData?.saves?.quests}
                  </h1>
                  <h1 className="pb-1">
                    Revives at{" "}
                    {new Date(
                      userData?.userData?.saves?.last_save
                    ).toLocaleString()}
                  </h1>
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
        </>
      ) : (
        //for adsense
        <button
          onClick={handleLogin}
          className=" bg-[#113023b7] text-[#1c9f5b]  hover:bg-[#113023f3] px-6 py-3 rounded-lg text-md font-bold transition duration-300 order-last"
        >
          Get started
        </button>
        //for adsense uncomment the below code
        // <button
        //   onClick={handleLogin}
        //   className=" bg-[#113023b7] text-[#1c9f5b]  hover:bg-[#113023f3] px-6 py-3 rounded-lg text-md font-bold transition duration-300 order-last"
        // >
        //   Sign in with Google <FaGoogle className="inline" />
        // </button>
      )}
    </header>
  );
}
