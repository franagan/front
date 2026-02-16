export interface BudgetCategory {
    id: string;
    userId: string;
    name: string;
    spent: number;
    limit: number;
    color: string;
    description?: string;
    subcategory?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateBudgetRequest {
    name: string;
    spent: number;
    limit: number;
    color: string;
    description?: string;
    subcategory?: string;
}
