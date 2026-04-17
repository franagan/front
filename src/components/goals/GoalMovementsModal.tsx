'use client'

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SavingsGoal } from '@/types/goal.types';
import { Expense } from '@/types/expense.types';
import goalService from '@/services/goal.service';
import { Loader2, ArrowUpRight, Calendar, DollarSign } from 'lucide-react';

interface GoalMovementsModalProps {
    isOpen: boolean;
    onClose: () => void;
    goal: SavingsGoal | null;
}

export default function GoalMovementsModal({
    isOpen,
    onClose,
    goal
}: GoalMovementsModalProps) {
    const [movements, setMovements] = useState<Expense[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen && goal?.id) {
            fetchMovements();
        }
    }, [isOpen, goal]);

    const fetchMovements = async () => {
        if (!goal?.id) return;
        setIsLoading(true);
        try {
            const res = await goalService.getGoalMovements(goal.id);
            const sorted = (res.data.data || []).sort((a, b) => 
                new Date(b.date).getTime() - new Date(a.date).getTime()
            );
            setMovements(sorted);
        } catch (error) {
            console.error("Error fetching goal movements:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] h-[70vh] flex flex-col p-0 overflow-hidden">
                <DialogHeader className="p-6 border-b border-border">
                    <DialogTitle className="flex items-center gap-3">
                        <span className="text-3xl">{goal?.icon}</span>
                        <div className="text-left">
                            <p className="text-sm font-normal text-muted-foreground uppercase tracking-widest">Movimientos de:</p>
                            <h2 className="text-2xl font-bold">{goal?.name}</h2>
                        </div>
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-0">
                    {isLoading ? (
                        <div className="h-full flex items-center justify-center py-20">
                            <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
                        </div>
                    ) : movements.length === 0 ? (
                        <div className="text-center py-20 px-6">
                            <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <DollarSign className="h-8 w-8 text-muted-foreground opacity-50" />
                            </div>
                            <h3 className="text-lg font-semibold text-muted-foreground italic">No hay registros aún</h3>
                            <p className="text-sm text-muted-foreground/60 mt-1">
                                Los aportes que vincules a este objetivo aparecerán aquí.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-border/50">
                            {movements.map((move) => (
                                <div key={move.id} className="p-4 hover:bg-muted/30 transition-colors flex justify-between items-center group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                                            <ArrowUpRight className="h-5 w-5 text-green-500" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-foreground">{move.concept || 'Aporte directo'}</p>
                                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(move.date).toLocaleDateString('es-ES', { 
                                                    day: '2-digit', 
                                                    month: 'long', 
                                                    year: 'numeric' 
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-black text-green-500">
                                            +€{move.amount.toFixed(2)}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                                            Completado
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-4 bg-muted/20 border-t border-border mt-auto flex justify-between items-center">
                    <div className="text-xs text-muted-foreground">
                        Total acumulado vinculado:
                    </div>
                    <div className="font-black text-xl text-yellow-600">
                        €{movements.reduce((sum, m) => sum + m.amount, 0).toLocaleString('es-ES')}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
