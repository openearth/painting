<template>
  <v-container fill-height fluid pa-0>
    <v-mapbox
      access-token="pk.eyJ1Ijoic2lnZ3lmIiwiYSI6Il8xOGdYdlEifQ.3-JZpqwUa3hydjAJFXIlMA"
      map-style="mapbox://styles/mapbox/satellite-streets-v10"
      :center="[4, 52]"
      :zoom="10"
      :pitch="20"
      :bearing="-0"
      :min-zoom="5"
      ref="map"
      class="xs12"
      id="map"
    >
      <v-mapbox-navigation-control></v-mapbox-navigation-control>
      <drawing-canvas></drawing-canvas>
      <v-mapbox-source v-for="source in sources" :key="source.id"></v-mapbox-source>
      <v-mapbox-layer v-for="layer in layers" :key="layer.id"></v-mapbox-layer>
    </v-mapbox>
  </v-container>
</template>

<script src="./v-main.js"></script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #map {
    height: 100%;
    width:  100%;
  }
  .fill-height {
    height: 100%;
  }

</style>
