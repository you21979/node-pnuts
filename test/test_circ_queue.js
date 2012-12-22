var PNuts = require('..'),
    CircQueue = PNuts.collection.CircQueue;
var assert = require('assert');

[function(){
    var circ = new CircQueue();
    var i = 0;
    circ.enqueue(i++);
    circ.enqueue(i++);
    circ.enqueue(i++);
    circ.enqueue(i++);
    circ.enqueue(i++);
    circ.enqueue(i++);
    var max = i;

    for(var i=0; i<100; ++i){
        circ.exec(function(data){
            assert(data === i % max);
        });
    }
}].forEach(function(f){
    f();
});
