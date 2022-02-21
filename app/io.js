class io{
    constructor(mem,interrupt){
        this.sio=new sio(interrupt);
        this.sd=new sd(mem,interrupt);
        this.timer = new timer(interrupt);
        this.mem = mem;
    }

    reset(){
        this.sio.reset();
        this.sd.reset();
        this.timer.reset();
    }

    input(ea){
        console.log(ea);
        switch(ea){
            case 0x00:
                return this.timer.readCnt(0);
            case 0x02:
                return this.timer.readFlag(0);
            case 0x04:
                return this.timer.readCnt(1);
            case 0x06:
                return this.timer.readFlag(1);
            case 0x08:
                return this.sio.readData();
            case 0x0a:
                return this.sio.readStat();
            case 0x10:
                return this.sd.readStat();
            case 0x12:
                return this.sd.readmem();
            case 0x14:
                return this.sd.readSecH();
            case 0x16:
                return this.sd.readSecL();
            case 0x1e:
                return 1;       //TaCモードとして動かす
        }
    }

    output(data,ea){
        switch(ea){
            case 0x00:
                this.timer.writeRegister(0,data);
                break;
            case 0x02:
                this.timer.writeCtrl(0,data);
                break;
            case 0x04:
                this.timer.writeRegister(1,data);
                break;
            case 0x06:
                this.timer.writeCtrl(1,data);
                break;
            case 0x08:
                this.sio.output(data);
                break;
            case 0x10:
                this.sd.writectrl(data);
                break;
            case 0x12:
                this.sd.writemem(data);
                break;
            case 0x14:
                this.sd.writeSecH(data);
                break;
            case 0x16:
                this.sd.writeSecL(data);
                break;
            case 0xa0:
                this.mem.iplbank(data);
                break;
        }
    }
}