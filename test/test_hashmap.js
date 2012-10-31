//
//  １０万件以上の削除が遅い
//
var PNuts = require('..'),
    Hash = PNuts.collection.HashMap;

var assert = require('assert');

[
function(MAX){
    // メモリ確保テスト
    var h = new Hash();
    var TID = MAX+':ALLOC';
    console.time(TID);
    for(var i=0;i<MAX;++i){
        h.set(i,'hoge');
    }
    console.timeEnd(TID);

    // スキャンテスト
    var TID = MAX+':SCAN';
    console.time(TID);
    var i = 0;
    h.scan(function(key,value){                                                                                                                  
        assert(i.toString() === key);
        assert(value === 'hoge');
        ++i;
        return true;
    });
    assert(i === MAX);
    console.timeEnd(TID);

    // メモリ削除テスト
    var TID = MAX+':DELETE';
    console.time(TID);
    for(var i=0;i<MAX;++i){
        h.remove(i);
    }
    console.timeEnd(TID);
}
].forEach(function(fnc){
    [1,1000,10000,100000].forEach(function(MAX){
        var TID = MAX+':SUM';
        console.time(TID);
        fnc(MAX);
        console.timeEnd(TID);
    });
});

