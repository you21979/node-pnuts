var PNuts = require('..'),
    Singleton = PNuts.util.Singleton,
    Class = PNuts.Class;

var assert = require('assert');

[
function(){
    var Simple = Class({
        initialize : function(){
            this.aaa_ = 'test';
        },
        get : function(){
            return this.aaa_;
        },
    });
    var x = new Simple();
    assert(x.get() === 'test');

    var Complex = Simple.extends({
        initialize : function(){
            Simple.call(this);
            this.bbb_ = 'xxx';
        },
        get : function(){
            return this.bbb_;
        },
    });
    var xx = new Complex();
    assert(xx.get() === 'xxx');
    assert(xx.aaa_ === 'test');
},
function(){
    var mxHoge = {
        Hoge : function(){
            this.MMM = 'aaaaaa';
        },
        update : function(){
            //console.log(this.MMM);
        },
    };
    var Mixin = Class({
        initialize : function(){
            this.aaa_ = 'test';
            this.Hoge();
        },
    }).mixin(mxHoge);
    var x = new Mixin();
    x.update();
},
function(){
    var Simple = Singleton({
        initialize : function(){
            this.x = 0;
            this.y = 2;
            this.z = 4;
        },
    });
    assert(Simple.get().x === 0);
    assert(Simple.get().y === 2);
    assert(Simple.get().z === 4);

    var Simple2 = Class({
        initialize : function(){
            this.x = 1;
            this.y = 2;
            this.z = 4;
        },
    });
    var Complex = Singleton(Simple2,{});
    assert(Complex.get().x === 1);
    assert(Complex.get().y === 2);
    assert(Complex.get().z === 4);
}
].forEach(function(fnc){
    var TID = 'SUM';
    console.time(TID);
    fnc();
    console.timeEnd(TID);
});
