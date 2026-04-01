'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import reportService from '@/services/report.service';
import {
    Download,
    FileText,
    FileSpreadsheet,
    FileCode,
    Loader2,
    FileDown,
} from 'lucide-react';

interface ExportButtonsProps {
    // Tipo de reporte a mostrar
    type: 'portfolio' | 'investments' | 'transactions' | 'financial-summary' | 'all';
    // Variante del botón
    variant?: 'default' | 'outline' | 'ghost';
    // Tamaño del botón
    size?: 'default' | 'sm' | 'lg' | 'icon';
    // Clase adicional
    className?: string;
    // Mostrar como dropdown o botones individuales
    mode?: 'dropdown' | 'buttons';
}

export function ExportButtons({
    type,
    variant = 'outline',
    size = 'sm',
    className = '',
    mode = 'dropdown',
}: ExportButtonsProps) {
    const [loading, setLoading] = useState<string | null>(null);

    const handleExport = async (exportType: 'pdf' | 'excel' | 'csv' | 'summary') => {
        setLoading(exportType);
        try {
            let result;
            switch (exportType) {
                case 'pdf':
                    result = await reportService.downloadPortfolioPdf();
                    break;
                case 'excel':
                    result = await reportService.downloadInvestmentsExcel();
                    break;
                case 'csv':
                    result = await reportService.downloadTransactionsCsv();
                    break;
                case 'summary':
                    result = await reportService.downloadFinancialSummaryPdf();
                    break;
            }

            if (!result.success) {
                console.error('Error:', result.message);
            }
        } finally {
            setLoading(null);
        }
    };

    // Determinar qué opciones mostrar según el tipo
    const getExportOptions = () => {
        switch (type) {
            case 'portfolio':
                return [
                    { id: 'pdf', label: 'Exportar PDF', icon: FileText, action: () => handleExport('pdf') },
                    { id: 'excel', label: 'Exportar Excel', icon: FileSpreadsheet, action: () => handleExport('excel') },
                ];
            case 'investments':
                return [
                    { id: 'excel', label: 'Exportar Excel', icon: FileSpreadsheet, action: () => handleExport('excel') },
                ];
            case 'transactions':
                return [
                    { id: 'csv', label: 'Exportar CSV', icon: FileCode, action: () => handleExport('csv') },
                ];
            case 'financial-summary':
                return [
                    { id: 'summary', label: 'Resumen PDF', icon: FileText, action: () => handleExport('summary') },
                ];
            case 'all':
            default:
                return [
                    { id: 'pdf', label: 'Portafolio PDF', icon: FileText, action: () => handleExport('pdf') },
                    { id: 'excel', label: 'Inversiones Excel', icon: FileSpreadsheet, action: () => handleExport('excel') },
                    { id: 'csv', label: 'Transacciones CSV', icon: FileCode, action: () => handleExport('csv') },
                    { id: 'summary', label: 'Resumen Financiero', icon: FileDown, action: () => handleExport('summary') },
                ];
        }
    };

    const options = getExportOptions();

    if (mode === 'buttons') {
        return (
            <div className={`flex gap-2 ${className}`}>
                {options.map((option) => (
                    <Button
                        key={option.id}
                        variant={variant}
                        size={size}
                        onClick={option.action}
                        disabled={loading !== null}
                    >
                        {loading === option.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <>
                                <option.icon className="h-4 w-4 mr-2" />
                                {option.label}
                            </>
                        )}
                    </Button>
                ))}
            </div>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={variant} size={size} className={className} disabled={loading !== null}>
                    {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <>
                            <Download className="h-4 w-4 mr-2" />
                            Exportar
                        </>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Opciones de Exportación</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {options.map((option) => (
                    <DropdownMenuItem
                        key={option.id}
                        onClick={option.action}
                        disabled={loading !== null}
                    >
                        <option.icon className="h-4 w-4 mr-2" />
                        {option.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

// Componente específico para Portafolio
export function PortfolioExportButtons({ className = '' }: { className?: string }) {
    return (
        <ExportButtons
            type="portfolio"
            variant="outline"
            size="sm"
            className={className}
        />
    );
}

// Componente específico para Inversiones
export function InvestmentsExportButtons({ className = '' }: { className?: string }) {
    return (
        <ExportButtons
            type="investments"
            variant="outline"
            size="sm"
            className={className}
        />
    );
}

// Componente específico para Transacciones
export function TransactionsExportButtons({ className = '' }: { className?: string }) {
    return (
        <ExportButtons
            type="transactions"
            variant="outline"
            size="sm"
            className={className}
        />
    );
}

// Componente completo con todas las opciones
export function FullExportButtons({ className = '' }: { className?: string }) {
    return (
        <ExportButtons
            type="all"
            variant="outline"
            size="sm"
            className={className}
        />
    );
}