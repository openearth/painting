/* exported urlParams, val2rgbaString  */
/* eslint-disable no-unused-vars */

function val2rgbaString(val) {
  'use strict';
  var rgba = val.rgba;
  var [r, g, b, a] = [rgba.r, rgba.g, rgba.b, rgba.a];
  return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
}

function urlParams () {
  'use strict';
  // parse url parameters, adapted from http://stackoverflow.com/a/2880929/386327
  var match,
  pl = /\+/g,  // Regex for replacing addition symbol with a space
  search = /([^&=]+)=?([^&]*)/g,
  decode = function (s) { return decodeURIComponent(s.replace(pl, ' ')); },
  query = window.location.search.substring(1);

  var result = {};
  while ((match = search.exec(query)) !== null) {
    // parameter
    var value = decode(match[2]);
    var decoded = null;
    if (value === 'true') {
      decoded = true;
    } else if (value === 'false') {
      decoded = false;
    } else {
      decoded = value;
    }

    result[decode(match[1])] = decoded;
  }
  return result;

}
/* eslint-enable no-unused-vars */
