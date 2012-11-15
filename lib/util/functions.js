/**
 *  雑多な関数
 */
"use strict";
var fs = require('fs');
var Functions = exports;

// jsonファイルの読み込み(同期)
Functions.readJsonFileSync = function(filename){
    var data = fs.readFileSync(filename, 'utf-8');
    return JSON.parse(data);
};

// 桁埋め
Functions.digitPadding = function(str, digit, padstr){
    var w = '';
    if(str.length < digit ){
        var len = digit - str.length;
        for(var i = 0; i < len; ++i){
            w = digit + w;
        }
    }
    return w + str;
};

// 日付をYYYYMMDDで出力する
Functions.formatDateYYYYMMDD = function(sep,dateObj){
    if(sep === undefined){
        sep = '-';
    }
    if(dateObj === undefined){
        dateObj = new Date();
    }
    function f(str,digit){
        return Functions.digitPadding(str, digit, '0');
    }
    var Y = f(dateObj.getFullYear(), 4);
    var M = f(dateObj.getMonth()+1, 2);
    var D = f(dateObj.getDate(), 2);
    return Y + sep + M + sep + D;
};

// 時間をHHMMSSで出力する
Functions.formatTimeHHMMSS = function(sep,dateObj){
    if(sep === undefined){
        sep = ':';
    }
    if(dateObj === undefined){
        dateObj = new Date();
    }
    function f(str,digit){
        return Functions.digitPadding(str, digit, '0');
    }
    var h = f(dateObj.getHours(), 2);
    var m = f(dateObj.getMinutes(), 2);
    var s = f(dateObj.getSeconds(), 2);
    return h + sep + m + sep + s;
};

// 時間をHHMMSS.MSで出力する
Functions.formatTimeHHMMSS_MS = function(sep,dateObj){
    if(dateObj === undefined){
        dateObj = new Date();
    }
    function f(str,digit){
        return Functions.digitPadding(str, digit, '0');
    }
    var ts = Functions.formatTimeHHMMSS(sep, dateObj);
    var ms = f(dateObj.getMilliseconds(), 3);
    return ts + '.' + ms;
};
