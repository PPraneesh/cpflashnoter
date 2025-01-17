import { createContext, useState ,useEffect} from "react";
const UserContext = createContext();
const UserProvider = ({children})=>{
    const [userData, setUserData] = useState(() => {
        const savedUserData = localStorage.getItem("userData");
        return savedUserData ? JSON.parse(savedUserData) : null;
      });
    const [userDataCp, setUserDataCp] = useState([])
    const [initialLoad, setInitialLoad] = useState(false);
    const [deleteActionState, setDeleteActionState] = useState(true);
    const [category, setCategory] = useState("all");
    const [userAnalytics, setUserAnalytics] = useState(null);

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
        initialLoad,
        setInitialLoad,
        category,
        setCategory,
        userAnalytics,
        setUserAnalytics,
        deleteActionState,
        setDeleteActionState
    }
    return <UserContext.Provider value={userDataValue}>{children}</UserContext.Provider>;
}
export {UserProvider, UserContext};