/*eslint no-underscore-dangle: 0 */
(function () {
  'use strict';

  Vue.component('story-container', {
    template: '#story-container-template',
    data: function() {
      return {
        storyUrl: 'data/stories/tutorial.json',
        story: null
      };
    },
    ready: function(){
      var controller = new ScrollMagic.Controller({
        container: this.$el
      });

      var app = this.$root;
      fetch(this.storyUrl)
        .then((resp) => {
          return resp.json();
        })
        .then((json) => {
          this.$set('story', json);

          this.$nextTick(() => {
            var storyElements = this.$el.getElementsByClassName('story-item');
            console.log('story elements', storyElements, storyElements.length);
            _.each(storyElements, function(element) {
              var item = element.__v_frag.raw;
              var scene = new ScrollMagic.Scene({
                triggerElement: element,
                duration: element.clientHeight
              })
                    .addTo(controller)
                    .on('enter', function () {
                      if (_.has(item, 'latlng')) {
                        // replace by flyTo after upgrade
                        app.map.setView(item.latlng, item.zoom);

                      }
                    })
                    .addIndicators();
              console.log('add scene', scene);

            });


          });
        });

    }
  });

}());
