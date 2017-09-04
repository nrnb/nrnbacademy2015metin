/*
 * Text utilities for common usage
 */

var optionUtilities = require('./option-utilities');
var options = optionUtilities.getOptions();

var textUtilities = {
  //TODO: use CSS's "text-overflow:ellipsis" style instead of function below?
  truncateText: function (textProp, font) {
    var context = document.createElement('canvas').getContext("2d");
    context.font = font;
    
    var fitLabelsToNodes = options.fitLabelsToNodes;
    fitLabelsToNodes = typeof fitLabelsToNodes === 'function' ? fitLabelsToNodes.call() : fitLabelsToNodes;
    
    var text = textProp.label || "";
    //If fit labels to nodes is false do not truncate
    if (fitLabelsToNodes == false) {
      return text;
    }
    var width;
    var len = text.length;
    var ellipsis = "..";
    var textWidth = (textProp.width > 30) ? textProp.width - 16 : textProp.width;
    while ((width = context.measureText(text).width) > textWidth) {
      --len;
      text = text.substring(0, len) + ellipsis;
    }
    return text;
  },

  // same purpose as previous one, but with clearer responsibility
  truncate: function(text, font, width) {
    var context = document.createElement('canvas').getContext("2d");
    context.font = font;
    // check trivial case first, when entire text is already small enough
    if(context.measureText(text).width < width) {
      return text;
    }
    else {
      var ellipsis = "..";
      // if ellipsis alone is already too large
      if(context.measureText(ellipsis).width > width) {
        return "";
      }

      var finalLength; // this should always have a value after the loop
      for(var i=0; i < text.length; i++) {
        var subtext = text.substring(0, i) + ellipsis;
        if (context.measureText(subtext).width > width) { // we're too far, take the previous index
          finalLength = i > 0 ? i-1 : 0;
          break;
        }
      }
      return text.substring(0, finalLength) + ellipsis;
    }
  },

  // ensure that returned string follows xsd:ID standard
  // should follow r'^[a-zA-Z_][\w.-]*$'
  getXMLValidId: function(originalId) {
    var newId = "";
    var xmlValidRegex = /^[a-zA-Z_][\w.-]*$/;
    if (! xmlValidRegex.test(originalId)) { // doesn't comply
      newId = originalId;
      newId = newId.replace(/[^\w.-]/g, "");
      if (! xmlValidRegex.test(newId)) { // still doesn't comply
        newId = "_" + newId;
        if (! xmlValidRegex.test(newId)) { // normally we should never enter this
          // if for some obscure reason we still don't comply, throw error.
          throw new Error("Can't make identifer comply to xsd:ID requirements: "+newId);
        }
      }
      return newId;
    }
    else {
      return originalId;
    }
  }

};

module.exports = textUtilities;
