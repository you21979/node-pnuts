/** 
 * @fileOverview ハッシュ操作クラス
 * 
 * @note javascipt標準の連想配列
 * 割と削除が遅い。1万件以上のデータには使わないこと。
 */
"use strict";
var assert = require('assert');
var Class = require(__dirname+'/../util').Class;

/**
 * HASHクラス
 */
var HashMap = Class({
    /**
     * コンストラクタ
     */
    initialize : function(){
        this.hash_ = {};
        this.size_ = 0;
    },
    /**
     * サイズの取得
     * @returns {Number} 値
     */
    size : function(){
        return this.size_;
    },
    /**
     * キーから値を取得
     * @param {String} key キー
     * @returns {Valiant} 値
     */
    get : function(key){
        assert(this.isExist(key));
        return this.hash_[key];
    },
    /**
     * キーで値を設定
     * @param {String} key キー
     * @param {Valiant} value 値
     */
    set : function(key,value){
        if(!(key in this.hash_)){
            ++this.size_;
        }
        this.hash_[key] = value;
    },
    /**
     *  キーが存在するかどうか
     * @param {String} key キー
     * @returns {Boolean} 存在可否
     */
    isExist : function(key){
        return (key in this.hash_);
    },
    /**
     * キーを削除
     * @param {String} key キー
     */
    remove : function(key){
        assert(this.isExist(key));
        --this.size_;
        assert(this.size_ >= 0);
        delete this.hash_[key];
    },
    /**
     * スキャン関数
     * 処理関数にfalseを返させると途中で処理を終了する
     * @param {Function} callback 処理関数function(key,value){return true;}
     */
    scan : function(callback){
        var w = this.hash_;
        for(var key in w) if(w.hasOwnProperty(key)){
            if(!callback(key, w[key])){
                return false;
            }
        }
        return true;
    },
});
module.exports = HashMap;
