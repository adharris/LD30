
var module = angular.module('app');

var neighborMap = {
    n: [0, -1],
    e: [1, 0],
    s: [0, 1],
    w: [-1, 0],
    ne: [1, -1],
    se: [1, 1],
    sw: [-1, 1],
    nw: [-1, -1],
};

function Cell(x, y) {
    this.x = x;
    this.y = y;

    this.items = [];
    this.neighbors = {};
    this.adjacentItems = [];

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

            for (var n in this.neighbors) {
                if (this.neighbors[n]) {
                    this.neighbors[n].adjacentItems.push(item);
                }
            }
            return true;
        }
        return false;
    };

    this.getScore = function() {
        var score = 0;
        for (var i = 0; i < this.items.length; i++) {
            score += this.getScoreForItem(this.items[i]);
        }
        return score;
    };

    this.getScoreForItem = function(item) {
        var score = 0;

        for (var i = 0; i < this.adjacentItems.length; i++) {
            score +=  item.score[this.adjacentItems[i].name] || 0;
        }

        return score;
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
                if (x < 0 || x >= settings.townSize || y < 0 || y >= settings.townSize) {
                    return null;
                }
                if (angular.isUndefined(this.cells[x])) {
                    this.cells[x] = {};
                }
                if (angular.isUndefined(this.cells[x][y])) {
                    this.cells[x][y] = new Cell(x, y);
                    for (var neighbor in neighborMap) {
                        var neighborCell = this.getCell(x + neighborMap[neighbor][0],
                                                        y + neighborMap[neighbor][1]);
                        if (angular.isDefined(neighborCell)) {
                            this.cells[x][y].neighbors[neighbor] = neighborCell;
                        }
                    }
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
                    this.items.push({x: x, y: y, item: item});
                    this.town.setScore(this.getScore());
                }
            };

            this.getScore = function() {
                var score = 0;
                for (var x in this.cells) {
                    for (var y in this.cells[x]) {
                        score += this.cells[x][y].getScore();
                    }
                }
                return score;
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

