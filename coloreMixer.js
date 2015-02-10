/**
 * Colore - v0.1 JavaScript Color Adjustment Utility
 * http://github.com/ctcleary
 * Copyright (c) 2014 Connor Thomas Cleary
 * Distributed with GNU GPL v2.0 license.
 *
 * Color Mixer utility class for Colore.js
 *
 * Takes two ColoreColor objects and produces a new ColoreColor
 * representing a mix of the two with a given weight percentage.
 * 
 */

 var ColoreMixer = function() {};
 ColoreMixer.prototype = {
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
        resultRgb[c] = Colore.prototype._clampVal(resultRgb[c]);
      }
    }
    var resultColor = new ColoreColor({
      vals: resultRgb,
      alpha: alpha
    });

    return resultColor;
  }
 };
