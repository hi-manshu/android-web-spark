
A waterfall chart visualizes the cumulative effect of sequential positive and negative values,
showing how an initial value is affected by a series of intermediate changes to reach a final value.
It's ideal for understanding how different factors contribute to a total result.

## Preview

<img src="/charty/img/waterfall-chart.png" alt="Waterfall chart example" width="420" />

## Code examples

```kotlin
WaterfallChart(
    data = {
        listOf(
            WaterfallData("Starting", 100f, isTotal = true),
            WaterfallData("Revenue", 50f),
            WaterfallData("Costs", -30f),
            WaterfallData("Taxes", -10f),
            WaterfallData("Ending", 110f, isTotal = true),
        )
    },
    positiveColor = Color(0xFF4CAF50),
    negativeColor = Color(0xFFF44336),
    totalColor = Color(0xFF2196F3),
    barConfig = BarChartConfig(
        barWidthFraction = 0.6f,
        cornerRadius = CornerRadius.Medium,
    ),
)
```

## Use cases

- Showing profit and loss statements with revenue increases and expense decreases.
- Analyzing how a starting budget is adjusted by various additions and subtractions.
- Displaying sales funnel conversions and drop-offs at each stage.
- Breaking down changes in inventory, cash flow, or other cumulative metrics over time.

## Configuration

Waterfall charts use configuration options to distinguish positive, negative, and total bars.

Key options include:

- `barWidthFraction`: Controls bar width and spacing.
- Corner radius: Smooth bar corners for a modern look.
- Colors: Use distinct colors for positive (green), negative (red), and total (neutral) bars.
- Data structure: Each entry typically includes a value (positive or negative) and an optional flag for totals.

See also:

- [Bar chart configuration](../configurations/bar-chart-config.md)
- [Chart scaffold configuration](../configurations/chart-scaffold-config.md)

## Tips

- Use green for positive changes, red for negative, and a neutral color (blue/gray) for starting/ending totals.
- Add value labels on or near bars to show the magnitude of each change.
- Show connecting lines between bars (if supported) to emphasize the flow from one value to the next.
- Ensure the baseline is clearly visible so users can distinguish increases from decreases.
- Limit the number of steps to avoid overcrowding; group smaller changes if needed.

## Related charts

- [Stacked Bar Chart](stacked-bar-chart.md)
- [Bar Chart](bar-chart.md)
- [Span Chart](span-chart.md)
- [Bar Charts Overview](bar-charts.md)

