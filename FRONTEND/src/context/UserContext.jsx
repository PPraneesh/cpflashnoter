import { createContext, useState ,useEffect} from "react";
const UserContext = createContext();
const UserProvider = ({children})=>{
    const [userData, setUserData] = useState(() => {
        const savedUserData = localStorage.getItem("userData");
        return savedUserData ? JSON.parse(savedUserData) : null;
      });
    const [userDataCp, setUserDataCp] = useState([])
    const [deleteActionState, setDeleteActionState] = useState(true);
      useEffect(() => {
        if (userData) {
          localStorage.setItem("userData", JSON.stringify(userData));
        } else {
          localStorage.removeItem("userData");
        }
      }, [userData]);
      
    const userDataValue = {
        userData,
        setUserData,
        userDataCp,
        setUserDataCp,
        deleteActionState,
        setDeleteActionState
    }
    return <UserContext.Provider value={userDataValue}>{children}</UserContext.Provider>;
}
export {UserProvider, UserContext};