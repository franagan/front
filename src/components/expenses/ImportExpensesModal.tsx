import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Upload } from 'lucide-react';
import expenseService from '@/services/expense.service';
import { useTranslations } from 'next-intl';

interface ImportExpensesModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function ImportExpensesModal({
    isOpen,
    onClose,
    onSuccess
}: ImportExpensesModalProps) {
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const tCommon = useTranslations('common');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            setError('Por favor, selecciona un archivo CSV');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            await expenseService.importExpenses(file);
            onSuccess();
            onClose();
            setFile(null);
        } catch (err) {
            console.error('Error importing expenses:', err);
            const errorPayload = err as { response?: { data?: { message?: string } } };
            setError(errorPayload.response?.data?.message || 'Error al importar los gastos. Verifica el formato del CSV.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            setError(null);
            setFile(null);
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Importar Gastos (CSV)</DialogTitle>
                    <DialogDescription>
                        Sube un archivo CSV con tus movimientos bancarios.
                        Formato esperado: Fecha, Concepto, Cantidad.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="file">Archivo CSV</Label>
                        <Input
                            id="file"
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            required
                        />
                    </div>

                    {error && (
                        <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                            {error}
                        </div>
                    )}

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
                            {tCommon('cancel')}
                        </Button>
                        <Button type="submit" disabled={isLoading || !file} className="bg-blue-600 hover:bg-blue-700 text-white">
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                            Importar
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
