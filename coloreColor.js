/**
 * Colore - v0.1 JavaScript Color Adjustment Utility
 * http://github.com/ctcleary
 * Copyright (c) 2014 Connor Thomas Cleary
 * Distributed with GNU GPL v2.0 license.
 *
 * Color wrapper utility class for Colore.js
 */
var ColoreColor = function(options) {
  // Defaults
  this._rgb = {r: 128, g: 128, b: 128};
  this._alpha = 1;

  // Override defaults with options, if they exist.
  if (options) {
    if (options.color) {
      // rgb, rgba, or hex string
      this.setColor(options.color);
    } else if (options.vals) {
      this._rgb = options.vals;
    }
      
    if (options.alpha) {
      this._alpha = options.alpha;
    }
  }
};
ColoreColor.prototype = {
  colorString: function() {
    if (this._alpha !== 1) {
      return 'rgba('+this._rgb.r+','+this._rgb.g+','+this._rgb.b+','+this._alpha+')';
    } else {
      return 'rgb('+this._rgb.r+','+this._rgb.g+','+this._rgb.b+')';
    }
  },
  setColor: function(newColor) {
    var cleanColor = newColor.trim();

    if (this._isHexColor(cleanColor)) {
      this._rgb = this._hexToRgbVals(cleanColor);

    } else {
      var strippedRgbString = this._getStrippedRgbString(cleanColor);
      var rgbArr = strippedRgbString.split(',');

      this._rgb = {
        r: rgbArr[0],
        g: rgbArr[1],
        b: rgbArr[2],
      }

      if (rgbArr.length > 3) {
        this._alpha = this._getAlphaValue(cleanColor);
      } else {
        this._alpha = 1;
      }
    }

    return this;
  },
  vals: function() {
    return this._rgb;
  },
  arr: function() {
    return [this._rgb.r, this._rgb.g, this._rgb.b];
  },
  aggregateValue: function() {
    return this._rgb.r + this._rgb.g + this._rgb.b;
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
  _hexToRgbVals: function(color) {
    var strippedHex = color.substr(color.indexOf('#') + 1);

    if (strippedHex.length === 3) {
      // Double up if we were provided a 3 digit hex color.
      strippedHex = strippedHex[0] + strippedHex[0] + strippedHex[1] + strippedHex[1] + strippedHex[2] + strippedHex[2];
    }

    return {
      r: this._h2n(strippedHex.slice(0,2)),
      g: this._h2n(strippedHex.slice(2,4)),
      b: this._h2n(strippedHex.slice(4,6))
    };
  }
};



    // var c = new ColoreColor('#112233');
    // debugger
