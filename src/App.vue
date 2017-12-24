<template>
  <v-app>
    <v-navigation-drawer
      fixed
      clipped
      v-model="drawer"
      app
    >
      <v-list>
        <v-list-tile
          value="true"
          v-for="(item, i) in items"
          :key="i"
        >
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar dense :clipped-left="clipped">
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer />
      <v-btn icon @click.stop="right = !right">
        <v-icon>menu</v-icon>
      </v-btn>
    </v-toolbar>
    <v-content>
      <router-view></router-view>
    </v-content>
    <v-navigation-drawer
      temporary
      right
      v-model="right"
      fixed
    >
      <v-list>
      </v-list>
    </v-navigation-drawer>
  </v-app>
</template>

<script>
  export default {
    data () {
      return {
        drawer: false,
        clipped: true,
        items: [{
          icon: 'bubble_chart',
          title: 'Inspire'
        }],
        right: false,
        title: 'Painting'
      }
    }
  }
</script>
