import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Loader2, Save } from 'lucide-react';
import { Expense } from '@/types/expense.types';
import expenseService from '@/services/expense.service';
import CategorySelector from '@/components/shared/CategorySelector';

interface EditExpenseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    expense: Expense | null;
    userCategories?: string[];
}

export default function EditExpenseModal({
    isOpen,
    onClose,
    onSuccess,
    expense,
    userCategories = []
}: EditExpenseModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<Partial<Expense>>({});

    useEffect(() => {
        if (expense) {
            setFormData({
                concept: expense.concept,
                amount: expense.amount,
                date: expense.date,
                category: expense.category,
                subcategory: expense.subcategory
            });
        }
    }, [expense]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!expense) return;

        setIsLoading(true);
        try {
            await expenseService.updateExpense(expense.id, formData);
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error updating expense:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Editar Gasto</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Concepto</Label>
                        <Input
                            value={formData.concept || ''}
                            onChange={e => setFormData({ ...formData, concept: e.target.value })}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Cantidad (€)</Label>
                            <Input
                                type="number"
                                step="0.01"
                                value={formData.amount || ''}
                                onChange={e => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Fecha</Label>
                            <Input
                                type="date"
                                value={formData.date?.toString().split('T')[0] || ''}
                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <CategorySelector
                        category={formData.category || ''}
                        subcategory={formData.subcategory || ''}
                        onCategoryChange={(val) => setFormData(prev => ({ ...prev, category: val, subcategory: '' }))}
                        onSubcategoryChange={(val) => setFormData(prev => ({ ...prev, subcategory: val }))}
                        userCategories={userCategories}
                    />

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isLoading} className="bg-yellow-600 hover:bg-yellow-700">
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Guardar
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
