<a href="https://promisesaplus.com/">
    <img src="https://promisesaplus.com/assets/logo-small.png" alt="Promises/A+ logo"
         title="Promises/A+ 1.0 compliant" align="right" />
</a>

# Then #
A tiny(only 200 lines) promise/A+ library.

# APIs #
The APIs of this library follow [MDN Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

## Then.resolve(value) ##
Returns a Promise object that is resolved with the given value. If the value is a thenable (i.e. has a then method), the returned promise will "follow" that thenable, adopting its eventual state; otherwise the returned promise will be fulfilled with the value.

## Then.reject(reason) ##
Returns a Promise object that is rejected with the given reason.

## Then.all(iterable) ##
Returns a promise that resolves when all of the promises in the iterable argument have resolved.

## Then.race(iterable) ##
Returns a promise that resolves or rejects as soon as one of the promises in the iterable resolves or rejects, with the value or reason from that promise.

## Then.prototype.then(onFulfilled, onRejected) ##
Appends fulfillment and rejection handlers to the promise, and returns a new promise resolving to the return value of the called handler.

## Then.prototype.catch(onRejected) ##
Appends a rejection handler callback to the promise, and returns a new promise resolving to the return value of the callback if it is called, or to its original fulfillment value if the promise is instead fulfilled.


# Running the Promises/A+ Test Suite #

- npm install
- npm test

# Contact #
`email`: [isaymeorg@gmail.com](mailto:isaymeorg@gmail.com)
