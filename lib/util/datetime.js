"use strict";
var DateTime = exports;
var StringUtil = require(__dirname + '/string_util');

/**
 *  UNIXタイムを取得する
 */
DateTime.getUnixTime = function(dateObj){
    if(dateObj === undefined){
        dateObj = new Date();
    }
    return dateObj / 1000 | 0;
};

/**
 *  UNIXタイムから時刻に変換する
 */
DateTime.fromUnixTime = function(unixtime){
    if( unixtime === undefined ){
        unixtime = 0;
    }
    return new Date( unixtime * 1000 );
};

var datePadding = function(str,digit){
    return StringUtil.digitPadding(str.toString(), digit, '0');
};

/**
 * 時間をフォーマットして出力する
 */
DateTime.format = function(fmt,dateObj){
    if(dateObj instanceof Date){
        fmt = fmt.replace('y', datePadding(dateObj.getFullYear()-2000, 2));
        fmt = fmt.replace('Y', datePadding(dateObj.getFullYear(), 4));
        fmt = fmt.replace('m', datePadding(dateObj.getMonth()+1, 2));
        fmt = fmt.replace('d', datePadding(dateObj.getDate(), 2));
        fmt = fmt.replace('H', datePadding(dateObj.getHours(), 2));
        fmt = fmt.replace('i', datePadding(dateObj.getMinutes(), 2));
        fmt = fmt.replace('s', datePadding(dateObj.getSeconds(), 2));
        fmt = fmt.replace('M', datePadding(dateObj.getMilliseconds(), 3));
    }
    return fmt;
};

if(!module.parent){
    var assert = require('assert');
    assert(DateTime.format('Y/m/d H:i:s.M', null) === 'Y/m/d H:i:s.M');
    assert(DateTime.format('Y/m/d H:i:s.M', new Date('2000/02/29 00:00:00')) === '2000/02/29 00:00:00.000');
}


