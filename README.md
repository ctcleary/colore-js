# colore-js
JavaScript Color Adjustment Utility

## v0.2
This is a very new repo, still a few things to do 'round here before it's ready to go.

**TODO**
* Add a pretty github pages page with some examples.
* Add some grunt stuff to auto minifiy, etc.


## Docs
```
// Methods supported:
Colore.Color(colorString);        // Returns a new ColoreColor wrapper for provided Color String
Colore.Adjuster(baseColorString); // Returns a new ColoreAdjuster object for shading or tinting a provided `baseColor`
Colore.mix(ColoreColor, ColoreColor, weight); // Returns a new ColoreColor, created by
                                              // mixing provided ColorColore objects by weight.


// ColoreAdjuster Methods supported:
ColoreAdjuster.baseColor(opt_newColor)  // Set/Get the current baseColor
ColoreAdjuster.mixPure(opt_mixPure)     // Set/Get use pure white or pure black for tint/shade
ColoreAdjuster.threshold(opt_threshold) // Set/Get tint/shade treshold for `calcHoverColor()`
ColoreAdjuster.calcHoverColor()         // Return an automatically generated hover color (i.e. for Interactive Elements)
ColoreAdjuster.tintColor(percentage)    // Return Tint current baseColor by `percentage`%
ColoreAdjuster.shadeColor(percentage)   // Return Shade current baseColor by `percentage`%
```

More to come.
