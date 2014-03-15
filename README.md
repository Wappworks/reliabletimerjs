![LOGO](http://rawgithub.com/Wappworks/reliabletimerjs/master/art/reliabletimerjs.png)ReliableTimerJs
===============
#### The better windows.setTimeout() ####

Introduction
------------
ReliableTimerJs addresses the shortcomings of windows.setTimeout(). Its advantages are:
* It preserves the timer callback’s order-of-execution, first by the execution time, and second by the order in which it’s invoked.
* Callers can specify the timer callback’s execution context as well as the function parameters when scheduling the callback.

A more thorough explanation of the problems with windows.setTimeout() can be found [here](http://www.wappworks.com/2014/03/15/reliabletimerjs-the-better-window-settimeout/).

Usage
------------
A demo on how to use this library is found at [jsFiddle](http://jsfiddle.net/ckhoo/Lw7br/).

License
-------
ReliableTimerJs is released under the [MIT license](http://rawgithub.com/Wappworks/reliabletimerjs/master/LICENSE).
