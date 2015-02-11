/**
 * ColoreColor
 * Color wrapper utility class for Colore.js
 * 
 * Constructor options: 
 * new ColoreColor({
 *   // Set color with either:
 *   color: String, // Optional: Set color with: rgb(), rgba(), or hex color.
 *   // Or:
 *   vals:  Object, // Optional: Or set color with: { r: Number, g: Number, b: Number }
 *   alpha: Number  // Optional: Set color transparency. 0.0 - 1.0
 * })
 *
 */

var ColoreColor = function(options) {
  // Set defaults
  this._rgb = {r: 128, g: 128, b: 128};
  this._alpha = 1;

  // Override defaults with options, if they exist.
  if (options) {
    if (options.color) {
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
      this._alpha = 1;

    } else {
      this._rgb = this._rgbStringToRgbVals(cleanColor);
      this._alpha = this._getAlphaValue(cleanColor);
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
  alpha: function(opt_alpha) {
    if (arguments.length) {
      this._alpha = optthis._alpha;
      return this;
    }
    return this._alpha;
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
  _rgbStringToRgbVals: function(origString) {
    var strippedRgbString = this._getStrippedRgbString(origString);
    var rgbArr = strippedRgbString.split(',');

    return {
      r: parseInt(rgbArr[0], 10),
      g: parseInt(rgbArr[1], 10),
      b: parseInt(rgbArr[2], 10)
    }
  },
  _getStrippedRgbString: function(origString) {
    return origString.substring(origString.indexOf('(') + 1, origString.indexOf(')'));
  },
  _getAlphaValue: function(color) {
    if (color.indexOf('rgba') === -1) {
      return 1;
    }

    var valsArr = this._getStrippedRgbString(color).split(',');
    if (valsArr.length < 4) {
      return 1;
    } else {
      return parseFloat(valsArr[3]); // Example result: '0.5'
    }
  },
  _h2n: function(h) {
    // convert a hex value to base10 number.
    return parseInt(h, 16);
  },
  _hexToRgbVals: function(color) {
    var strippedHex = color.substr(color.indexOf('#') + 1);

    // Double up if we were provided a 3 digit hex color.
    if (strippedHex.length === 3) {
      strippedHex = strippedHex[0] + strippedHex[0] + strippedHex[1] + strippedHex[1] + strippedHex[2] + strippedHex[2];
    }

    return {
      r: this._h2n(strippedHex.slice(0,2)),
      g: this._h2n(strippedHex.slice(2,4)),
      b: this._h2n(strippedHex.slice(4,6))
    };
  }
};


