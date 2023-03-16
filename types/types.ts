export type Order = {
    id: string;
    type: string;
    side: string;
    qty: number;
    filled_avg_price: number;
    timestamp: number;
}