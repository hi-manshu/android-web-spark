
A bar chart is a graphical representation of data that uses rectangular bars to show comparisons between categories.
This composable allows for customization of the bar chart's appearance and behavior.

## Preview

<div style="display: flex; gap: 1rem; flex-wrap: wrap;">
  <img src="/charty/img/bar-chart.png" alt="Bar chart example" width="400" />
  <img src="/charty/img/bar-chart-02.png" alt="Bar chart example variant" width="400" />
</div>

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
