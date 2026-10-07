import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "../types/User";
import { postLogout, postSignIn, type SignInPayload } from "@/api/auth";
import getCurrentUser from "@/api/user";

type AuthContextType = {
    user: User | null;
    token: string | null;
    loading: boolean;
    isAuthenticated: boolean;
    login: (payload: SignInPayload) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(() => {
        return localStorage.getItem("token");
    });
    const [loading, setLoading] = useState(true);
    const isAuthenticated = !!user && !!token;

    useEffect(() => {
        async function getMe() {
            if (!token) {
                setUser(null);
                setLoading(false);
                return;
            }

            setLoading(true);

            try {
                const user = await getCurrentUser();
                setUser(user);
            } catch {
                setUser(null);
                setToken(null);
                localStorage.removeItem("token");
            } finally {
                setLoading(false);
            }
        }

        getMe();
    }, [token]);

    async function login(payload: SignInPayload) {
        const response = await postSignIn(payload);

        const token = response.authentication_token.plaintext;

        localStorage.setItem("token", token);
        setToken(token);
    }

    async function logout() {
        await postLogout();

        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                login,
                logout,
                isAuthenticated,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }

    return context;
};
