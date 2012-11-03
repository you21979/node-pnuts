var PNuts = require('..'),
    Singleton = PNuts.util.Singleton,
    Class = PNuts.Class;

var assert = require('assert');

var Def = function(){
    this.aaa_ = 'test';
}

var Simple = Class({
    initialize : function(){
        this.aaa_ = 'test';
    },
    get : function(){
        return this.aaa_;
    },
});
var Complex1 = Simple.extends({});
var Complex2 = Complex1.extends({});
var Complex3 = Complex2.extends({});
var Complex4 = Complex3.extends({});
var Complex5 = Complex4.extends({});
var Complex6 = Complex5.extends({});
var Complex7 = Complex6.extends({});

var S = Singleton(Simple,{});
var C7 = Singleton(Complex7,{});

[
function(){
    var x = {
        aaa_ : 'test'
    };
},
function(){
    var x = new Def();
},
function(){
    var x = new Simple();
},
function(){
    var x = new Complex1();
},
function(){
    var x = new Complex2();
},
function(){
    var x = new Complex3();
},
function(){
    var x = new Complex4();
},
function(){
    var x = new Complex5();
},
function(){
    var x = new Complex6();
},
function(){
    var x = new Complex7();
},
function(){
    var x = C7.get();
},
function(){
    var x = S.get();
}
].forEach(function(fnc){
    var TID = 'SUM';
    console.time(TID);
    for(var i=0;i<10000000;++i){
        fnc();
    };
    console.timeEnd(TID);
});
