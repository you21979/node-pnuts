var PNuts = require('..'),
    Singleton = PNuts.util.Singleton,
    Class = PNuts.Class;

var assert = require('assert');

var Def = function(){
    this.aaa_ = 'test';
}

var IHoge = {
    Hoge : function(){},
    Fuga : function(){},
    Piyo : function(){},
};
var IMoga = {
    Ugogo : function(){},
};
var Moga = {
    Moga : function(p){
        this.OOOOO = p;
    },
    Ugogo : function(){
        console.log("UHOOOOOOOO");
        console.log(this.OOOOO);
    },
};

var Mix = Class({
    initialize : function(){
        this.bbb_ = 'test';
        this.Moga("aaaaaaa");
    },
}).mixin(Moga);
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
var InfTest = Simple.extends({
    Hoge : function(){},
    Fuga : function(){},
    Piyo : function(){},
    Ugogo : function(){},
}).imprements(IHoge).imprements(IMoga);
var InfFinal = InfTest.extends({}).imprements(IHoge);

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
    var x = new Mix();
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
    var x = new InfTest();
},
function(){
    var x = new InfFinal();
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
