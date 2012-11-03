/** 
 * @fileOverview 配列を大きなビットとして扱うクラス
 */
"use strict";
var assert = require('assert');
var Class = require(__dirname+'/../util').Class.create;

// 配列一つに入るビットの数
var BITS = 32;
// フラグ数から配列のサイズを求める
var getArraySize = function(flagmax){
    return Math.ceil(flagmax/BITS);
};
// フラグ番号から配列の位置を求める
var getArrayIndex = function(no){
    return Math.floor(no/BITS);
};
// フラグ番号から実際のフラグの位置を求める
var getFlagPos = function(no){
    return no % BITS;
};
// 数値からヘックスの文字列にする
var NumberToHexString = function(num,digit){
    var digitfix = function(str, b){
        if(str.length < b ){
            var len = b - str.length;
            for(var i = 0; i < len; ++i){
                str = '0' + str;
            }
        }
        return str;
    }
    var hexconv = function(n){
        switch (n) {
            case 10: return 'A';
            case 11: return 'B';
            case 12: return 'C';
            case 13: return 'D';
            case 14: return 'E';
            case 15: return 'F';
        }
        return n.toString();
    }
    var remainder=0;
    var str = '';
    while (num > 0) {
        remainder = num % 16;
        num = (num - remainder) / 16;
        str = hexconv(remainder) + str;
    }
    return digitfix(str, digit);
}
// ビットフラグ配列を扱うクラス
var BitArray = Class({
    // コンストラクタ
    initialize : function(flagmax){
        this.flagmax_ = flagmax;
        var size = getArraySize(this.flagmax_);
        this.flags_ = new Uint32Array(size);
        for(var i=0; i<size; ++i){
            this.flags_[i] = 0;
        }
    },
    // 番地が有効かどうか
    check : function(no){
        if(!(this.flagmax_ > no)){
            return false;
        }
        var idx = getArrayIndex(no);
        if(!(idx >= 0 && idx < this.flags_.length)){
            return false;
        }
        return true;
    },
    // 指定した番地にフラグをセットする
    set : function(no){
        assert(this.flagmax_ > no, 'set:over flagmax');
        var idx = getArrayIndex(no);
        assert(idx >= 0 && idx < this.flags_.length, 'set:over idx range');
        var pos = getFlagPos(no);
        var flag = 1 << pos;
        this.flags_[idx] |= flag;
    },
    // 指定した番地のフラグをクリアする
    clear : function(no){
        assert(this.flagmax_ > no, 'clear:over flagmax');
        var idx = getArrayIndex(no);
        assert(idx >= 0 && idx < this.flags_.length, 'clear:over idx range');
        var pos = getFlagPos(no);
        var flag = 1 << pos;
        if(this.flags_[idx] & flag ? true : false){
            this.flags_[idx] ^= flag;
        }
    },
    // 指定した番地のフラグを取得する
    get : function(no){
        assert(this.flagmax_ > no, 'get:over flagmax');
        var idx = getArrayIndex(no);
        assert(idx >= 0 && idx < this.flags_.length, 'get:over idx range');
        var pos = getFlagPos(no);
        var flag = 1 << pos;
        return this.flags_[idx] & flag ? true : false;
    },
    // フラグ情報を文字列に変換（16進数）
    toString : function(){
        var str = '';
        var n = this.flags_.length;
        for(var i=n-1;i>=0;--i){
            str = str + NumberToHexString(this.flags_[i],8);
        }
        return str;
    },
    // フラグ情報に文字列から復元（16進数）
    fromString : function(str){
        var s = 8;
        var b = str.length-s;
        var e = str.length-0;
        var n = str.length/s;
        for(var i=0;i<n;++i){
            this.flags_[i] = parseInt(str.substring(b,e),16);
            b -= s;
            e -= s;
        }
    },
    // フラグ配列を取得
    getArray : function(){
    	return this.flags_;
    },
});
module.exports = BitArray;
