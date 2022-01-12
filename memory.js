class memory{
    constructor(){
        this.mem =new Uint16Array(1024*32);
        this.iplflag = 0;   //0=ROM,1=RAM
    }
    
    iplload(){
        let addr = 0xe000;
        let i=0;
        while(addr < 0x10000){
            this.mem[Math.floor(addr/2)] = ipl[i];
            i++;
            addr = addr + 2;
        }
    }

    write(val,addr){
        if(this.iplflag === 0){
            if(addr < 0xe000){
                this.mem[Math.floor(addr/2)]=val;
            }
        }else this.mem[Math.floor(addr/2)]=val;
    }

    read(addr){
        return this.mem[Math.floor(addr/2)];
    }

    iplbank(b0){
        this.iplflag = b0;
    }
}