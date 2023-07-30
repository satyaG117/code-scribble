import { NavLink } from "react-router-dom"
import { useContext } from "react"

import { AuthContext } from "../../contexts/AuthContext"
import NavLogo from "./NavLogo"

export default function Navbar() {
    const auth = useContext(AuthContext);

    return (
        <nav className="navbar navbar-expand-lg bg-dark-blue">
            <div className="container-fluid">
                <div className="mx-3">
                    <NavLogo />
                </div>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div className="navbar-nav">
                        <NavLink className="nav-link" end to="/scribbles">Home</NavLink>
                        <NavLink className="nav-link" end to="/scribbles/search">Search</NavLink>
                        <NavLink className="nav-link" end to="/challenges">Challenges</NavLink>
                        <NavLink className="nav-link" end to="scribbles/create">Create</NavLink>
                    </div>
                    <div className="navbar-nav ms-auto">
                        {!auth.isLoggedIn ? 
                        (<NavLink className="nav-link" end to="/signup">Signup</NavLink>) : 
                        (<>
                        <NavLink className="nav-link mx-1" end to={`profile/${auth.userId}`}>Profile</NavLink>
                        <button className="btn btn-outline-warning" onClick={auth.logout}>Logout</button>
                        </>)}
                    </div>
                </div>
            </div>
        </nav>
    )
}
