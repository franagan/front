'use client'

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import portfolioService from '@/services/portfolio.service';
import type { CreatePortfolioRequest } from '@/types/portfolio.types';
import { PortfolioType, RiskLevel } from '@/types/portfolio.types';
import { Textarea } from '../ui/textarea';

interface CreatePortfolioModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CreatePortfolioModal({
    isOpen,
    onClose,
    onSuccess
}: CreatePortfolioModalProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [currency, setCurrency] = useState('EUR');
    const [type, setType] = useState<PortfolioType>(PortfolioType.PERSONAL);
    const [riskLevel, setRiskLevel] = useState<RiskLevel>(RiskLevel.MODERATE);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || name.trim().length === 0) {
            setError('El nombre es requerido');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const portfolioData: CreatePortfolioRequest = {
                name: name.trim(),
                description: description.trim(),
                currency,
                type,
                riskLevel
            };

            await portfolioService.createPortfolio(portfolioData);

            // Reset form
            setName('');
            setDescription('');
            setCurrency('EUR');
            setType(PortfolioType.PERSONAL);
            setRiskLevel(RiskLevel.MODERATE);

            onSuccess();
            onClose();
        } catch (err) {
            console.error('Error creating portfolio:', err);
            const errorPayload = err as { response?: { data?: { message?: string } } };
            setError(errorPayload.response?.data?.message || 'Error al crear el portfolio');
        } finally {

            setIsLoading(false);
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            setName('');
            setDescription('');
            setCurrency('EUR');
            setType(PortfolioType.PERSONAL);
            setRiskLevel(RiskLevel.MODERATE);
            setError(null);
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Crear Nuevo Portfolio</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Nombre *</Label>
                        <Input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ej: Interactive Brokers, Degiro, Largo Plazo..."
                            required
                            maxLength={100}
                        />
                        <p className="text-xs text-muted-foreground">
                            Dale un nombre descriptivo (broker, estrategia, etc.)
                        </p>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Descripción (opcional)</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                            placeholder="Describe el propósito de este portfolio..."
                            rows={3}
                            maxLength={500}
                        />
                    </div>

                    {/* Currency */}
                    <div className="space-y-2">
                        <Label htmlFor="currency">Moneda</Label>
                        <Select value={currency} onValueChange={setCurrency}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="EUR">EUR (€)</SelectItem>
                                <SelectItem value="USD">USD ($)</SelectItem>
                                <SelectItem value="GBP">GBP (£)</SelectItem>
                                <SelectItem value="JPY">JPY (¥)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Type */}
                    <div className="space-y-2">
                        <Label htmlFor="type">Tipo</Label>
                        <Select value={type} onValueChange={(value) => setType(value as PortfolioType)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="PERSONAL">Personal</SelectItem>
                                <SelectItem value="RETIREMENT">Jubilación</SelectItem>
                                <SelectItem value="EDUCATION">Educación</SelectItem>
                                <SelectItem value="EMERGENCY">Emergencia</SelectItem>
                                <SelectItem value="OTHER">Otro</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Risk Level */}
                    <div className="space-y-2">
                        <Label htmlFor="riskLevel">Nivel de Riesgo</Label>
                        <Select value={riskLevel} onValueChange={(value) => setRiskLevel(value as RiskLevel)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="CONSERVATIVE">Conservador</SelectItem>
                                <SelectItem value="MODERATE">Moderado</SelectItem>
                                <SelectItem value="AGGRESSIVE">Agresivo</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isLoading}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-yellow-600 hover:bg-yellow-700"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creando...
                                </>
                            ) : (
                                'Crear Portfolio'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
