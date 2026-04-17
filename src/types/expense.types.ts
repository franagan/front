export interface Expense {
    id: string;
    userId: string;
    date: string;
    concept: string;
    amount: number;
    category?: string;
    subcategory?: string;
    isRecurring?: boolean;
    recurringPeriod?: string;
    linkedGoalId?: string;
    createdAt?: string;
}

export interface ImportExpensesResponse {
    message: string;
    data: Expense[];
}
