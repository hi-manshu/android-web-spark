
Configuration for Candlestick (OHLC) Chart appearance and behavior.

## Overview

`CandlestickChartConfig` controls the visual appearance of candlestick charts used for financial data visualization, including candle body and wick sizing.

## Definition

```kotlin
data class CandlestickChartConfig(
    val candleWidthFraction: Float = 0.7f,
    val wickWidthFraction: Float = 0.1f,
    val minCandleBodyHeight: Float = 2f,
    val showWicks: Boolean = true,
    val cornerRadius: CornerRadius = CornerRadius.None,
    val animation: Animation = Animation.Default,
)
```

## Properties

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `candleWidthFraction` | `Float` | `0.7f` | Fraction of available space each candle occupies (0.0f - 1.0f) |
| `wickWidthFraction` | `Float` | `0.1f` | Fraction of candle width that the wick line occupies (0.0f - 1.0f) |
| `minCandleBodyHeight` | `Float` | `2f` | Minimum height for candle body in pixels (for doji candles) |
| `showWicks` | `Boolean` | `true` | Whether to show upper and lower wicks |
| `cornerRadius` | `CornerRadius` | `None` | Corner radius for candle body corners |
| `animation` | `Animation` | `Animation.Default` | Animation configuration |

## Usage Example

```kotlin
import com.himanshoe.charty.candlestick.CandlestickChart
import com.himanshoe.charty.candlestick.config.CandlestickChartConfig

CandlestickChart(
    data = { ohlcData },
    upColor = Color(0xFF4CAF50),
    downColor = Color(0xFFF44336),
    candleConfig = CandlestickChartConfig(
        candleWidthFraction = 0.8f,
        wickWidthFraction = 0.15f,
        showWicks = true,
        cornerRadius = CornerRadius.Small
    )
)
```

## Related

- [Candlestick Chart](../chart-types/candle-stick-chart.md)
- [ChartScaffoldConfig](chart-scaffold-config.md)

