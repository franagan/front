'use client'

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
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

const budgetSchema = z.object({
    name: z.string().min(1, 'El nombre es obligatorio'),
    budget: z.string().min(1, 'El presupuesto mensual es obligatorio'),
    spent: z.string().min(1, 'El gasto real es obligatorio'),
    color: z.string(),
    description: z.string().optional(),
    subcategory: z.string().optional(),
    customName: z.string().optional(),
});

type BudgetFormData = z.infer<typeof budgetSchema>;

export default function CreateBudgetModal({
    isOpen,
    onClose,
    onSuccess,
    initialData,
    existingBudgets = []
}: CreateBudgetModalProps) {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        setValue,
        clearErrors,
    } = useForm<BudgetFormData>({
        resolver: zodResolver(budgetSchema),
        defaultValues: {
            name: '',
            budget: '',
            spent: '0',
            color: 'bg-blue-500',
            description: '',
        },
    });

        const [isCustom, setIsCustom] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                const isPredefined = PREDEFINED_CATEGORIES.includes(initialData.name);
                setIsCustom(!isPredefined);
                setValue('name', isPredefined ? initialData.name : 'custom');
                setValue('customName', isPredefined ? '' : initialData.name);
                setValue('subcategory', initialData.subcategory || '');
                setValue('budget', initialData.limit.toString());
                setValue('spent', initialData.spent.toString());
                setValue('color', initialData.color);
                setValue('description', initialData.description || '');
                setIsLocked(false);
                setHasUnsavedChanges(false);
            } else {
                resetForm();
            }
            clearErrors();
        }
    }, [isOpen, initialData, setValue, clearErrors]);

    useEffect(() => {
        const selectedName = isCustom ? watch('customName')?.trim() : watch('name');
        if (!selectedName || selectedName === 'custom') return;

        const existingCategory = existingBudgets.find(b => b.name === selectedName && b.id !== initialData?.id);

        if (existingCategory) {
            setValue('budget', existingCategory.limit.toString());
            setValue('color', existingCategory.color);
            setIsLocked(true);
        } else {
            setIsLocked(false);
        }
    }, [watch('name'), watch('customName'), existingBudgets, isCustom, initialData, setValue]);

    const resetForm = () => {
        setValue('name', '');
        setValue('customName', '');
        setIsCustom(false);
        setValue('subcategory', '');
        setValue('budget', '');
        setValue('spent', '0');
        setValue('color', 'bg-blue-500');
        setValue('description', '');
        setIsLocked(false);
        setHasUnsavedChanges(false);
        clearErrors();
    };

    const onSubmit = async (data: BudgetFormData) => {
        const budgetData: CreateBudgetRequest = {
            name: data.name,
            limit: parseFloat(data.budget),
            spent: parseFloat(data.spent),
            color: data.color,
            description: data.description || '',
            subcategory: data.subcategory || undefined,
        };

        try {
            if (initialData) {
                await budgetService.updateBudget(initialData.id, budgetData);
                toast.success('Presupuesto actualizado correctamente');
            } else {
                await budgetService.createBudget(budgetData);
                toast.success('Presupuesto creado correctamente');
            }
            onSuccess();
            onClose();
            resetForm();
        } catch (err) {
            console.error('Error saving budget:', err);
            const errorPayload = err as { response?: { data?: { message?: string } } };
            const errorMessage = errorPayload.response?.data?.message || 'Error al guardar el presupuesto';
            toast.error(errorMessage);
        }
    };

        const handleClose = () => {
        if (!isLoading && !hasUnsavedChanges) {
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{initialData ? 'Editar Presupuesto' : 'Añadir Presupuesto'}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <CategorySelector
                                            category={watch('name')}
                                            subcategory={watch('subcategory') || ''}
                                            onCategoryChange={(value) => {
                                                setValue('name', value);
                                                setValue('subcategory', '');
                                            }}
                                            onSubcategoryChange={(value) => setValue('subcategory', value)}
                                            allowCustom={true}
                                            isCustom={isCustom}
                                            onIsCustomChange={setIsCustom}
                                            customCategoryName={watch('customName') || ''}
                                            onCustomNameChange={(value) => setValue('customName', value)}
                                        />

                    <div className="space-y-2">
                        <Label htmlFor="description">Descripción (Opcional)</Label>
                        <Input
                            id="description"
                            {...register('description')}
                            placeholder="Ej: Compra mensual Mercadona"
                        />
                        {errors.description && (
                            <span className="text-xs text-red-500">{errors.description.message}</span>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="limit">Presupuesto Mensual (€)</Label>
                            <Input
                                id="limit"
                                {...register('budget')}
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="Ej: 500"
                                disabled={isLocked}
                                className={isLocked ? "bg-muted text-muted-foreground" : ""}
                            />
                            {isLocked && <p className="text-xs text-muted-foreground">Presupuesto compartido con la categoría existente.</p>}
                            {errors.budget && (
                                <span className="text-xs text-red-500">{errors.budget.message}</span>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="spent">Gasto Real (€)</Label>
                            <Input
                                id="spent"
                                {...register('spent')}
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="Ej: 250"
                            />
                            {errors.spent && (
                                <span className="text-xs text-red-500">{errors.spent.message}</span>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="color">Color</Label>
                        <Select value={watch('color')} onValueChange={(value) => setValue('color', value)} disabled={isLocked}>
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

                    {errors.name && (
                        <div className="text-sm text-red-500">
                            {errors.name.message}
                        </div>
                    )}

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isLoading} className="bg-yellow-600 hover:bg-yellow-700">
                            {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : (initialData ? 'Guardar Cambios' : 'Añadir Presupuesto')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}