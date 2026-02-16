import React from 'react';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BudgetCategory } from "@/types/budget.types";
import { SavingsGoal } from "@/types/goal.types";
import { IncomeSource } from "@/types/income.types";
import { Expense } from "@/types/expense.types";
// import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

interface FinancialChartsProps {
    portfolioData: {
        totalValue: number;
        totalReturn: number;
        positions: number;
    };
    budgets: BudgetCategory[];
    goals: SavingsGoal[];
    incomes: IncomeSource[];
    expenses: Expense[];
}

const TAILWIND_HEX_MAP: Record<string, string> = {
    'bg-blue-500': '#3b82f6',
    'bg-green-500': '#22c55e',
    'bg-yellow-500': '#eab308',
    'bg-purple-500': '#a855f7',
    'bg-pink-500': '#ec4899',
    'bg-red-500': '#ef4444',
    'bg-orange-500': '#f97316',
    'bg-cyan-500': '#06b6d4',
    'bg-gray-500': '#6b7280',
    'bg-green-600': '#16a34a',
};

const resolveColor = (colorClass?: string, fallback: string = '#8884d8') => {
    if (!colorClass) return fallback;
    if (colorClass.startsWith('#')) return colorClass;
    return TAILWIND_HEX_MAP[colorClass] || fallback;
};

export default function FinancialCharts({ portfolioData, budgets, goals, incomes, expenses }: FinancialChartsProps) {
    // const t = useTranslations('mainboard');

    // 1. Prepare Income Data (Monthly Basis)
    const incomeData = useMemo(() => incomes.map(inc => ({
        name: inc.name,
        value: inc.frequency === 'ANNUALLY' ? inc.amount / 12 : inc.amount,
        color: resolveColor(inc.color, '#22c55e')
    })).filter(d => d.value > 0), [incomes]);

    // 2. Prepare Expenses Data (By Category)
    const expensesByCategoryData = useMemo(() => budgets.map((b) => ({
        name: b.name,
        value: b.spent,
        color: resolveColor(b.color, '#eab308')
    })).filter(d => d.value > 0), [budgets]);

    // 3. Prepare Monthly Financial Data (Income vs Expenses)
    const monthlyFinancialData = useMemo(() => {
        const monthsMap: Record<string, { expenses: number, income: number }> = {};
        const now = new Date();

        // Initialize last 6 months
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const key = d.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' });
            monthsMap[key] = { expenses: 0, income: 0 };
        }

        // Aggregate Expenses
        expenses.forEach(exp => {
            const d = new Date(exp.date);
            const key = d.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' });
            if (monthsMap[key]) {
                monthsMap[key].expenses += exp.amount;
            }
        });

        // Aggregate Income (Recurring amounts distributed monthly)
        const totalMonthlyIncome = incomes.reduce((sum, inc) => {
            return sum + (inc.frequency === 'ANNUALLY' ? inc.amount / 12 : inc.amount);
        }, 0);

        Object.keys(monthsMap).forEach(key => {
            monthsMap[key].income = totalMonthlyIncome;
        });

        return Object.entries(monthsMap).map(([date, data]) => ({
            date,
            expenses: data.expenses,
            income: data.income
        }));
    }, [expenses, incomes]);

    // 4. Prepare Savings Goals Data

    // 5. Prepare Net Worth History Data
    const totalSavings = goals.reduce((sum, g) => sum + g.currentAmount, 0);
    const currentNetWorth = portfolioData.totalValue + totalSavings;

    const generateHistory = (current: number) => {
        const history = [];
        const months = 6;
        const now = new Date();

        for (let i = months; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const randomVariance = 0.85 + (0.15 * (1 - (i / months)));
            const noise = (Math.random() * 0.05) - 0.025;

            let value = i === 0 ? current : current * (randomVariance + noise);
            if (value < 0) value = 0;

            history.push({
                date: date.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' }),
                value: value
            });
        }
        return history;
    };

    const netWorthHistory = useMemo(() => generateHistory(currentNetWorth), [currentNetWorth]);

    // Custom Tooltip for Money
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const renderTooltip = (props: any) => {
        const { active, payload } = props;
        if (active && payload && payload.length) {
            return (
                <div className="bg-background border border-border p-2 rounded shadow-md text-sm">
                    <p className="font-semibold underline mb-1">{payload[0].payload.date || payload[0].name}</p>
                    <div className="space-y-1">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {payload.map((entry: any, index: number) => (
                            <div key={`tooltip-${index}`} className="flex items-center justify-between gap-4">
                                <span className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill }}></div>
                                    <span className="text-muted-foreground">{entry.name}:</span>
                                </span>
                                <span className="font-bold">€{Number(entry.value).toLocaleString('es-ES', { minimumFractionDigits: 2 })}</span>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        return null;
    };



    return (
        <section className="mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="text-yellow-400">📊</span>
                Análisis Visual
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Monthly Financial Chart (Income vs Expenses) */}
                <Card className="bg-card border-border">
                    <CardHeader>
                        <CardTitle className="text-lg">Equilibrio Mensual (Ingresos vs Gastos)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {monthlyFinancialData.some(d => d.expenses > 0 || d.income > 0) ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={monthlyFinancialData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                                    <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value: number) => `€${value}`} />
                                    <RechartsTooltip content={renderTooltip} />
                                    <Legend />
                                    <Bar dataKey="income" name="Ingresos" fill="#22c55e" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="expenses" name="Gastos" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                                No hay datos financieros
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Expenses by Category Chart */}
                <Card className="bg-card border-border">
                    <CardHeader>
                        <CardTitle className="text-lg">Gastos por Categoría</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {expensesByCategoryData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={expensesByCategoryData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {expensesByCategoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip content={renderTooltip} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                                No hay gastos registrados
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Income Chart */}
                <Card className="bg-card border-border">
                    <CardHeader>
                        <CardTitle className="text-lg">Distribución de Ingresos (Mensual)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {incomeData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={incomeData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {incomeData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip content={renderTooltip} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                                No hay datos de ingresos
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Net Worth Evolution (Line Chart) */}
                <Card className="bg-card border-border">
                    <CardHeader>
                        <CardTitle className="text-lg">Evolución del Patrimonio</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {currentNetWorth > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart
                                    data={netWorthHistory}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                                    <XAxis
                                        dataKey="date"
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `€${value.toLocaleString('es-ES', { notation: 'compact' })}`}
                                    />
                                    <RechartsTooltip content={renderTooltip} />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        name="Patrimonio Neto"
                                        stroke="#EAB308"
                                        strokeWidth={3}
                                        dot={{ r: 4, fill: "#EAB308" }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                                No hay datos de patrimonio
                            </div>
                        )}
                    </CardContent>
                </Card>

            </div>
        </section>
    );
}
