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
            method: this.clear,
            arguments: {}
          }
        ]
      };
    },
    ready: function() {
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
        app.$refs.drawingCanvas.clear();
        app.$refs.modelCanvas.clear3d();
      }
    }
  });

}());
