'use client';

import { useAuthStore } from '@/stores/useAuthStore';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
    const { user, logout } = useAuthStore();

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <div className="flex items-center gap-4">
                    <span>Hola, {user?.firstName}</span>
                    <Button variant="outline" onClick={logout}>
                        Cerrar Sesión
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="p-6 bg-card rounded-lg shadow border border-border">
                    <h3 className="text-sm font-medium text-muted-foreground">Patrimonio Total</h3>
                    <p className="text-2xl font-bold mt-2">$0.00</p>
                </div>
                {/* Add more cards here */}
            </div>
        </div>
    );
}
