'use client'
import {createChart, ColorType, UTCTimestamp, LineStyle} from 'lightweight-charts';
import React, { useEffect, useRef } from 'react';
import {Order} from "@/types/types";
import {getHexFromClass} from "@/components/utils/utils";

// @ts-ignore
export const ChartComponent = props => {
    const {
        ohlc,
        plots,
        orders,
        colors: {
            backgroundColor = getHexFromClass('bg-neutral'),
            lineColor = getHexFromClass('bg-base-100'),
            textColor = getHexFromClass('bg-neutral-content'),
            areaTopColor = '#2962FF',
            areaBottomColor = 'rgba(41, 98, 255, 0.28)',
        } = {},
    } = props;

    const chartContainerRef = useRef();

    useEffect(
        () => {
            const handleResize = () => {
                // @ts-ignore
                chart.applyOptions({ width: chartContainerRef.current.clientWidth });
            };

            // @ts-ignore
            const chart = createChart(chartContainerRef.current, {
                layout: {
                    background: { type: ColorType.Solid, color: backgroundColor },
                    textColor,
                },
                grid: {
                    vertLines: {
                        color: getHexFromClass('bg-base-300'),
                    },
                    horzLines: {
                        color: getHexFromClass('bg-base-300'),
                    },
                },
                // @ts-ignore
                width: chartContainerRef.current.clientWidth,
                height: 350,
            });
            chart.timeScale().fitContent();

            // set the time axis format
            chart.timeScale().applyOptions({
                timeVisible: true,
            });

            // handle OHLC
            if (ohlc) {
                const newSeries = chart.addCandlestickSeries({
                    upColor: getHexFromClass('bg-success'),
                    downColor: getHexFromClass('bg-error'),
                    borderDownColor: getHexFromClass('bg-error'),
                    borderUpColor: getHexFromClass('bg-success'),
                    wickDownColor: getHexFromClass('bg-error'),
                    wickUpColor: getHexFromClass('bg-success'),
                });
                newSeries.setData(ohlc);
                // handle orders
                if (orders) {
                    newSeries.setMarkers(orders);
                }
            }

            // handle plots
            if (plots) {
                // loop through plots
                plots.forEach((plot: any) => {
                    // add series
                    const newSeries = chart.addLineSeries({
                        color: plot.color,
                        lineWidth: plot.lineWidth,
                        lineStyle: plot.lineStyle,
                        // priceFormat: {
                        //     type: 'custom',
                        //     // @ts-ignore
                        //     precision: 2,
                        //     formatter: (price: number) => {
                        //         return price.toFixed(2);
                        //     },
                        // },
                    });
                    // add data
                    newSeries.setData(plot.data);
                })
            }

            window.addEventListener('resize', handleResize);

            return () => {
                window.removeEventListener('resize', handleResize);

                chart.remove();
            };
        },
        [ohlc, backgroundColor, lineColor, textColor, areaTopColor, areaBottomColor]
    );

    return (
        <div
            // @ts-ignore
            ref={chartContainerRef}
        />
    );
};

export function Chart({ohlc, plots, orders, className}: {ohlc: any, plots: any, orders: Order[], className?: string}) {
    let convertedOHLC: never[] = []
    if (ohlc.length > 0) {
        convertedOHLC = ohlc.map((d: any) => {
            return {
                time: (d.time / 1000) as UTCTimestamp,
                open: d.open,
                high: d.high,
                low: d.low,
                close: d.close,
            }
        })
    }

    const sharedXAxis = ohlc.map((d: any) => {
        return {
            time: (d.time / 1000) as UTCTimestamp,
        }
    })

    let convertedOrders: { shape: string; color: string; size: number; time: number & { [Symbol.species]: "UTCTimestamp" }; text: string }[] = []
    if (orders) {
        convertedOrders = orders.map((d: any) => {
            return {
                time: (d.timestamp / 1000) as UTCTimestamp,
                shape: d.side === 'buy' ? 'arrowUp' : 'arrowDown',
                color: d.side === 'buy' ? getHexFromClass('bg-info') : getHexFromClass('bg-accent'),
                size: 2,
                position: d.side === 'buy' ? 'belowBar' : 'aboveBar',
                text: d.id.substring(0, 8)
            }
        })
    }

    let convertedPlots: any[] = []
    if (plots.length > 0) {
        convertedPlots = plots.map((d: any) => {
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

    return (
        <div className={`${className} overflow-hidden rounded-lg pr-3`}>
            <ChartComponent
                ohlc={convertedOHLC}
                plots={convertedPlots}
                orders={convertedOrders}>
            </ChartComponent>
        </div>
    );
}