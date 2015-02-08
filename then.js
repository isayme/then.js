(function(root, factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        define('Then', function() {
            return factory();
        });
    } else if (typeof exports === 'object' && module.exports) {
        exports = module.exports = factory();
    } else {
        root.Then = factory();
    }
}(this, function() {
    'use strict';

    var isFunction = function(obj) {
        return typeof obj === 'function';
    };

    var isObject = function(obj) {
        return obj && typeof obj === 'object';
    };

    var isObjOrFunc = function(obj) {
        return isObject(obj) || isFunction(obj);
    };

    var isArray = Array.isArray || function(obj) {
        return {}.toString.call(obj) === '[object Array]';
    };

    var Then = function(executor) {
        if (!isFunction(executor)) {
            throw new TypeError('argument must be a function.');
        }

        if (!(this instanceof Then)) {
            return new Then(executor);
        }
        
        var promise = this;
        promise.status = 'pending';
        promise.resolves = [];
        promise.rejects = [];

        function resolve(value) {
            if ('pending' !== promise.status) return;

            promise.value = value;
            promise.status = 'fulfilled';
            for (var i = 0, l = promise.resolves.length; i < l; i++) {
                promise.resolves[i].call(undefined, value);
            }
        }

        function reject(reason) {
            if ('pending' !== promise.status) return;

            promise.reason = reason;
            promise.status = 'rejected';
            for (var i = 0, l = promise.rejects.length; i < l; i++) {
                promise.rejects[i].call(undefined, reason);
            }
        }

        executor(resolve, reject);
    };

    Then.reject = function(reason) {
        return new Then(function(resolve, reject) {
            reject(reason);
        });
    };

    Then.resolve = function(value) {
        return new Then(function(resolve, reject) {
            resolve(value);
        });
    };

    Then.all = function(promises) {
        if (!isArray(promises)) {
            throw new TypeError('argument must be a array.');
        }

        return new Then(function(resolve, reject) {
            var result = [];
            var length = promises.length;
            var cnt = 0;

            function resolver(index) {
                return function(value) {
                    result[index] = value;
                    cnt++;
                    if (cnt === length) {
                        resolve(result);
                    }
                };
            }
            
            for (var i = 0, l = promises.length; i < l; i++) {
                promises[i].then(resolver(i), reject);
            }
        });
    };

    Then.race = function(promises) {
        if (!isArray(promises)) {
            throw new TypeError('argument must be a array.');
        }

        return new Then(function(resolve, reject) {
            for (var i = 0, l = promises.length; i < l; i++) {
                promises[i].then(resolve, reject);
            }
        });
    };

    function resolution_procedure(promise, x, resolve, reject) {
        var done = false;
        function once(func) {
            return function(x) {
                if (done) return;
                done = true;
                return func.call(undefined, x);
            };
        }

        if (promise === x) {
            throw new TypeError('donot resolve promise itself.');
        }

        var then = isObjOrFunc(x) && x.then;
        if (isFunction(then)) {
            try {
                then.call(x, once(function(value) {
                    try {
                        resolution_procedure(x, value, resolve, reject);
                    } catch(e) {
                        once(reject(e));
                    }
                }), once(reject));
            } catch(e) {
                once(reject)(e);
            }
        } else {
            resolve(x);
        }
    }

    Then.prototype.then = function(onFulfilled, onRejected) {
        var promise = this;

        var next = new Then(function(resolve, reject) {
            function _resolve(value) {
                setTimeout(function() {
                    if (isFunction(onFulfilled)) {
                        try {
                            var ret = onFulfilled(value);
                            resolution_procedure(next, ret, resolve, reject);
                        } catch (e) {
                            reject(e);
                        }
                    } else {
                        resolve(value);
                    }
                }, 0);
            }

            function _reject(reason) {
                setTimeout(function() {
                    if (isFunction(onRejected)) {
                        try {
                            var ret = onRejected(reason);
                            resolution_procedure(next, ret, resolve, reject);
                        } catch (e) {
                            reject(e);
                        }
                    } else {
                        reject(reason);
                    }
                }, 0);
            }

            if ('fulfilled' === promise.status) {
                _resolve.call(undefined, promise.value);
            } else if ('rejected' === promise.status) {
                _reject.call(undefined, promise.reason);
            } else {
                promise.resolves.push(_resolve);
                promise.rejects.push(_reject);
            }
        });

        return next;
    };

    Then.prototype.catch = function(onRejected) {
        return this.then(undefined, onRejected);
    };

    return Then;
}));
