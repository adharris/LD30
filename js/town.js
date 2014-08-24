
app = angular.module('app');

var ItemQueue = require("./items");


var townCounter = 0;

TownDirective.$inject = ['$document'];
function TownDirective($document) {
    return {
        restrict: 'E',
        templateUrl: 'templates/town.html',
        scope: {},
        controllerAs: 'town',
        controller: ['$scope', function($scope) {

            this.queue = new ItemQueue(6);

            this.peekItem = function() {
                return this.queue[0];
            };

            this.popItem = function() {
                return this.queue.shift();
            };
        }],
    };
}

app.directive('town', TownDirective);

