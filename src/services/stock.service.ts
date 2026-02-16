import axios from 'axios';
import type { 
  StockSearchResult, 
  StockQuote, 
  CompanyOverview, 
  StockPriceResponse 
} from '@/types/stock.types';
import type { ApiResponse } from '@/types/auth.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

/**
 * Service for stock data operations using Alpha Vantage API
 */
class StockService {
  
  /**
   * Search for stocks by keywords
   */
  async searchStocks(keywords: string): Promise<StockSearchResult[]> {
    try {
      const response = await axios.get<ApiResponse<StockSearchResult[]>>(
        `${API_URL}/stocks/search`,
        {
          params: { keywords },
          headers: this.getAuthHeaders()
        }
      );
      
      return response.data.data || [];
    } catch (error) {
      console.error('Error searching stocks:', error);
      throw error;
    }
  }

  /**
   * Get current quote for a stock
   */
  async getStockQuote(symbol: string): Promise<StockQuote | null> {
    try {
      const response = await axios.get<ApiResponse<StockQuote>>(
        `${API_URL}/stocks/${symbol}/quote`,
        {
          headers: this.getAuthHeaders()
        }
      );
      
      return response.data.data || null;
    } catch (error) {
      console.error(`Error getting quote for ${symbol}:`, error);
      throw error;
    }
  }

  /**
   * Get company overview
   */
  async getCompanyOverview(symbol: string): Promise<CompanyOverview | null> {
    try {
      const response = await axios.get<ApiResponse<CompanyOverview>>(
        `${API_URL}/stocks/${symbol}/overview`,
        {
          headers: this.getAuthHeaders()
        }
      );
      
      return response.data.data || null;
    } catch (error) {
      console.error(`Error getting overview for ${symbol}:`, error);
      throw error;
    }
  }

  /**
   * Get just the current price (lightweight)
   */
  async getStockPrice(symbol: string): Promise<number | null> {
    try {
      const response = await axios.get<ApiResponse<StockPriceResponse>>(
        `${API_URL}/stocks/${symbol}/price`,
        {
          headers: this.getAuthHeaders()
        }
      );
      
      return response.data.data?.price || null;
    } catch (error) {
      console.error(`Error getting price for ${symbol}:`, error);
      throw error;
    }
  }

  /**
   * Get authorization headers with JWT token
   */
  private getAuthHeaders() {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  /**
   * Get JWT token from localStorage
   */
  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const authStorage = localStorage.getItem('auth-storage');
      if (authStorage) {
        const parsed = JSON.parse(authStorage);
        return parsed.state?.token || null;
      }
    } catch (error) {
      console.error('Error getting token:', error);
    }
    
    return null;
  }
}

const stockServiceInstance = new StockService();
export default stockServiceInstance;
