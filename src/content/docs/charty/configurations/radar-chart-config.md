# RadarChartConfig

Configuration for Radar (Spider) Chart appearance and behavior.

## Overview

`RadarChartConfig` provides comprehensive control over radar chart visualization, including data lines, grid, labels, and center content.

## Definition

```kotlin
data class RadarChartConfig(
    val dataLineWidth: Float = 2f,
    val showDataPoints: Boolean = true,
    val dataPointRadius: Float = 4f,
    val strokeCap: StrokeCap = StrokeCap.Round,
    val strokeJoin: StrokeJoin = StrokeJoin.Round,
    val startAngleDegrees: Float = -90f,
    val labelConfig: RadarLabelConfig = RadarLabelConfig(),
    val gridConfig: RadarGridConfig = RadarGridConfig(),
    val centerConfig: RadarCenterConfig = RadarCenterConfig(),
    val animation: Animation = Animation.Default,
    val scaleToFit: Boolean = true,
    val paddingFraction: Float = 0.15f,
)
```

## Main Properties

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `dataLineWidth` | `Float` | `2f` | Width of the data polygon lines |
| `showDataPoints` | `Boolean` | `true` | Whether to show points at each data vertex |
| `dataPointRadius` | `Float` | `4f` | Radius of data points |
| `strokeCap` | `StrokeCap` | `Round` | Style of line ends |
| `strokeJoin` | `StrokeJoin` | `Round` | Style of line joins |
| `startAngleDegrees` | `Float` | `-90f` | Starting angle (0° = right, -90° = top) |
| `labelConfig` | `RadarLabelConfig` | `...` | Configuration for axis labels |
| `gridConfig` | `RadarGridConfig` | `...` | Configuration for grid lines |
| `centerConfig` | `RadarCenterConfig` | `...` | Configuration for center content |
| `animation` | `Animation` | `Default` | Animation configuration |
| `scaleToFit` | `Boolean` | `true` | Whether to scale chart to fit available space |
| `paddingFraction` | `Float` | `0.15f` | Padding around chart (0.0 - 0.5) |

## RadarLabelConfig

```kotlin
data class RadarLabelConfig(
    val showLabels: Boolean = false,
    val showValues: Boolean = false,
    val labelDistanceMultiplier: Float = 1.15f,
    val labelTextStyle: TextStyle = TextStyle(...),
    val valueTextStyle: TextStyle = TextStyle(...),
)
```

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `showLabels` | `Boolean` | `false` | Whether to show axis labels |
| `showValues` | `Boolean` | `false` | Whether to show values on data points |
| `labelDistanceMultiplier` | `Float` | `1.15f` | Distance multiplier for label positioning |
| `labelTextStyle` | `TextStyle` | `...` | Style for axis labels |
| `valueTextStyle` | `TextStyle` | `...` | Style for value labels |

## RadarGridConfig

```kotlin
data class RadarGridConfig(
    val gridStyle: RadarGridStyle = RadarGridStyle.POLYGON,
    val numberOfGridLevels: Int = 5,
    val showGridLines: Boolean = true,
    val showAxisLines: Boolean = true,
    val gridLineWidth: Float = 1f,
    val axisLineWidth: Float = 1f,
    val gridLineColor: ChartyColor = ...,
    val axisLineColor: ChartyColor = ...,
    val gridLineAlpha: Float = 0.5f,
)

enum class RadarGridStyle {
    CIRCULAR,  // Circular/web grid lines
    POLYGON,   // Polygonal grid lines
}
```

## Usage Example

```kotlin
import com.himanshoe.charty.radar.RadarChart
import com.himanshoe.charty.radar.config.*

RadarChart(
    data = { radarData },
    radarConfig = RadarChartConfig(
        dataLineWidth = 3f,
        showDataPoints = true,
        dataPointRadius = 6f,
        labelConfig = RadarLabelConfig(
            showLabels = true,
            labelDistanceMultiplier = 1.2f
        ),
        gridConfig = RadarGridConfig(
            gridStyle = RadarGridStyle.POLYGON,
            numberOfGridLevels = 5
        )
    )
)
```

## Related

- [Radar Chart](../chart-types/radar-chart.md)
- [Multiple Radar Chart](../chart-types/multiple-radar-chart.md)
- [MultipleRadarChartConfig](multiple-radar-chart-config.md)

