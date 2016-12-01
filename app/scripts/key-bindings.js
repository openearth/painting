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
          }
        ]
      };
    },
    mounted: function() {
      window.addEventListener('keyup', this.keyUp);
    },
    methods: {
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
