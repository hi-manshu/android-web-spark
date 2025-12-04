![Comparison Bar Chart](../img/comparison-bar-chart.png)

# Comparison Bar Chart

A comparison bar chart, also known as a grouped bar chart, displays multiple data series side-by-side for each category.
It is ideal for comparing sub-categories or multiple metrics within each main category.

## Usage

```kotlin
ComparisonBarChart(
    data = {
        listOf(
            BarGroup("Q1", listOf(45f, 52f)),
            BarGroup("Q2", listOf(58f, 63f)),
            BarGroup("Q3", listOf(72f, 68f))
        )
    },
    colors = ChartyColor.Gradient(
        listOf(Color(0xFFE91E63), Color(0xFF2196F3))
    )
)
```
