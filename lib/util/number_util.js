/**
 *  数値操作
 */
"use strict";
var NumberUtil = exports;

// 
NumberUtil.clamp = function(num, min, max){
    return Math.min(Math.max(num, min), max);
};

