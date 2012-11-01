var PNuts = require('..'),
    Binary = PNuts.serialize.Binary;

var assert = require('assert');

var Pack = Binary.Serializer.extends({
    initialize : function(maxsize){
        Binary.Serializer.call(this,maxsize);
    },
});
var Unpack = Binary.Deserializer.extends({
    initialize : function(buffer){
        Binary.Deserializer.call(this,buffer);
    },
});
[
function(MAX){
    var p = new Pack(MAX*4);
    var TID = MAX+':Pack';
    console.time(TID);
    for(var i=0; i<MAX; ++i){
        p.push_int32(i);
    }
    console.timeEnd(TID);
    var u = new Unpack(p.getBuffer());
    var TID = MAX+':Unpack';
    console.time(TID);
    for(var i=0; i<MAX; ++i){
        var num = u.pop_int32();
        assert(num === i);
    }
    console.timeEnd(TID);
}
].forEach(function(fnc){
    [1,100,1000,5000,10000,50000,100000].forEach(function(MAX){
        var TID = MAX+':SUM';
        console.time(TID);
        fnc(MAX);
        console.timeEnd(TID);
    });
});
