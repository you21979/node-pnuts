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

var StringUtil = require(__dirname + '/string_util');
var datePadding = function(str,digit){
    return StringUtil.digitPadding(str, digit, '0');
};

// 日付をYYYYMMDDで出力する
Functions.formatDateYYYYMMDD = function(sep,dateObj){
    if(sep === undefined){
        sep = '-';
    }
    if(dateObj === undefined){
        dateObj = new Date();
    }
    var Y = datePadding(dateObj.getFullYear(), 4);
    var M = datePadding(dateObj.getMonth()+1, 2);
    var D = datePadding(dateObj.getDate(), 2);
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
    var h = datePadding(dateObj.getHours(), 2);
    var m = datePadding(dateObj.getMinutes(), 2);
    var s = datePadding(dateObj.getSeconds(), 2);
    return h + sep + m + sep + s;
};

// 時間をHHMMSS.MSで出力する
Functions.formatTimeHHMMSS_MS = function(sep,dateObj){
    if(dateObj === undefined){
        dateObj = new Date();
    }
    var ts = Functions.formatTimeHHMMSS(sep, dateObj);
    var ms = datePadding(dateObj.getMilliseconds(), 3);
    return ts + '.' + ms;
};

// TypedArrayからJSへ変換
Functions.arrayTyped2JS = function(ar){
    var len = ar.length;
    var r = new Array(len);
    for(var i = 0; i<len; ++i){
        r[i] = ar[i];
    }
    return r;
};
