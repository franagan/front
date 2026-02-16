'use client'

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import incomeService from '@/services/income.service';
import type { CreateIncomeRequest } from '@/types/income.types';

interface CreateIncomeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CreateIncomeModal({
    isOpen,
    onClose,
    onSuccess
}: CreateIncomeModalProps) {
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [frequency, setFrequency] = useState<'MONTHLY' | 'ANNUALLY'>('MONTHLY');
    const [color, setColor] = useState('bg-green-500');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !amount) {
            setError('Todos los campos son obligatorios');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const incomeData: CreateIncomeRequest = {
                name: name.trim(),
                amount: parseFloat(amount),
                frequency,
                color
            };

            await incomeService.createIncome(incomeData);

            // Reset form
            setName('');
            setAmount('');
            setFrequency('MONTHLY');
            setColor('bg-green-500');

            onSuccess();
            onClose();
        } catch (err) {
            console.error('Error creating income source:', err);
            const errorPayload = err as { response?: { data?: { message?: string } } };
            setError(errorPayload.response?.data?.message || 'Error al crear la fuente de ingresos');
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
                    <DialogTitle>Añadir Fuente de Ingresos</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nombre</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ej: Nómina, Alquiler, Dividendos"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="amount">Monto (€)</Label>
                        <Input
                            id="amount"
                            type="number"
                            min="0"
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Ej: 2000"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="frequency">Frecuencia</Label>
                        <Select value={frequency} onValueChange={(val: 'MONTHLY' | 'ANNUALLY') => setFrequency(val)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="MONTHLY">Mensual</SelectItem>
                                <SelectItem value="ANNUALLY">Anual</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="color">Color</Label>
                        <Select value={color} onValueChange={setColor}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="bg-green-500">Verde</SelectItem>
                                <SelectItem value="bg-blue-500">Azul</SelectItem>
                                <SelectItem value="bg-yellow-500">Amarillo</SelectItem>
                                <SelectItem value="bg-purple-500">Morado</SelectItem>
                                <SelectItem value="bg-pink-500">Rosa</SelectItem>
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
