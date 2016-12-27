/*eslint no-underscore-dangle: 0 */
(function () {
  'use strict';

  Vue.component('story-container', {
    template: '#story-container-template',
    data: function() {
      return {
        storyUrl: 'data/stories/ecomare.json',
        story: null
      };
    },
    mounted: function(){
      this.$nextTick(() => {
        var controller = new ScrollMagic.Controller({
          container: this.$el,
          loglevel: 3
        });
        console.log('adding story to ', this.$el);
        var app = this.$root;
        fetch(this.storyUrl)
          .then((resp) => {
            return resp.json();
          })
          .then((json) => {
            Vue.set(this, 'story', json);

            this.$nextTick(() => {
              var storyElements = this.$el.getElementsByClassName('story-item');
              _.each(storyElements, function(element, index) {
                var item = json.items[index];
                console.log('combining', element, 'with', item, element.clientHeight);
                var scene = new ScrollMagic.Scene({
                  triggerElement: element,
                  duration: element.clientHeight
                })
                      .on('enter', () => {
                        console.log('entering item', item);
                        if (_.has(item, 'latlng')) {
                          // replace by flyTo after upgrade
                          app.$refs.map.mapObject.flyTo(L.latLng(item.latlng), item.zoom);

                        }
                      })
                      .addIndicators()
                      .addTo(controller);
                console.log('add scene', scene);

              });

              var jssorSliders = Array.from(this.$el.getElementsByClassName('jssor-slider-container'));
              _.map(jssorSliders, function(el) {
                var slider = new $JssorSlider$(el.id, {$AutoPlay: true});
                return slider;
              });
            });
          });
      });


    }
  });

}());
