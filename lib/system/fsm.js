/** 
 * @fileOverview 有限状態マシン
 */
"use strict";
var FSM = exports;
var Class = require(__dirname+'/../util').Class;

/*
 *	状態遷移インターフェイス
 */
FSM.IState = {
    begin : function(arg){},
    end : function(arg){},
    update : function(arg){},
};

/*
 *	状態遷移マシン
 */
FSM.StateMachine = Class({
    initialize : function(){
        this.current_ = null;
    },
    finalize : function(){
    },
    // 状態を取得
    getState : function(){
        return	this.current_;
    },
    // イベントを起こさず状態を設定
    _set : function(state){
        this.current_ = state;
    },
    // 状態を設定
    setState : function(newstate,arg){
        if(this.current_){
            this.current_.end(arg);
        }
        this._set(newstate);
        if(this.current_){
            this.current_.begin(arg);
        }
    },
    // 定期処理
    update : function(arg){
        if(this.current_){
            this.current_.update(arg);
        }
    },
});

/*
 * keyで状態遷移を管理
 */
FSM.Manager = Class({
    initialize : function(state_table){
        this.fsm_ = new FSM.StateMachine();
        this.state_table_ = state_table || {};
    },
    finalize : function(){
        this.fsm_ = null;
        this.state_table_ = null;
    },
    init_table : function(state_table){
        this.state_table_ = state_table;
    },
    _set : function(key,arg){
        this.fsm_._set(this.state_table_[key],arg);
    },
    setState : function(key,arg){
        this.fsm_.setState(this.state_table_[key],arg);
    },
    getState : function(){
        for(var key in this.state_table_){
            if( this.state_table_[key] == this.fsm_.getState() ){
                return key;
            }
        }
        return null;
    },
    update : function(arg){
        this.fsm_.update(arg);
    },
});
