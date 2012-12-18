/**
 *  文字列操作
 */
"use strict";
var StringUtil = exports;

// 桁埋め
StringUtil.digitPadding = function(str, digit, padstr){
    var w = '';
    if(str.length < digit ){
        var len = digit - str.length;
        for(var i = 0; i < len; ++i){
            w = padstr + w;
        }
    }
    return w + str;
};

