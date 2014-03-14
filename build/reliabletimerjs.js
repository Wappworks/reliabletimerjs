/**
 * ReliableTimerJs
 *
 * Javascript timer function which preserves scheduling order
 * Released under MIT license
 * Copyright (c) 2014 Wappworks Studio
 */

RELIABLETIMER = (function(){
    "use strict";

    var laterState = {
        timeMap:    {},
        queue:      [],
        queueDirty: false
    };

    /**
     *  Schedule a later function
     *
     *  @param  delayMs {Number}
     *  @param  handle  {LaterHandle}
     *
     *  @returns {LaterHandle}
     */
    function scheduleLaterFunction( delayMs, handle ) {
        var eventMs     = new Date().getTime() + Math.max(0, Math.round(delayMs)),
            timeMap     = laterState.timeMap,
            eventRecord = timeMap[ eventMs ];

        if( eventRecord != null ) {
            eventRecord.last.setNext( handle );
            eventRecord.last = handle;
            return handle;
        }

        // If we get here, we're scheduling a new handle...
        timeMap[ eventMs ] = {
            first:  handle,
            last:   handle
        };

        laterState.queue.push( eventMs );
        laterState.queueDirty = true;

        function callback() {
            var queue   = laterState.queue,
                timeMap = laterState.timeMap;

            if( laterState.queueDirty ) {
                laterState.queueDirty = false;
                queue.sort();
            }

            // Process all the events up to the current point in time... in the right order
            var queueLength = queue.length,
                queueIdx;
            for( queueIdx = 0; queueIdx < queueLength; queueIdx++ ) {
                var currMs = queue[ queueIdx ];
                if( currMs > eventMs )
                    break;

                var handle = timeMap[ currMs ].first;
                do {
                    handle.execute();
                    handle = handle.___next;
                } while( handle != null );

                // Preserve list integrity - delete the time record only at the end in case further events are queued...
                delete timeMap[ currMs ];
            }

            if( queueIdx == queue.length )                  // Resample queue length here because it could have changed...
                laterState.queue = [];
            else
                laterState.queue = queue.slice( queueIdx );
        }

        window.setTimeout( callback, delayMs );
        return( handle );
    }

    /**
     *  @constructor
     *
     *  @param  {Function}  [cbFn]
     *  @param  {Object}    [cbContext]
     *  @param  {Object[]}  [cbArgs]
     */
    function LaterHandle( cbFn, cbContext, cbArgs ) {
        this.___next    = null;

        /** @private */
        this.cbFn       = cbFn;
        /** @private */
        this.cbContext  = cbContext;
        /** @private */
        this.cbArgs     = cbArgs;
        /** @private */
        this.finished   = false;
    }
    LaterHandle.prototype = {
        /**
         *  Cancel the callback
         */
        cancel: function() {
            this.cbFn = null;
            this.cbContext = null;
            this.cbArgs = null;
            this.finished = true;
        },

        /**
         *  Execute the callback
         *  @private
         */
        execute: function() {
            if( this.finished )
                return;

            this.finished = true;
            this.cbFn.apply( this.cbContext || window, this.cbArgs );

            this.cbFn = null;
            this.cbContext = null;
            this.cbArgs = null;
        },

        /**
         * Set the next handle
         * @private
         *
         * @param handleNext    {LaterHandle}
         */
        setNext: function( handleNext ) {
            this.___next = handleNext;
        }
    };

    return {
        /**
         * Queue a function for later execution
         *
         * @param timeMs        {Number}
         * @param fn            {Function}
         * @param [ctx]         {*}
         * @param [var_args]    {...*}
         */
        later: function( timeMs, fn, ctx, var_args ) {
            // Build the callback arguments (if applicable)
            var cbArgs = null;
            if( arguments.length > 3 )
                cbArgs = Array.prototype.slice.call( arguments, 3 );

            var handle = new LaterHandle( fn, ctx, cbArgs );
            scheduleLaterFunction( timeMs, handle );
        }
    }
})();
