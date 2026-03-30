'use client';

import { SessionProvider, useSession, signOut } from "next-auth/react";
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
                googleLogin(idToken).then((result) => {
                    if (result && typeof result === 'object' && result.unauthorized) {
                        console.log("Google login session expired, signing out locally.");
                        // Explicitly sign out from next-auth to avoid stale sessions causing 401s
                        signOut({ redirect: false });
                    }
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
