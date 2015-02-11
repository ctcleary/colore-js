/**
 * Colore - v0.1 JavaScript Color Adjustment Utility
 * http://github.com/ctcleary
 * Copyright (c) 2014 Connor Thomas Cleary
 * Distributed with GNU GPL v2.0 license.
 *
 * Color wrapper utility class for Colore.js
 * 
 * Constructor options: 
 * new ColoreAdjuster({
 *   // Set color with either:
 *   baseColor: String, // (Required-ish) Set baseColor from which to shade or tint.
 *   mixPure: Boolen,   // (Optional) Default: false; Choose whether to shade/tint  
 *   threshold: Number  // (Optional) Default: 600;   Aggregate color value threshold for shading or tinting. (0-765)
 * });
 */

var ColoreAdjuster = function(options) {
  this.Utils = Colore.Utils;

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
ColoreAdjuster.prototype = {
  baseColor: function(opt_newColor) {
    if (arguments.length) {
      this._baseColor = new ColoreColor({color: opt_newColor});
      return this;
    } else {
      return this._baseColor.colorString();
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
    var aggValue = this._baseColor.aggregateValue();
    if (aggValue > this.threshold()) {
      return this.shadeColor(10);
    } else {
      return this.tintColor(30);
    }
  },
  tintColor: function(percentage) {
    return this.Utils.shiftColor(this._baseColor, percentage, this.mixPure(), true);
  },
  shadeColor: function(percentage) {
    return this.Utils.shiftColor(this._baseColor, percentage, this.mixPure(), false);
  }
};