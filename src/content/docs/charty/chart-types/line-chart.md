
A line chart displays data as a series of points connected by straight or curved lines,
making it ideal for visualizing trends, patterns, and changes over continuous intervals such as time.
Line charts are one of the most effective ways to show how values evolve and identify patterns in sequential data.

## Preview

<div style="display: flex; gap: 1rem; flex-wrap: wrap;">
  <img src="/charty/img/line-chart.png" alt="Line chart example" width="400" />
  <img src="/charty/img/line-chart-one.png" alt="Line chart example variant" width="400" />
</div>

## Code examples

```kotlin
LineChart(
    data = {
        listOf(
            LineData("Jan", 100f),
            LineData("Feb", 150f),
            LineData("Mar", 120f),
            LineData("Apr", 180f),
            LineData("May", 165f),
        )
    },
    color = ChartyColor.Solid(ChartyColors.Blue),
    lineConfig = LineChartConfig(
        lineThickness = 3.dp,
        showPoints = true,
        pointRadius = 4.dp,
        smoothCurve = true,
    ),
)
```

### Straight line example

```kotlin
LineChart(
    data = { temperatureData },
    color = ChartyColor.Solid(Color(0xFFFF5722)),
    lineConfig = LineChartConfig(
        lineThickness = 2.dp,
        showPoints = false,
        smoothCurve = false,
    ),
)
```

### Area fill example

```kotlin
LineChart(
    data = { revenueData },
    color = ChartyColor.Gradient(
        listOf(Color(0xFF4CAF50), Color(0xFF8BC34A))
    ),
    lineConfig = LineChartConfig(
        lineThickness = 3.dp,
        fillArea = true,
        smoothCurve = true,
    ),
)
```

## Use cases

- Visualizing time-series data such as stock prices, website traffic, or sensor readings.
- Showing trends and patterns over continuous intervals.
- Tracking changes in metrics over days, weeks, months, or years.
- Displaying temperature, sales, or performance data over time.
- Identifying seasonality, cycles, and anomalies in sequential data.

## Configuration

Line charts in Charty are configured through `LineChartConfig` and `ChartScaffoldConfig`.

Key options include:

- `lineThickness`: Controls the stroke width of the line (e.g., `2.dp`, `3.dp`).
- `smoothCurve`: Enable curved (Bezier) lines for a smoother appearance.
- `showPoints`: Display circular markers at each data point.
- `pointRadius`: Size of data point markers when enabled.
- `fillArea`: Optionally fill the area under the line (creates an area chart effect).
- Colors: Use `ChartyColor.Solid` or gradients for the line stroke.
- Animation: Configure entrance and update animations.

See also:

- [Line chart configuration](../configurations/line-chart-config.md)
- [Chart scaffold configuration](../configurations/chart-scaffold-config.md)
- [Animation customization](../customization/animations.md)

## Tips

- Use smooth curves (`smoothCurve = true`) for a more polished, professional look.
- Show point markers when you have relatively few data points (< 20); hide them for dense datasets.
- Ensure consistent time intervals on the X-axis to accurately represent trends.
- Use different colors for multiple lines when comparing series (see **Multiline Chart**).
- Consider adding a zero baseline or reference line for context.
- Label key points or inflection points for emphasis.
- Use area fill sparingly; it works best for single-line charts showing magnitude.

## Related charts

- [Line Charts Overview](line-charts.md)
- [Multiline Chart](multiline-chart.md) – multiple lines on the same chart
- [Area Chart](area-chart.md) – filled area under the line
- [Stacked Area Chart](stacked-area-chart.md) – multiple stacked filled areas
- [Combo Bar Chart](combo-bar-chart.md) – combine lines with bars
