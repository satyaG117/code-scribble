import { useState , useCallback,useEffect } from "react";

export const useAuth = ()=>{
    const [token , setToken] = useState(null);
    const [userId , setUserId] = useState(null);

    const login = useCallback((userId , token)=>{
        setToken(token);
        setUserId(userId);

        localStorage.setItem('userData',JSON.stringify({userId , token}));
    },[])
    
    const logout = useCallback(()=>{
        setToken(null);
        setUserId(null);

        localStorage.removeItem('userData');
    },[])

    useEffect(()=>{
        const userData = JSON.parse(localStorage.getItem('userData'));
        if(userData && userData.token && userData.userId){
            login(userData.userId , userData.token);
        }
    },[login])

    return {userId , token , login , logout}
}