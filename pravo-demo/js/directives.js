app.directive('onLastPreview', function() {
    return function(scope, element, attrs) {
        if (scope.$last) setTimeout(function(){
            scope.$emit('lastPreviewCallback', element, attrs);
        }, 1);
    };
});