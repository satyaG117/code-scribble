import { createContext } from "react";

// define the structure
export const AuthContext = createContext({
    isLoggedIn: false,
    token: null,
    userId: null,
    login: () => { },
    logout: () => { }
})