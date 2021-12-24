class memory{
    constructor(){
        this.mem =new Uint16Array(1024*32);
    }

    write(val,addr){
        this.mem[addr/2]=val;
    }

    read(addr){
        return this.mem[addr/2];
    }
}