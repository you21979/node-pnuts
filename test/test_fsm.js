var PNuts = require('..'),
    FSM = PNuts.system.FSM;

var assert = require('assert');

var param = {
    name : 'hogezo-',
    hp : 100,
    mp : 100,
};
var STATE = {
    NONE : 0,
    DAMAGE : 1,
    HEAL : 2,

    SIZEOF : 3,
};
var def = [];
def[STATE.NONE] = null;
def[STATE.DAMAGE] = {
    VAL : 9,
	begin : function(arg){
		console.log("begin:"+param.name+":in damage zone");
	},
	end : function(arg){
		console.log("end:"+param.name+":out damage zone");
	},
	update : function(arg){
		console.log("damage:"+param.name+":"+this.VAL);
        param.hp -= this.VAL;
	},
};
def[STATE.HEAL] = {
    VAL : 20,
	begin : function(arg){
		console.log("begin:"+param.name+":in heal zone");
	},
	end : function(arg){
		console.log("end:"+param.name+":out heal zone");
	},
	update : function(arg){
		console.log("update:"+param.name+":"+this.VAL);
        param.hp += this.VAL;
	},
};
var s = new FSM.Manager(def);
s.setState(STATE.NONE);

[
function(){
    console.log(param);
},
function(){
    s.update();
},
function(){
    s.setState(STATE.DAMAGE);
},
function(){
    s.update();
},
function(){
    s.update();
},
function(){
    s.update();
},
function(){
    s.update();
},
function(){
    s.update();
},
function(){
    console.log(param);
},
function(){
    s.setState(STATE.HEAL);
},
function(){
    s.update();
},
function(){
    s.update();
},
function(){
    s.setState(STATE.NONE);
},
function(){
    console.log(param);
}
].forEach(function(fnc){
    var TID = 'SUM';
    console.time(TID);
    fnc();
    console.timeEnd(TID);
});

