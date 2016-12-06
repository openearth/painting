(function () {
  'use strict';

  Vue.component('key-bindings', {
    template: '<div></div>',
    data: function() {
      var app = this.$root;
      return {
        keyBindings: [
          {
            key: 'p',
            method: app.$refs.particleComponent.addParticles,
            arguments: {}
          },
          {
            key: 'c',
            method: () => {
              this.clear();
            },
            arguments: {}
          },
          {
            key: 'q',
            method: (evt, drawing) => {
              if (_.isNil(drawing)) {
                return;
              }
              _.each(
                _.range(0, 100),
                (i) => {
                  var x = Math.random() * 1024;
                  var y = Math.random() * 1024;
                  drawing.strokeStyle = 'white';
                  drawing.beginPath();
                  drawing.arc(x, y, 1, 0, 2*Math.PI);
                  drawing.closePath();
                  drawing.stroke();
                }
              );
            }
          },
          {
            key: 'g',
            method: (evt, drawing) => {
              if (_.isNil(drawing)) {
                return;
              }
              _.each(
                _.range(0, 1024, 2**7),
                (i) => {
                  drawing.strokeStyle = 'black';
                  drawing.beginPath();
                  drawing.moveTo(i, 0);
                  drawing.lineTo(i, 1024);
                  drawing.closePath();
                  drawing.stroke();

                  drawing.beginPath();
                  drawing.moveTo(0, i);
                  drawing.lineTo(1024, i);
                  drawing.closePath();
                  drawing.stroke();
                }
              );
            }
          }
        ]
      };
    },
    mounted: function() {
      window.addEventListener('keyup', this.keyUp);
      bus.$on('drawing-keydown', this.drawingKey);
    },
    methods: {
      drawingKey: function(evt, drawing) {
        var keyBinding = _.first(
          _.filter(this.keyBindings, ['key', evt.key])
        );
        if (!_.isNil(keyBinding)) {
          keyBinding.method(evt, drawing);
        }
      },
      keyUp: function(evt) {
        var keyBinding = _.first(
          _.filter(this.keyBindings, ['key', evt.key])
        );
        if (!_.isNil(keyBinding)) {
          keyBinding.method(keyBinding.arguments);
        }
      },
      clear: function() {
        var app = this.$root;
        app.$refs.particleComponent.removeParticles();
        if (_.has(app.$refs, 'drawingCanvas')) {
          app.$refs.drawingCanvas.clear();
          console.warn('Expected drawingCanvas on', app.$refs);
        }
        if (_.has(app.$refs, 'modelCanvas')) {
          app.$refs.modelCanvas.clear3d();
          console.warn('Expected modelCanvas on', app.$refs);
        }
      }
    }
  });

}());
