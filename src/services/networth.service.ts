import api from './api'
import { ApiResponse } from '@/types/auth.types'

export interface NetWorthCategory {
    id: string
    name: string
    groupName: string
    type: 'ASSET' | 'LIABILITY'
    icon: string
    color: string
}

export interface HistoryEntry {
    date: string
    assets: number
    liabilities: number
    netWorth: number
}

export interface NetWorthSummary {
    totalAssets: number
    totalLiabilities: number
    netWorth: number
    monthlyChange: number
    monthlyChangePercent: number
    history: HistoryEntry[]
    assetsDistribution: Record<string, number>
    liabilitiesDistribution: Record<string, number>
    categoryBalances: Record<string, number>
}

class NetWorthService {
    async getSummary(): Promise<ApiResponse<NetWorthSummary>> {
        const response = await api.get<ApiResponse<NetWorthSummary>>('/net-worth/summary')
        return response.data
    }

    async getCategories(): Promise<ApiResponse<NetWorthCategory[]>> {
        const response = await api.get<ApiResponse<NetWorthCategory[]>>('/net-worth/categories')
        return response.data
    }

    async saveEntry(categoryId: string, date: string, amount: number, notes?: string): Promise<ApiResponse<any>> {
        const response = await api.post<ApiResponse<any>>('/net-worth/entries', null, {
            params: { categoryId, date, amount, notes }
        })
        return response.data
    }

    async createCategory(category: Partial<NetWorthCategory>): Promise<ApiResponse<NetWorthCategory>> {
        const response = await api.post<ApiResponse<NetWorthCategory>>('/net-worth/categories', category)
        return response.data
    }

    async updateCategory(id: string, category: Partial<NetWorthCategory>): Promise<ApiResponse<NetWorthCategory>> {
        const response = await api.put<ApiResponse<NetWorthCategory>>(`/net-worth/categories/${id}`, category)
        return response.data
    }

    async deleteCategory(id: string): Promise<ApiResponse<void>> {
        const response = await api.delete<ApiResponse<void>>(`/net-worth/categories/${id}`)
        return response.data
    }
}

const netWorthServiceInstance = new NetWorthService()
export default netWorthServiceInstance
