'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/useAuthStore'
import adminService from '@/services/admin.service'
import { User, Role } from '@/types/auth.types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'
import { ShieldAlert, Trash2, Power, PowerOff, ShieldCheck } from 'lucide-react'

export default function AdminDashboard() {
    const { user, isHydrated } = useAuthStore()
    const router = useRouter()
    const { addToast } = useToast()
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!isHydrated) return

        if (user?.role !== 'ADMIN') {
            router.push('/mainboard') // Redirect non-admins
            return
        }

        fetchUsers()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, isHydrated, router])

    const fetchUsers = async () => {
        try {
            setLoading(true)
            const res = await adminService.getAllUsers()
            setUsers(res.data.data)
        } catch (error) {
            console.error(error)
            addToast({
                title: 'Error central',
                description: 'No se pudieron cargar los usuarios.',
                type: 'error'
            })
        } finally {
            setLoading(false)
        }
    }

    const handleToggleStatus = async (targetUserId: string, currentStatus: boolean) => {
        try {
            await adminService.toggleUserStatus(targetUserId, !currentStatus)
            setUsers(users.map(u => u.id === targetUserId ? { ...u, enabled: !currentStatus } : u))
            addToast({
                title: 'Estado actualizado',
                description: `El usuario ahora está ${!currentStatus ? 'activo' : 'inactivo'}.`,
                type: 'success'
            })
        } catch (error) {
            console.error(error)
            addToast({
                title: 'Error',
                description: 'No se pudo cambiar el estado del usuario.',
                type: 'error'
            })
        }
    }

    const handlePromoteDemote = async (targetUserId: string, currentRole: string) => {
        const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN'
        try {
            await adminService.updateUserRole(targetUserId, newRole)
            setUsers(users.map(u => u.id === targetUserId ? { ...u, role: newRole as Role } : u))
            addToast({
                title: 'Rol actualizado',
                description: `El usuario ahora es ${newRole}.`,
                type: 'success'
            })
        } catch (error) {
            console.error(error)
            addToast({
                title: 'Error',
                description: 'No se pudo cambiar el rol del usuario.',
                type: 'error'
            })
        }
    }

    const handleDelete = async (targetUserId: string) => {
        if (!confirm('¿Estás seguro de que quieres eliminar a este usuario permanentemente?')) return

        try {
            await adminService.deleteUser(targetUserId)
            setUsers(users.filter(u => u.id !== targetUserId))
            addToast({
                title: 'Usuario eliminado',
                description: 'La cuenta ha sido borrada.',
                type: 'success'
            })
        } catch (error) {
            console.error(error)
            addToast({
                title: 'Error',
                description: 'Hubo un error borrando al usuario.',
                type: 'error'
            })
        }
    }

    if (!isHydrated || loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Panel de Administración</h1>
                <p className="text-muted-foreground mt-2">
                    Gestiona los usuarios de la plataforma, sus roles y sus estados.
                </p>
            </div>

            <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
                <div className="w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b bg-muted/50">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Usuario</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Email</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Rol</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Estado</th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {users.map((u) => (
                                <tr key={u.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <td className="p-4 align-middle font-medium">
                                        {u.firstName} {u.lastName}
                                    </td>
                                    <td className="p-4 align-middle text-muted-foreground">{u.email}</td>
                                    <td className="p-4 align-middle">
                                        <Badge variant={u.role === 'ADMIN' ? 'destructive' : 'default'} className="uppercase">
                                            {u.role === 'ADMIN' && <ShieldAlert className="w-3 h-3 mr-1" />}
                                            {u.role}
                                        </Badge>
                                    </td>
                                    <td className="p-4 align-middle">
                                        <Badge variant={u.enabled ? 'default' : 'secondary'} className={u.enabled ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20 shadow-none border-transparent' : 'bg-red-500/10 text-red-500 hover:bg-red-500/20 shadow-none border-transparent'}>
                                            {u.enabled ? 'Activo' : 'Baneado'}
                                        </Badge>
                                    </td>
                                    <td className="p-4 align-middle text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handlePromoteDemote(u.id, u.role || 'USER')}
                                                title={u.role === 'ADMIN' ? 'Quitar Admin' : 'Hacer Admin'}
                                                disabled={u.id === user?.id} // Cannot demote self
                                            >
                                                {u.role === 'ADMIN' ? <ShieldCheck className="h-4 w-4" /> : <ShieldAlert className="h-4 w-4 text-orange-500" />}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleToggleStatus(u.id, u.enabled || false)}
                                                title={u.enabled ? 'Banear Usuario' : 'Activar Usuario'}
                                                className={u.enabled ? 'text-red-500 hover:text-red-600' : 'text-green-500 hover:text-green-600'}
                                                disabled={u.id === user?.id} // Cannot ban self
                                            >
                                                {u.enabled ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(u.id)}
                                                title="Eliminar Cuenta"
                                                disabled={u.id === user?.id} // Cannot delete self
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {users.length === 0 && (
                    <div className="p-8 text-center text-muted-foreground">
                        No hay usuarios registrados en la base de datos.
                    </div>
                )}
            </div>
        </div>
    )
}
