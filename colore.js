/**
 * Colore - v0.2 JavaScript Color Adjustment Utility
 * http://github.com/ctcleary
 * Copyright (c) 2014 Connor Thomas Cleary
 * Distributed with GNU GPL v2.0 license.
 *
 * Methods supported:
 * Colore.mix(ColoreColor, ColoreColor, weight); // Returns a new ColoreColor, created by
                                                 // mixing provided ColorColore objects by weight.
 * Colore.Color(colorString);        // Returns a new ColoreColor wrapper for provided Color String
 * Colore.Adjuster(baseColorString); // Returns a new ColoreAdjuster object for shading or tinting a provided `baseColor`
 *
 *
 * ColoreAdjuster Methods supported:
 *   .baseColor(opt_newColor)  // Set/Get the current baseColor
 *   .mixPure(opt_mixPure)     // Set/Get use pure white or pure black for tint/shade
 *   .threshold(opt_threshold) // Set/Get tint/shade treshold for `calcHoverColor()`
 *   .calcHoverColor()         // Return an automatically generated hover color (i.e. for Interactive Elements)
 *   .tintColor(percentage)    // Return Tint current baseColor by `percentage`%
 *   .shadeColor(percentage)   // Return Shade current baseColor by `percentage`%
 */

var Colore = (function() {
  var ColoreUtils = (function() {
    var White = new ColoreColor({
      vals: { r: 255, g: 255, b: 255 }
    });
    var Black = new ColoreColor({
      vals: { r:   0, g:   0, b:   0 }
    });
    return {
      mix: function(baseColor, mixColor, weight) {
        var baseRgb = baseColor.vals();
        var mixRgb = mixColor.vals();
        var resultRgb = {};

        var alpha = baseColor.alpha(); // Use baseColor's alpha setting.

        for (var c in baseRgb) {
          if (baseRgb.hasOwnProperty(c)) {
            var baseVal = baseRgb[c];
            var mixVal = mixRgb[c];
            resultRgb[c] = Math.floor(baseVal + (mixVal - baseVal) * (weight / 100.0));
            resultRgb[c] = this.clampVal(resultRgb[c]);
          }
        }
        var resultColor = new ColoreColor({
          vals: resultRgb,
          alpha: alpha
        });

        return resultColor;
      },
      shiftColor: function(baseColor, percentage, mixPure, doTint) {
        var weight;
        if (typeof percentage === 'undefined') {
          weight = 25; // Default of 25% weight
        } else {
          weight = (typeof percentage === 'string') ? parseInt(percentage, 10) : percentage;
        }

        var mixColor = this.determineMixColor(baseColor, mixPure, doTint);
        var newColor = Colore.Utils.mix(baseColor, mixColor, weight);
        return newColor.colorString();
      },
      determineMixColor: function(baseColor, mixPure, doTint) {
        if (mixPure) {
          return this.returnPure(doTint);
        }

        var mixColoreColor = {};
        if (doTint) {
          mixColoreColor = this.determineTintColor(baseColor);
        } else { // doShade
          mixColoreColor = this.determineShadeColor(baseColor);
        }
        return mixColoreColor;
      },
      determineTintColor: function(baseColor) {
        var srcRgb = baseColor.vals();
        var highestVal = Math.max(srcRgb.r, srcRgb.g, srcRgb.b);
        var minVal = this.clampVal(highestVal / 2, 1, 255);

        var aggregateVal = baseColor.aggregateValue(); // Max Value: 765
        var diffToMax = this.clampVal(765 / aggregateVal, 2, 1000); // min 2 in case baseColor is very bright    

        var rgb = {
          r: this.clampVal(srcRgb.r, minVal, 255),
          g: this.clampVal(srcRgb.g, minVal, 255),
          b: this.clampVal(srcRgb.b, minVal, 255)
        };
        var tintColor = new ColoreColor({
          vals: {
            r: this.clampVal(Math.floor(rgb.r * diffToMax)),
            g: this.clampVal(Math.floor(rgb.g * diffToMax)),
            b: this.clampVal(Math.floor(rgb.b * diffToMax))
          }
        });

        return tintColor;
      },
      determineShadeColor: function(baseColor) {
        // TODO make smarter.
        var srcRgb = baseColor.vals();
        var aggregateVal = baseColor.aggregateValue(); // Max Value: 765
        var diffToMin = this.clampVal(1 / aggregateVal, 0.01, 0.05);
        var shadeColor = new ColoreColor({
          vals : {
            r: Math.floor(srcRgb.r * diffToMin),
            g: Math.floor(srcRgb.g * diffToMin),
            b: Math.floor(srcRgb.b * diffToMin)
          }
        });

        return shadeColor;
      },
      returnPure: function(doTint) {
        if (doTint) {
          return White;
        } else {
          return Black;
        }
      },
      clampVal: function(toClamp, min, max) {
        // if min/max not provided, assume we are clamping an rgb value.
        var clampMin = min || 0;
        var clampMax = max || 255;
        return Math.min(Math.max(toClamp, clampMin), clampMax);
      },
    }
  })();

  return {
    Utils: ColoreUtils,
    Adjuster: function(options) {
      return new ColoreAdjuster(options);
    },
    Color: function(colorString) {
      return new ColoreColor({ color: colorString });
    },
    mix: function(baseColor, mixColor, weight, opt_asObject) {
      var resultColor = this.Utils.mix(baseColor, mixColor, weight);
      if (opt_asObject) {
        return resultColor;
      } else {
        return resultColor.colorString();
      }
    }
  }
})();
