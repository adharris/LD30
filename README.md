# Kent: Bidimensional Landscaper

This is my entry into [Ludum Dare #30](http://www.ludumdare.com/compo/category/ld-30/).
It's a score-attack puzzler where you control two instances of the game at a
time.

You play as Kent, the bi-dimensional landscaper.  He exists in two dimensions
at once, and is expected to build beautiful towns in both.

## How to play

Control Kent With WSAD or the arrow keys, and place the current item with
space.

Items placed in the world are awarded Aesthetic points based on what is in the
tiles to the north, south, east, and west of them, according to the following
rules:

* Trees get 1 point for every adjacent tree.
* Paths get 1 point for every adjacent path.
* Houses get 1 point for every adjacent path or tree, but lose one point for an adjacent house.

The goal is to maximize your points across both towns.  There isn't a formal
end/lose condition, but eventually you will trap Kent with trees or houses, so
let's call that the end.


## About

This is my first #LD48, as well as my first released "game".  As such, I stuck
with what I know, which is web development.

As such, everything here is HTML and pngs (no svg, no canvas). I used AngularJS
for the javascript.

I only really tested this in Chrome.

## Things I Didn't Get To

I had planned for more items, (i.e. signpost which gets bonus for being at a
forking path, flowers placed at the base of trees, wells in path intersections,
etc) but ran out of time. Much of the logic for adding multiple items to the
same cell is in place, I was just missing the sprites and the scoring logic.

Originally, my goal was to have more than 2 towns. There would be a limit to
the number of active towns you could have, and a town would be removed when
it got a certain number of points. The goal would be to get a high score in few
moves so you could keep the number of villages down.  There were far too few
hours to do this.
