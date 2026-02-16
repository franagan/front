'use client'

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import budgetService from '@/services/budget.service';
import type { CreateBudgetRequest, BudgetCategory } from '@/types/budget.types';
import { PREDEFINED_CATEGORIES } from '@/constants/categories';
import CategorySelector from '@/components/shared/CategorySelector';

interface CreateBudgetModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData?: BudgetCategory | null;
    existingBudgets?: BudgetCategory[];
}

export default function CreateBudgetModal({
    isOpen,
    onClose,
    onSuccess,
    initialData,
    existingBudgets = []
}: CreateBudgetModalProps) {
    const [name, setName] = useState('');
    const [customName, setCustomName] = useState('');
    const [isCustom, setIsCustom] = useState(false);

    // Subcategory logic
    const [subcategory, setSubcategory] = useState('');

    const [budget, setBudget] = useState('');
    const [spent, setSpent] = useState('0');
    const [color, setColor] = useState('bg-blue-500');
    const [description, setDescription] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLocked, setIsLocked] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                // Edit mode
                const isPredefined = PREDEFINED_CATEGORIES.includes(initialData.name);
                setIsCustom(!isPredefined);
                setName(isPredefined ? initialData.name : 'custom');
                setCustomName(isPredefined ? '' : initialData.name);
                setSubcategory(initialData.subcategory || '');

                setBudget(initialData.limit.toString());
                setSpent(initialData.spent.toString());
                setColor(initialData.color);
                setDescription(initialData.description || '');
                setIsLocked(false);
            } else {
                // Create mode
                resetForm();
            }
            setError(null);
        }
    }, [isOpen, initialData]);

    // Handle Category Change -> Check for existing budget lock
    useEffect(() => {
        const selectedName = isCustom ? customName.trim() : name;
        if (!selectedName || selectedName === 'custom') return;

        // Check if this category already exists in the current budget list
        // We look for any entry with the same name, EXCLUDING the current item if we are editing.
        const existingCategory = existingBudgets.find(b => b.name === selectedName && b.id !== initialData?.id);

        if (existingCategory) {
            // Lock Limit and Color to match the existing category
            setBudget(existingCategory.limit.toString());
            setColor(existingCategory.color);
            setIsLocked(true);
        } else {
            // Unlock if it's a new category
            setIsLocked(false);
        }

    }, [name, customName, existingBudgets, isCustom, initialData]);

    const resetForm = () => {
        setName('');
        setCustomName('');
        setIsCustom(false);
        setSubcategory('');
        setBudget('');
        setSpent('0');
        setColor('bg-blue-500');
        setDescription('');
        setIsLocked(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const finalName = isCustom ? customName.trim() : name;

        if (!finalName || !budget) {
            setError('Todos los campos son obligatorios');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const budgetData: CreateBudgetRequest = {
                name: finalName,
                limit: parseFloat(budget),
                spent: parseFloat(spent),
                color,
                description,
                subcategory: subcategory || undefined
            };

            if (initialData) {
                await budgetService.updateBudget(initialData.id, budgetData);
            } else {
                await budgetService.createBudget(budgetData);
            }

            onSuccess();
            onClose();
        } catch (err) {
            console.error('Error saving budget:', err);
            const errorPayload = err as { response?: { data?: { message?: string } } };
            const errorMessage = errorPayload.response?.data?.message || 'Error al guardar el presupuesto';
            setError(errorMessage);
        } finally {

            setIsLoading(false);
        }
    };

    const handleCategoryChange = (value: string) => {
        setName(value);
        if (value !== 'custom') {
            setSubcategory('');
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
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{initialData ? 'Editar Gasto' : 'Añadir Gasto'}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <CategorySelector
                        category={name}
                        subcategory={subcategory}
                        onCategoryChange={handleCategoryChange}
                        onSubcategoryChange={setSubcategory}
                        allowCustom={true}
                        isCustom={isCustom}
                        onIsCustomChange={setIsCustom}
                        customCategoryName={customName}
                        onCustomNameChange={setCustomName}
                    />

                    <div className="space-y-2">
                        <Label htmlFor="description">Descripción (Opcional)</Label>
                        <Input
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Ej: Compra mensual Mercadona"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="limit">Presupuesto Mensual (€)</Label>
                            <Input
                                id="limit"
                                type="number"
                                min="0"
                                step="0.01"
                                value={budget}
                                onChange={(e) => setBudget(e.target.value)}
                                placeholder="Ej: 500"
                                required
                                disabled={isLocked}
                                className={isLocked ? "bg-muted text-muted-foreground" : ""}
                            />
                            {isLocked && <p className="text-xs text-muted-foreground">Presupuesto compartido con la categoría existente.</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="spent">Gasto Real (€)</Label>
                            <Input
                                id="spent"
                                type="number"
                                min="0"
                                step="0.01"
                                value={spent}
                                onChange={(e) => setSpent(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="color">Color</Label>
                        <Select value={color} onValueChange={setColor} disabled={isLocked}>
                            <SelectTrigger className={isLocked ? "bg-muted" : ""}>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="bg-blue-500">Azul</SelectItem>
                                <SelectItem value="bg-green-500">Verde</SelectItem>
                                <SelectItem value="bg-yellow-500">Amarillo</SelectItem>
                                <SelectItem value="bg-purple-500">Morado</SelectItem>
                                <SelectItem value="bg-pink-500">Rosa</SelectItem>
                                <SelectItem value="bg-red-500">Rojo</SelectItem>
                                <SelectItem value="bg-orange-500">Naranja</SelectItem>
                                <SelectItem value="bg-cyan-500">Cian</SelectItem>
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
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (initialData ? 'Guardar Cambios' : 'Añadir Gasto')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
