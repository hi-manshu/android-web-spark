
Configuration for Wavy Chart appearance and behavior.

## Overview

`WavyChartConfig` controls the visual appearance of wavy charts where bars are rendered with animated sine wave outlines.

## Definition

```kotlin
data class WavyChartConfig(
    val barWidthFraction: Float = 0.8f,
    val waveAmplitudeFractionOfBarWidth: Float = 1f / 3f,
    val waveSegments: Int = 40,
    val animationDurationMillis: Int = 500,
    val animationEasing: Easing = LinearEasing,
    val strokeWidthDp: Float = 3f,
    val phaseOffsetPerBar: Float = 0f,
)
```

## Properties

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `barWidthFraction` | `Float` | `0.8f` | Fraction of horizontal slot width occupied by each bar |
| `waveAmplitudeFractionOfBarWidth` | `Float` | `1f / 3f` | Amplitude of wave as fraction of bar width |
| `waveSegments` | `Int` | `40` | Number of vertical segments for smooth curves |
| `animationDurationMillis` | `Int` | `500` | Duration of one full wave cycle in milliseconds |
| `animationEasing` | `Easing` | `LinearEasing` | Easing function for wave phase animation |
| `strokeWidthDp` | `Float` | `3f` | Stroke width of the wavy line in dp |
| `phaseOffsetPerBar` | `Float` | `0f` | Additional phase offset per bar index (0f = all in sync) |

## Usage Example

```kotlin
import com.himanshoe.charty.bar.WavyChart
import com.himanshoe.charty.bar.config.WavyChartConfig
import androidx.compose.animation.core.FastOutSlowInEasing

WavyChart(
    data = { wavyData },
    color = ChartyColor.Solid(Color(0xFF00BCD4)),
    wavyConfig = WavyChartConfig(
        waveAmplitudeFractionOfBarWidth = 0.4f,
        waveSegments = 50,
        animationDurationMillis = 800,
        strokeWidthDp = 4f,
        animationEasing = FastOutSlowInEasing
    )
)
```

## Related

- [Wavy Chart](../chart-types/wavy-chart.md)
- [BarChartConfig](bar-chart-config.md)

