'use client';

import AuthGuard from '@/components/auth/AuthGuard';


export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthGuard>
            <div className="min-h-screen bg-gray-100">
                {/* Sidebar or Navbar could go here */}
                <main>{children}</main>
            </div>
        </AuthGuard>
    );
}
