class sd {
    constructor(mem, interrupt) {
        this.stat = 0x80;
        this.ctrl = 0x00;
        this.memaddr = 0x0000;
        this.secaddrH = 0x0000;  //セクタアドレス上位
        this.secaddrL = 0x0000;  //セクタアドレス下位
        this.mem = mem;
        this.interrupt = interrupt;
    }

    reset() {
        this.stat = 0x80;
        this.ctrl = 0x00;
        this.memaddr = 0x0000;
        this.secaddrH = 0x0000;
        this.secaddrL = 0x0000;
    }

    readStat() {
        return this.stat;
    }

    readmem() {
        return this.memaddr;
    }
    readSecH() {
        return this.secaddrH;
    }
    readSecL() {
        return this.secaddrL;
    }

    writectrl(data) {
        this.ctrl = data;
        let secaddr = this.Secaddr();
        if ((this.ctrl & 0x02) !== 0) {
            console.log("read");
            this.readFile(this.memaddr, secaddr);
            this.Ebit();
        } else if ((this.ctrl & 0x01) !== 0) {
            this.writeFile(this.memaddr, secaddr);
            this.Ebit();
        } else if ((this.ctrl & 0x04) !== 0) {
            this.Ebit();
        }
    }

    writemem(addr) {
        this.memaddr = addr;
        console.log("memaddr:" + this.memaddr);
    }

    writeSecH(addr) {
        this.secaddrH = addr;
        console.log("SecH:" + this.secaddrH);
    }

    writeSecL(addr) {
        this.secaddrL = addr;
        console.log("SecL:" + this.secaddrL);
    }

    Ebit() {
        if ((this.ctrl & 0x80) !== 0) {
            this.interrupt.setFlag(1);//割り込みコントローラ通知
            console.log("interrupt");
        }
    }

    Secaddr() {  //上位・下位のセクタアドレス合成
        let secaddr = (this.secaddrH << 16) + this.secaddrL;
        console.log(secaddr);
        return secaddr;
    }

    readFile(md, sec) {
        console.log(md, sec);
        let buf = new Uint8Array(window.electron.readSector(sec));  //window.electron.readSector(sec)はprelpad.jsに記述
        console.log(buf);
        for (let i = 0; i < 512; i = i + 2) {   //8bit->16bit
            let val = (buf[i] << 8) + buf[i + 1];
            this.mem.write(val, md);
            md = md + 2;
        }
        console.log(this.mem.mem);
    }

    writeFile(md, sec) {
        let data = new Uint8Array(512);
        for (let i = 0; i < 256; i = i + 2) {   //16bit->8bit
            data[i] = (this.mem.read(md) & 0xff00) >> 8;
            data[i + 1] = this.mem.read(md) & 0x00ff;
            md = md + 2;
        }
        window.electron.writeSector(data, sec);      //window.electron.writeSector(data,sec)はprelpad.jsに記述
        console.log(data);
    }
}