var app = angular.module('app');

app.run(['$document', '$rootScope',
        function($document, $rootScope) {

    function move(x, y) {
        console.log(x, y);
        $rootScope.$emit('move', x, y);
    }


    $document.bind('keyup', function(event) {
        var code = event.key || event.keyCode;

        if (code == 37 || code == 65) {
            move(-1, 0);
        } else if (code == 39 || code == 68) {
            move(1, 0);
        } else if (code == 38 || code == 87) {
            move(0, -1);
        } else if (code == 40 || code == 83) {
            move(0, 1);
        }
    });
}]);