# Line Chart
- [Line Charts Overview](line-charts.md)
- [Combo Bar Chart](combo-bar-chart.md) – combine lines with bars
- [Stacked Area Chart](stacked-area-chart.md) – multiple stacked filled areas
- [Area Chart](area-chart.md) – filled area under the line
- [Multiline Chart](multiline-chart.md) – multiple lines on the same chart

## Related charts

- Use area fill sparingly; it works best for single-line charts showing magnitude.
- Label key points or inflection points for emphasis.
- Consider adding a zero baseline or reference line for context.
- Use different colors for multiple lines when comparing series (see **Multiline Chart**).
- Ensure consistent time intervals on the X-axis to accurately represent trends.
- Show point markers when you have relatively few data points (< 20); hide them for dense datasets.
- Use smooth curves (`smoothCurve = true`) for a more polished, professional look.

## Tips

```
)
    ),
        smoothCurve = true,
        fillArea = true,
        lineThickness = 3.dp,
    lineConfig = LineChartConfig(
    ),
        listOf(Color(0xFF4CAF50), Color(0xFF8BC34A))
    color = ChartyColor.Gradient(
    data = { revenueData },
LineChart(
```kotlin

### Area fill example

```
)
    ),
        smoothCurve = false,
        showPoints = false,
        lineThickness = 2.dp,
    lineConfig = LineChartConfig(
    color = ChartyColor.Solid(Color(0xFFFF5722)),
    data = { temperatureData },
LineChart(
```kotlin

### Straight line example

```
)
    ),
        smoothCurve = true,
        pointRadius = 4.dp,
        showPoints = true,
        lineThickness = 3.dp,
    lineConfig = LineChartConfig(
    color = ChartyColor.Solid(ChartyColors.Blue),
    },
        )
            LineData("May", 165f),
            LineData("Apr", 180f),
            LineData("Mar", 120f),
            LineData("Feb", 150f),
            LineData("Jan", 100f),
        listOf(
    data = {
LineChart(
```kotlin

## Code examples

- [Animation customization](../customization/animations.md)
- [Chart scaffold configuration](../configurations/chart-scaffold-config.md)
- [Line chart configuration](../configurations/line-chart-config.md)

See also:

- Animation: Configure entrance and update animations.
- Colors: Use `ChartyColor.Solid` or gradients for the line stroke.
- `fillArea`: Optionally fill the area under the line (creates an area chart effect).
- `pointRadius`: Size of data point markers when enabled.
- `showPoints`: Display circular markers at each data point.
- `smoothCurve`: Enable curved (Bezier) lines for a smoother appearance.
- `lineThickness`: Controls the stroke width of the line (e.g., `2.dp`, `3.dp`).

Key options include:

Line charts in Charty are configured through `LineChartConfig` and `ChartScaffoldConfig`.

## Configuration

- Identifying seasonality, cycles, and anomalies in sequential data.
- Displaying temperature, sales, or performance data over time.
- Tracking changes in metrics over days, weeks, months, or years.
- Showing trends and patterns over continuous intervals.
- Visualizing time-series data such as stock prices, website traffic, or sensor readings.

## Use cases

_Note: A dedicated line chart image will be added in a future update._

<img src="../img/bar-chart.png" alt="Line chart example" width="420" />

## Preview

Line charts are one of the most effective ways to show how values evolve and identify patterns in sequential data.
making it ideal for visualizing trends, patterns, and changes over continuous intervals such as time.
A line chart displays data as a series of points connected by straight or curved lines,


