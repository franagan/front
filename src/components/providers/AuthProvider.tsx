'use client';

import { SessionProvider, useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { useAuthStore } from "@/stores/useAuthStore";

function GoogleAuthHandler() {
    const { data: session, status } = useSession();
    const { googleLogin, isAuthenticated } = useAuthStore();
    const processedTokenRef = useRef<string | null>(null);

    useEffect(() => {
        if (status === 'authenticated' && session && !isAuthenticated) {
            // @ts-expect-error id_token is custom property
            const idToken = session.id_token as string;

            // Prevent infinite retries for the same token
            if (idToken && processedTokenRef.current !== idToken) {
                processedTokenRef.current = idToken;
                googleLogin(idToken).catch((err) => {
                    console.error("Google login failed", err);
                    // Optionally sign out from next-auth if backend auth fails
                    // signOut(); 
                });
            }
        }
    }, [session, status, isAuthenticated, googleLogin]);

    return null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <GoogleAuthHandler />
            {children}
        </SessionProvider>
    );
}
