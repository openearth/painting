/* global   */

var mockupModel;

(function () {
  'use strict';
  mockupModel = {
    currentTime: 0.0,
    duration: 100,
    extent: {
      time: ['2010-01-01 00:00:00', '2010-02-01 00:00:00']
    }
  };
  function updateTime() {
    mockupModel.currentTime = mockupModel.currentTime + 1;
    if (mockupModel.currentTime > mockupModel.duration) {
      mockupModel.currentTime = 0.0;
    }

  }

  setInterval(updateTime, 1000);
})();
