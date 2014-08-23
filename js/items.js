
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
