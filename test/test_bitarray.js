//
//  １０万件以上の削除が遅い
//
var PNuts = require('..'),
    BitArray = PNuts.util.BitArray;

var assert = require('assert');

[
function(MAX){
    var copy = new BitArray(MAX);
    for(var i=0;i<MAX;++i){
        copy.set(i);
        copy.clear(i);
    }
},
function(MAX){
    var flags = new BitArray(1000);
    assert(flags.check(1000) === false);//フラグ数オーバー
    assert(flags.get(100) === false);
    flags.set(100);
    assert(flags.get(100) === true);
    flags.clear(100);
    assert(flags.get(100) === false);
    flags.clear(101);
    assert(flags.get(101) === false);
    flags.clear(101);
    assert(flags.get(101) === false);
    flags.set(999);
    var copy = new BitArray(1000);
    copy.fromString(flags.toString());
    assert(copy.get(999) === true);
    assert(flags.toString() === copy.toString());
}
].forEach(function(fnc){
    [32,1024,65535].forEach(function(MAX){
        var TID = MAX+':SUM';
        console.time(TID);
        fnc(MAX);
        console.timeEnd(TID);
    });
});
