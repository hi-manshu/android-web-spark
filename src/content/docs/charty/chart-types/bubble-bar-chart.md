
A bubble bar chart represents data as stacked bubbles in vertical columns,
where the number and size of bubbles are proportional to the value they represent.
This playful, visually distinct style is ideal for dashboards and presentations where you want to add personality.

## Preview

<img src="/charty/img/bubble-bar-chart.png" alt="Bubble bar chart example" width="420" />

## Code examples

```kotlin
BubbleBarChart(
    data = {
        listOf(
            BarData("Jan", 100f),
            BarData("Feb", 150f),
            BarData("Mar", 120f),
        )
    },
    color = ChartyColor.Solid(Color(0xFF2196F3)),
    bubbleConfig = BubbleBarChartConfig(
        barWidthFraction = 0.6f,
        bubbleRadius = 8.dp,
        bubbleSpacing = 4.dp,
        animation = Animation.Enabled(),
    ),
)
```

### Multi-color example

```kotlin
BubbleBarChart(
    data = { myData },
    color = ChartyColor.Gradient(ChartyColors.Rainbow),
    bubbleConfig = BubbleBarChartConfig(
        bubbleRadius = 6.dp,
        maxBubbles = 20,
    ),
)
```

## Use cases

- Creating engaging, playful visualizations for dashboards and infographics.
- Showing discrete counts or magnitudes in a more interesting way than plain bars.
- Emphasizing data in consumer-facing apps where visual appeal matters.
- Drawing attention to specific metrics in presentations.

## Configuration

Bubble bar charts use `BubbleBarChartConfig` to control bubble appearance and animation.

Key options include:

- `barWidthFraction`: Controls the width of the column containing bubbles.
- `bubbleRadius`: Sets the size of individual bubbles.
- `bubbleSpacing`: Controls spacing between stacked bubbles.
- `maxBubbles`: Limits the number of bubbles shown per column (useful for large values).
- Animation: Configure entrance and transition animations.

See also:

- [Bar chart configuration](../configurations/bar-chart-config.md)
- [Chart scaffold configuration](../configurations/chart-scaffold-config.md)
- [Animation customization](../customization/animations.md)

## Tips

- Avoid showing too many bubbles per column; consider scaling or using `maxBubbles`.
- Use consistent bubble sizes for easier comparison between categories.
- Ensure sufficient contrast between bubble color and background.
- Consider subtle animations to draw attention without overwhelming the user.
- For accessibility, provide text labels or tooltips with exact values.

## Related charts

- [Bar Chart](bar-chart.md)
- [Lollipop Bar Chart](lollipop-bar-chart.md)
- [Wavy Chart](wavy-chart.md)
- [Bar Charts Overview](bar-charts.md)

