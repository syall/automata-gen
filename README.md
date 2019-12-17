# automata-gen

## Content

automata-gen provides an easy framework ([Automata Class](https://github.com/syall/automata-gen/blob/master/src/automata.ts)) to generate Cellular Automata, including timing, size of the universe, maximum iterations, and more.

Features include difference between state and display, hooks to different parts of the running lifecycle, and simple design that requires no dependencies!

## Motivation

Personally, Cellular Automata are a fascinating subject!

Although there are a lot of academic papers which discuss the various applications of this simple concept, there was no simple way to generalize and visualize creating cellular automata.

It should be noted that the generator is not able to generate every type of cellular automata, particularly cellular automata that involve "direction" of a cell (see [Langton's Ant](https://rosettacode.org/wiki/Langton%27s_ant) and the like).

## Installation

To use this package using npm:

~~~shell
npm install automata-gen
~~~

or using yarn:

~~~shell
yarn add automata-gen
~~~

## Examples

Demo of examples built in a React app can be found [here](https://automata-demo.syall.work/).

The source code of the [Examples](https://github.com/syall/automata-gen/tree/master/examples):

* [Conway's Game of Life](https://github.com/syall/automata-gen/blob/master/examples/gameOfLife.ts)
* [Forest Fire](https://github.com/syall/automata-gen/blob/master/examples/forestFire.ts)
* [Wire World](https://github.com/syall/automata-gen/blob/master/examples/wireWorld.ts)

## Documentation

Further Documentation can be found [here](https://syall.github.io/automata-gen/).

## Personal Note

automata-gen is the first package I have felt confident enough to publish!

I have been learning how to code in my free time for several months now in addition to my computer science degree.

After using so much open source software, this would be my first contribution back to the computer science community.

Thank you,

[syall](https://github.com/syall)

*P.S.* For those programmers that are coding Conway's Game of Life, you can make much more complex automata then that with this package for very little additional technical complexity.
