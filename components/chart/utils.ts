import {UTCTimestamp} from "lightweight-charts";
import {getHexFromClass} from "@/components/utils/utils";

export const convertedOHLC = (ohlc: any) => {
    return ohlc.map((d: any) => {
        return {
            time: (d.time / 1000) as UTCTimestamp,
            open: d.open,
            high: d.high,
            low: d.low,
            close: d.close,
        }
    })
}


export const convertedPlots = (plots: any, sharedXAxis: any) => {
    return plots.map((d: any) => {
        return {
            // add shared xaxis
            data: sharedXAxis.map((x: any, i: number) => {
                return {
                    ...x,
                    value: d.data[i]
                }
            }),
        }
    })
}


export const convertedOrders = (orders: any, buyColor: any, sellColor: any) => {
    return orders.map((d: any) => {
        const price = d.filled_avg_price.toFixed(2)
        const str = `${d.qty} @ ${price} (${d.id.substring(0, 4)})`
        const shape = d.side === 'buy' ? 'arrowUp' : 'arrowDown'
        const position = d.side === 'buy' ? 'belowBar' : 'aboveBar'
        return {
            time: (d.timestamp / 1000) as UTCTimestamp,
            shape: shape,
            color: d.side === 'buy' ? buyColor : sellColor,
            size: 2,
            position: position,
            text: str,
        }
    })
}
