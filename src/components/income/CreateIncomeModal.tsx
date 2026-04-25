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
import { useTranslations } from 'next-intl';

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
    const t = useTranslations('modals');
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
                    <DialogTitle>{t('addIncome.title')}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">{t('addIncome.name')}</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={t('addIncome.namePlaceholder')}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="amount">{t('addIncome.amount')}</Label>
                        <Input
                            id="amount"
                            type="number"
                            min="0"
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder={t('addIncome.amountPlaceholder')}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="frequency">{t('addIncome.frequency')}</Label>
                        <Select value={frequency} onValueChange={(val: 'MONTHLY' | 'ANNUALLY') => setFrequency(val)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="MONTHLY">{t('addIncome.monthly')}</SelectItem>
                                <SelectItem value="ANNUALLY">{t('addIncome.annually')}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="color">{t('addIncome.color')}</Label>
                        <Select value={color} onValueChange={setColor}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="bg-green-500">{t('addIncome.colors.green')}</SelectItem>
                                <SelectItem value="bg-blue-500">{t('addIncome.colors.blue')}</SelectItem>
                                <SelectItem value="bg-yellow-500">{t('addIncome.colors.yellow')}</SelectItem>
                                <SelectItem value="bg-purple-500">{t('addIncome.colors.purple')}</SelectItem>
                                <SelectItem value="bg-pink-500">{t('addIncome.colors.pink')}</SelectItem>
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
                            {t('cancel')}
                        </Button>
                        <Button type="submit" disabled={isLoading} className="bg-yellow-600 hover:bg-yellow-700">
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : t('create')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
