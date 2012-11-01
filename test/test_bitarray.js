//
//  １０万件以上の削除が遅い
//
var PNuts = require('..'),
    BitArray = PNuts.util.BitArray;

var assert = require('assert');

[
function(){
/*
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
    console.log(copy.getArray());
    copy.set(60);
    copy.set(1);
    console.log(copy.toString());
*/
    var MAX = 33;
    var copy = new BitArray(MAX);
    for(var i=0;i<MAX;++i){
        copy.set(i);
    }
    console.log(copy.getArray());
    console.log(copy.toString());
}
].forEach(function(fnc){
    var TID = 'SUM';
    console.time(TID);
    fnc();
    console.timeEnd(TID);
});
