'use strict';
function zoomToModel(map, model) {
    var sw = L.latLng(model.extent.sw[0], model.extent.sw[1]),
        ne = L.latLng(model.extent.ne[0], model.extent.ne[1]);
    var bounds = L.latLngBounds(sw, ne);
    map.fitBounds(
        bounds,
        {
            animate: true
        }
    );
}

$(function(){
    L.mapbox.accessToken = 'pk.eyJ1Ijoic2lnZ3lmIiwiYSI6Il8xOGdYdlEifQ.3-JZpqwUa3hydjAJFXIlMA';
    var map = L.mapbox.map('map', 'siggyf.c74e2e04');
    var sidebar = L.control.sidebar('sidebar').addTo(map);

    // Listen for loaded models
    document.addEventListener('model-selected', function(evt){
        var model = evt.detail;
        console.log('model selected', model);
        zoomToModel(map, model);

    });

});


