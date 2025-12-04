
A span chart (also known as a range chart or Gantt-style chart) displays horizontal bars
that show ranges or time periods for different categories. Each span has a start and end value,
making it ideal for visualizing schedules, timelines, or value ranges across categories.

## Preview

<img src="/charty/img/span-chart.png" alt="Span chart example" width="420" />

## Code examples

```kotlin
SpanChart(
    data = {
        listOf(
            SpanData("Task 1", startValue = 5f, endValue = 15f),
            SpanData("Task 2", startValue = 10f, endValue = 25f),
            SpanData("Task 3", startValue = 3f, endValue = 18f),
        )
    },
    colors = ChartyColor.Gradient(
        listOf(Color(0xFF2196F3), Color(0xFF4CAF50), Color(0xFFFF9800))
    ),
    barConfig = BarChartConfig(
        barWidthFraction = 0.6f,
        cornerRadius = CornerRadius.Medium,
    ),
)
```

### Time-based span example

```kotlin
SpanChart(
    data = {
        listOf(
            SpanData("Sprint 1", startValue = 0f, endValue = 14f),
            SpanData("Sprint 2", startValue = 14f, endValue = 28f),
            SpanData("Sprint 3", startValue = 28f, endValue = 42f),
        )
    },
    colors = ChartyColor.Solid(Color(0xFF9C27B0)),
    barConfig = BarChartConfig(
        barWidthFraction = 0.5f,
    ),
)
```

## Use cases

- Displaying project timelines, schedules, and task durations (lightweight Gantt-style).
- Showing value ranges, such as min/max temperatures or price ranges over time.
- Visualizing availability windows or operating hours for different services.
- Comparing overlapping time periods or intervals across categories.

## Configuration

Span charts use configuration similar to horizontal bar charts but with start and end values for each span.

Key options include:

- `barWidthFraction`: Controls the thickness of each span bar.
- Corner radius: Configure `cornerRadius` for rounded ends.
- Colors: Use distinct colors per category or a gradient.
- Data structure: Each `SpanData` includes a category label, start value, and end value.

See also:

- [Bar chart configuration](../configurations/bar-chart-config.md)
- [Chart scaffold configuration](../configurations/chart-scaffold-config.md)

## Tips

- Sort spans by start time or duration to make patterns easier to spot.
- Show start and end labels on or near each span for clarity.
- Use consistent time units or scales on the horizontal axis.
- Avoid overlapping labels by using shorter category names or rotating text.
- Consider color-coding spans by status (e.g., completed, in-progress, planned).

## Related charts

- [Horizontal Bar Chart](horizontal-bar-chart.md)
- [Waterfall Chart](waterfall-chart.md)
- [Bar Charts Overview](bar-charts.md)

