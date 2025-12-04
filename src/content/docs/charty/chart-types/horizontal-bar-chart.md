# Horizontal Bar Chart

A horizontal bar chart presents categorical data with horizontal rectangular bars, where the length of each bar is proportional to the value it represents.
This type of chart is particularly useful for comparing categories with long labels or when there are many categories to display.

## Preview

<img src="../img/horizontal-bar-chart.png" alt="Horizontal bar chart example" width="420" />

## Use cases

- Comparing many categories where vertical bars would become crowded.
- Displaying categories with long labels that benefit from more horizontal space.
- Showing rankings, leaderboards, and ordered lists.

## Configuration

Horizontal bar charts reuse most options from `BarChartConfig` and `ChartScaffoldConfig`.

Key options include:

- `barWidthFraction`: Controls bar thickness and spacing between bars.
- Corner radius: Configure `cornerRadius` or per-corner settings for rounded ends.
- Colors: Single color or gradient palettes via `ChartyColor`.
- Axes and labels: Usually controlled via the surrounding `ChartScaffold`.

See also:

- [Bar chart configuration](../configurations/bar-chart-config.md)
- [Chart scaffold configuration](../configurations/chart-scaffold-config.md)

## Code examples

```kotlin
HorizontalBarChart(
    data = {
        listOf(
            BarData("Category A", 100f),
            BarData("Category B", 150f),
            BarData("Category C", 120f),
        )
    },
    color = ChartyColor.Solid(Color(0xFF2196F3)),
    barConfig = BarChartConfig(
        barWidthFraction = 0.6f,
        cornerRadius = CornerRadius.Large,
    ),
)
```

## Tips

- Sort bars in descending order to emphasize the highest values.
- Use truncation or wrapping for very long labels and consider tooltips for full text.
- Leave enough margin on the left for labels; use right alignment for numeric values.

## Related charts

- [Bar Chart](bar-chart.md)
- [Span Chart](span-chart.md)
- [Bar Charts Overview](bar-charts.md)
