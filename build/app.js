(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

var app = angular.module("app", ['ngAnimate']);

app.constant("settings", {
    'townSize': 8,
});

require('./town');
require('./grid');
require('./kent');

},{"./grid":2,"./kent":4,"./town":5}],2:[function(require,module,exports){

var module = angular.module('app');

var neighborMap = {
    n: [0, -1],
    e: [1, 0],
    s: [0, 1],
    w: [-1, 0],
    // ne: [1, -1],
    // se: [1, 1],
    // sw: [-1, 1],
    // nw: [-1, -1],
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

    this.class = function(item) {
        var d = {};
        d[item.name] = true;

        for (var n in this.neighbors) {
            for (var i in this.neighbors[n].items) {
                d[n + '-' + this.neighbors[n].items[i].name] = true;
            }
        }

        return d;
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
                    return undefined;
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
                    this.items.push({cell: cell, item: item});
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


},{}],3:[function(require,module,exports){


function fisherYates(array) {
    var count = array.length;
    var swapTo, temp;

    while (count > 0) {
        swapTo = Math.floor(Math.random() * count);
        temp = array[count - 1];
        array[count - 1] = array[swapTo];
        array[swapTo] = temp;
        count--;
    }
    return array;
}

function Tree() {

    this.name = "tree";
    this.isPassable = false;
    this.score = {
        tree: 1,
    };

    this.canCoexistWith = function(item) {
        return false;
    };

}

function Path() {

    this.name = 'path';
    this.isPassable = true;
    this.score = {
        path: 1,
    };

    this.canCoexistWith = function(item) {
        return false;
    };
}

function House() {
    this.name = 'house';
    this.isPassable = false;

    this.score = {
        house: -1,
        tree: 1,
        path: 1,
    };

    this.canCoexistWith = function(item) {
        return false;
    };
}

var everyIteration = [Path, Tree, House];

function buildIteration() {
    var iteration = [];
    for (var i = 0; i < everyIteration.length; i++) {
        iteration.push(new everyIteration[i]());
    }
    return fisherYates(iteration);
}


function ItemQueue(size) {
    var iteration = [];

    function getNextFromIteration() {
        if (iteration.length === 0) {
            iteration = buildIteration();
        }
        console.log(iteration);
        return iteration.pop();
    }

    for(var i = 0; i < size; i++) {
        this.push(getNextFromIteration());
    }

    this.shift = function() {
        this.push(getNextFromIteration());
        return Array.prototype.shift.call(this);
    };
}

ItemQueue.prototype = new Array;


module.exports = ItemQueue;

},{}],4:[function(require,module,exports){
var app = angular.module('app');

function getRotationClass(x, y) {
    if (x > 0) {return 'right';}
    if (x < 0) {return 'left';}
    if (y > 0) { return 'down';}
    if (y < 0) { return 'up';}
}

function kentContainer() {
    return {
        restrict: 'EA',
        controller: ['$document', '$rootScope', function($document, $rootScope) {
            this.kents = [];

            this.hasKent = function(kent) {
                return this.kents.indexOf(kent) >= 0;
            };

            this.addKent = function(kent) {
                if (!this.hasKent(kent)) {
                    this.kents.push(kent);
                }
            };

            this.removeKent = function(kent) {
                var kentIndex = this.kents.indexOf(kent);
                if (kentIndex >= 0) {
                    this.kents.splice(kentIndex, 1);
                }
            };

            this.moveKents = function(x, y) {
                for (var i = 0; i < this.kents.length; i++) {
                    this.kents[i].move(x, y);
                }
            };

            this.placeItem = function() {
                for (var i = 0; i < this.kents.length; i++) {
                    this.kents[i].placeItem();
                }
            };

            $document.bind('keyup', (function(event) {
                var code = event.key || event.keyCode;

                if (code == 37 || code == 65) {
                    $rootScope.$apply(this.moveKents.bind(this, -1, 0));
                } else if (code == 39 || code == 68) {
                    $rootScope.$apply(this.moveKents.bind(this, 1, 0));
                } else if (code == 38 || code == 87) {
                    $rootScope.$apply(this.moveKents.bind(this, 0, -1));
                } else if (code == 40 || code == 83) {
                    $rootScope.$apply(this.moveKents.bind(this, 0, 1));
                }

                if (code == 32) {
                    $rootScope.$apply(this.placeItem.bind(this));
                }

                return false;

            }).bind(this));

        }],
    };
}

app.directive('kentContainer', kentContainer);



KentDirective.$inject = ['$animate'];
function KentDirective() {
    return {
        restrict: 'E',
        templateUrl: 'templates/kent.html',
        require: ['kent', '^kentContainer', '^grid', '^town'],
        controllerAs: 'kent',
        link: function(scope, element, attrs, ctrls) {
            var kent = ctrls[0];
            var kentContainer = ctrls[1];

            kent.grid = ctrls[2];
            kent.town = ctrls[3];

            kentContainer.addKent(kent);
        },
        controller: ['$scope', '$element', function($scope, $element) {

            this.setCoord = function(name, val) {
                this[name] = val;
                $element.attr(name, val);
            };

            this.move = function(x, y) {
                var newX = this.x + x;
                var newY = this.y + y;

                if (this.grid.isPassable(newX, newY)) {
                    $element.removeClass('up down left right');
                    $element.addClass(getRotationClass(x, y));
                    this.setCoord('x', newX);
                    this.setCoord('y', newY);
                }
            };

            this.placeItem = function() {
                var item = this.town.peekItem();
                var x = this.x;
                var y = this.y;

                if (this.grid.canPlaceItem(item, x, y)) {
                    this.grid.placeItem(item, x, y);
                    this.town.popItem();
                }
            };

            this.setCoord('x', 3);
            this.setCoord('y', 3);
        }],
    };
}
app.directive('kent', KentDirective);

},{}],5:[function(require,module,exports){

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
            this.score = 0;

            this.peekItem = function() {
                return this.queue[0];
            };

            this.popItem = function() {
                return this.queue.shift();
            };

            this.setScore = function(score) {
                this.score = score;
            };
        }],
    };
}

app.directive('town', TownDirective);


},{"./items":3}]},{},[1])