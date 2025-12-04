# Multiline Chart

A multiline chart displays multiple data series as separate lines on the same axes,
allowing you to compare trends, patterns, and relationships between different datasets.
This is ideal for comparing performance metrics, tracking multiple categories over time, or analyzing correlations.

## Preview

<img src="../img/bar-chart.png" alt="Multiline chart example" width="420" />

_Note: A dedicated multiline chart image will be added in a future update._

## Use cases

- Comparing sales performance across multiple products or regions over time.
- Tracking website traffic from different sources simultaneously.
- Analyzing temperature trends in multiple cities.
- Comparing actual vs. projected values over time.
- Displaying multiple KPIs or metrics on the same timeline.
- Showing correlations and divergences between related datasets.

## Configuration

Multiline charts use `LineChartConfig` for shared line properties and individual color configuration per series.

Key options include:

- `lineThickness`: Stroke width for all lines (can be overridden per line).
- `smoothCurve`: Enable curved lines for all series.
- `showPoints`: Display markers at data points for all lines.
- Colors: Provide a color palette or gradient to distinguish lines.
- Legend: Enable to identify which line represents which series.
- Line style: Optionally use dashed or dotted lines for differentiation.

See also:

- [Line chart configuration](../configurations/line-chart-config.md)
- [Chart scaffold configuration](../configurations/chart-scaffold-config.md)

## Code examples

```kotlin
MultilineChart(
    data = {
        mapOf(
            "Product A" to listOf(100f, 150f, 120f, 180f, 165f),
            "Product B" to listOf(80f, 130f, 140f, 160f, 175f),
            "Product C" to listOf(90f, 110f, 100f, 140f, 155f),
        )
    },
    colors = ChartyColor.Gradient(
        listOf(
            Color(0xFFE91E63),
            Color(0xFF2196F3),
            Color(0xFF4CAF50),
        )
    ),
    lineConfig = LineChartConfig(
        lineThickness = 2.dp,
        smoothCurve = true,
        showPoints = true,
    ),
)
```

### Actual vs. Target comparison

```kotlin
MultilineChart(
    data = {
        mapOf(
            "Actual" to actualSales,
            "Target" to targetSales,
        )
    },
    colors = ChartyColor.Gradient(
        listOf(Color(0xFF4CAF50), Color(0xFFFF9800))
    ),
    lineConfig = LineChartConfig(
        lineThickness = 3.dp,
        smoothCurve = true,
        showPoints = false,
    ),
)
```

## Tips

- Limit the number of lines to 3-5; more becomes difficult to distinguish and track.
- Use distinct, accessible colors for each line with good contrast against the background.
- Always include a legend to identify which line represents which series.
- Consider using different line styles (solid, dashed, dotted) if colors alone aren't sufficient.
- Avoid crossing lines when possible by ordering series strategically.
- Use thicker lines for the most important series.
- Show point markers only if the data is sparse; hide them for dense time series.
- Ensure all lines use the same time intervals and scale for accurate comparison.

## Related charts

- [Line Chart](line-chart.md) – single line
- [Area Chart](area-chart.md) – filled area under line
- [Stacked Area Chart](stacked-area-chart.md) – stacked filled areas
- [Combo Bar Chart](combo-bar-chart.md) – bars + lines
- [Comparison Bar Chart](comparison-bar-chart.md) – grouped bars

