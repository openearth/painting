'use strict';

function startModel(model){
}
$(function(){
    // Listen for selected models
    document.addEventListener('model-loaded', function(evt){
        var model = evt.detail;
        startModel(model);
        // fire model started event
        var event = new CustomEvent(
            'model-started',
            {'detail': model}
        );
        document.dispatchEvent(event);

    });

});
