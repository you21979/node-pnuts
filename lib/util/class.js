/**
 *  クラス定義
 */
"use strict";
var assert = require('assert');

// モジュール定義
var Class = {};

// コンストラクタ作成
Class.CreateConstructor = function(superclass, classdef){
    var constructor = function(){
        if(this instanceof constructor){
            constructor.prototype.initialize.apply(this, arguments);
            return;
        }
        return new constructor();
    };
    constructor.extends = function(classdef){
        return Class.create(constructor, classdef);
    };
    constructor.prototype = Object.create(superclass.prototype, classdef);
    if(constructor.prototype.initialize == null){
        constructor.prototype.initialize = function(){
            superclass.apply(this, arguments);
        };
    }
    Object.freeze(constructor);
    return constructor;
}

// クラス作成
Class.create = function (superclass, classdef){
    if(classdef === undefined){
        classdef = superclass;
        superclass = Object;
    }
    for(var p in classdef){
        if(classdef.hasOwnProperty(p)){
            classdef[p] = {
                value : classdef[p],
                enumerable : true,
                writable : true,
            };
        }
    }
    return Class.CreateConstructor(superclass, classdef);
};
module.exports = Class.create;
