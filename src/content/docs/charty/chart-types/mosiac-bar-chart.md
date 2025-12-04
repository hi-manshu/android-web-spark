# Mosaic Bar Chart

A mosaic bar chart (also called a 100% stacked bar chart) displays multiple data series stacked within each bar,
where all bars are normalized to 100% height. This emphasizes the proportional composition of each category
rather than absolute values, making it ideal for comparing part-to-whole relationships across groups.

## Preview

<img src="../img/mosiac-bar-chart.png" alt="Mosaic bar chart example" width="420" />

## Use cases

- Comparing proportional composition across multiple categories (e.g., market share by region).
- Showing how the mix of components changes between groups when absolute totals vary.
- Emphasizing percentage breakdowns rather than raw values.
- Analyzing survey results or demographic distributions across segments.

## Configuration

Mosaic bar charts use similar configuration to stacked bar charts but normalize all bars to 100%.

Key options include:

- `barWidthFraction`: Controls the width of each bar.
- Corner radius: Configure `topCornerRadius` for rounded top segments.
- Colors: Provide one color per segment; consistent colors help track segments across bars.
- Data grouping: Each `BarGroup` contains segment values that will be normalized to 100%.

See configuration references:

- [Bar chart configuration](../configurations/bar-chart-config.md)
- [Chart scaffold configuration](../configurations/chart-scaffold-config.md)

## Code examples

```kotlin
MosiacBarChart(
    data = {
        listOf(
            BarGroup("Region A", listOf(30f, 45f, 25f)),
            BarGroup("Region B", listOf(40f, 30f, 30f)),
            BarGroup("Region C", listOf(25f, 50f, 25f)),
        )
    },
    colors = ChartyColor.Gradient(
        listOf(Color(0xFFE91E63), Color(0xFF2196F3), Color(0xFF4CAF50))
    ),
    barConfig = BarChartConfig(
        barWidthFraction = 0.7f,
        topCornerRadius = CornerRadius.Medium,
    ),
)
```

## Tips

- Use percentage labels on segments to make the proportions clear.
- Keep the number of segments to 3-5 for readability.
- Use consistent, distinct colors for each segment type across all bars.
- Consider adding a legend to identify what each segment represents.
- If absolute values matter, consider using a standard **Stacked Bar Chart** instead.

## Related charts

- [Stacked Bar Chart](stacked-bar-chart.md)
- [Comparison Bar Chart](comparison-bar-chart.md)
- [Pie Charts](pie-charts.md)
- [Bar Charts Overview](bar-charts.md)

