/** 
 * @fileOverview 双方向リンクドリスト
 */
"use strict";
var assert = require('assert');
var Class = require(__dirname+'/../util').Class;

var LinkedList = exports;

// 引数に指定したノードを自身の後にリンクする
var AfterInsert = function(linked,unlinked){
    assert(isLinked(unlinked) === false, 'AfterInsert:linked node');
    assert(linked !== unlinked, 'AfterInsert:Same node');
    // 後ろにすでにリンク済みノードがあるなら繋ぎかえる
    if(linked.next_){
        linked.next_.prev_ = unlinked;
        unlinked.next_ = linked.next_;
    }
    linked.next_ = unlinked;
    unlinked.prev_ = linked;
};
// 引数に指定したノードを自身の前にリンクする
var BeforeInsert = function(linked,unlinked){
    assert(isLinked(unlinked) === false, 'BeforeInsert:linked node');
    assert(linked !== unlinked, 'BeforeInsert:Same node');
    // 前にすでにリンク済みノードがあるなら繋ぎかえる
    if(linked.prev_){
        linked.prev_.next_ = unlinked;
        unlinked.prev_ = linked.prev_;
    }
    linked.prev_ = unlinked;
    unlinked.next_ = linked;
};
// リンクを解除する
var Unlink = function(linked){
    if(linked.prev_){
        linked.prev_.next_ = linked.next_;
        linked.prev_ = null;
    }
    if(linked.next_){
        linked.next_.prev_ = linked.prev_;
        linked.next_ = null;
    }
};
var isLinked = function(node){
    if(node.prev_ || node.next_){
        return true;
    }
    return false;
};

/**
 *  Node
 */
LinkedList.MXNode = {
    MXNode : function(){
        this.next_ = null;
        this.prev_ = null;
    },
    next : function(){ return this.next_; },
    prev : function(){ return this.prev_; },
    isLinked : function(){ return isLinked(this); },
};

LinkedList.Node = Class({
    initialize : function(){
        this.MXNode();
        this.data = null;
    },
}).mixin(LinkedList.MXNode);


/**
 *  ノード管理
 */
LinkedList.Manager = Class({
    // コンストラクタ
    initialize : function(){
        this.head_ = null;  // 頭
        this.tail_ = null;  // 尾
        this.length_ = 0;   // 長さ
    },
    // 後始末
    finalize : function(){
        var w = null;
        while((w = this.popHead()) !== null){
            w.finalize();
        }
        this.head_ = null;
        this.tail_ = null;
        this.length_ = 0;
    },
    // 管理してるノード数を取得
    size : function(){
        return this.length_;
    },
    // 一番前を取得
    head : function(){
        return this.head_;
    },
    // 一番後ろを取得
    tail : function(){
        return this.tail_;
    },
    // 一番後ろに挿入する
    pushTail : function(node){
        if(this.tail_){
            AfterInsert(this.tail_, node);
        }
        if(this.head_ === null){
            this.head_ = node;
        }
        this.tail_ = node;
        ++this.length_;
    },
    // 一番前に挿入する
    pushHead : function(node){
        if(this.head_){
            BeforeInsert(this.head_, node);
        }
        if(this.tail_ === null){
            this.tail_ = node;
        }
        this.head_ = node;
        ++this.length_;
    },
    // 一番前から取り出す
    popHead : function(){
        var node = null;
        if(this.length_){
            node = this.head_;
            this.head_ = node.next();
            Unlink(node);
            --this.length_;
            if(this.head_ === null){
                this.tail_ = null;
            }
        }
        return node;
    },
    // 一番後から取り出す
    popTail : function(){
        var node = null;
        if(this.length_){
            node = this.tail_;
            this.tail_ = node.prev();
            Unlink(node);
            --this.length_;
            if(this.tail_ === null){
                this.head_ = null;
            }
        }
        return node;
    },
    // 指定したノードの後ろに新規にノードをリンクする
    // 主にスキャン中に使う
    afterInsert : function(currentnode,newnode){
        AfterInsert(currentnode, newnode);
        if(this.tail_ === currentnode){
            this.tail_ = newnode;
        }
        ++this.length_;
    },
    // 指定したノードの前に新規にノードをリンクする
    // 主にスキャン中に使う
    beforeInsert : function(currentnode,newnode){
        BeforeInsert(currentnode, newnode);
        if(this.head_ === currentnode){
            this.head_ = newnode;
        }
        ++this.length_;
    },
    // 前からスキャンする
    scanHead : function(callback){
        var node = this.head_;
        var work = null;
        while(node){
            work = node.next();
            if(!callback(node)){
                return node;
            }
            node = work;
        }
        return null;
    },
    // 後ろからスキャンする
    scanTail : function(callback){
        var node = this.tail_;
        var work = null;
        while(node){
            work = node.prev();
            if(!callback(node)){
                return node;
            }
            node = work;
        }
        return null;
    },
    // 指定したノードをリンクからはずす
    unlink : function(node){
        if(this.length_ > 0){
            if(node === this.head_){
                this.head_ = node.next();
                if(this.head_ === null){
                    this.tail_ = null;
                }
            }
            if(node === this.tail_){
                this.tail_ = node.prev();
                if(this.tail_ === null){
                    this.head_ = null;
                }
            }
            Unlink(node);
            --this.length_;
        }
    },
});
