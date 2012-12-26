/**
 *  カスタムiniファイルパーサー
 *  JSONっぽいiniファイル
 */
"use strict";
var fs = require('fs');
/*
 * [section]
 * string_data="hoge"
 * number_data=100
 * number_array_data=[1,2,3,4]
 * object_data={"hoge":"fuga"}
 */

/**
 * iniファイルパーサー
 */
var Parser = module.exports = function(filename){
    var line_count = 0;
    var skip_mark = '#';
    var data = fs.readFileSync(filename);
    var section = '';
    var iniobj = {};
    var ctx = [iniobj];
    data.toString().split('\n').forEach(function (line) {
        ++line_count;
        line = line.replace(/\t/g,'').trim();
        if(line.charAt(0) == skip_mark){
            return;
        }
        if(line.length === 0){
            return;
        }
        if(line.charAt(0) == '['){
            section = line.replace('[', '').replace(']', '');
            ctx[0][section] = {};
            ctx.push(ctx[0][section]);
            return;
        }
        var tok = line.split('=');
        tok[0] = tok[0].trim();
        ctx[ctx.length - 1][tok[0]] = JSON.parse(tok[1]);
    });
    return iniobj;
};
