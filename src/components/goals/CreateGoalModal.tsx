'use client'

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import goalService from '@/services/goal.service';
import type { CreateGoalRequest } from '@/types/goal.types';

interface CreateGoalModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CreateGoalModal({
    isOpen,
    onClose,
    onSuccess
}: CreateGoalModalProps) {
    const [name, setName] = useState('');
    const [target, setTarget] = useState('');
    const [current, setCurrent] = useState('0');
    const [icon, setIcon] = useState('💰');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !target) {
            setError('Todos los campos son obligatorios');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const goalData: CreateGoalRequest = {
                name: name.trim(),
                targetAmount: parseFloat(target),
                currentAmount: parseFloat(current),
                icon
            };

            await goalService.createGoal(goalData);

            // Reset form
            setName('');
            setTarget('');
            setCurrent('0');
            setIcon('💰');

            onSuccess();
            onClose();
        } catch (err) {
            console.error('Error creating goal:', err);
            const errorPayload = err as { response?: { data?: { message?: string } } };
            setError(errorPayload.response?.data?.message || 'Error al crear el objetivo');
        } finally {

            setIsLoading(false);
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            setError(null);
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Añadir Objetivo de Ahorro</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nombre</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ej: Fondo de Emergencia"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="target">Objetivo (€)</Label>
                        <Input
                            id="target"
                            type="number"
                            min="0"
                            step="0.01"
                            value={target}
                            onChange={(e) => setTarget(e.target.value)}
                            placeholder="Ej: 10000"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="current">Ahorrado Actual (€)</Label>
                        <Input
                            id="current"
                            type="number"
                            min="0"
                            step="0.01"
                            value={current}
                            onChange={(e) => setCurrent(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="icon">Icono</Label>
                        <Select value={icon} onValueChange={setIcon}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="💰">💰 Dinero</SelectItem>
                                <SelectItem value="🛡️">🛡️ Seguridad</SelectItem>
                                <SelectItem value="✈️">✈️ Viaje</SelectItem>
                                <SelectItem value="🏠">🏠 Casa</SelectItem>
                                <SelectItem value="🚗">🚗 Coche</SelectItem>
                                <SelectItem value="💍">💍 Boda</SelectItem>
                                <SelectItem value="🎓">🎓 Educación</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {error && (
                        <div className="text-sm text-red-500">
                            {error}
                        </div>
                    )}

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isLoading} className="bg-yellow-600 hover:bg-yellow-700">
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Crear'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
