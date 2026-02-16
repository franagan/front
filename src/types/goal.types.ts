export interface SavingsGoal {
    id: string;
    userId: string;
    name: string;
    currentAmount: number;
    targetAmount: number;
    icon: string;
    deadline?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateGoalRequest {
    name: string;
    currentAmount: number;
    targetAmount: number;
    icon: string;
    deadline?: string;
}
