
function view(buf){              //ファイル内容確認用
  let str = "";
  for (let c=0 ;c<256; c++) {
    str += ("0"+buf[c].toString(16)).slice(-2);
    if ((c+1)%16===0) {
        str += "\n";
    } else {
        str += " ";
    }
  }

  document.getElementById("aaa").innerText = str;
}

class sd{
    constructor(mem,interrupt){
        this.stat=0x80;
        this.ctrl=0x00;
        this.memaddr=0x0000;
        this.secaddrH=0x0000;  //セクタアドレス上位
        this.secaddrL=0x0000;  //セクタアドレス下位
        this.mem = mem;
        this.interrupt = interrupt;
    }

    reset(){
        this.stat=0x80;
        this.ctrl=0x00;
        this.memaddr=0x0000;
        this.secaddrH=0x0000;
        this.secaddrL=0x0000;
    }

    readmem(){
        return this.memaddr;
    }
    readSecH(){
        return this.secaddrH;
    }
    readSecL(){
        return this.secaddrL;
    }

    writectrl(data){
        this.ctrl=data;
        let secaddr=this.Secaddr();
        if((this.ctrl & 0x02) !==0 ){
            console.log("read");
            this.readFile(this.memaddr*2,secaddr);
            this.Ebit();
        }else if((this.ctrl & 0x01) !==0 ){
            this.writeFile(this.memaddr*2,secaddr);
            this.Ebit();
        }else if((this.ctrl & 0x04) !==0 ){
            this.Ebit();
        }
    }

    writemem(addr){
        this.memaddr=addr;
    }

    writeSecH(addr){
        this.secaddrH=addr;
    }

    writeSecL(addr){
       this.secaddrL=addr;
    }

    Ebit(){
        if((this.ctrl & 0x80) !== 0){
            this.interrupt.setFlag(8);//割り込みコントローラ通知
            console.log("interrupt");
        }
    }

    Secaddr(){
        let secaddr=(this.secaddrH <<16 ) + this.secaddrL;
        console.log(secaddr);
        return secaddr;
    }

    readFile(md,sec){
        console.log(md,sec);
        let buf = new Uint8Array(window.electron.readSector(sec));
        view(buf);
        console.log(buf);
        for(let i=0;i<512;i=i+2){
            this.mem[md/2]=(buf[i]<<8)+buf[i+1];
            md=md+2;
        }
        console.log(this.mem);
    }

    writeFile(md,sec){
        let data= new Uint8Array(512);
        for(let i=0;i<256;i=i+2){
            data[i]=(this.mem[md/2] & 0xff00) >> 8;
            data[i+1] = this.mem[md/2] & 0x00ff;
            md=md+2;
        }
        window.electron.writeSector(data,sec);
        console.log(data);
    }
}