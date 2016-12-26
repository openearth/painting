(function () {

  Vue.component('realtime-layer', {
    template: '#realtime-layer-template',
    props: {
      model: {
        type: Object
      }
    },
    watch: {
      bounds: function() {
        // set bounds on image if they change
        this.setBounds();
      }
    },
    mounted: function() {
      // some random bounds, reset later
      var bounds = this.bounds;
      this.$drawingLayer = L.canvasOverlay(bounds, {el: this.$el, width: 1024, height: 1024});
    },
    computed: {
      bounds: {
        get: function() {
          var bounds = L.latLngBounds(L.latLng(0, 0), L.latLng(1, 1));
          if (_.has(this, 'model.extent')) {
            var model = this.model;
            var sw = L.latLng(model.extent.sw[0], model.extent.sw[1]),
                ne = L.latLng(model.extent.ne[0], model.extent.ne[1]);
            bounds = L.latLngBounds(sw, ne);
          }
          return bounds;
        },
        cache: false
      }
    },
    methods: {
      deferredMountedTo(parent) {
        this.$drawingLayer.addTo(parent);
        _.forEach(this.$children, (child) => {
          child.deferredMountedTo(this.$drawingLayer);
        });
      },
      setBounds: function() {
        this.$drawingLayer.setBounds(this.bounds);

      }

    }
  })

}());
