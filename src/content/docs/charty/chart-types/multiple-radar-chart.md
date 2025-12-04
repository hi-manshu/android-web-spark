# Multiple Radar Chart

A multiple radar chart displays two or more data series on the same radar axes,
allowing you to compare multiple entities across the same set of variables. Each entity is represented
by a different colored polygon, making it easy to identify strengths, weaknesses, and differences at a glance.

## Preview

<img src="../img/bar-chart.png" alt="Multiple radar chart example" width="420" />

_Note: A dedicated multiple radar chart image will be added in a future update._

## Use cases

- Comparing multiple competitors across various business metrics.
- Evaluating different products on the same set of features or criteria.
- Comparing player or team statistics in sports and gaming.
- Benchmarking multiple employees, departments, or projects on performance dimensions.
- Comparing treatment options in healthcare across multiple factors.
- Analyzing multiple countries or regions on economic or social indicators.

## Configuration

Multiple radar charts extend single radar chart configuration with multi-series support.

Key options include:

- `numberOfAxes`: Number of variables/dimensions (same for all series).
- `showAxisLabels`: Display labels at the end of each axis.
- `showScaleLines`: Show concentric value scale guides.
- Colors: Provide a color palette with one color per series/entity.
- `fillOpacity`: Control transparency of each polygon (important for overlapping visibility).
- `strokeWidth`: Thickness of polygon outlines.
- Legend: Enable to identify which color represents which entity.

See also:

- [Radar chart configuration](../configurations/radar-chart-config.md)
- [Chart scaffold configuration](../configurations/chart-scaffold-config.md)

## Code examples

```kotlin
MultipleRadarChart(
    data = {
        mapOf(
            "Product A" to mapOf(
                "Price" to 70f,
                "Quality" to 90f,
                "Features" to 80f,
                "Support" to 85f,
                "Usability" to 75f,
            ),
            "Product B" to mapOf(
                "Price" to 90f,
                "Quality" to 75f,
                "Features" to 70f,
                "Support" to 70f,
                "Usability" to 80f,
            ),
        )
    },
    maxValue = 100f,
    colors = ChartyColor.Gradient(
        listOf(Color(0xFF2196F3), Color(0xFFE91E63))
    ),
    radarConfig = RadarChartConfig(
        showAxisLabels = true,
        showScaleLines = true,
        fillOpacity = 0.4f,
        strokeWidth = 2.dp,
    ),
)
```

### Team comparison example

```kotlin
MultipleRadarChart(
    data = {
        mapOf(
            "Team Alpha" to teamAlphaStats,
            "Team Beta" to teamBetaStats,
            "Team Gamma" to teamGammaStats,
        )
    },
    maxValue = 100f,
    colors = ChartyColor.Gradient(
        listOf(
            Color(0xFF4CAF50),
            Color(0xFF2196F3),
            Color(0xFFFF9800),
        )
    ),
    radarConfig = RadarChartConfig(
        fillOpacity = 0.3f,
    ),
)
```

## Tips

- Limit to 2-4 overlapping series; more becomes visually cluttered.
- Use semi-transparent fills (opacity 0.3-0.5) so overlapping areas are visible.
- Use distinct, high-contrast colors for each series.
- Always include a legend to identify which color represents which entity.
- Ensure all series use the same axes order and maximum values for fair comparison.
- Consider using thicker strokes for series outlines to improve visibility.
- Show axis labels and scale lines to help users interpret values.
- If polygons overlap heavily, consider using a **Comparison Bar Chart** instead.

## Related charts

- [Radar Chart](radar-chart.md) – single entity radar
- [Comparison Bar Chart](comparison-bar-chart.md) – grouped bars
- [Multiline Chart](multiline-chart.md) – multiple lines over time

