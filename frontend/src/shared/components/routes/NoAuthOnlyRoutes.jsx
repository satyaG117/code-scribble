import { useContext } from "react"
import { Navigate, Outlet } from "react-router-dom"
import { AuthContext } from "../../contexts/AuthContext"

export default function NoAuthOnlyRoutes() {
    const auth = useContext(AuthContext);

    if(!auth.isLoggedIn){
        return(
            <Outlet />
        )
    }
    return (
        <Navigate to="/scribbles" />
    )
}