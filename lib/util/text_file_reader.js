/**
 *  テキストファイル一括読み込み
 */
"use strict";
var fs = require('fs');
var domain = require('domain');

var SimpleAsync = require(__dirname + '/simple_async');
var Class = require(__dirname + '/class'); 

var TextFileReader = module.exports = Class({
    initialize : function(){
        var self = this;
        this.list_ = [];
        this.completeCB_ = function(){};
        this.async_ = new SimpleAsync(function(){
            self.completeCB_();
        });
        this.domain_ = domain.create();
        this.domain_.setMaxListeners(1);
    },
    finalize : function(){
        this.domain_.removeAllListeners();
        this.list_.length = 0;
        this.list_ = null;
        this.completeCB_ = null;
        this.async_ = null;
        this.domain_ = null;
    },
    add : function(filename, callback){
        var self = this;
        this.async_.inc();
        this.list_.push({
            filename : filename,
            callback : function(err, data){
                callback(err, data);
                self.async_.dec();
            },
        });
        return this;
    },
    read : function(callback){
        if(callback){
            this.completeCB_ = callback;
        }
        var self = this;
        this.list_.forEach(function(v){
            fs.readFile(v.filename, 'utf-8', self.domain_.bind(v.callback));
        });
    },
    readSync : function(callback){
        if(callback){
            this.completeCB_ = callback;
        }
        var self = this;
        this.list_.forEach(function(v){
            try {
                var data = fs.readFileSync(v.filename, 'utf-8');
                v.callback(null, data);
            }catch(e){
                self.domain_.emit('error', e);
            }
        });
    },
    error : function(callback){
        this.domain_.on('error', callback);
        return this;
    },
});
/*
var x = new TextFileReader();
x
    .add("./a.js", function(err,data){
        if(err) throw new Error("aaaa");
    })
    .add("./a.js", function(err,data){
        if(err) throw new Error("aaaa");
    })
    .add("./xx.js", function(err,data){
        if(err) throw new Error("aaaa");
    })
    .error(function(err){
        console.log(err.message);
    })
    .readSync(function(){
    })
;
*/
