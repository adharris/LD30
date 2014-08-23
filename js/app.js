
var app = angular.module("app", ['ngAnimate']);

app.constant("settings", {
    'townSize': 8,
});

require('./town');
require('./grid');
require('./kent');
