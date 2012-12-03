"use strict";
var Class = require(__dirname + '/class').create;
var assert = require('assert');

var SimpleAsync = Class({
    initialize : function(){
        this.count_ = 0;
    },
    inc : function(){
        ++this.count_;
    },
    dec : function(){
        --this.count_;
        assert(this.count_ >= 0);
    },
    chkSync : function(){ 
        if(this.count_ === 0){
            return true;
        }
        return false;
    },
});
module.exports = SimpleAsync;
