var PNuts = require('..'),
    Binary = PNuts.serialize.Binary;

var assert = require('assert');

var MyData = function(){
    this.hoge = 0; 
    this.fuga = '';
    this.piyo = [];
    this.count = 0;
};

var Pack = Binary.Serializer.extends({
    initialize : function(maxsize){
        Binary.Serializer.call(this,maxsize);
    },
    begin : function(){
        this.push_int32(0);
    },
    end : function(){
        var old = this.pos_;
        this.pos_ = 0;
        this.push_int32(old);
        this.pos_ = old;
    },
    push_mydata : function(data){
        if(data instanceof MyData){
            this.push_int16(data.hoge);
            this.push_string(data.fuga);
            var len = data.piyo.length;
            this.push_int16(len);
            for(var i = 0; i<len; ++i){
                this.push_int8(data.piyo[i]);
            }
            this.push_int32(data.count);
        }
    },
});
var Unpack = Binary.Deserializer.extends({
    initialize : function(buffer){
        Binary.Deserializer.call(this,buffer);
    },
    pop_header : function(){
        return this.pop_int32();
    },
    pop_mydata : function(){
        var w = new MyData();
        w.hoge = this.pop_int16();
        w.fuga = this.pop_string();
        var len = this.pop_int16(len);
        w.piyo = new Array(len);
        for(var i = 0; i<len; ++i){
            w.piyo[i] = this.pop_int8();
        }
        w.count = this.pop_int32();
        return w;
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
},
function(MAX){
    var mydata = new MyData();
    mydata.hoge = 1024; 
    mydata.fuga = 'hogehogemogamoga';
    mydata.piyo = [1,2,3,4,5];
    mydata.count = 0;

    var p = new Pack(5120000);
    var TID = MAX+':Pack';
    console.time(TID);
    p.begin();
    for(var i=0; i<MAX; ++i){
        ++mydata.count;
        p.push_mydata(mydata);
    }
    p.end();
    console.timeEnd(TID);
    var u = new Unpack(p.getBuffer());
    var TID = MAX+':Unpack';
    console.time(TID);
    var header = u.pop_header();
    console.log('%s Byte',header);
    for(var i=0; i<MAX; ++i){
        var w = u.pop_mydata();
        assert(w.hoge === mydata.hoge);
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
