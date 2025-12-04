
A candlestick chart displays financial data showing the open, high, low, and close (OHLC) values for each time period.
Each "candle" consists of a body (showing open and close) and wicks (showing high and low),
making it essential for financial analysis, stock trading, and cryptocurrency tracking.

## Preview

<img src="/charty/img/candle-stick-chart.png" alt="Candlestick chart example" width="420" />

## Code examples

```kotlin
CandlestickChart(
    data = {
        listOf(
            OHLCData("Jan 1", open = 100f, high = 110f, low = 95f, close = 105f),
            OHLCData("Jan 2", open = 105f, high = 115f, low = 103f, close = 108f),
            OHLCData("Jan 3", open = 108f, high = 112f, low = 102f, close = 104f),
            OHLCData("Jan 4", open = 104f, high = 120f, low = 104f, close = 118f),
        )
    },
    upColor = Color(0xFF4CAF50),
    downColor = Color(0xFFF44336),
    candleConfig = CandlestickChartConfig(
        bodyWidth = 0.7f,
        wickThickness = 2.dp,
    ),
)
```

### Intraday trading example

```kotlin
CandlestickChart(
    data = { hourlyOHLCData },
    upColor = Color(0xFF00BCD4),
    downColor = Color(0xFFE91E63),
    candleConfig = CandlestickChartConfig(
        bodyWidth = 0.6f,
        wickThickness = 1.5.dp,
        hollowCandles = true,
    ),
)
```

## Use cases

- Displaying stock prices, cryptocurrency values, or other financial instruments over time.
- Analyzing intraday or multi-day price movements and volatility.
- Identifying trading patterns such as bullish/bearish trends, reversals, and consolidations.
- Showing opening and closing prices along with the trading range for each period.

## Configuration

Candlestick charts use configuration options for candle appearance and color-coding.

Key options include:

- `bodyWidth`: Controls the width of the candle body.
- `wickThickness`: Sets the thickness of the high/low wicks.
- Colors: Typically use green/blue for "up" candles (close > open) and red for "down" candles (close < open).
- Time scale: Configure the X-axis for time-based intervals (minutes, hours, days).
- Hollow vs. filled: Optionally use hollow candles for additional visual distinction.

See also:

- [Chart scaffold configuration](../configurations/chart-scaffold-config.md)
- [Theming customization](../customization/theming.md)

## Tips

- Use consistent time intervals (e.g., 1 hour, 1 day) for accurate pattern recognition.
- Color-code "up" candles (close > open) in green/blue and "down" candles in red.
- Show sufficient candles (20-50) to identify trends without overcrowding.
- Consider adding volume bars below the candlestick chart for comprehensive analysis.
- Use hollow candles or transparency variations for additional visual information.
- Ensure wicks are clearly visible to show the full trading range.

## Related charts

- [Line Charts](line-charts.md) (for closing prices only)
- [Bar Chart](bar-chart.md) (for volume)
- [Span Chart](span-chart.md) (for simpler high-low ranges)

