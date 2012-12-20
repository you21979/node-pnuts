/** 
 * @fileOverview バイナリシリアライザー／デシリアライザー
 * 64ビットは継承して。
 */
"use strict";
var Binary = exports;
var Class = require(__dirname+"/../util").Class;

// 変数のサイズ
var TYPE_SIZE = {
    INT8 : 1,
    INT16 : 2,
    INT32 : 4,
    UINT8 : 1,
    UINT16 : 2,
    UINT32 : 4,
    FLOAT : 4,
    DOUBLE : 8,
};
var DEFAULT = {
    ENCODE : 'utf8',
};

// ---------------------------------------
// シリアライザー
// ---------------------------------------
Binary.Serializer = Class({
    initialize : function(maxsize){
        this.buf_ = new Buffer(maxsize);
        this.encode_ = DEFAULT.ENCODE;
        this.pos_ = 0;
//        this.buf_.fill(0);
    },
    finalize : function(){
        this.buf_ = null;
    },
    reset : function(){
        this.pos_ = 0;
    },
    // シリアライズ済みバッファの取得
    getBuffer : function(){
        return this.buf_.slice(0, this.pos_);
    },
    // シリアライズしたサイズの取得
    getByteSize : function(){
        return this.pos_;
    },
    // バイナリデータのコピーを作る
    copy : function(){
        var newbuff = new Buffer( this.pos_ );
        return this.copyToBuff(newbuff, 0);
    },
    // バイナリデータのコピーを指定したバッファの指定した位置にコピーする
    copyToBuff : function(buff, pos){
        this.buf_.copy( buff, pos, 0, this.pos_ );
        return buff;
    },
    // 書き込む前にサイズを確認する
    checkBufferSize : function(size){
        if(this.buf_.length < this.pos_ + size){
            throw new Error('buffer size over');
        }
    },
    // 指定した場所に移動する。クロージャを処理したあと元の場所に戻る
    setPositionPush : function(pos, pusher){
        var old = this.pos_;
        this.pos_ = pos;
        pusher();
        this.pos_ = old;
    },
    // int8[1byte]
    push_int8 : function(val){
        var old = this.pos_;
        var size = TYPE_SIZE.INT8;
        this.checkBufferSize(size);
        this.buf_.writeInt8(val,this.pos_);
        this.pos_ += size;
        return old;
    },
    // uint8[1byte]
    push_uint8 : function(val){
        var old = this.pos_;
        var size = TYPE_SIZE.UINT8;
        this.checkBufferSize(size);
        this.buf_.writeUInt8(val,this.pos_);
        this.pos_ += size;
        return old;
    },
    // int16[2byte]
    push_int16 : function(val){
        var old = this.pos_;
        var size = TYPE_SIZE.INT16;
        this.checkBufferSize(size);
        this.buf_.writeInt16BE(val,this.pos_);
        this.pos_ += size;
        return old;
    },
    // uint16[2byte]
    push_uint16 : function(val){
        var old = this.pos_;
        var size = TYPE_SIZE.UINT16;
        this.checkBufferSize(size);
        this.buf_.writeUInt16BE(val,this.pos_);
        this.pos_ += size;
        return old;
    },
    // int32[4byte]
    push_int32 : function(val){
        var old = this.pos_;
        var size = TYPE_SIZE.INT32;
        this.checkBufferSize(size);
        this.buf_.writeInt32BE(val,this.pos_);
        this.pos_ += size;
        return old;
    },
    // uint32[4byte]
    push_uint32 : function(val){
        var old = this.pos_;
        var size = TYPE_SIZE.UINT32;
        this.checkBufferSize(size);
        this.buf_.writeUInt32BE(val,this.pos_);
        this.pos_ += size;
        return old;
    },
    // float[4byte]
    push_float : function(val){
        var old = this.pos_;
        var size = TYPE_SIZE.FLOAT;
        this.checkBufferSize(size);
        this.buf_.writeFloatBE(val,this.pos_);
        this.pos_ += size;
        return old;
    },
    // double[8byte]
    push_double : function(val){
        var old = this.pos_;
        var size = TYPE_SIZE.DOUBLE;
        this.checkBufferSize(size);
        this.buf_.writeDoubleBE(val,this.pos_);
        this.pos_ += size;
        return old;
    },
    // string[2byte+variable]
    push_string : function(val,max){
        var old = this.pos_;
        if(max === undefined){
            max = 1024;
        }
        var size = Buffer.byteLength(val, this.encode_);
        if(size > max){
            throw new Error('string max over');
        }
        this.checkBufferSize(TYPE_SIZE.UINT16 + size);
        this.push_uint16(size);
        this.buf_.write(val, this.pos_, size, this.encode_);
        this.pos_ += size;
        return old;
    },
    push_binary : function(val, max){
        var old = this.pos_;
        if(max === undefined){
            max = 1024;
        }
        var size = val.length;
        if(size > max){
            throw new Error('byte max over');
        }
        this.checkBufferSize(TYPE_SIZE.UINT16 + size);
        this.push_uint16(size);
        val.copy(this.buf_, this.pos_, 0, size);
        this.pos_ += size;
        return old;
    },
    // array[2byte+variable]
    push_array : function(params,callback){
        var old = this.pos_;
        if(!(params instanceof Array)){
            throw new Error('param is no array');
        }
        var len = params.length;
        this.push_uint16(len);
        for(var i=0; i < len; ++i){
            callback(params[i]);
        }
        return old;
    },
});
// ---------------------------------------
// デシリアライザー
// ---------------------------------------
Binary.Deserializer = Class({
    initialize : function(buffer){
        this.buf_ = buffer;
        this.pos_ = 0;
        this.encode_ = DEFAULT.ENCODE;
    },
    finalize : function(){
        this.buf_ = null;
    },
    reset : function(){
    },
    checkBufferSize : function(size){
        if(this.buf_.length < this.pos_ + size){
            throw new Error('buffer size over');
        }
    },
    pop_int8 : function(){
        var size = TYPE_SIZE.INT8;
        this.checkBufferSize(size);
        var ret = this.buf_.readInt8(this.pos_);
        this.pos_ += size;
        return ret;
    },
    pop_uint8 : function(){
        var size = TYPE_SIZE.UINT8;
        this.checkBufferSize(size);
        var ret = this.buf_.readUInt8(this.pos_);
        this.pos_ += size;
        return ret;
    },
    pop_int16 : function(){
        var size = TYPE_SIZE.INT16;
        this.checkBufferSize(size);
        var ret = this.buf_.readInt16BE(this.pos_);
        this.pos_ += size;
        return ret;
    },
    pop_uint16 : function(){
        var size = TYPE_SIZE.UINT16;
        this.checkBufferSize(size);
        var ret = this.buf_.readUInt16BE(this.pos_);
        this.pos_ += size;
        return ret;
    },
    pop_int32 : function(){
        var size = TYPE_SIZE.INT32;
        this.checkBufferSize(size);
        var ret = this.buf_.readInt32BE(this.pos_);
        this.pos_ += size;
        return ret;
    },
    pop_uint32 : function(){
        var size = TYPE_SIZE.UINT32;
        this.checkBufferSize(size);
        var ret = this.buf_.readUInt32BE(this.pos_);
        this.pos_ += size;
        return ret;
    },
    pop_float : function(){
        var size = TYPE_SIZE.FLOAT;
        this.checkBufferSize(size);
        var ret = this.buf_.readFloatBE(this.pos_);
        this.pos_ += size;
        return ret;
    },
    pop_double : function(){
        var size = TYPE_SIZE.DOUBLE;
        this.checkBufferSize(size);
        var ret = this.buf_.readDoubleBE(this.pos_);
        this.pos_ += size;
        return ret;
    },
    pop_string : function(max){
        var size = this.pop_uint16();
        if(size > max){
            throw new Error('string max over');
        }
        this.checkBufferSize(size);
        var ret = this.buf_.toString(this.encode_,this.pos_, this.pos_+size);
        this.pos_ += size;
        return ret;
    },
    pop_binary : function(max){
        var size = this.pop_uint16();
        if(size > max){
            throw new Error('string max over');
        }
        this.checkBufferSize(size);
        var buff = new Buffer(size);
        var ret = this.buf_.copy(buff, 0, this.pos_, this.pos_+size);
        this.pos_ += size;
        return ret;
    },
    pop_array : function(callback){
        var len = this.pop_uint16();
        var params = new Array(len);
        for(var i=0; i < len; ++i){
            params[i] = callback();
        }
        return params;
    },
});

