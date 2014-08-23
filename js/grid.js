
var module = angular.module('app');
var items = require("./items");


function Cell(x, y) {
    this.x = x;
    this.y = y;

    this.items = [];

    this.canPlaceItem = function(item) {
        for (var i = 0; i < this.items.length; i++) {
            if (!this.items[i].canCoexistWith(item)) {
                return false;
            }
        }
        return true;
    };

    this.isPassable = function() {
        for (var i = 0; i < this.items.length; i++) {
            if (!this.items[i].isPassable) {
                return false;
            }
        }
        return true;
    };

    this.hasItem = function(item) {
        return this.items.indexOf(item) >= 0;
    };

    this.placeItem = function(item) {
        if (!this.hasItem(item)) {
            this.items.push(item);
            return true;
        }
        return false;
    };
}

function GridDirective() {

    return {
        restrict: 'E',
        templateUrl: 'templates/grid.html',
        controllerAs: 'grid',
        scope: {},
        require: ['grid', '^town'],
        link: function(scope, element, attrs, ctrls) {
            ctrls[0].town = ctrls[1];
        },
        controller: ['settings', '$scope', function(settings, $scope) {

            this.kent = {x: 0, y: 0};
            this.cells = {};
            this.items = [];

            this.getCell = function(x, y) {
                if (angular.isUndefined(this.cells[x])) {
                    this.cells[x] = {};
                }
                if (angular.isUndefined(this.cells[x][y])) {
                    this.cells[x][y] = new Cell(x, y);
                }
                return this.cells[x][y];
            };

            this.canPlaceItem = function(item, x, y) {
                var cell = this.getCell(x, y);
                return cell.canPlaceItem(item);
            };

            this.placeItem = function(item, x, y) {
                var cell = this.getCell(x, y);
                if (cell.placeItem(item)) {
                    console.log('place', this.town.id, item.name);
                    this.items.push({x: x, y: y, item: item});
                }
            };

            this.isPassable = function(x, y) {
                var onMap = x >= 0 && x < settings.townSize &&
                            y >= 0 && y < settings.townSize;

                if (!onMap) {
                    return false;
                }

                var cell = this.getCell(x, y);
                return cell.isPassable();
            };
        }],
    };
}

module.directive("grid", GridDirective);

