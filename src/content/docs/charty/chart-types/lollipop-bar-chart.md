![Lollipop Bar Chart](/charty/img/lolipop-chart.png)

# Lollipop Bar Chart

A lollipop bar chart is a variation of a traditional bar chart that uses a vertical line (stem) and a circular head to represent each value.
This design provides a visually lighter and more modern way to compare categories.

## Usage

```kotlin
LollipopBarChart(
    data = {
        listOf(
            BarData("Category A", 100f),
            BarData("Category B", 150f),
            BarData("Category C", 120f)
        )
    },
    colors = ChartyColor.Solid(Color(0xFF2196F3)),
    config = LollipopBarChartConfig(
        stemThickness = 4.dp,
        circleRadius = 8.dp
    )
)
```
