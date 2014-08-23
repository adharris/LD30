
app = angular.module('app');

var items = require("./items");

var itemNames = Object.keys(items);

function getRandomItem() {
    var rand = Math.floor(Math.random() * itemNames.length);
    return new items[itemNames[rand]]();
}


var townCounter = 0;

TownDirective.$inject = ['$document'];
function TownDirective($document) {
    return {
        restrict: 'E',
        templateUrl: 'templates/town.html',
        scope: {},
        controllerAs: 'town',
        controller: ['$scope', function($scope) {

            this.queue = [];

            for (var i=0; i < 6; i++) {
                this.queue.push(getRandomItem());
            }

            this.peekItem = function() {
                return this.queue[0];
            };

            this.popItem = function() {
                this.queue.push(getRandomItem());
                return this.queue.shift();
            };
        }],
    };
}

app.directive('town', TownDirective);

