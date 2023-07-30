import { useContext } from "react"
import { Navigate, Outlet } from "react-router-dom"
import { AuthContext } from "../../contexts/AuthContext"

export default function AuthOnlyRoutes() {
    const auth = useContext(AuthContext);
    if(auth.isLoggedIn){
        return(
            <Outlet />
        )
    }
    return (
        <Navigate to="/login" />
    )
}
