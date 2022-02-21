class timer{
    constructor(interrupt){
        this.cnt=Array(2);
        this.flag=Array(2);
        this.register=Array(2);
        this.ctrl=Array(2);
        this.interrupt = interrupt;
        this.id;
    }

    reset(){
        this.cnt.fill(0);
        this.flag.fill(0);
        this.register.fill(0);
        this.ctrl.fill(0);
        clearInterval(this.id);
    }

    readCnt(timer){
        this.flag[timer]=0x0000;
        return this.cnt[timer];
    }

    readFlag(timer){
        let tflag=this.flag[timer];
        this.flag[timer]=0x0000;
        return tflag;
    }

    writeRegister(timer,data){
        this.register[timer]=data;
    }

    writeCtrl(timer,data){
        this.ctrl[timer]=data;
        this.cnt[timer]=0;
        if((this.ctrl[timer] & 1)!==0){
            let t=this;     //setInterval()ではthisが使えないので名前を変更
            this.id=setInterval(function(){t.time(timer)},1);   //1ms毎にtime()を繰り返す
        }
        if((this.ctrl[timer] & 0x8000)!==0){
            console.log("interrupt");
            this.interrupt.setFlag(9-timer)     //割り込み番号　8:timer1 ,9:timer0
        }
    }

    time(timer){       
        if(this.cnt[timer] === this.register[timer]){
            this.flag[timer]=0x8000;
            this.cnt[timer]=0;
            clearInterval(this.id);     //タイマーストップ
        }else{
            this.cnt[timer]++;
        }
    }
}