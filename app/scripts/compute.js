function startModel(model){
    console.log('starting model', model);
}
$(function(){
    // Listen for selected models
    document.addEventListener('model-loaded', function(evt){
        var model = evt.detail;
        console.log('model loaded', model);
        startModel(model);
        // fire model started event
        var event = new CustomEvent(
            'model-started',
            {'detail': model}
        );
        document.dispatchEvent(event);

    });

});
