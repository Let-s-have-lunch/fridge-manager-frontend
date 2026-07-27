export interface GetStatisticsResponse {
    targetMonth: string;
    dashboardData: DashboardResponse;
    modalData: ModalResponse;
}

export interface DashboardResponse {
    totalConsumedPrice: number;
    statusRates: {
        consumed: number;
        discarded: number;
        others: number;
    };
    expirationCards: {
        expired: number;
        expiringSoon: number;
        expiredList: ExpirationListItem[];
        expiringSoonList: ExpirationListItem[];
    };
    top3Products: Top3ProductItem[];
}

export interface ModalResponse {
    totalConsumedPrice: number;
    categoryChartData: CategoryChartItem[];
    savingEffect: {
        amount: number;
        isPositive: boolean;
        percentage: string;
    };
}

export interface ExpirationListItem {
    id: number;
    name: string;
    expirationDate: string;
    icon: string;
}

export interface Top3ProductItem {
    name: string;
    useCount: number;
    totalPrice: number;
    icon: string;
}

export interface CategoryChartItem {
    name: string;
    price: number;
}
