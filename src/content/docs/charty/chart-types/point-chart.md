# Point Chart

A point chart (also known as a scatter plot or dot plot) displays individual data points as circles or markers
on a coordinate plane, where both X and Y axes represent continuous values. This makes it ideal for showing
relationships, correlations, distributions, and outliers between two variables.

## Preview

<img src="../img/bar-chart.png" alt="Point chart example" width="420" />

_Note: A dedicated point chart image will be added in a future update._

## Use cases

- Analyzing correlations between two continuous variables (e.g., age vs. income, temperature vs. sales).
- Identifying clusters, patterns, and outliers in data distributions.
- Displaying scientific data, experimental results, or measurement data.
- Showing relationships in bivariate analysis.
- Visualizing data density and distribution across two dimensions.
- Comparing multiple groups using different point colors or shapes.

## Configuration

Point charts use `PointChartConfig` to control marker appearance and behavior.

Key options include:

- `pointRadius`: Size of each data point marker.
- `pointShape`: Shape of markers (circle, square, triangle, etc.).
- Colors: Color-code points by category or use gradients based on a third variable.
- `strokeWidth`: Optional outline stroke for each point.
- Opacity: Control transparency for overlapping points.
- Interactive: Enable tooltips showing exact coordinates on hover/tap.

See also:

- [Point chart configuration](../configurations/point-chart-config.md)
- [Chart scaffold configuration](../configurations/chart-scaffold-config.md)

## Code examples

```kotlin
PointChart(
    data = {
        listOf(
            PointData(x = 10f, y = 20f),
            PointData(x = 20f, y = 35f),
            PointData(x = 30f, y = 25f),
            PointData(x = 40f, y = 50f),
            PointData(x = 50f, y = 45f),
        )
    },
    color = ChartyColor.Solid(Color(0xFF2196F3)),
    pointConfig = PointChartConfig(
        pointRadius = 6.dp,
        pointShape = PointShape.Circle,
    ),
)
```

### Multi-category scatter plot

```kotlin
PointChart(
    data = { scatterData },
    color = ChartyColor.Gradient(
        listOf(Color(0xFFE91E63), Color(0xFF2196F3), Color(0xFF4CAF50))
    ),
    pointConfig = PointChartConfig(
        pointRadius = 5.dp,
        strokeWidth = 1.dp,
        strokeColor = Color.White,
    ),
)
```

### With transparency for density

```kotlin
PointChart(
    data = { denseDataPoints },
    color = ChartyColor.Solid(Color(0xFF2196F3).copy(alpha = 0.6f)),
    pointConfig = PointChartConfig(
        pointRadius = 4.dp,
    ),
)
```

## Tips

- Use smaller point sizes (3-6dp) when you have many data points to avoid overcrowding.
- Add transparency (alpha 0.5-0.7) when points overlap to show density.
- Color-code points by category or a third variable for multi-dimensional analysis.
- Add a trend line or regression line (if supported) to emphasize correlations.
- Use consistent scales on both axes for accurate perception of relationships.
- Consider using a **Bubble Chart** if you need to show a third variable via point size.
- Add gridlines to help users read exact coordinates.
- Enable interactive tooltips to show precise values.

## Related charts

- [Bubble Chart](bubble-chart.md) – points with variable sizes
- [Line Chart](line-chart.md) – connected points showing trends
- [Multiline Chart](multiline-chart.md) – multiple series of connected points

