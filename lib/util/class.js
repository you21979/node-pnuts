/**
 *  クラス定義
 */
"use strict";

// コンストラクタ作成
var CreateConstructor = function(superclass, classdef){
    var constructor = function(){
        if(this instanceof constructor){
            constructor.prototype.initialize.apply(this, arguments);
            return;
        }
        return new constructor();
    };
    constructor.extends = function(classdef){
        return Class(constructor, classdef);
    };
    constructor.implements = function(classdef){
        for(var name in classdef){
            if(typeof constructor.prototype[name] !== 'function'){
                throw new Error('Nothing Method:' + name);
            }
        }
        return constructor;
    };
    constructor.mixin = function(mixindef){
        for(var name in mixindef){
            if(classdef[name]){
                throw new Error('Exist Property:' + name);
            }
            constructor.prototype[name] = mixindef[name];
        }
        return constructor;
    };
    constructor.toSingleton = (function(){
        var instance = null;
        var p = function(){
        };
        p.prototype.initialize = function(){
            if(!instance){
                var args = [null];
                for(var k in arguments){
                    args.push(arguments[k]);
                }
                instance = new (constructor.bind.apply(constructor, args));
            }
            return instance;
        };
        p.prototype.finalize = function(){
            if(instance){
                if(instance.finalize){
                    instance.finalize();
                }
                instance = null;
            }
        };
        p.prototype.__defineGetter__('instance', function(){
            if(!instance){
                instance = new constructor();
            }
            return instance;
        });
        return function(){
            return new p();
        };
    })();
    constructor.prototype = Object.create(superclass.prototype, classdef);
    if(constructor.prototype.initialize == null){
        constructor.prototype.initialize = function(){
            superclass.apply(this, arguments);
        };
    }
    if(constructor.prototype.finalize == null){
        constructor.prototype.finalize = function(){
        };
    }
    constructor.prototype.constructor = constructor;
    Object.freeze(constructor);
    return constructor;
}

// クラス作成
var Class = module.exports = function (superclass, classdef){
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
    return CreateConstructor(superclass, classdef);
};
