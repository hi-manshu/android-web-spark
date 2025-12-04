
A radar chart (also called a spider chart or star chart) displays multivariate data on axes radiating from a central point,
with each axis representing a different variable. Data values are plotted along each axis and connected to form a polygon,
making it ideal for comparing multiple attributes of a single entity or showing patterns in multi-dimensional data.

## Preview

<img src="/charty/img/radar-chart.png" alt="Radar chart example" width="420" />

## Code examples

```kotlin
RadarChart(
    data = {
        mapOf(
            "Speed" to 80f,
            "Strength" to 70f,
            "Defense" to 90f,
            "Agility" to 75f,
            "Intelligence" to 85f,
        )
    },
    maxValue = 100f,
    color = ChartyColor.Solid(Color(0xFF2196F3).copy(alpha = 0.6f)),
    radarConfig = RadarChartConfig(
        showAxisLabels = true,
        showScaleLines = true,
        fillOpacity = 0.5f,
        strokeWidth = 2.dp,
    ),
)
```

### Skills assessment example

```kotlin
RadarChart(
    data = {
        mapOf(
            "Communication" to 85f,
            "Leadership" to 75f,
            "Technical" to 90f,
            "Problem Solving" to 80f,
            "Creativity" to 70f,
            "Teamwork" to 95f,
        )
    },
    maxValue = 100f,
    color = ChartyColor.Gradient(
        listOf(Color(0xFF4CAF50), Color(0xFF8BC34A))
    ),
    radarConfig = RadarChartConfig(
        showAxisLabels = true,
        strokeWidth = 3.dp,
    ),
)
```

## Use cases

- Comparing multiple attributes or skills of a single entity (e.g., player stats in sports or games).
- Visualizing performance across different dimensions (e.g., product features, KPI scorecards).
- Showing personality profiles, skill assessments, or competency matrices.
- Displaying survey results across multiple questions or categories.
- Analyzing competitive positioning across various factors.
- Comparing before/after assessments on multiple criteria.

## Configuration

Radar charts use `RadarChartConfig` to control the polygon, axes, and labels.

Key options include:

- `numberOfAxes`: Number of variables/dimensions to display (typically 3-8).
- `showAxisLabels`: Display labels at the end of each axis.
- `showScaleLines`: Show concentric circles or polygons representing value scales.
- `fillOpacity`: Control transparency of the filled polygon.
- Colors: Use solid colors or gradients for the data polygon.
- `strokeWidth`: Thickness of the polygon outline.
- Point markers: Optionally show dots at each data point.

See also:

- [Radar chart configuration](../configurations/radar-chart-config.md)
- [Chart scaffold configuration](../configurations/chart-scaffold-config.md)

## Tips

- Limit the number of axes to 3-8; more becomes difficult to read.
- Use consistent maximum values across all axes for fair comparison.
- Add fill with moderate opacity (0.4-0.6) to show the area covered.
- Label each axis clearly at the outer endpoints.
- Show concentric scale lines to help users judge values.
- Use a **Multiple Radar Chart** to compare multiple entities on the same radar.
- Ensure axis labels don't overlap; rotate or abbreviate if needed.
- Consider normalizing all values to a common scale (e.g., 0-100).

## Related charts

- [Multiple Radar Chart](multiple-radar-chart.md) – compare multiple entities
- [Bar Chart](bar-chart.md) – simpler for single-dimension comparisons
- [Comparison Bar Chart](comparison-bar-chart.md) – grouped comparisons

