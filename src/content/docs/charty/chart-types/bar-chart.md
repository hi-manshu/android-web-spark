# Bar Chart

A bar chart is a graphical representation of data that uses rectangular bars to show comparisons between categories.
This composable allows for customization of the bar chart's appearance and behavior.

## Preview

<img src="../img/bar-chart.png" alt="Vertical bar chart example" width="420" />

## Use cases

- Comparing discrete categories such as products, regions, or segments.
- Highlighting top/bottom performers in dashboards.
- Showing changes between periods when exact time continuity is not required.
- Replacing tables of numeric values with a more scannable visual.

## Configuration

Bar charts in Charty are configured primarily through `BarChartConfig` and `ChartScaffoldConfig`.

- `barWidthFraction`: Controls how wide each bar is within its allotted slot (e.g. `0.6f` for some spacing between bars).
- Corner radius: Configure `roundedTopCorners`, `topCornerRadius`, or `cornerRadius` for softer shapes.
- Animation: Enable or disable initial and value-change animations.
- Colors: Use `ChartyColor.Solid`, gradients, or custom palettes for multiple series.

See the configuration guides for more details:

- [Bar chart configuration](../configurations/bar-chart-config.md)
- [Chart scaffold configuration](../configurations/chart-scaffold-config.md)

## Code examples

```kotlin
BarChart(
    data = {
        listOf(
            BarData("Jan", 100f),
            BarData("Feb", 150f),
            BarData("Mar", 120f),
        )
    },
    color = ChartyColor.Solid(ChartyColors.Blue),
    barConfig = BarChartConfig(
        barWidthFraction = 0.6f,
        roundedTopCorners = true,
        topCornerRadius = CornerRadius.Large,
        animation = Animation.Enabled(),
    ),
)
```

### Dark theme example

```kotlin
BarChart(
    data = { myBarData },
    color = ChartyColor.Solid(ChartyColors.Purple),
    barConfig = BarChartConfig(
        barWidthFraction = 0.7f,
        roundedTopCorners = true,
    ),
    // Often used inside a ChartScaffold with axes and labels
)
```

## Tips

- Sort categories by value to make comparisons easier.
- Keep category labels short; use tooltips or legends for long descriptions.
- Use a zero baseline for the value axis to avoid misleading bar heights.
- Limit the number of categories to avoid overcrowding; consider horizontal bars for many categories.

## Related charts

- [Bar Charts Overview](bar-charts.md)
- [Horizontal Bar Chart](horizontal-bar-chart.md)
- [Stacked Bar Chart](stacked-bar-chart.md)
- [Comparison Bar Chart](comparison-bar-chart.md)
- [Pie Charts](pie-charts.md)
