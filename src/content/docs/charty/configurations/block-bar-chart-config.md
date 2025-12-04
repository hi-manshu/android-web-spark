# BlockBarChartConfig

Configuration for Block Bar Chart appearance and behavior.

## Overview

`BlockBarChartConfig` controls the visual appearance of block bar charts where data is visualized as segmented horizontal bars with distinct blocks.

## Definition

```kotlin
data class BlockBarChartConfig(
    val cornerRadius: CornerRadius = CornerRadius.Small,
    val gapBetweenBlocks: Dp = 4.dp,
    val barHeight: Dp = 16.dp,
)
```

## Properties

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `cornerRadius` | `CornerRadius` | `Small` | Corner radius for start and end blocks (use barHeight/2 for pill shape) |
| `gapBetweenBlocks` | `Dp` | `4.dp` | Horizontal spacing between adjacent block segments |
| `barHeight` | `Dp` | `16.dp` | Total height of the bar |

## Usage Example

```kotlin
import com.himanshoe.charty.block.BlockBarChart
import com.himanshoe.charty.block.config.BlockBarChartConfig
import androidx.compose.ui.unit.dp

BlockBarChart(
    data = { blockData },
    color = ChartyColor.Solid(Color(0xFF2196F3)),
    blockConfig = BlockBarChartConfig(
        cornerRadius = CornerRadius.Medium,
        gapBetweenBlocks = 6.dp,
        barHeight = 20.dp
    )
)
```

## Related

- [Block Bar Chart](../chart-types/block-bar-chart.md)
- [BarChartConfig](bar-chart-config.md)

