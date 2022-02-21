class register{
    constructor(){
        this.reg = new Uint16Array(13);
        this.sp = new Uint16Array(2); //sp[0]=ssp,sp[1]=usp;
        this.privMode = 0;  //特権フラグ
    }

    reset(){
        this.reg.fill(0);
        this.sp.fill(0);
    }

    setPrivMode(flag){       //CPUのreti(),interrupth()で呼び出し
        this.privMode = flag;
    }

    read(no){
        switch(no){
            case 13:
                if(this.privMode){
                    return this.sp[0];      //ssp
                }else{
                    return this.sp[1];      //usp
                }
            case 14:
                return this.sp[1];      //usp
            default :
                return this.reg[no];       //G0~FP
        }
    }

    write(no,val){
        switch(no){
            case 13:
                if(this.privMode){
                    this.sp[0]=val;      //ssp
                }else{
                    this.sp[1]=val;      //usp
                }
                break;
            case 14:
                this.sp[1]=val;      //usp
                break;
            default :
                this.reg[no]=val;       //G0~FP
        }
    }
}