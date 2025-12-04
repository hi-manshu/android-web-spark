![Span Chart](/charty/img/span-chart.png)

# Span Chart

Span Chart - Display ranges/spans horizontally across categories

A span chart (also known as a range chart or Gantt-style chart) displays horizontal bars
showing ranges or time periods for different categories. Each span has a start and end value,
making it ideal for visualizing schedules, timelines, or value ranges.

## Usage

```kotlin
SpanChart(
    data = {
        listOf(
            SpanData("Category 1", startValue = 5f, endValue = 15f),
            SpanData("Category 2", startValue = 10f, endValue = 25f),
            SpanData("Category 3", startValue = 3f, endValue = 18f)
        )
    },
    colors = ChartyColor.Gradient(
        listOf(Color(0xFF2196F3), Color(0xFF4CAF50), Color(0xFFFF9800))
    ),
    barConfig = BarChartConfig(
        barWidthFraction = 0.6f,
        cornerRadius = CornerRadius.Medium
    )
)
```
