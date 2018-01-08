export default {
  name: '',
  data () {
    return {
      map: null,
      canvas: null
    };
  },
  mounted() {
    this.canvas = this.$el.querySelector('#drawing');
  },
  methods: {
    deferredMountedTo(map) {
      this.map = map;
      map.addSource('drawing', {
        type: 'canvas',
        canvas: 'drawing',
        animate: true,
        coordinates: [
          [3.5, 52.5],
          [4.5, 52.5],
          [4.5, 51.5],
          [3.5, 51.5]
        ]
      });
      map.addLayer({
        id: 'drawing-layer',
        type: 'raster',
        source: 'drawing',
        interactive: true
      });
      map.on('click', (e) => {
        let layer = map.getLayer('drawing-layer');
        let source = map.getSource(layer.source);
        let [nw, ne, se, sw] = source.coordinates;
        let [north, west] = nw;
        let [south, east] = se;
        let row = (e.lngLat.lat - south)/(north - south);
        let col = (e.lngLat.lng - west)/(east - west);
        console.log(e.lngLat, row, col);


      });


      this.draw();
    },
    draw() {
      let ctx = this.canvas.getContext('2d');
      ctx.fillStyle = '#33aa5588';
      ctx.strokeStyle = '#eee';
      ctx.lineWidth = 5;
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);
    }

  },
  computed: {
  }

}
