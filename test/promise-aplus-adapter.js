var Then = require('../then');

exports.resolved = Then.resolve;

exports.rejected = Then.reject;


exports.deferred = function() {
    var p = {};

    p.promise = new Then(function(resolve, reject) {
        p.resolve = resolve;
        p.reject = reject;
    });

    return p;
}
