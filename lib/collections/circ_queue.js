/** 
 * @fileOverview キュー操作クラス
 */
"use strict";
var assert = require('assert');
var Queue = require(__dirname+'/queue');

var CircQueue = module.exports = Queue.extends({
    // コンストラクタ
    initialize : function(){
        Queue.call(this);
    },
    // 後始末
    finalize : function(){
        Queue.prototype.finalize.call(this);
    },
    // 処理を行う
    exec : function(callback){
        this.q_.circuitHead(function(q){
            callback(q.data);
        });
    },
});
