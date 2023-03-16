export type Order = {
    id: string;
    type: string;
    side: string;
    qty: number;
    filled_avg_price: number;
    timestamp: number;
}

export interface Position {
    orders: Order[];
    closed: boolean;
    average_entry_price: number;
    average_exit_price: number;
    size: number
    side: string
    pnl: number
    timestamp: number
}

export interface Backtest {
    pnl: number;
    wl_ratio: number;
    sharpe_ratio: number;
    max_drawdown: number;
    max_drawdown_duration: number;
    trades: number;
    winning_trades: number;
    losing_trades: number;
    positions: Position[]
    orders: Order[]
}