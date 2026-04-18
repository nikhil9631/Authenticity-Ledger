import {createContext, useState} from "react";

const AuthContext = createContext({});

// Decode a JWT payload without verifying its signature. Signature verification
// happens on the backend; this is only used to rehydrate the role/username
// from a previously issued token after a page refresh.
const decodeToken = (token) => {
    try {
        const payload = token.split('.')[1];
        const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
        return JSON.parse(json);
    } catch (e) {
        return null;
    }
};

const initialAuth = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) return {};
    const claims = decodeToken(token);
    if (!claims) return {};
    if (claims.exp && Date.now() >= claims.exp * 1000) {
        localStorage.removeItem('token');
        return {};
    }
    return { token, user: claims.username, role: claims.role };
};

export const AuthProvider = ({children}) => {
    const [auth, setAuth] = useState(initialAuth);

    return (
        <AuthContext.Provider value={{auth, setAuth}}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;