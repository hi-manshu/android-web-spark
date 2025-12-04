
Pie charts display data as slices of a circular "pie," where each slice represents a proportion of the whole.
They are ideal for showing part-to-whole relationships when you have a small number of categories.

## Preview

<div style="display: flex; gap: 1rem; flex-wrap: wrap;">
  <img src="/charty/img/pie-chart.png" alt="Pie chart example" width="400" />
  <img src="/charty/img/donut-chart.png" alt="Donut chart example" width="400" />
</div>

## Code examples

```kotlin
PieChart(
    data = {
        listOf(
            PieData("Category A", 30f),
            PieData("Category B", 45f),
            PieData("Category C", 25f),
        )
    },
    colors = ChartyColor.Gradient(
        listOf(Color(0xFFE91E63), Color(0xFF2196F3), Color(0xFF4CAF50))
    ),
    pieConfig = PieChartConfig(
        showLabels = true,
        labelPosition = LabelPosition.Outside,
    ),
)
```

### Donut chart variant

```kotlin
DonutChart(
    data = { pieData },
    colors = ChartyColors.DefaultGradient,
    donutConfig = DonutChartConfig(
        innerRadiusFraction = 0.5f,
        showCenterLabel = true,
        centerLabelText = "Total",
    ),
)
```

## Use cases

- Showing percentage breakdowns of a total (e.g., market share, budget allocation).
- Comparing a small number of categories (typically 2-6) as parts of a whole.
- Visualizing survey results or demographic distributions.
- Emphasizing one or two dominant categories within a total.

## Configuration

Pie charts in Charty support customization of slices, labels, and interactivity.

Key options include:

- Slice colors: Assign colors to each slice via `ChartyColor`.
- Donut mode: Create a donut chart by setting an inner radius.
- Start angle: Rotate where the first slice begins.
- Labels: Show percentages, values, or category names on or outside slices.
- Interactivity: Enable slice selection or tooltips.

See also:

- [Chart scaffold configuration](../configurations/chart-scaffold-config.md)
- [Theming customization](../customization/theming.md)

## Tips

- Limit slices to 2-6 categories; more makes the chart hard to read.
- Order slices by size (largest to smallest) or in a logical sequence.
- Use distinct, accessible colors for each slice.
- Avoid 3D pie charts, as they distort perception of slice sizes.
- Label percentages directly on or near slices for clarity.
- Consider a **Mosaic Bar Chart** or **Stacked Bar Chart** if you need to compare multiple totals.

## Related charts

- [Mosiac Bar Chart](mosiac-bar-chart.md)
- [Stacked Bar Chart](stacked-bar-chart.md)
- [Bar Charts Overview](bar-charts.md)
