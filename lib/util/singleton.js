/**
 *  シングルトン定義
 */
"use strict";
var assert = require('assert');
var Class = require(__dirname + '/class');

var singleton = (function(superclass,classdef) {
    var constructor = Class.create(superclass,classdef);
    var instance = null;

    function initialize(){
        if(instance === null){
            instance = new constructor();
        }
    };
    function finalize(){
        if(instance){
            instance.finalize();
            instance = null;
        }
    };
    function getInstance(){
        if(instance === null){
            instance = new constructor();
        }
        return instance;
    };
    return {
        initialize : initialize,
        finalize : finalize,
        get : getInstance,
    };
});
module.exports = singleton;
