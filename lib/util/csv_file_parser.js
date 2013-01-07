"use strict";
var fs = require('fs');
var Class = require(__dirname+'/class');

// パーステーブルインターフェイス
var IParseTable = exports.IParseTable = {
    // パース開始時に呼ばれる
    onParseBegin : function(){},
    // パース完了時に呼ばれる
    onParseEnd : function(){},
    // パース時に呼ばれる
    doParseCsv : function(line,line_count){},
    // オプション
    getOption : function(){return {};},
};

var DEFAULT = {
    SKIP_MARK : '#',
    SKIP_COUNT : 0,
};

// テーブル読み込み基礎
var Parser = exports.Parser = Class({
    // コンストラクタ
    initialize : function(){
    },
    // パーサーを作成
    createParser : function(iparse_table){
        var self = this;
        var line_count = 0;
        var skip_mark = iparse_table.getOption().skip_mark || DEFAULT.SKIP_MARK;
        var skip_count = iparse_table.getOption().skip_count || DEFAULT.SKIP_COUNT;
        return function(data){
            iparse_table.onParseBegin();
            data.split('\n').forEach(function (line) {
                line = line.replace('\r', '');
                ++line_count;
                if(line.charAt(0) == skip_mark){
                    return;
                }
                if(line_count <= skip_count){
                    return;
                }
                if(line.length === 0){
                    return;
                }
                iparse_table.doParseCsv(line, line_count);
            });
            iparse_table.onParseEnd();
        };
    },
    // 読み込み処理
    readFromCsv: function(filename, iparse_table){
        var csvparser = this.createParser(iparse_table);
        var data = fs.readFileSync(filename, 'utf-8');
        csvparser(data);
        return true;
    },
    // テーブルデータを取得
    getTable : function(){
        return null;
    },
});

// 基礎テーブル
var BaseParseTable = exports.BaseParseTable = Class({
    // データを解析して構造を作る
    create : function(tok, line_count){
    },

    // パース開始時に呼ばれる
    onParseBegin : function(){
    },
    // パース完了時に呼ばれる
    onParseEnd : function(){
    },
    // パース時に呼ばれる
    doParseCsv : function(line,line_count){
        var tok = line.split(',');
        this.create(tok, line_count);
    },
    // オプション
    getOption : function(){
        return {
            SKIP_MARK : '#',
            SKIP_COUNT : 0,
        };
    },
}).implements(IParseTable);

