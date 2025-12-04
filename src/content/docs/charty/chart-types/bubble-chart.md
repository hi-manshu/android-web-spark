# Bubble Chart

A bubble chart is an extension of a scatter plot where each data point is represented as a circle (bubble)
whose size varies based on a third variable. This allows you to visualize three dimensions of data simultaneously:
X position, Y position, and bubble size, making it ideal for rich, multi-dimensional data analysis.

## Preview

<img src="../img/bar-chart.png" alt="Bubble chart example" width="420" />

_Note: A dedicated bubble chart image will be added in a future update._

## Use cases

- Visualizing three-dimensional relationships (e.g., sales vs. profit vs. market size).
- Comparing products or entities across multiple metrics (e.g., price vs. quality vs. popularity).
- Displaying portfolio analysis (risk vs. return vs. investment amount).
- Showing demographic data (age vs. income vs. population size).
- Analyzing business metrics (growth rate vs. market share vs. company size).
- Competitive analysis with multiple variables.

## Configuration

Bubble charts extend point chart configuration with variable bubble sizes.

Key options include:

- `minRadius`: Minimum bubble size for the smallest data value.
- `maxRadius`: Maximum bubble size for the largest data value.
- Colors: Color-code bubbles by category or use a gradient based on a fourth variable.
- `strokeWidth`: Optional outline stroke for each bubble.
- Opacity: Control transparency, especially useful when bubbles overlap.
- Scale: Configure how bubble size scales with the data value (linear, square root, etc.).

See also:

- [Point chart configuration](../configurations/point-chart-config.md)
- [Chart scaffold configuration](../configurations/chart-scaffold-config.md)

## Code examples

```kotlin
BubbleChart(
    data = {
        listOf(
            BubbleData(x = 10f, y = 20f, size = 30f, label = "A"),
            BubbleData(x = 20f, y = 35f, size = 50f, label = "B"),
            BubbleData(x = 30f, y = 25f, size = 20f, label = "C"),
            BubbleData(x = 40f, y = 50f, size = 70f, label = "D"),
        )
    },
    color = ChartyColor.Solid(Color(0xFF2196F3).copy(alpha = 0.7f)),
    bubbleConfig = BubbleChartConfig(
        minRadius = 10.dp,
        maxRadius = 50.dp,
    ),
)
```

### Multi-category bubble chart

```kotlin
BubbleChart(
    data = { productData },
    color = ChartyColor.Gradient(
        listOf(
            Color(0xFFE91E63),
            Color(0xFF2196F3),
            Color(0xFF4CAF50),
        )
    ),
    bubbleConfig = BubbleChartConfig(
        minRadius = 15.dp,
        maxRadius = 60.dp,
        strokeWidth = 2.dp,
        strokeColor = Color.White,
    ),
)
```

### Portfolio analysis example

```kotlin
BubbleChart(
    data = {
        investments.map { investment ->
            BubbleData(
                x = investment.risk,
                y = investment.return,
                size = investment.amount,
                label = investment.name,
            )
        }
    },
    color = ChartyColor.Solid(Color(0xFF4CAF50).copy(alpha = 0.6f)),
    bubbleConfig = BubbleChartConfig(
        minRadius = 20.dp,
        maxRadius = 80.dp,
    ),
)
```

## Tips

- Use transparency (alpha 0.5-0.7) to handle overlapping bubbles.
- Ensure `minRadius` is large enough to be visible and `maxRadius` doesn't overwhelm the chart.
- Add labels inside or near large bubbles to identify data points.
- Use color to encode a fourth dimension (category, status, or continuous value).
- Consider using square-root scaling for bubble area (not radius) for more accurate size perception.
- Add a size legend to help users interpret bubble sizes.
- Limit the number of bubbles to avoid overcrowding (typically under 20-30).
- Enable interactive tooltips to show all dimensions of each bubble.

## Related charts

- [Point Chart](point-chart.md) – scatter plot without variable sizes
- [Bubble Bar Chart](bubble-bar-chart.md) – bubbles stacked in columns
- [Multiline Chart](multiline-chart.md) – multiple lines for trends

