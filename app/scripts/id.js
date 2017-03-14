(function () {
  'use strict';
  /* eslint-disable no-extend-native, no-underscore-dangle */


  var idCounter = 1;

  Object.defineProperty(Object.prototype, '__uniqueId', {
    writable: true
  });

  Object.defineProperty(Object.prototype, 'uniqueId', {
    get: function() {
      if (this.__uniqueId === undefined) {
        this.__uniqueId = idCounter++;
      }
      return this.__uniqueId;
    }
  });

  /* eslint-enable no-extend-native, no-underscore-dangle */

}());
