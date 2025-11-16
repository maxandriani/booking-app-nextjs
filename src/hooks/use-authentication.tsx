'use client';

import { loginAction, logoutAction } from "@/actions/auth";
import { Session, UserSession } from "@/services/auth/auth-service";
import { usePathname } from "next/navigation";
import { createContext, PropsWithChildren, useCallback, useContext } from "react";

export interface ClientSession {
    user?: UserSession;
}

export interface ClientSessionWithActions extends ClientSession {
    signIn(): Promise<void>;
    signOut(): Promise<void>;
}

export interface AuthenticationProviderProps extends PropsWithChildren {
    session: Session;
}

const AuthenticationContext = createContext<ClientSessionWithActions | undefined>(undefined);

export function useAuthentication(): ClientSessionWithActions {
    const context = useContext(AuthenticationContext);
    if (!context) throw new Error('Unabble to use useAuthentication without AuthenticationProvider');
    return context;
}

export function AuthenticationProvider({ children, session: { user } }: AuthenticationProviderProps) {
    const path = usePathname();

    const signIn = useCallback(async () => {
        loginAction(path);
    }, [path]);

    const signOut = useCallback(async () => {
        logoutAction();
    }, []);

    return (
        <AuthenticationContext.Provider value={{ user, signIn, signOut }}>
            {children}
        </AuthenticationContext.Provider>
    )
}