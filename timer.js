class timer{
    constructor(interrupt){
        this.cnt=Array(2);
        this.flag=Array(2);
        this.register=Array(2);
        this.ctrl=Array(2);
        this.interrupt = interrupt;
    }

    reset(){
        this.cnt.fill(0);
        this.flag.fill(0);
        this.register.fill(0);
        this.ctrl.fill(0);
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
        if((this.ctrl[timer] & 0x0001)!==0){
            let id=setInterval(this.time(timer,id),1);
        }
        if((this.ctrl[timer] & 0x8000)!==0){
            console.log("interrupt");
            this.interrupt.setFlag(timer)//割り込み処理
        }
    }

    time(timer,id){
        if(this.cnt[timer] === this.ctrl[timer]){
            this.flag[timer]=0x8000;
            this.cnt[timer]=0;
            clearInterval(id);
        }else{
            this.cnt[timer]++;
        }
    }
}