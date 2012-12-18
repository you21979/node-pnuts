/** 
 * @fileOverview ハッシュ操作クラス(bitmask版)
 */
"use strict";
var assert = require('assert');
var Class = require(__dirname+'/../util').Class;

var MAXBITSIZE = 16;

// ハッシュ関数
var HashFunctionBitMask = function(data,mask){
    var idx = data & mask;
    return idx;
};
// ビットサイズからビットマスクを取得する
var GetBitMask = function(bitsize){
    var x = 0;
    for(var i=0; i<bitsize; ++i){
        x |= 1<<i;
    }
    return x;
};
// ハッシュコンテナクラス
var BitHash = module.exports = Class({
    initialize : function(bitsize){
        assert(bitsize <= MAXBITSIZE);
        this.size_ = 0;
        this.table_ = new Array(Math.pow(2,bitsize));
        this.bitmask_ = GetBitMask(bitsize);
        for(var i=0; i<this.table_.length; ++i){
            this.table_[i] = {};
        }
    },
    finalize : function(){
        this.size_ = 0;
        this.bitmask_ = 0;
        for(var i=0; i<this.table_.length; ++i){
            this.table_[i] = null;
        }
        this.table_ = null;
    },
    get : function(key){
        assert(typeof key == 'number');
        var idx = HashFunctionBitMask(key, this.bitmask_);
        assert(idx < this.table_.length);
        if(this.table_[idx][key] !== undefined){
            return this.table_[idx][key];
        }
        return null;
    },
    set : function(key,value){
        if(this.isExist(key)){
            return false;
        }
        assert(typeof key == 'number');
        var idx = HashFunctionBitMask(key, this.bitmask_);
        assert(idx < this.table_.length);
        this.table_[idx][key] = value;
        ++this.size_;
        return true;
    },
    isExist : function(key){
        assert(typeof key == 'number');
        var idx = HashFunctionBitMask(key, this.bitmask_);
        assert(idx < this.table_.length);
        if(this.table_[idx][key] !== undefined){
            return true;
        }
        return false;
    },
    remove : function(key){
        assert(typeof key == 'number');
        var idx = HashFunctionBitMask(key, this.bitmask_);
        assert(idx < this.table_.length);
        if(this.table_[idx][key] !== undefined){
            delete this.table_[idx][key];
            --this.size_;
            return true;
        }
        return false;
    },
    size : function(){
        return this.size_;
    },
    // 基本遅いから使うな
    scan : function(callback){
        var n = this.table_.length;
        for(var i=0; i<n; ++i){
            for(var k in this.table_[i]){
                callback(k, this.table_[i][k]);
            }
        }
    },
});
/*
var max = 1000000;
var x = new BitHash(12);
for(var i=0;i<max;++i){
    x.set(i,"hogehoge");
}
x.scan(function(obj){
    //console.log(obj);
});
for(var i=0;i<1000000;++i){
    var o=x.get(i);
    if(i%10000===0)
    console.log("%d=%s",i,o);
}
for(var i=0;i<max;++i){
    x.remove(i);
}
x.finalize();
*/
