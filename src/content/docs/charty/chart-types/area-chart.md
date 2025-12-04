
An area chart is similar to a line chart but with the area under the line filled with color or gradient,
emphasizing the magnitude of values over time. This makes trends and cumulative totals more visually prominent
and helps viewers understand the "volume" of data, not just the trend.

## Preview

<img src="/charty/img/area-chart.png" alt="Area chart example" width="420" />

_Note: A dedicated area chart image will be added in a future update._

## Code examples

```kotlin
AreaChart(
    data = {
        listOf(
            LineData("Jan", 100f),
            LineData("Feb", 150f),
            LineData("Mar", 120f),
            LineData("Apr", 180f),
            LineData("May", 165f),
        )
    },
    color = ChartyColor.Gradient(
        listOf(Color(0xFF2196F3), Color(0xFF64B5F6))
    ),
    lineConfig = LineChartConfig(
        lineThickness = 3.dp,
        smoothCurve = true,
        fillOpacity = 0.6f,
    ),
)
```

### Gradient fill example

```kotlin
AreaChart(
    data = { profitData },
    color = ChartyColor.Gradient(
        listOf(
            Color(0xFF4CAF50).copy(alpha = 0.8f),
            Color(0xFF8BC34A).copy(alpha = 0.3f),
        )
    ),
    lineConfig = LineChartConfig(
        lineThickness = 2.dp,
        smoothCurve = true,
        showPoints = true,
        pointRadius = 5.dp,
    ),
)
```

## Use cases

- Emphasizing the magnitude or volume of data over time (e.g., total sales, cumulative revenue).
- Showing how a single metric accumulates or fluctuates across periods.
- Creating more visually impactful dashboards compared to plain line charts.
- Displaying environmental data like rainfall, pollution levels, or resource usage.
- Highlighting the "area under the curve" in scientific or statistical visualizations.

## Configuration

Area charts extend line chart configuration with fill options.

Key options include:

- `lineThickness`: Stroke width for the top line.
- `smoothCurve`: Enable curved lines for smoother transitions.
- `showPoints`: Display markers at data points along the line.
- `fillOpacity`: Control transparency of the filled area (0.0 to 1.0).
- Colors: Use gradients for visually appealing fills (e.g., darker at bottom, lighter at top).
- `showLine`: Optionally hide the stroke line and show only the filled area.

See also:

- [Line chart configuration](../configurations/line-chart-config.md)
- [Chart scaffold configuration](../configurations/chart-scaffold-config.md)
- [Theming customization](../customization/theming.md)

## Tips

- Use gradient fills from opaque to transparent (top to bottom) for a modern, polished look.
- Set fill opacity between 0.4 and 0.7 to balance emphasis with readability.
- Use smooth curves for more organic, flowing visualizations.
- Ensure good contrast between the fill color and background.
- Consider showing the top line stroke in a darker shade of the fill color.
- Area charts work best for single series; use **Stacked Area Chart** for multiple series.
- Show point markers if you have fewer than 15-20 data points.

## Related charts

- [Line Chart](line-chart.md) – line without fill
- [Stacked Area Chart](stacked-area-chart.md) – multiple stacked areas
- [Multiline Chart](multiline-chart.md) – multiple lines
- [Bar Chart](bar-chart.md) – discrete comparisons
- [Line Charts Overview](line-charts.md)

