import { createContext, useState } from "react";
export const UserContext = createContext();
const UserProvider = ({children})=>{
    const [userData, setUserData] = useState({});

    const userDataValue = {
        userData,
        setUserData
    }
    return <UserContext.Provider value={userDataValue}>{children}</UserContext.Provider>;
}
export default UserProvider;