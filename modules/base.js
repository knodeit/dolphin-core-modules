/**
 * Created by Vadim on 12/9/15.
 */
'use strict';

var Dolphin = require('dolphin-core');
var Logger = require('dolphin-logger');
var FsUtil = require('dolphin-core-utils').FS;
var PathUtil = require('path');
var FACTORIES_FOLDER = 'factories';

// private
function checkName(name) {
    if (Dolphin.modules[name] !== undefined) {
        Dolphin.Logger.error('Module "' + name + '" has already been registered');
        return false;
    }
    return true;
}

//public

/**
 * Module constructor
 * @param name
 * @constructor
 */
function Module(name, source) {
    if (!checkName(name)) {
        return;
    }

    this.name = name;
    this.factories = [];
    this.configureFactoryName = null;
    this.runName = null;
    this.source = source;
    Dolphin.container.register(this.name, this);
    Dolphin.modules[this.name] = this;

    //load by default
    this.loadFactories(FACTORIES_FOLDER);
}


/**
 *
 * @param name
 * @param plus
 * @returns {*}
 */
Module.prototype.resolvePath = function(path) {
    return PathUtil.join(this.source, this.name, path);
};

/**
 * Load factories via files, relative path of your module
 * @param patch
 * @return Array
 */
Module.prototype.loadFactories = function (path) {
    var files = FsUtil.readDirSync(PathUtil.join(this.source, path, '/**/*.js'));
    for (var i in files) {
        var factory = require(files[i]);
        if (!factory || !factory.name || !factory.entity) {
            Logger.error('Not valid factory file:', files[i]);
            continue;
        }

        //load
        this.addFactory(factory.name, factory.entity);
    }
};

/**
 * Registration a factory
 * @param name
 * @param callback
 * @return undefined
 */
Module.prototype.addFactory = function (name, callback) {
    this.factoryName = this.name + name + 'Factory';

    if (!checkName(this.factoryName)) {
        return;
    }

    this.factories.push(this.factoryName);
    Dolphin.container.register(this.factoryName, callback);
};

/**
 * Method for Dolphin, Resolve all module factories
 * @return undefined
 */
Module.prototype.resolveFactories = function () {
    for (var i in this.factories) {
        Dolphin.container.get(this.factories[i]);
    }
};

/**
 * Registration event
 * @param callback
 * @return undefined
 */
Module.prototype.configureFactories = function (callback) {
    this.configureFactoryName = this.name + 'ConfigureFactory';

    if (!checkName(this.configureFactoryName)) {
        return;
    }

    Dolphin.container.register(this.configureFactoryName, callback);
};

/**
 * Method for Dolphin, resolve configureFactories
 * @return undefined
 */
Module.prototype.resolveConfigurationFactory = function () {
    if (!this.configureFactoryName) {
        return;
    }
    Dolphin.container.get(this.configureFactoryName);
};

/**
 * Registration event, run functions
 * @param callback
 * @return undefined
 */
Module.prototype.run = function (callback) {
    this.runName = this.name + 'Run';

    if (!checkName(this.runName)) {
        return;
    }

    Dolphin.container.register(this.runName, callback);
};

/**
 * Resolve all run functions
 * @return undefined
 */
Module.prototype.resolveRun = function () {
    if (!this.runName) {
        return;
    }
    Dolphin.container.get(this.runName);
};

module.exports = Module;