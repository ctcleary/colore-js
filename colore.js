/**
 * Colore - v0.1 JavaScript Color Adjustment Utility
 * http://github.com/ctcleary
 * Copyright (c) 2014 Connor Thomas Cleary
 * Distributed with GNU GPL v2.0 license.
 *
 * Constructor options:
 * new Colore({
 *   baseColor: String, // Optional: rgb(), rgba(), or hex color.
 *   threshold: Number, // Optional: Adjust the tint/shade level for calcHoverColor()`
 *   mixPure:   Boolean // Optional: Use pure white or pure black for tint/shade.
 * });
 *
 * Methods supported:              // * Setters support chaining
 * Colore.baseColor(opt_newColor)  // Set/Get the current baseColor
 * Colore.mixPure(opt_mixPure)     // Set/Get use pure white or pure black for tint/shade
 * Colore.threshold(opt_threshold) // Set/Get tint/shade treshold for `calcHoverColor()`
 * Colore.tintColor(percentage)    // Return Tint current baseColor by `percentage`%
 * Colore.shadeColor(percentage)   // Return Shade current baseColor by `percentage`%
 * Colore.calcHoverColor()         // Return an automatically generated hover color
 *
 */

var Colore = function(options) {
  // Set defaults.
  this._baseColor = new ColoreColor();
  this._threshold = 600;
  this._mixPure = false;

  if (options) {
    if (options.baseColor) {
      this.baseColor(options.baseColor || '');
    }
    if (options.threshold) {
      this._threshold = options.threshold;
    }
    if (options.mixPure) {
      this._mixPure = options.mixPure;
    }
  }
};
Colore.prototype = {
  baseColor: function(opt_newColor) {
    if (arguments.length) {
      _baseColor = new ColoreColor({color: opt_newColor});
      return this;
    } else {
      return _baseColor.colorString();
    }
  },
  mixPure: function(opt_mixPure) {
    if (arguments.length) {
      this._mixPure = opt_mixPure;
      return this;
    }
    return this._mixPure;
  },
  threshold: function(opt_threshold) {
    if (arguments.length) {
      this._threshold = opt_threshold;
      return this;
    }
    return this._threshold;
  },
  calcHoverColor: function() {
    var aggValue = _baseColor.aggregateValue();
    if (aggValue > this.threshold()) {
      return this.shadeColor(10);
    } else {
      return this.tintColor(30);
    }
  },
  tintColor: function(percentage) {
    return this._shiftColor(percentage, true);
  },
  shadeColor: function(percentage) {
    return this._shiftColor(percentage, false);
  },
  _shiftColor: function(percentage, doTint) {
    var weight;
    if (typeof percentage === 'undefined') {
      weight = 25; // Default of 25% weight
    } else {
      weight = (typeof percentage === 'string') ? parseInt(percentage, 10) : percentage;
    }

    var mixColor = this._determineMixColor(doTint);
    var baseRgb = _baseColor.vals();
    var alpha = _baseColor.alpha();

    var rgb = {};
    for (var c in baseRgb) {
      if (baseRgb.hasOwnProperty(c)) {
        var mixVal = mixColor[c];
        var baseVal = baseRgb[c];
        rgb[c] = Math.floor(baseVal + (mixVal - baseVal) * (weight / 100.0));
        rgb[c] = this._clampVal(rgb[c]);
      }
    }

    var resultColor = new ColoreColor({
      vals: rgb,
      alpha: alpha
    });

    return resultColor.colorString();
  },
  _determineMixColor: function(doTint) {
    if (this.mixPure()) {
      return this._returnPure(doTint);
    }

    var rgb = _baseColor.vals();
    var mixRgb = {};

    if (doTint) {
      mixRgb = this._determineTintColor(rgb);
    } else { // doShade
      mixRgb = this._determineShadeColor(rgb);
    }
    return mixRgb;
  },
  _determineTintColor: function(srcRgb) {
    var highestVal = Math.max(srcRgb.r, srcRgb.g, srcRgb.b);
    var minVal = this._clampVal(highestVal / 2, 1, 255);
    var rgb = {
      r: this._clampVal(srcRgb.r, minVal, 255),
      g: this._clampVal(srcRgb.g, minVal, 255),
      b: this._clampVal(srcRgb.b, minVal, 255)
    };
    var aggregateVal = _baseColor.aggregateValue(); // Max Value: 765
    var diffToMax = this._clampVal(765 / aggregateVal, 2, 1000); // min 2 in case baseColor is very bright
    return {
      r: this._clampVal(Math.floor(rgb.r * diffToMax)),
      g: this._clampVal(Math.floor(rgb.g * diffToMax)),
      b: this._clampVal(Math.floor(rgb.b * diffToMax))
    };
  },
  _determineShadeColor: function(srcRgb) {
    // TODO make smarter.
    var aggregateVal = _baseColor.aggregateValue(); // Max Value: 765
    var diffToMin = this._clampVal(1 / aggregateVal, 0.01, 0.05);
    return {
      r: Math.floor(srcRgb.r * diffToMin),
      g: Math.floor(srcRgb.g * diffToMin),
      b: Math.floor(srcRgb.b * diffToMin)
    };
  },
  _returnPure: function(doTint) {
    if (doTint) {
      return {
        // pure white
        r: 255,
        g: 255,
        b: 255
      };
    } else {
      return {
        // pure black
        r: 0,
        g: 0,
        b: 0
      };
    }
  },
  _clampVal: function(toClamp, min, max) {
    // if min/max not provided, assume we are clamping an rgb value.
    var clampMin = min || 0;
    var clampMax = max || 255;
    return Math.min(Math.max(toClamp, clampMin), clampMax);
  }
};
