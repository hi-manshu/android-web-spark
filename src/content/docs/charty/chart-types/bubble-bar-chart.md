![Bubble Bar Chart](/charty/img/bubble-bar-chart.png)

# Bubble Bar Chart

A bubble bar chart represents data as stacked bubbles in vertical columns.
The number and size of the bubbles are proportional to the value they represent, offering a visually distinct way to compare categorical data.

## Usage

```kotlin
BubbleBarChart(
    data = {
        listOf(
            BarData("Jan", 100f),
            BarData("Feb", 150f),
            BarData("Mar", 120f)
        )
    },
    color = ChartyColor.Solid(Color(0xFF2196F3)),
    bubbleConfig = BubbleBarChartConfig(
        barWidthFraction = 0.6f,
        bubbleRadius = 8.dp,
        bubbleSpacing = 4.dp,
        animation = Animation.Enabled()
    )
)
```
