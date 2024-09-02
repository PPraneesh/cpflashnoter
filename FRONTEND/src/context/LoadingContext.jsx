import {  createContext, useState } from "react";

export const LoadingContext = createContext()

const LoadingProvider = ({children}) => {
    const [saveCp, setSaveCp] = useState(false);
    const [genNotes, setGenNotes] = useState(false);

    const loadingValue = {
        saveCp,
        setSaveCp,
        genNotes,
        setGenNotes
    } 
    return <LoadingContext.Provider value={loadingValue}> {children}</LoadingContext.Provider>
}

export default LoadingProvider;