/** 
 * @fileOverview バイナリシリアライザー／デシリアライザー
 * 64ビットは継承して。
 */
"use strict";
var Binary = exports;
var Class = require(__dirname+"/../util").Class.create;

// 変数のサイズ
var TYPE_SIZE = {
    INT8 : 1,
    INT16 : 2,
    INT32 : 4,
    INT64 : 8,
    UINT8 : 1,
    UINT16 : 2,
    UINT32 : 4,
    UINT64 : 8,
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
        this.error_ = false;
        this.encode_ = DEFAULT.ENCODE;
        this.pos_ = 0;
        this.buf_.fill(0);
    },
    finalize : function(){
        this.buf_ = null;
    },
    reset : function(){
        this.pos_ = 0;
        this.error_ = false;
    },
    // シリアライズ済みバッファの取得
    getBuffer : function(){
        return this.buf_;
    },
    // シリアライズしたサイズの取得
    getByteSize : function(){
        return this.pos_;
    },
    push_int8 : function(val){
        var size = TYPE_SIZE.INT8;
        if(this.buf_.length < this.pos_ + size){
            this.error_ = true;
            return;
        }
        this.buf_.writeInt8(val,this.pos_);
        this.pos_ += size;
    },
    push_uint8 : function(val){
        var size = TYPE_SIZE.UINT8;
        if(this.buf_.length < this.pos_ + size){
            this.error_ = true;
            return;
        }
        this.buf_.writeUInt8(val,this.pos_);
        this.pos_ += size;
    },
    push_int16 : function(val){
        var size = TYPE_SIZE.INT16;
        if(this.buf_.length < this.pos_ + size){
            this.error_ = true;
            return;
        }
        this.buf_.writeInt16BE(val,this.pos_);
        this.pos_ += size;
    },
    push_uint16 : function(val){
        var size = TYPE_SIZE.UINT16;
        if(this.buf_.length < this.pos_ + size){
            this.error_ = true;
            return;
        }
        this.buf_.writeUInt16BE(val,this.pos_);
        this.pos_ += size;
    },
    push_int32 : function(val){
        var size = TYPE_SIZE.INT32;
        if(this.buf_.length < this.pos_ + size){
            this.error_ = true;
            return;
        }
        this.buf_.writeInt32BE(val,this.pos_);
        this.pos_ += size;
    },
    push_uint32 : function(val){
        var size = TYPE_SIZE.UINT32;
        if(this.buf_.length < this.pos_ + size){
            this.error_ = true;
            return;
        }
        this.buf_.writeUInt32BE(val,this.pos_);
        this.pos_ += size;
    },
    push_int64 : function(val){
        this.error_ = true;
        return;
    },
    push_uint64 : function(val){
        this.error_ = true;
        return;
    },
    push_float : function(val){
        var size = TYPE_SIZE.FLOAT;
        if(this.buf_.length < this.pos_ + size){
            this.error_ = true;
            return;
        }
        this.buf_.writeFloatBE(val,this.pos_);
        this.pos_ += size;
    },
    push_double : function(val){
        var size = TYPE_SIZE.DOUBLE;
        if(this.buf_.length < this.pos_ + size){
            this.error_ = true;
            return;
        }
        var ret = this.buf_.writeDoubleBE(this.pos_);
        this.pos_ += size;
    },
    push_string : function(val,max){
        var size = Buffer.byteLength(val, this.encode_);
        if(size > max){
            this.error_ = true;
            return;
        }
        this.push_uint16(size);
        this.buf_.write(val, this.pos_, size, this.encode_);
        this.pos_ += size;
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
        this.error_ = false;
    },
    finalize : function(){
        this.buf_ = null;
    },
    reset : function(){
    },
    pop_int8 : function(){
        var size = TYPE_SIZE.INT8;
        if(this.buf_.length < this.pos_+size){
            this.error_ = true;
            return null;
        }
        var ret = this.buf_.readInt8(this.pos_);
        this.pos_ += size;
        return ret;
    },
    pop_uint8 : function(){
        var size = TYPE_SIZE.UINT8;
        if(this.buf_.length < this.pos_+size){
            this.error_ = true;
            return null;
        }
        var ret = this.buf_.readUInt8(this.pos_);
        this.pos_ += size;
        return ret;
    },
    pop_int16 : function(){
        var size = TYPE_SIZE.INT16;
        if(this.buf_.length < this.pos_+size){
            this.error_ = true;
            return null;
        }
        var ret = this.buf_.readInt16BE(this.pos_);
        this.pos_ += size;
        return ret;
    },
    pop_uint16 : function(){
        var size = TYPE_SIZE.UINT16;
        if(this.buf_.length < this.pos_+size){
            this.error_ = true;
            return null;
        }
        var ret = this.buf_.readUInt16BE(this.pos_);
        this.pos_ += size;
        return ret;
    },
    pop_int32 : function(){
        var size = TYPE_SIZE.INT32;
        if(this.buf_.length < this.pos_+size){
            this.error_ = true;
            return null;
        }
        var ret = this.buf_.readInt32BE(this.pos_);
        this.pos_ += size;
        return ret;
    },
    pop_uint32 : function(){
        var size = TYPE_SIZE.UINT32;
        if(this.buf_.length < this.pos_+size){
            this.error_ = true;
            return null;
        }
        var ret = this.buf_.readUInt32BE(this.pos_);
        this.pos_ += size;
        return ret;
    },
    pop_int64 : function(){
        this.error_ = true;
        return null;
    },
    pop_uint64 : function(){
        this.error_ = true;
        return null;
    },
    pop_float : function(){
        var size = TYPE_SIZE.FLOAT;
        if(this.buf_.length < this.pos_+size){
            this.error_ = true;
            return null;
        }
        var ret = this.buf_.readFloatBE(this.pos_);
        this.pos_ += size;
        return ret;
    },
    pop_double : function(){
        var size = TYPE_SIZE.DOUBLE;
        if(this.buf_.length < this.pos_+size){
            this.error_ = true;
            return null;
        }
        var ret = this.buf_.readDoubleBE(this.pos_);
        this.pos_ += size;
        return ret;
    },
    pop_string : function(max){
        var size = this.pop_uint16();
        if(size > max){
            this.error_ = true;
            return null;
        }
        if(this.buf_.length < this.pos_+size){
            this.error_ = true;
            return null;
        }
        var ret = this.buf_.toString(this.encode_,this.pos_, this.pos_+size);
        this.pos_ += size;
        return ret;
    },
});

