# Stacked Bar Chart

A stacked bar chart displays multiple values stacked on top of each other within a single bar,
showing both individual segment values and the total. It is useful for showing part-to-whole
relationships and how composition changes across categories.

## Preview

<img src="../img/stacked-bar-chart.png" alt="Stacked bar chart example" width="420" />

## Use cases

- Showing how categories contribute to a total (e.g., revenue by product within a region).
- Comparing composition across groups, such as segments over time.
- Highlighting how the mix of components changes between periods.

## Configuration

Stacked bar charts are configured using `StackedBarChartConfig` together with standard chart scaffold options.

Key options include:

- `barWidthFraction`: Controls the width of each stacked bar.
- Corner radius: Configure `topCornerRadius` for rounded top segments.
- Colors: Provide one color per stack segment or a gradient palette via `ChartyColor`.
- Data grouping: Each `BarGroup` contains the list of stacked values for a category.

See configuration references:

- [Bar chart configuration](../configurations/bar-chart-config.md)
- [Chart scaffold configuration](../configurations/chart-scaffold-config.md)

## Code examples

```kotlin
StackedBarChart(
    data = {
        listOf(
            BarGroup("Q1", listOf(20f, 30f, 15f)),
            BarGroup("Q2", listOf(25f, 35f, 20f)),
            BarGroup("Q3", listOf(30f, 25f, 25f)),
        )
    },
    colors = ChartyColors.DefaultGradient,
    stackedConfig = StackedBarChartConfig(
        barWidthFraction = 0.7f,
        topCornerRadius = CornerRadius.Medium,
    ),
)
```

## Tips

- Limit the number of segments per bar; too many colors become hard to read.
- Use a consistent color for each segment across all bars.
- Consider a **Mosiac Bar Chart** if you want all bars normalized to 100%.

## Related charts

- [Mosiac Bar Chart](mosiac-bar-chart.md)
- [Bar Chart](bar-chart.md)
- [Waterfall Chart](waterfall-chart.md)
- [Bar Charts Overview](bar-charts.md)
