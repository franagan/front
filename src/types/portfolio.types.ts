// Portfolio Types
export interface Portfolio {
    id: string;
    name: string;
    description?: string;
    type: PortfolioType;
    riskLevel: RiskLevel;
    currency: string;
    totalValue: number;
    totalInvested: number;
    totalGainLoss: number;
    totalGainLossPercentage: number;
    totalInvestments: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface PortfolioDetail extends Portfolio {
    isPublic: boolean;
    goal?: FinancialGoal;
    analytics?: PortfolioAnalytics;
    lastRebalanceAt?: string;
}

export interface PortfolioSummary {
    id: string;
    name: string;
    totalValue: number;
    totalReturn: number;
    positions: number;
}

export interface CreatePortfolioRequest {
    name: string;
    description?: string;
    type?: PortfolioType;
    riskLevel?: RiskLevel;
    currency?: string;
}

export interface UpdatePortfolioRequest {
    name: string;
    description?: string;
    type?: PortfolioType;
    riskLevel?: RiskLevel;
    currency?: string;
}

export enum PortfolioType {
    PERSONAL = 'PERSONAL',
    RETIREMENT = 'RETIREMENT',
    EDUCATION = 'EDUCATION',
    EMERGENCY = 'EMERGENCY',
    SAVINGS = 'SAVINGS',
    SPECULATIVE = 'SPECULATIVE'
}

export enum RiskLevel {
    VERY_LOW = 'VERY_LOW',
    LOW = 'LOW',
    MODERATE = 'MODERATE',
    HIGH = 'HIGH',
    VERY_HIGH = 'VERY_HIGH'
}

export interface FinancialGoal {
    description: string;
    targetAmount: number;
    targetDate: string;
    monthlyContribution: number;
    status: GoalStatus;
}

export enum GoalStatus {
    ACTIVE = 'ACTIVE',
    ACHIEVED = 'ACHIEVED',
    PAUSED = 'PAUSED',
    CANCELLED = 'CANCELLED'
}

export interface PortfolioAnalytics {
    volatility?: number;
    sharpeRatio?: number;
    beta?: number;
    alpha?: number;
    maxDrawdown?: number;
    averageReturn?: number;
    totalTransactions?: number;
    lastAnalysisAt?: string;
}

// Investment Types
export interface Investment {
    id: string;
    portfolioId: string;
    stockId: string;
    stockSymbol: string;
    stockName: string;
    quantity: number;
    averagePrice: number;
    currentPrice: number;
    totalInvested: number;
    currentValue: number;
    gainLoss: number;
    gainLossPercentage: number;
    assetType?: AssetType;
    strategy: InvestmentStrategy;
    status: InvestmentStatus;
    createdAt: string;
    updatedAt: string;
}

export enum AssetType {
    STOCK = 'STOCK',
    ETF = 'ETF',
    MUTUAL_FUND = 'MUTUAL_FUND',
    BOND = 'BOND',
    COMMODITY = 'COMMODITY',
    CRYPTO = 'CRYPTO',
    REIT = 'REIT',
    REAL_ESTATE = 'REAL_ESTATE',
    FIXED_INCOME = 'FIXED_INCOME',
    CASH = 'CASH',
    INDEX = 'INDEX'
}

export interface InvestmentDetail extends Investment {
    alerts?: InvestmentAlerts;
    goals?: InvestmentGoals;
    performance?: PerformanceMetrics;
    totalTransactions?: number;
    firstPurchaseDate?: string;
    lastTransactionDate?: string;
}

export interface CreateInvestmentRequest {
    portfolioId: string;
    stockId: string;
    stockSymbol: string;
    stockName: string;
    quantity: number;
    averagePrice: number;
    currentPrice?: number;
}

export interface UpdateInvestmentRequest {
    quantity?: number;
    averagePrice?: number;
    currentPrice?: number;
    strategy?: InvestmentStrategy;
    status?: InvestmentStatus;
}

export enum InvestmentStrategy {
    BUY_AND_HOLD = 'BUY_AND_HOLD',
    DOLLAR_COST_AVERAGE = 'DOLLAR_COST_AVERAGE',
    VALUE_INVESTING = 'VALUE_INVESTING',
    GROWTH_INVESTING = 'GROWTH_INVESTING',
    MOMENTUM = 'MOMENTUM',
    SWING_TRADING = 'SWING_TRADING',
    DAY_TRADING = 'DAY_TRADING',
    DIVIDEND_INCOME = 'DIVIDEND_INCOME'
}

export enum InvestmentStatus {
    ACTIVE = 'ACTIVE',
    PARTIAL_EXIT = 'PARTIAL_EXIT',
    CLOSED = 'CLOSED',
    PAUSED = 'PAUSED',
    UNDER_REVIEW = 'UNDER_REVIEW'
}

export interface InvestmentAlerts {
    stopLoss?: number;
    takeProfit?: number;
    priceLowerAlert?: number;
    priceUpperAlert?: number;
    lossPercentageAlert?: number;
    gainPercentageAlert?: number;
    alertsEnabled: boolean;
    emailAlerts: boolean;
    pushAlerts: boolean;
}

export interface InvestmentGoals {
    targetValue?: number;
    targetGainPercentage?: number;
    targetDate?: string;
    monthlyContribution?: number;
    description?: string;
    status: GoalStatus;
}

export interface PerformanceMetrics {
    annualizedReturn?: number;
    volatility?: number;
    sharpeRatio?: number;
    maxDrawdown?: number;
    totalReturn?: number;
    holdingPeriodDays?: number;
    dividendsReceived?: number;
    lastCalculated?: string;
}

// API Response wrapper
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message: string;
    timestamp?: string;
}
