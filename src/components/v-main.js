import Vue from 'vue';

import Vue2MapboxGL from 'vue2mapbox-gl';
import DrawingCanvas from './DrawingCanvas';
Vue.use(Vue2MapboxGL);
export default {
  name: '',
  data () {
    return {
      sources: [],
      layers: []
    };
  },
  mounted() {
  },
  methods: {
  },
  computed: {
  },
  components: {
    'drawing-canvas': DrawingCanvas
  }

}
