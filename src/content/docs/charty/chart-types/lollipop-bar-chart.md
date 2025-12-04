
A lollipop bar chart is a variation of a traditional bar chart that uses a vertical line (stem) and a circular head to represent each value.
This design provides a visually lighter, more modern way to compare categories while reducing visual clutter compared to full bars.

## Preview

<img src="/charty/img/lolipop-chart.png" alt="Lollipop bar chart example" width="420" />

## Code examples

```kotlin
LollipopBarChart(
    data = {
        listOf(
            BarData("Category A", 100f),
            BarData("Category B", 150f),
            BarData("Category C", 120f),
        )
    },
    colors = ChartyColor.Solid(Color(0xFF2196F3)),
    config = LollipopBarChartConfig(
        stemThickness = 4.dp,
        circleRadius = 8.dp,
    ),
)
```

### Gradient example

```kotlin
LollipopBarChart(
    data = { myRankingData },
    colors = ChartyColor.Gradient(
        listOf(Color(0xFFFF6B6B), Color(0xFF4ECDC4))
    ),
    config = LollipopBarChartConfig(
        stemThickness = 3.dp,
        circleRadius = 10.dp,
    ),
)
```

## Use cases

- Showing rankings or comparisons when full bars feel visually heavy.
- Creating a modern, minimalist look for dashboards and reports.
- Emphasizing the endpoint value rather than the full bar area.
- Comparing many categories without overwhelming the viewer with solid bars.

## Configuration

Lollipop bar charts use `LollipopBarChartConfig` to control stem and circle appearance.

Key options include:

- `stemThickness`: Controls the width of the vertical line.
- `circleRadius`: Sets the size of the circular head.
- `barWidthFraction`: Controls spacing between lollipops.
- Colors: Apply solid colors or gradients to circles and stems.

See also:

- [Bar chart configuration](../configurations/bar-chart-config.md)
- [Chart scaffold configuration](../configurations/chart-scaffold-config.md)

## Tips

- Use thin stems (2-4dp) to maintain the lightweight aesthetic.
- Make the circle heads large enough to be easily visible and clickable.
- Ensure good color contrast between the lollipop and the background.
- Consider sorting by value to create a clear ascending or descending pattern.
- Add value labels near the circle heads for precision.

## Related charts

- [Bar Chart](bar-chart.md)
- [Bubble Bar Chart](bubble-bar-chart.md)
- [Horizontal Bar Chart](horizontal-bar-chart.md)
- [Bar Charts Overview](bar-charts.md)

