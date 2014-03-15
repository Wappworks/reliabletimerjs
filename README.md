![LOGO](https://rawgithub.com/Wappworks/reliabletimerjs/master/art/reliabletimerjs.png)ReliableTimerJs
===============
#### The better windows.setTimeout() ####

Introduction
------------
ReliableTimerJs is a Javascript library aimed at addressing shortcomings in windows.setTimeout(). Its advantages are:
* It preserves the timer callback’s order-of-execution, first by the execution time, and second by the order in which it’s invoked.
* Callers can specify the timer callback’s execution context as well as the function parameters when scheduling the callback.

A more thorough explanation of the problems with windows.setTimeout() can be found [here](http://www.wappworks.com/portfolio/reliabletimerjs/).

License
-------
ReliableTimerJs is released under the MIT license.
