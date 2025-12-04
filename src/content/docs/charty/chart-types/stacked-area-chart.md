# Stacked Area Chart

A stacked area chart displays multiple data series as filled areas stacked on top of each other,
showing both individual series trends and the cumulative total. This is ideal for visualizing how different
components contribute to a whole over time while maintaining the ability to see each component's pattern.

## Preview

<img src="../img/bar-chart.png" alt="Stacked area chart example" width="420" />

_Note: A dedicated stacked area chart image will be added in a future update._

## Use cases

- Showing how multiple categories contribute to a total over time (e.g., revenue by product line).
- Displaying resource allocation or usage across different departments or projects.
- Tracking market share evolution with multiple competitors.
- Visualizing budget breakdowns by category over multiple periods.
- Analyzing traffic sources or user segments over time.

## Configuration

Stacked area charts use configuration for multiple series with distinct colors.

Key options include:

- `lineThickness`: Stroke width for lines between areas.
- `smoothCurve`: Enable curved transitions for smoother appearance.
- Colors: Provide a color palette with one color per series (stacked from bottom to top).
- `fillOpacity`: Control transparency of each filled area.
- Legend: Display to identify which area represents which series.
- Ordering: Series order affects visual impact (typically most important series at bottom).

See also:

- [Line chart configuration](../configurations/line-chart-config.md)
- [Chart scaffold configuration](../configurations/chart-scaffold-config.md)

## Code examples

```kotlin
StackedAreaChart(
    data = {
        mapOf(
            "Series A" to listOf(30f, 40f, 35f, 50f, 45f),
            "Series B" to listOf(50f, 60f, 55f, 70f, 65f),
            "Series C" to listOf(20f, 25f, 30f, 25f, 30f),
        )
    },
    colors = ChartyColor.Gradient(
        listOf(
            Color(0xFF2196F3),
            Color(0xFF4CAF50),
            Color(0xFFFF9800),
        )
    ),
    lineConfig = LineChartConfig(
        lineThickness = 2.dp,
        smoothCurve = true,
        fillOpacity = 0.7f,
    ),
)
```

### Revenue by product example

```kotlin
StackedAreaChart(
    data = {
        mapOf(
            "Product A" to listOf(100f, 120f, 140f, 130f),
            "Product B" to listOf(80f, 90f, 110f, 100f),
            "Product C" to listOf(60f, 70f, 80f, 90f),
        )
    },
    colors = ChartyColor.Gradient(
        listOf(
            Color(0xFF4CAF50),
            Color(0xFF2196F3),
            Color(0xFFE91E63),
        )
    ),
    lineConfig = LineChartConfig(
        smoothCurve = true,
    ),
)
```

## Tips

- Limit the number of stacked series to 3-5 for readability.
- Use distinct, harmonious colors for each series.
- Place the most important or stable series at the bottom (it will be easiest to read).
- Ensure consistent time intervals across all series.
- Add a legend to identify each colored area.
- Use smooth curves for a more polished appearance.
- Consider using a **Multiline Chart** if you need to compare exact values rather than composition.
- Label the total at the top of the stack for key time points.

## Related charts

- [Area Chart](area-chart.md) – single filled area
- [Multiline Chart](multiline-chart.md) – multiple lines without fill
- [Stacked Bar Chart](stacked-bar-chart.md) – stacked discrete bars
- [Mosiac Bar Chart](mosiac-bar-chart.md) – 100% stacked bars
- [Line Charts Overview](line-charts.md)

