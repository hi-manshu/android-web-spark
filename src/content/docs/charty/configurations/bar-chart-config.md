# BarChartConfig

Configuration for Bar Chart appearance and behavior.

```kotlin
data class BarChartConfig(
    val barWidthFraction: Float = 0.6f,
    val barSpacing: Float = 0f,
    val cornerRadius: CornerRadius = CornerRadius.Medium,
    val negativeValuesDrawMode: NegativeValuesDrawMode = NegativeValuesDrawMode.BELOW_AXIS,
    val animation: Animation = Animation.Default,
    val referenceLine: ReferenceLineConfig? = null,
    val tooltipConfig: TooltipConfig = TooltipConfig(),
    val tooltipPosition: TooltipPosition = TooltipPosition.AUTO,
    val tooltipFormatter: (BarData) -> String = { barData ->
        "${barData.label}: ${barData.value}"
    },
)
```

### Properties

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `barWidthFraction` | `Float` | `0.6f` | Fraction of available space that each bar occupies (0.0f - 1.0f) |
| `barSpacing` | `Float` | `0f` | Spacing between bars in pixels |
| `cornerRadius` | `CornerRadius` | `CornerRadius.Medium` | Corner radius for bar corners (None, Small, Medium, Large, ExtraLarge, or Custom) |
| `negativeValuesDrawMode` | `NegativeValuesDrawMode` | `BELOW_AXIS` | How to draw negative values (BELOW_AXIS or FROM_MIN_VALUE) |
| `animation` | `Animation` | `Animation.Default` | Animation configuration (Disabled or Enabled with duration) |
| `referenceLine` | `ReferenceLineConfig?` | `null` | Optional reference line configuration (target/average line) |
| `tooltipConfig` | `TooltipConfig` | `TooltipConfig()` | Configuration for tooltip appearance when a bar is clicked |
| `tooltipPosition` | `TooltipPosition` | `TooltipPosition.AUTO` | Preferred position for tooltips (ABOVE, BELOW, or AUTO) |
| `tooltipFormatter` | `(BarData) -> String` | `...` | Formatter for the tooltip text |
