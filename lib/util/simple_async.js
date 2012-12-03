"use strict";
var Class = require(__dirname + '/class').create;
var assert = require('assert');

var SimpleAsync = Class({
    initialize : function(completeCB){
        this.completeCB_ = completeCB;
        this.count_ = 0;
    },
    inc : function(){
        ++this.count_;
    },
    dec : function(){
        --this.count_;
        assert(this.count_ >= 0);
        if(this.count_ === 0){
            this.completeCB_();
        }
    },
});
module.exports = SimpleAsync;
