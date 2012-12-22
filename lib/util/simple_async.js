/**
 *  @fileOverview シンプルな同期制御
 */
"use strict";
var Class = require(__dirname + '/class');
var assert = require('assert');

/**
 * @class シンプルな同期制御
 * @param {Function} completeCB 同期完了時に呼ばれるコールバック関数
 */
var SimpleAsync = module.exports = Class({
    /**
     * コンストラクタ
     */
    initialize : function(completeCB){
        this.completeCB_ = completeCB;
        this.count_ = 0;
    },
    /**
     * 同期カウンタを増やす
     */
    inc : function(){
        ++this.count_;
    },
    /**
     * 同期カウンタを減らす
     */
    dec : function(){
        --this.count_;
        assert(this.count_ >= 0);
        if(this.count_ === 0){
            this.completeCB_();
        }
    },
});
