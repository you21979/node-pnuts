var PNuts = require('..'),
    SimpleAsync = PNuts.util.SimpleAsync;

var assert = require('assert');

var flag = true;

var sync = new SimpleAsync(function(){
    flag = false;
    console.log('done');
});

[
function(MAX){
    sync.inc();
    setTimeout(function(){
        sync.dec();
    }, 300);
},
function(MAX){
    sync.inc();
    setTimeout(function(){
        sync.dec();
    }, 200);
},
function(MAX){
    sync.inc();
    setTimeout(function(){
        sync.dec();
    }, 100);
},
function(MAX){
    sync.inc();
    setTimeout(function(){
        sync.dec();
    }, 10);
}
].forEach(function(fnc){
    fnc();
});
var loop = function(){
    if(flag){
        process.nextTick(loop);
    }
}
process.nextTick(loop);
