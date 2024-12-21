import {ReactNode, useEffect, useState} from "react";
import {AuthState, AuthContext} from "./AuthContext.tsx";
import auth from "./auth.ts";

export default function AuthProvider({children}: {children: ReactNode}) {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        loading: true,
        error: null,
    });

    useEffect(() => {
        const user = auth.getSession();
        setAuthState({
            user,
            loading: false,
            error: null
        });
    }, []);

    const signUp = async (email: string, password: string) => {
        setAuthState(prev => ({ ...prev, loading: true }));
        const { data, error } = await auth.signUp(email, password);
        if (error) {
            setAuthState({user: null, loading: false, error});
        } else if (data) {
            setAuthState({user: null, loading: false, error: null});
            return true;
        }
        return false;
    };

    const signIn = async (email: string, password: string) => {
        setAuthState(prev => ({ ...prev, loading: true }));
        const { data, error } = await auth.signIn(email, password);
        if (error)
            setAuthState(prev => ({ ...prev, loading: false, error }));
        else if (data)
            setAuthState({user: data, loading: false, error: null});
    };

    const signOut = async () => {
        auth.signOut();
        setAuthState({
            user: null,
            loading: false,
            error: null,
        });
    };

    return <AuthContext.Provider value={{ authState, signUp, signIn, signOut }}>
        {children}
    </AuthContext.Provider>
}