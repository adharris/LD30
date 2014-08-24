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
