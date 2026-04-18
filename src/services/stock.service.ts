import api from './api';
import type {
  StockSearchResult,
  StockQuote,
  CompanyOverview,
  StockPriceResponse
} from '@/types/stock.types';
import type { ApiResponse } from '@/types/auth.types';

// Tipo para resultados de busqueda de Finnhub
export interface FinnhubSearchResult {
  symbol: string;
  description: string;
  displaySymbol: string;
  type: string;
}

// Tipo para quote de Finnhub
export interface FinnhubQuoteResponse {
  success: boolean;
  data: {
    currentPrice: number;
    high: number;
    low: number;
    open: number;
    previousClose: number;
    timestamp: number;
  };
  message: string;
}

/**
 * Service for stock data operations using unified api client
 */
class StockService {

  /**
   * Search for stocks by keywords (Finnhub)
   */
  async searchSymbols(query: string): Promise<ApiResponse<FinnhubSearchResult[]>> {
    try {
      const response = await api.get<ApiResponse<FinnhubSearchResult[]>>('/stocks/search', {
        params: { keywords: query } // Consistent with backend StockDataController
      });
      return response.data;
    } catch (error) {
      console.error('Error searching stocks:', error);
      return { success: false, data: [], message: 'Error al buscar simbolos' };
    }
  }

  /**
   * Get current quote for a stock (Finnhub)
   */
  async getQuote(symbol: string): Promise<FinnhubQuoteResponse> {
    try {
      const response = await api.get<FinnhubQuoteResponse>(`/stocks/${symbol}/quote`);
      return response.data;
    } catch (error) {
      console.error(`Error getting quote for ${symbol}:`, error);
      return { 
        success: false, 
        data: { currentPrice: 0, high: 0, low: 0, open: 0, previousClose: 0, timestamp: 0 }, 
        message: 'Error al obtener cotizacion' 
      };
    }
  }

  /**
   * Search for stocks by keywords (Legacy/Alpha Vantage)
   */
  async searchStocks(keywords: string): Promise<StockSearchResult[]> {
    try {
      const response = await api.get<ApiResponse<StockSearchResult[]>>('/stocks/search', {
        params: { keywords }
      });
      return response.data.data || [];
    } catch (error) {
      console.error('Error searching stocks:', error);
      return [];
    }
  }

  /**
   * Get current quote for a stock
   */
  async getStockQuote(symbol: string): Promise<StockQuote | null> {
    try {
      const response = await api.get<ApiResponse<StockQuote>>(`/stocks/${symbol}/quote`);
      return response.data.data || null;
    } catch (error) {
      console.error(`Error getting quote for ${symbol}:`, error);
      return null;
    }
  }

  /**
   * Get company overview
   */
  async getCompanyOverview(symbol: string): Promise<CompanyOverview | null> {
    try {
      const response = await api.get<ApiResponse<CompanyOverview>>(`/stocks/${symbol}/overview`);
      return response.data.data || null;
    } catch (error) {
      console.error(`Error getting overview for ${symbol}:`, error);
      return null;
    }
  }

  /**
   * Get complete stock details (Aggregated)
   */
  async getStockDetails(symbol: string): Promise<ApiResponse<any>> {
    try {
      const response = await api.get<ApiResponse<any>>(`/stocks/${symbol}/details`);
      return response.data;
    } catch (error) {
      console.error(`Error getting details for ${symbol}:`, error);
      return { success: false, data: null, message: 'Error al obtener detalles' };
    }
  }

  /**
   * Get just the current price (lightweight)
   */
  async getStockPrice(symbol: string): Promise<number | null> {
    try {
      const response = await api.get<ApiResponse<StockPriceResponse>>(`/stocks/${symbol}/price`);
      return response.data.data?.price || null;
    } catch (error) {
      console.error(`Error getting price for ${symbol}:`, error);
      return null;
    }
  }
}

const stockServiceInstance = new StockService();
export default stockServiceInstance;
