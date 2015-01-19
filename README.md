# colore-js
JavaScript Color Adjustment Utility

## v0.1
This is a brand new repo, still a few things to do 'round here before it's ready to go.

**TODO**
* Add a pretty github pages page with some examples.
* Add some grunt stuff to auto minifiy, etc.


## Docs
### Constructor options:
```
new Colore({
  baseColor: String, // Optional: rgb(), rgba(), or hex color.
  threshold: Number, // Optional: Adjust the tint/shade level for calcHoverColor()`
  mixPure:   Boolean // Optional: Use pure white or pure black for tint/shade.
});
```

### Methods supported: (Setters support chaining)
```
Colore.baseColor(opt_newColor)  // Set/Get the current baseColor
Colore.mixPure(opt_mixPure)     // Set/Get use pure white or pure black for tint/shade
Colore.threshold(opt_threshold) // Set/Get tint/shade treshold for `calcHoverColor()`
Colore.tintColor(percentage)    // Return Tint current baseColor by `percentage`%
Colore.shadeColor(percentage)   // Return Shade current baseColor by `percentage`%
Colore.calcHoverColor()         // Return an automatically generated hover color
```

More to come.
