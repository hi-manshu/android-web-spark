![Wavy Chart](../img/wavy-chart.png)

# Wavy Chart

Wavy Chart - Bar-like chart with animated sine wave lines for each bar.

This chart renders each [BarData] entry as a vertical "bar" whose outline is a
continuously animating sine wave, giving a fluid, wavy appearance instead of
a solid rectangle. All bars animate in sync (or with optional per-bar phase offset),
producing a rhythmic wave motion.

## Usage

```kotlin
// Example usage
WavyChart(
    data = {
        // ... list of bar data
    },
    // ... other parameters
)
```
