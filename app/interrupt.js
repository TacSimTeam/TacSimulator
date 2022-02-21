class interrupt{
    constructor(){
        this.flag=0;
    }

    reset(){
        this.flag=0;
    }

    setFlag(num){   //割り込み記憶
        this.flag = this.flag | (1<<num);
        console.log(this.flag);
    }

    testFlag(){ //割り込み判定
        if(this.flag !== 0){
            for(let i=15;i>=0;i--){     //割り込み番号は0~15まで
                if((this.flag & (1<<i)) !== 0){
                    this.flag = this.flag & ~(1<<i);    //発見した割り込みビットは0にする
                    return i;
                }
            }
        }
        return -1;
    }
}