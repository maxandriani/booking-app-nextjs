'use client';

import { loginAction, logoutAction } from "@/actions/auth";
import { getServerSession, UserSession } from "@/services/auth/auth-service";
import { usePathname } from "next/navigation";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";

export interface ClientSession {
    user?: UserSession;
    status: 'initializing' | 'completed'
}

export interface ClientSessionWithActions extends ClientSession {
    signIn(): Promise<void>;
    signOut(): Promise<void>;
}

export interface AuthenticationProviderProps {
    children?: ReactNode;
}

export const AuthenticationContext = createContext<ClientSessionWithActions | undefined>(undefined);

export function useAuthentication(): ClientSessionWithActions {
    const context = useContext(AuthenticationContext);
    if (!context) throw new Error('Unabble to use useAuthentication without AuthenticationProvider');
    return context;
}

export function AuthenticationProvider({ children }: AuthenticationProviderProps) {
    const path = usePathname();
    const [{ user, status }, setValue] = useState<ClientSession>({ status: 'initializing' });

    const signIn = useCallback(async () => {
        setValue({ status: 'initializing' });
        loginAction(path);
    }, [path]);

    const signOut = useCallback(async () => {
        setValue({ status: 'completed' });
        logoutAction();
    }, [setValue]);

    useEffect(() => {
        getServerSession()
            .then(session => {
                if (!!session) {
                    const { user } = session;
                    setValue({ user, status: 'completed' });
                } else {
                    setValue({ status: `completed` });
                }
            });
    }, [status])

    return (
        <AuthenticationContext.Provider value={{ user, status, signIn, signOut }}>
            {children}
        </AuthenticationContext.Provider>
    )
}