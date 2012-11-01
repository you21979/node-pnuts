//
//  １０万件以上の削除が遅い
//
var PNuts = require('..'),
    Queue = PNuts.collection.Queue;

var assert = require('assert');

[
function(MAX){
    // メモリ確保テスト
    var q = new Queue();
    var TID = MAX+':ALLOC';
    console.time(TID);
    for(var i=0;i<MAX;++i){
        q.enqueue("aaaa");
    }
    console.timeEnd(TID);

    // スキャンテスト
    var TID = MAX+':SCAN';
    console.time(TID);
    var i = 0;
    q.scan(function(key,value){
        ++i
        return true;
    });
    assert(i === q.size());
    console.timeEnd(TID);

    var TID = MAX+':DELETE';
    console.time(TID);
    var x = null;
    for(var i=0;i<MAX;++i){
        x = q.dequeue();
    }
    assert(q.size() === 0);
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
