var PNuts = require('..'),
    Sched = PNuts.system.Sched,
    FSM = PNuts.system.FSM;

var assert = require('assert');

[
function(MAX){
    var Worker = new Sched.Worker(0);
    var TaskManager = new Sched.TaskManager();
    Worker.createJob('MainLoop', 0, function(){
        TaskManager.update();
    }).run();
    var x = 0;
    for(var i=0;i<MAX;++i){
        TaskManager.add(1.05,function(){
            ++x;
        });
    }
    TaskManager.add(1.1,function(){
        assert(x === i+1);
        ++x;
    });
    TaskManager.add(0.9,function(){
        assert(x === 0);
        ++x;
    });
    TaskManager.add(1.0,function(){
        assert(x === 1);
    });
    TaskManager.add(2.0,function(){
        Worker.stop();
console.log("OK");
    });
}
].forEach(function(fnc){
    [1,1000,10000,100000].forEach(function(MAX){
        var TID = MAX+':SUM';
        console.time(TID);
        fnc(MAX);
        console.timeEnd(TID);
    });
});
