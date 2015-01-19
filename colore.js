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
  this._defaultColor = 'rgb(128, 128, 128)';
  if (options.baseColor) {
    this.baseColor(options.baseColor);
  } else {
    this.baseColor(this._defaultColor);
  }

  this._opacity = 1; // Will be set if an 'rgba' color is passed in.
  this._threshold = options.threshold || 600;
  this._mixPure = options.mixPure || false;
};
Colore.prototype = {
  baseColor: function(opt_newColor) {
    if (arguments.length) {
      this._setBaseColor(opt_newColor);
      return this;
    } else {
      return this._baseColor;
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
    var aggValue = this._getColorAggregateValue();
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
    var baseRgb = this._getRgbValues();

    var rgb = {};
    for (var c in baseRgb) {
      if (baseRgb.hasOwnProperty(c)) {
        var mixVal = mixColor[c];
        var baseVal = baseRgb[c];
        rgb[c] = Math.floor(baseVal + (mixVal - baseVal) * (weight / 100.0));
        rgb[c] = this._clampVal(rgb[c]);
      }
    }

    if (this._opacity < 1) {
      // this was an rgba() color
      return 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + this._opacity + ')';
    } else {
      return 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')';
    }
  },
  _setBaseColor: function(newColor) {
    var cleanColor = newColor.trim();
    // Normalize to an rgb color to make things easier.
    if (this._isHexColor(cleanColor)) {
      this._baseColor = this._hexToRgbColor(cleanColor);
      this._opacity = 1;
    } else if (this._isRgbColor(cleanColor)) {
      this._baseColor = cleanColor;

      if (cleanColor.indexOf('rgba') !== -1) {
        this._opacity = this._getAlphaValue(cleanColor);
      } else {
        this._opacity = 1;
      }
    } else {
      // Must not use named colors like 'red' or 'blue'
      // These will break the .tintColor and .shadeColor functions.
      console.warn('Colore: Bad parameter. Must use an hex, rgb, or rgba color value.');
      this._baseColor = this._defaultColor;
    }
    return this;
  },
  _getRgbValues: function() {
    var rgbArr = this._getRgbArray();
    var rgb = {
      r: parseInt(rgbArr[0], 10),
      g: parseInt(rgbArr[1], 10),
      b: parseInt(rgbArr[2], 10)
    };
    return rgb;
  },
  _getColorAggregateValue: function() {
    var rgb = this._getRgbValues();
    return rgb.r + rgb.g + rgb.b; // Scale is 0 - 765 :: (0,0,0) - (255,255,255)
  },
  _isHexColor: function(color) {
    var len = color.length;
    return (color.indexOf('#') !== -1 && (len === 4 || len === 7)) ||
      (len === 3 || len === 6);
  },
  _isRgbColor: function(color) {
    var len = color.length;
    return color.indexOf('rgb') === 0 && len >= 10 && len <= 22;
  },
  _getStrippedRgbString: function(origString) {
    if (arguments.length) {
      return origString.substring(origString.indexOf('(') + 1, origString.indexOf(')'));
    } else {
      return this._baseColor.substring(this._baseColor.indexOf('(') + 1, this._baseColor.indexOf(')'));
    }
  },
  _getRgbArray: function() {
    var strippedStr = this._getStrippedRgbString();
    var rgbArr = strippedStr.split(',');
    for (var i = rgbArr.length - 1; i >= 0; i--) {
      rgbArr[i] = this._trim(rgbArr[i]);
    }
    return rgbArr;
  },
  _getAlphaValue: function(color) {
    if (color.indexOf('rgba') === -1) {
      return 1;
    }

    var strippedStr = this._getStrippedRgbString(color);
    var alpha = strippedStr.split(',')[3]; // Example result: '0.5'
    return alpha;
  },
  _h2n: function(h) {
    // convert a hex value to base10 number.
    return parseInt(h, 16);
  },
  _hexToRgbColor: function(color) {
    var strippedHex = color.substr(color.indexOf('#') + 1);
    var rgb = {};
    if (strippedHex.length === 6) {
      // 6 digit hex string
      rgb.r = this._h2n('' + strippedHex[0] + strippedHex[1]);
      rgb.g = this._h2n('' + strippedHex[2] + strippedHex[3]);
      rgb.b = this._h2n('' + strippedHex[4] + strippedHex[5]);
    } else {
      // 3 digit hex string.
      rgb.r = this._h2n('' + strippedHex[0] + strippedHex[0]);
      rgb.g = this._h2n('' + strippedHex[1] + strippedHex[1]);
      rgb.b = this._h2n('' + strippedHex[2] + strippedHex[2]);
    }

    return 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')';
  },
  _trim: function(str) {
    if (typeof String.prototype.trim !== 'function') {
      // <= IE 8
      return str.replace(/^\s+|\s+$/g, '');
    } else {
      return str.trim();
    }
  },
  _determineMixColor: function(doTint) {
    if (this.mixPure()) {
      return this._returnPure(doTint);
    }

    var rgb = this._getRgbValues();
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
    var aggregateVal = this._getColorAggregateValue(); // Max Value: 765
    var diffToMax = this._clampVal(765 / aggregateVal, 2, 1000); // min 2 in case baseColor is very bright
    return {
      r: this._clampVal(Math.floor(rgb.r * diffToMax)),
      g: this._clampVal(Math.floor(rgb.g * diffToMax)),
      b: this._clampVal(Math.floor(rgb.b * diffToMax))
    };
  },
  _determineShadeColor: function(srcRgb) {
    // TODO make smarter.
    var aggregateVal = this._getColorAggregateValue(); // Max Value: 765
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
