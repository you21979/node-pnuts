var PNuts = require('..'),
    CircQueue = PNuts.collection.CircQueue;
var assert = require('assert');

var MAX = 10000000;

[function(){
    var circ = new CircQueue();
    var i = 0;
    for(i = 0; i<MAX; ++i){
        circ.enqueue(i);
    }
    var max = i;

    for(var i=0; i<MAX; ++i){
        circ.exec(function(data){
            assert(data === i % max);
        });
    }
    circ.finalize();
console.log(circ)
}].forEach(function(f){
    f();
});
