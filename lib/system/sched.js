/** 
 * @fileOverview タスクスケジューラ
 */
"use strict";
var Sched = exports;
var Class = require(__dirname+'/../util').Class;
var LinkedList = require(__dirname+'/../collections').LinkedList;
var Hash = require(__dirname+'/../collections').HashMap;

// 時間取得はuptimeを使用
var getTickCount = function(){
    return process.uptime();
}

// スケジューラ
// intervalが0以上ならsetTimeoutを使う
// 0ならばprocess.nextTickを使う。ただしCPU使用率100%
var scheduler = function(interval, callback){
    if(interval>0){
        setTimeout(callback, interval);
    }else{
        process.nextTick(callback);
    }
}

// -----------------------------------------------
// memo
// ワーカーは複数のジョブを持つ
// ジョブはなんらかの振る舞いかタスクを持つ(反復処理)
// タスクは仕事の最小単位（一度だけ処理）
// -----------------------------------------------

// ---------------------------------------
// ジョブ
// ---------------------------------------
var Job = Class({
    // コンストラクタ
    initialize : function(
        interval,   // 実行間隔
        next,       // 処理開始時間
        callback    // 処理関数
    ){
        this.interval_ = interval;
        this.next_ = next;
        this.callback_ = callback;
    },
    // 後始末
    finalize : function(){
        this.interval_ = 0;
        this.next_ = 0;
        this.callback_ = null;
    },
    // 次の仕事をスケジューリングする
    next : function(){
        this.next_ += this.interval_;
    },
    // スケジューリングされている時間を経過したかチェックする
    isExec : function(now){
        if(now >= this.next_){
            return true;
        }
        return false;
    },
    // 処理を実行する
    exec : function(now){
        if(this.callback_){
            this.callback_(now);
        }
    },
});
// ---------------------------------------
// タスク
// ---------------------------------------
var Task = Class({
    // コンストラクタ
    initialize : function(
        nowTick,        // 登録時間
        nextTick,       // 実行時間
        callback        // 処理関数
    ){
        this.MXNode();
        this.id_ = 0;
        this.startTick_ = nowTick;
        this.nextTick_ = nextTick;
        this.callback_ = callback;
    },
    // 後始末
    finalize : function(){
        this.id_ = -1;
        this.callback_ = null;
        this.startTick_ = 0.0;
        this.nextTick_ = 0.0;
    },
    // 処理を実行する
    exec : function(){
        if( this.callback_ ){
            this.callback_();
        }
    },
    // タスク処理をキャンセルする
    cancel : function(){
        this.callback_ = null;
    },
    // スケジューリングされている時間を経過したかチェックする
    isExec : function(now){
        if(this.startTick_ + this.nextTick_ <= now){
            return true;
        }
        return false;
    },
    // タスクのIDを取得する
    getId : function(){
        return this.id_;
    },
    // スケジューリングの時間を取得する
    getExecTime : function(){
        return this.startTick_ + this.nextTick_;
    },
}).mixin(LinkedList.MXNode);
// ---------------------------------------
// 時間管理(bookmark)
// ---------------------------------------
var TimeManager = Class({
    // 初期化
    initialize : function(sec){
        this.id_ = sec;                                   // ID
        this.taskList_ = new LinkedList.Manager();        // タスクリスト
    },
    // 後始末
    finalize : function(){
        this.taskList_.finalize();
        this.taskList_ = null;
    },
    // ID（秒）を取得
    getId : function(){
        return this.id_;
    },
    // 管理しているタスクの数を取得
    size : function(){
        return this.taskList_.size();
    },
    // タスクを登録する
    add : function(nowTick,nextTick,callback){
        var self = this;
        var task = new Task(nowTick,nextTick,callback);
        task.id_ = this.getId();
        var execTime = task.getExecTime();
        // リストをスキャンする
        var ret = this.taskList_.scanTail(function(node){
            var existTime = node.getExecTime();
            // 予定時刻より前のタスクを探す
            if(execTime > existTime){
                // 見つけたら直前に追加する
                self.taskList_.afterInsert(node,task);
                return false;
            }else if(execTime === existTime){
                self.taskList_.afterInsert(node,task);
                return false;
            }
            return true;
        });
        // 見つからなかったら
        if(ret === null){
            // 最初に追加する
            this.taskList_.pushHead(task);
        }
        return task;
    },
    // 登録されているタスクを指定時間まで実行する
    exec : function(now){
        var self = this;
        this.taskList_.scanHead(function(task){
            if(task.isExec(now)){
                task.exec();
                // 実行が終わったら破棄する
                self.taskList_.unlink(task);
                task.finalize();
                return true;
            }
            return false;
        });
    },
});
// ---------------------------------------
// タスクを処理する仕事
// ---------------------------------------
Sched.TaskManager = Class({
    // コンストラクタ
    initialize : function(max){
        this.nowTick_ = 0; // 現在時間
        this.timeManagers_ = new Hash(); // 秒単位で作られるテーブル
    },
    // 後始末
    finalize : function(){
        this.timeManagers_.scan(function(key,val){
            this.timeManagers_.remove(key);
        });
    },
    // タスクを登録する
    add : function(nextTick,callback){
        // キーは秒で管理
        var sec = Math.floor(nextTick + this.nowTick_);
        // タイムラインがなければ新規作成
        var timeMgr = null;
        if(!this.timeManagers_.isExist(sec)){
            timeMgr = new TimeManager(sec);
            this.timeManagers_.set(sec, timeMgr);
        }else{
            timeMgr = this.timeManagers_.get(sec);
        }
        var task = timeMgr.add(this.nowTick_,nextTick,callback);
        return task;
    },
    // 内部の時間を進める
    update : function(){
        var self = this;
        this.nowTick_ = getTickCount(); // updateが呼ばれたときのみ時間が進む
        // 処理するタスクをスキャンする
        this.timeManagers_.scan(function(sec, timeMgr){
            var now = self.nowTick_;
            if(sec > now){
                // 時間順にソートされているので抜けてOK
                return false;
            }
            timeMgr.exec(now);
            if(timeMgr.size() === 0){
                // タスク処理が無くなればタイムラインを削除する
                self.timeManagers_.remove(sec);
            }
            return true;
        });
    },
    // 登録したタスクをキャンセルする
    cancel : function(task){
        if( task ){
            task.cancel();
        }
    },
    // タスクの情報を取得
    getInfo : function(){
        var total = 0;
        var keycount = 0;
        this.timeManagers_.scan(function(sec,mgr){
            ++keycount;
            total += mgr.size();
            return true;
        });
        return{
            count : total,
            key : keycount,
        };
    },
});
// ---------------------------------------
// ワーカー
// ---------------------------------------
Sched.Worker = Class({
    // コンストラクタ
    initialize : function(interval){
        this.count_          = 0;                    // ループ回数（ベンチ用）
        this.tickStart_      = getTickCount();       // 開始時間
        this.tickCurrent_    = getTickCount();       // 現在時間
        this.jobList_        = new Hash();           // 役割リスト
        this.runFlag_        = true;                 // 継続フラグ
        this.interval_       = interval || 0;        // 呼び出し間隔(ミリ秒)
    },
    // 後始末
    finalize : function(){
        this.jobList_.scan(function(jobname,job){
            job.finalize();
        });
        this.jobList_ = null;
    },
    // 仕事を開始
    run : function(){
        var self = this;
        scheduler(this.interval_, function(){
            // 更新
            self.update();
            // ジョブ処理
            self.jobList_.scan(function(jobname,job){
                var now = self.tickCurrent_;
                if(job.isExec(now)){
                    job.exec(now);
                    job.next();
                }
                return true;
            });
            // 継続するか
            if(self.runFlag_){
                self.run();
            }
        });
    },
    // 停止する
    stop : function(){
        this.runFlag_ = false;
    },
    // 役割を設定する
    createJob : function(jobname,interval,callback){
        this.jobList_.set(jobname, new Job(interval, this.tickCurrent_ + interval, callback));
        return this;
    },
    // 役割を削除する
    deleteJob : function(jobname){
        if(this.jobList_.isExist(jobname)){
            this.jobList_.get(jobname).finalize();
            this.jobList_.remove(jobname);
        }
        return this;
    },
    // 時間経過で更新する情報
    update : function() {
        this.tickCurrent_ = getTickCount();
        ++this.count_;
    },
});
