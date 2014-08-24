

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

var everyIteration = [Tree, House, Path];

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
