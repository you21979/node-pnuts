/** 
 * @fileOverview キュー操作クラス
 */
"use strict";
var assert = require('assert');
var Class = require(__dirname+'/../util').Class;
var LinkedList = require(__dirname+'/linkedlist');


var List = module.exports = Class({
    // コンストラクタ
    initialize : function(){
        this.list_ = new LinkedList.Manager();
    },
    // 後始末
    finalize : function(){
        this.list_ = null;
    },
    push : function(o){
        var n = new LinkedList.Node();
        n.data = o;
        this.list_.pushTail(n);
    },
    unshift : function(o){
        var n = new LinkedList.Node();
        n.data = o;
        this.list_.pushHead(n);
    },
    pop : function(){
        var data = null;
        if(this.list_.size() > 0){
            var n = this.list_.popTail();
            data = n.data;
            n.data = null;
        }
        return data;
    },
    shift : function(){
        var data = null;
        if(this.list_.size() > 0){
            var n = this.list_.popHead();
            data = n.data;
            n.data = null;
        }
        return data;
    },
    // キューをクリアする
    clear : function(){
        this.list_.finalize();
    },
    // キューの長さを取得する
    size : function(){
        return this.list_.size();
    },
    // キューをスキャンする
    scan : function(callback){
        var i = 0;
        this.list_.scanHead(function(node){
            if(!callback(i++,node.data)){
                return false;
            }
            return true;
        });
        return true;
    },
});
