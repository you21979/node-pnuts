/**
 *  雑多な関数
 */
"use strict";
var Functions = exports;

Functions.DigitPadding = function(str, digit, padstr){
    var w = '';
    if(str.length < digit ){
        var len = digit - str.length;
        for(var i = 0; i < len; ++i){
            w = digit + w;
        }
    }
    return w + str;
};

