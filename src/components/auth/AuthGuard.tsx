import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';

interface AuthGuardProps {
    children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/auth/login');
        } else {
            setIsChecking(false);
        }
    }, [isAuthenticated, router]);

    // Prevent hydration mismatch by only rendering after client-side checks
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted || isChecking) {
        return null; // Or a loading spinner
    }

    return <>{children}</>;
}
