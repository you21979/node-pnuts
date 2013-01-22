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

var DateTime = require(__dirname + '/datetime');

// 日付をYYYYMMDDで出力する
Functions.formatDateYYYYMMDD = function(sep,dateObj){
    if(sep === undefined){
        sep = '-';
    }
    if(dateObj === undefined){
        dateObj = new Date();
    }
    return DateTime.format('Y'+sep+'m'+sep+'d', dateObj);
};

// 時間をHHMMSSで出力する
Functions.formatTimeHHMMSS = function(sep,dateObj){
    if(sep === undefined){
        sep = ':';
    }
    if(dateObj === undefined){
        dateObj = new Date();
    }
    return DateTime.format('H'+sep+'i'+sep+'s', dateObj);
};

// 時間をHHMMSS.MSで出力する
Functions.formatTimeHHMMSS_MS = function(sep,dateObj){
    if(dateObj === undefined){
        dateObj = new Date();
    }
    return DateTime.format('H'+sep+'i'+sep+'s'+'.M', dateObj);
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
