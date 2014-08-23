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


},{"./items":3}],3:[function(require,module,exports){

function Tree() {

    this.name = "tree";
    this.isPassable = false;

    this.canCoexistWith = function(item) {
        return false;
    };
}

function Path() {

    this.name = 'path';
    this.isPassable = true;

    this.canCoexistWith = function(item) {
        return false;
    };
}

function House() {
    this.name = 'house';
    this.isPassable = false;

    this.canCoexistWith = function(item) {
        return false;
    };
}


module.exports = {
    Tree: Tree,
    Path: Path,
    House: House,
};

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
        templateUrl: '/templates/kent.html',
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

            this.setCoord('x', 0);
            this.setCoord('y', 0);
        }],
    };
}
app.directive('kent', KentDirective);

},{}],5:[function(require,module,exports){

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


},{"./items":3}]},{},[1])