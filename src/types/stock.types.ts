// Stock data types matching backend DTOs

export interface StockSearchResult {
  symbol: string;
  name: string;
  type: string;
  region: string;
  currency: string;
  matchScore: string;
  hasLiveData: boolean; // Indica si tiene datos de precio en tiempo real
}

export interface StockQuote {
  symbol: string;
  price: number;
  open: number;
  high: number;
  low: number;
  previousClose: number;
  change: number;
  changePercent: number;
  volume: number;
  lastUpdated: string;
}

export interface CompanyOverview {
  symbol: string;
  name: string;
  description: string;
  sector: string;
  industry: string;
  country: string;
  currency: string;
  marketCap: number | null;
  peRatio: number | null;
  dividendYield: number | null;
  eps: number | null;
  beta: number | null;
  week52High: number | null;
  week52Low: number | null;
}

export interface StockPriceResponse {
  symbol: string;
  price: number;
}
