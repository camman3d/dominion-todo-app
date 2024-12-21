import React, {useContext} from "react";

export interface User {
    id: number;
    name: string;
    email: string;
}

export type AuthState = {
    user: User | null;
    loading: boolean;
    error: string | null;
};

type AuthContextType = {
    authState: AuthState;
    signUp: (email: string, password: string) => Promise<boolean>;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
}

export const AuthContext = React.createContext<AuthContextType>({
    authState: {user: null, loading: true, error: null},
    signUp: async () => true,
    signIn: async () => {},
    signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);