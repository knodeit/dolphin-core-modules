/**
 * Created by Vadim on 12/9/15.
 */
'use strict';

var Module = require('./base');
var swig = require('swig');
var Q = require('q');

function HttpModule(name, source) {
    Module.apply(this, arguments);
}

require('util').inherits(HttpModule, Module);
module.exports = HttpModule;

HttpModule.prototype.render = function (view, options) {
    var deferred = Q.defer();
    swig.renderFile(this.resolvePath('/server/views/' + view), options, function (err, html) {
        if (err) {
            return deferred.reject(err);
        }
        deferred.resolve(html);
    });
    return deferred.promise;
};
