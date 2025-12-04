
A block bar chart is a horizontal segmented bar where each segment's width is proportional to its value.
It is ideal for showing the composition or progress of a whole, with each block representing a different category.

## Preview

<img src="/charty/img/block-bar-chart.png" alt="Block bar chart example" width="420" />

## Code examples

```kotlin
BlockBarChart(
    data = {
        listOf(
            BlockData(1f, ChartyColor.Solid(Color(0xFFFF6B81))),
            BlockData(2f, ChartyColor.Solid(Color(0xFFFFE066))),
            BlockData(5f, ChartyColor.Solid(Color(0xFF5BE37D))),
        )
    },
    modifier = Modifier.fillMaxWidth()
)
```

### With custom configuration

```kotlin
BlockBarChart(
    data = {
        listOf(
            BlockData(3f, ChartyColor.Solid(Color(0xFFE91E63))),
            BlockData(4f, ChartyColor.Solid(Color(0xFF9C27B0))),
            BlockData(2f, ChartyColor.Solid(Color(0xFF3F51B5))),
        )
    },
    blockBarConfig = BlockBarChartConfig(
        blockHeight = 40.dp,
        blockSpacing = 4.dp,
        cornerRadius = 8.dp,
    ),
    modifier = Modifier.fillMaxWidth()
)
```

## Use cases

- Showing composition or progress of a whole with different categories.
- Visualizing proportional data where each segment represents a part of the total.
- Creating progress indicators with multiple stages or categories.
- Displaying budget allocation, time distribution, or resource allocation.
- Representing survey results or demographic breakdowns in a linear format.

## Configuration

Block bar charts use `BlockBarChartConfig` to control appearance and layout.

Key options include:

- `blockHeight`: Sets the height of the horizontal bar.
- `blockSpacing`: Controls the gap between adjacent blocks.
- `cornerRadius`: Rounds the corners of blocks for a softer appearance.
- Colors: Each block can have its own color via `ChartyColor.Solid` or use gradients.
- Non-positive values are automatically filtered out.

See also:

- [Bar chart configuration](../configurations/bar-chart-config.md)
- [Chart scaffold configuration](../configurations/chart-scaffold-config.md)

## Tips

- Use distinct colors for each block to make categories easily distinguishable.
- Keep the number of blocks reasonable (3-8) for best readability.
- Order blocks logically (by size, chronologically, or by importance).
- Add value labels or percentages for precision.
- Ensure sufficient contrast between adjacent block colors.
- Consider using the entire width of the container for better visual impact.

## Related charts

- [Bar Chart](bar-chart.md)
- [Stacked Bar Chart](stacked-bar-chart.md)
- [Mosiac Bar Chart](mosiac-bar-chart.md)
- [Bar Charts Overview](bar-charts.md)
