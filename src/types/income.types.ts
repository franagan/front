export interface IncomeSource {
    id: string;
    userId: string;
    name: string;
    amount: number;
    frequency: 'MONTHLY' | 'ANNUALLY';
    color: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateIncomeRequest {
    name: string;
    amount: number;
    frequency: 'MONTHLY' | 'ANNUALLY';
    color: string;
}
