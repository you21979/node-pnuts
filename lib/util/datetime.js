"use strict";
var DateTime = exports;

// UNIXタイムを取得する
DateTime.getUnixTime = function(dateObj){
    if(dateObj === undefined){
        dateObj = new Date();
    }
    return dateObj / 1000 | 0;
};

// UNIXタイムから時刻に変換する
DateTime.fromUnixTime = function(unixtime){
    if( unixtime === undefined ){
        unixtime = 0;
    }
    return new Date( unixtime * 1000 );
};


