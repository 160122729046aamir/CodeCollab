import { createContext, useState } from "react";

export const StateContext = createContext();

const StateProvider = ({children})=>{
    
    const [users,setUsers] = useState([]);
    const [currentUser,setCurrentUser]=useState(null);
    return (
    <StateContext.Provider value={{users,setUsers,currentUser,setCurrentUser}}>
        {children}
    </StateContext.Provider>)
};
export default StateProvider;