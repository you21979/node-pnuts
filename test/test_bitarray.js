var PNuts = require('..'),
    BitArray = PNuts.util.BitArray;

var assert = require('assert');

[
function(MAX){
    var copy = new BitArray(MAX);
    for(var i=0;i<MAX;++i){
        copy.on(i);
        copy.off(i);
    }
},
function(MAX){
    var flags = new BitArray(1000);
    assert(flags.isRange(1000) === false);//フラグ数オーバー
    assert(flags.is(100) === false);
    flags.on(100);
    assert(flags.is(100) === true);
    flags.off(100);
    assert(flags.is(100) === false);
    flags.off(101);
    assert(flags.is(101) === false);
    flags.off(101);
    assert(flags.is(101) === false);
    flags.on(999);
    var copy = new BitArray(1000);
    copy.fromString(flags.toString());
    assert(copy.is(999) === true);
    assert(flags.toString() === copy.toString());
    flags.on(998);
    flags.on(997);
    flags.on(996);
    assert(flags.isAll([998,997,996]) === true);
    assert(flags.isAll([998,997,995]) === false);
}
].forEach(function(fnc){
    [32,1024,65535].forEach(function(MAX){
        var TID = MAX+':SUM';
        console.time(TID);
        fnc(MAX);
        console.timeEnd(TID);
    });
});
