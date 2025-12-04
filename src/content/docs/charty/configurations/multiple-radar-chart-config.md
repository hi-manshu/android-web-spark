# MultipleRadarChartConfig
- [RadarChartConfig](radar-chart-config.md)
- [Radar Chart](../chart-types/radar-chart.md)
- [Multiple Radar Chart](../chart-types/multiple-radar-chart.md)

## Related

```
)
    )
        )
            gridConfig = RadarGridConfig(numberOfGridLevels = 5)
            labelConfig = RadarLabelConfig(showLabels = true),
        radarConfig = RadarChartConfig(
        staggerDelay = 0.2f,
        staggerAnimation = true,
        legendPosition = LegendPosition.TOP,
        showLegend = true,
    multipleRadarConfig = MultipleRadarChartConfig(
    data = { multipleRadarData },
MultipleRadarChart(

import com.himanshoe.charty.radar.config.*
import com.himanshoe.charty.radar.MultipleRadarChart
```kotlin

## Usage Example

| `maxDataSets` | `Int` | `0` | Maximum number of datasets to display (0 = unlimited) |
| `blendMode` | `BlendMode` | `NORMAL` | Blend mode for overlapping areas |
| `showPointInnerCircle` | `Boolean` | `true` | Show inner white circle on data points for visibility |
| `datasetPointRadius` | `Float?` | `null` | Custom point radius per dataset (null uses radarConfig) |
| `datasetLineWidth` | `Float?` | `null` | Custom line width per dataset (null uses radarConfig) |
| `staggerDelay` | `Float` | `0.15f` | Delay multiplier between dataset animations (0.0 - 0.5) |
| `staggerAnimation` | `Boolean` | `true` | Animate datasets with a stagger effect |
| `highlightOnHover` | `Boolean` | `false` | Highlight dataset when hovering/clicking |
| `allowDatasetToggle` | `Boolean` | `false` | Allow clicking datasets to toggle visibility |
| `legendTextStyle` | `TextStyle` | `12.sp` | TextStyle for legend labels |
| `legendPosition` | `LegendPosition` | `TOP` | Position of the legend (TOP, BOTTOM, LEFT, RIGHT) |
| `showLegend` | `Boolean` | `false` | Whether to show a legend for datasets |
| `radarConfig` | `RadarChartConfig` | `RadarChartConfig()` | Base radar chart configuration |
| :--- | :--- | :--- | :--- |
| Property | Type | Default | Description |

## Properties

```
}
    NORMAL, ADDITIVE, MULTIPLY
enum class BlendMode {

}
    TOP, BOTTOM, LEFT, RIGHT
enum class LegendPosition {

)
    val maxDataSets: Int = 0,
    val blendMode: BlendMode = BlendMode.NORMAL,
    val showPointInnerCircle: Boolean = true,
    val datasetPointRadius: Float? = null,
    val datasetLineWidth: Float? = null,
    val staggerDelay: Float = 0.15f,
    val staggerAnimation: Boolean = true,
    val highlightOnHover: Boolean = false,
    val allowDatasetToggle: Boolean = false,
    val legendTextStyle: TextStyle = TextStyle(fontSize = 12.sp),
    val legendPosition: LegendPosition = LegendPosition.TOP,
    val showLegend: Boolean = false,
    val radarConfig: RadarChartConfig = RadarChartConfig(),
data class MultipleRadarChartConfig(
```kotlin

## Definition

`MultipleRadarChartConfig` extends the basic radar chart configuration to support multiple overlapping datasets with enhanced features like legends, staggered animations, and dataset-specific styling.

## Overview

Configuration for Multiple Radar Chart with support for multiple datasets.


