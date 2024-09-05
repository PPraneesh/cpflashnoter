import { createContext, useState ,useEffect} from "react";
export const UserContext = createContext();
const UserProvider = ({children})=>{
    const [userData, setUserData] = useState(() => {
        const savedUserData = localStorage.getItem("userData");
        return savedUserData ? JSON.parse(savedUserData) : null;
      });
    
      useEffect(() => {
        if (userData) {
          localStorage.setItem("userData", JSON.stringify(userData));
        } else {
          localStorage.removeItem("userData");
        }
      }, [userData]);
    const userDataValue = {
        userData,
        setUserData
    }
    return <UserContext.Provider value={userDataValue}>{children}</UserContext.Provider>;
}
export default UserProvider;