class sio{
    constructor(interrupt){
        this.stat=0x80; //送信可能
        this.ctrl;
        this.data=0;
        this.ctrlf=0;
        this.shiftf = 0;
        this.interrupt = interrupt;
    }

    reset(){
        this.stat=0x80;
        this.data=0;
    }

    ctrl(e){
        if(e.key === 'Control'){
            this.ctrlf =0;
        }else if(e.key === 'Shift'){
            this.shiftf = 0;
        }
    }

    input(e){
        console.log(e.key);
        if(e.key === 'Shift'){
            this.shiftf = 1;
        }
        if(e.key ==='Control'){
            this.ctrlf=1;
        }
        if(e.key.length === 1){
            const cp=e.key.codePointAt(0);
            if((0x20 <= cp)  && (cp <= 0x7e)){
                this.data=cp;
                this.stat=0xc0;
            }
            if(this.ctrlf === 1 && this.shiftf !==1){
                if(0x40 <= this.data&& this.data <= 0x5f){
                    this.data = this.data-0x40;
                }else if(0x60 <= this.data && this.data <= 0x6e){
                    this.data = this.data-0x60;
                }
            }
            this.interrupt.setFlag(5);
        }else{
            switch(e.key){
                case 'Escape':
                    this.data=0x1b;
                    break;
                case 'Tab':
                    this.data=0x09;
                    break;
                case 'Enter':
                    this.data=0x0a;
                    break;
                case 'Backspace':
                    this.data=0x08;
                    break;
                case 'Delete':
                    this.data=0x7f;
                    break;
                default:
                    this.data=0;
            }
            if(this.data !== 0){
                this.stat=0xc0;
                this.interrupt.setFlag(5);
            }
        }
        console.log(this.data);
    }

    output(data){
        console.log(data);
        textarea2.value+=String.fromCodePoint(data); //文字列に変換
        this.interrupt.setFlag(4);
    }

    readData(){
        this.stat=0x80;
        return this.data;
    }

    readStat(){
        console.log('readStat');
        return this.stat;
    }
}