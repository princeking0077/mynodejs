import React, { useContext, useState, useEffect } from "react";
import { api } from "../services/api";

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    async function login(username, password) {
        try {
            const data = await api.login(username, password);
            if (data.token) {
                const userObj = { username: data.user, token: data.token };
                setCurrentUser(userObj);
                localStorage.setItem('apex_user', JSON.stringify(userObj));
                return userObj;
            }
        } catch (error) {
            throw error;
        }
    }

    function logout() {
        setCurrentUser(null);
        localStorage.removeItem('apex_user');
        return Promise.resolve();
    }

    useEffect(() => {
        // Check for existing session
        const stored = localStorage.getItem('apex_user');
        if (stored) {
            try {
                setCurrentUser(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse user session", e);
                localStorage.removeItem('apex_user');
            }
        }
        setLoading(false);
    }, []);

    const value = {
        currentUser,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
