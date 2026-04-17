import api from './api';
import type { ApiResponse } from '@/types/portfolio.types';

export interface Transaction {
    id: string;
    userId: string;
    portfolioId: string;
    investmentId: string;
    stockId: string;
    stockSymbol: string;
    stockName: string;
    type: 'BUY' | 'SELL' | 'DIVIDEND' | 'STOCK_SPLIT' | 'TRANSFER_IN' | 'TRANSFER_OUT' | 'ADJUSTMENT';
    status: 'PENDING' | 'EXECUTED' | 'SETTLED' | 'CANCELLED' | 'FAILED';
    quantity: number;
    unitPrice: number;
    grossAmount: number;
    commission: number;
    fees: number;
    taxes: number;
    netAmount: number;
    currency: string;
    executedAt: string;
    notes?: string;
    source?: string;
}

class TransactionService {
    async getTransactions(page = 0, size = 10, sort = 'executedAt,desc') {
        const response = await api.get<ApiResponse<any>>(`/transactions?page=${page}&size=${size}&sort=${sort}`);
        return response.data;
    }

    async getPortfolioTransactions(portfolioId: string) {
        const response = await api.get<ApiResponse<Transaction[]>>(`/transactions/portfolio/${portfolioId}`);
        return response.data;
    }

    async buyStock(data: Partial<Transaction>) {
        const response = await api.post<ApiResponse<Transaction>>('/transactions/buy', data);
        return response.data;
    }

    async sellStock(data: Partial<Transaction>) {
        const response = await api.post<ApiResponse<Transaction>>('/transactions/sell', data);
        return response.data;
    }

    async collectDividend(data: Partial<Transaction>) {
        const response = await api.post<ApiResponse<Transaction>>('/transactions/dividend', data);
        return response.data;
    }

    async getTransactionDetail(id: string) {
        const response = await api.get<ApiResponse<Transaction>>(`/transactions/${id}`);
        return response.data;
    }

    async cancelTransaction(id: string) {
        const response = await api.delete<ApiResponse<Transaction>>(`/transactions/${id}`);
        return response.data;
    }
}

const transactionService = new TransactionService();
export default transactionService;
