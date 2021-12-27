const flagE=0x80;
const flagP=0x40;
const flagI=0x20;
const flagV=0x08;
const flagC=0x04;
const flagS=0x02;
const flagZ=0x01;
class cpu{
        constructor(mem){
            this.register = new register();
            this.interrupt =new interrupt();
            this.io=new io(mem,this.interrupt);
            this.pc = 0;
            this.flag = flagP;
            this.ir = 0;
            this.dr = 0;
            this.op = 0;  //命令の1byte目
            this.op3= 0; //opの下位3bit
            this.op5 = 0; //opの上位5bit
            this.excp = false;
            this.mem =mem;
        }

            // CPUを初期化する関数
        reset() {
            this.register.reset();
            this.pc = 0;
            this.flag = flagP;
            this.io.reset();
            this.interrupt.reset();
        }
        // アドレスを正規化する
        normAddr(val) {
            return val & 0xfffe;
        }

        // intを正規化する
        normInt(val) {
            return val & 0xffff;
        }

        sigExt4(v){
            if((v & 8) != 0){
                v = ~7 | v;
            }
            return v;
        }

        EA(rx){
            let val = this.normAddr(this.pc);
            switch(this.op3){
            case 0:
                this.pc = this.normAddr(this.pc+2);
                return this.normAddr(this.mem[val/2]);
            case 1:
                this.pc = this.normAddr(this.pc+2);
                return this.normAddr(this.mem[val/2] + this.register.read(rx));
            case 2:
                this.pc = this.normAddr(this.pc+2);
                return this.normAddr(val);
            case 3:
                let c = this.sigExt4(rx);
                return this.normAddr(c*2 + this.register.read(12));
            case 6,7:
                return this.register.read(rx);
            default:
                return null;
            }
        }

        fetchData(rx){
            let ea = this.EA(rx);
            switch(this.op3){
            case 4:
                return this.register.read(rx);
            case 5:
                let c = this.sigExt4(rx);
                return this.normInt(c);
            case 7:
                let word = this.mem[ea/2];
                if((ea & 1) == 0){
                    return word >>> 8;
                }else return word & 0xff;
            default:
                return this.mem[ea/2];
            }
        }

        calFlag(val,v1,v2){
            let valMsb = val & 0x8000;
            let v1Msb = v1 & 0x8000;
            let v2Msb = v2 & 0x8000;
            this.flag = this.flag & 0xfff0;

            if(this.op5 == 3){ //add
                if(v1Msb == v2Msb && valMsb != v1Msb){
                    this.flag |= flagV;
                }
            }else if(this.op5 == 4 || this.op5 == 5){ //sub or cmp
                if(v1Msb != v2Msb && valMsb != v1Msb){
                    this.flag |= flagV;
                }
            }
            if((val & 0x10000) != 0){
                this.flag |= flagC;
            }
            if(valMsb != 0){
                this.flag |= flagS;
            }
            if(this.normInt(val) == 0){
                this.flag |= flagZ;
            }
       }

        ld(rd,rx){
            let d = this.fetchData(rx);
            this.register.write(rd,d);
        }

        st(rd,rx){
            let ea = this.EA(rx);
            let word = this.register.read(rd);
            if(this.op3 == 7){
                if((ea & 1) == 0){
                    word = (this.mem[ea/2] & 0xff00) | (word & 0x00ff);
                }else{
                    word = (this.mem[ea/2] & 0x00ff) | ((word << 8) & 0xff00);
                }
            }
            this.mem[ea/2] = word;
        }

        cal = (rd,rx,f) =>{
            let v1 = this.register.read(rd);
            let v2 = this.fetchData(rx);
            let d = f(v1,v2);
            this.calFlag(d,v1,v2);
            if(this.op5 != 5){
                this.register.write(rd,this.normInt(d));
            }
        }

        jmpf(flag,d){ //jmpのflag判定
            if(flag){
                this.pc=d;
            }
        }

        jmp(rd){
            let d = this.EA();
            let zflag = ((this.flag & flagZ) !=0);
            let cflag = ((this.flag & flagC) !=0);
            let sflag = ((this.flag & flagS) !=0);
            let vflag = ((this.flag & flagV) !=0);
            switch(rd){
            case 0:
                this.jmpf(zflag,d);
                console.log("jz");
                break;
            case 1:
                this.jmpf(cflag,d);
                console.log("jc");
                break;
            case 2:
                this.jmpf(sflag,d);
                console.log("jm");
                break;
            case 3:
                this.jmpf(vflag,d);
                console.log("jo");
                break;
            case 4:
                this.jmpf(!(zflag || (!sflag && vflag || sflag && !vflag) ),d);
                console.log("jgt");
                break;
            case 5:
                this.jmpf(! (!sflag && vflag || sflag && !vflag),d );
                console.log("jge");
                break;
            case 6:
                this.jmpf(zflag || (!sflag && vflag || sflag && !vflag),d);
                console.log("jle");
                break;
            case 7:
                this.jmpf((!sflag && vflag || sflag && !vflag),d);
                console.log("jlt");
                break;
            case 8:
                this.jmpf(!zflag,d);
                console.log("jnz");
                break;
            case 9:
                this.jmpf(!cflag,d);
                console.log("jnc");
                break;
            case 10:
                this.jmpf(!sflag,d);
                console.log("jnm");
                break;
            case 11:
                this.jmpf(!vflag,d);
                console.log("jno");
                break;
            case 12:
                this.jmpf(!(zflag || cflag),d);
                console.log("jhi");
                break;
            case 14:
                this.jmpf(zflag || cflag,d);
                console.log("jls");
                break;
            case 15:
                this.pc = d;
                console.log("jmp");
            }
        }

        pushVal(v){
            this.register.write(13,this.normAddr(this.register.read(13) - 2));
            this.mem[this.register.read(13)/2] = v;
        }

        popVal(){
            const v = this.mem[this.register.read(13)/2];
            this.register.write(13,this.normAddr(this.register.read(13) + 2));
            return v;
        }

        call(){
            let ea = this.EA();
            this.pushVal(this.pc);
            this.pc = ea;
        }

        in(rd,rx){
            let d=this.EA(rx);
            this.register.write(rd,this.io.input(d));
        }

        out(rd,rx){
            let d=this.EA(rx);
            let data=this.register.read(rd);
            this.io.output(data,d);
        }

        push(rd){
            this.pushVal(this.register.read(rd));
        }

        pop(rd){
            this.register.write(rd,this.popVal());
        }

        ret(){
            this.pc = this.popVal();
        }

        reti(){
            if((this.flag & flagP) !== 0){  //特権モード時
                this.flag = this.popVal();
            }else{
                this.flag = (0xf0 & this.flag) +(0x0f & this.popVal());    //特権モード以外
            }
            this.pc = this.popVal();
            this.register.privMode((this.flag & flagP)!==0);
        }

        svc(){
            this.interrupt.setFlag(15);
            this.excp=true;
        }

        interruph(num){  //割り込み処理
            let flag = this.flag;
            this.flag = (this.flag & ~flagE) | flagP;   //Ebit=0;Pbit=1;
            this.register.setPrivMode(true);
            this.pushVal(this.pc);
            this.pushVal(flag);
            this.pc = this.mem[(0xffe0 + num*2)/2];  //割り込みベクタ
        }

        exec(con){
            if((this.flag & flagE)!==0|| this.excp === true){  //割り込み判定
                let num = this.interrupt.testFlag();    //割り込み番号
                this.excp = false;
                if(num !== -1){
                    console.log('割り込み番号:'+num);
                    this.interruph(num);
                    this.flag = this.flag | flagE;
                }
            }
            this.exceInstruction(con);      //１命令実行
        }

        exceInstruction(con){
            this.ir = this.mem[this.pc/2];
            this.pc = this.normAddr(this.pc+2);
            this.op = this.ir >>> 8;
            this.op5 = this.op >>> 3;
            this.op3 = this.op & 0x07;
            let rd = (this.ir >>> 4) & 0xf;
            let rx = (this.ir & 0x0f);
            switch(this.op5){
            case 0x00:
                console.log('nop');
                break;
            case 0x01:
                console.log('load');
                this.ld(rd,rx);
                break;
            case 0x02:
                console.log('store');
                this.st(rd,rx);
                break;
            case 0x03:
                console.log('add');
                this.cal(rd,rx,(v1,v2) => {return v1 + v2});
                break;
            case 0x04:
                console.log('sub');
                this.cal(rd,rx,(v1,v2) => {return v1 - v2});
                break;
            case 0x05:
                console.log('cmp');
                this.cal(rd,rx,(v1,v2) => {return v1 - v2});
                break;
            case 0x06:
                console.log('and');
                this.cal(rd,rx,(v1,v2) => {return v1 & v2});
                break;
            case 0x07:
                console.log('or');
                this.cal(rd,rx,(v1,v2) => {return v1 | v2});
                break;
            case 0x08:
                console.log('xor');
                this.cal(rd,rx,(v1,v2) => {return v1 ^ v2});
                break;
            case 0x09:
                console.log('adds');
                this.cal(rd,rx,(v1,v2) => {return v1 + (v2 * 2)});
                break;
            case 0x0a:
                console.log('mul');
                this.cal(rd,rx,(v1,v2) => {return v1 * v2});
                break;
            case 0x0b:
                console.log('div');
                this.cal(rd,rx,(v1,v2) => {
                    if(v2 === 0){
                        this.interrupt.setFlag(12); //ゼロ除算
                        this.excp = true;
                        return v1;
                    }else {
                        return v1 / v2;
                    }
                });
                break;
            case 0x0c:
                console.log('mod');
                this.cal(rd,rx,(v1,v2) => {return v1 % v2});
                break;
            case 0x0d:
                console.log('mull');
                break;
            case 0x0e:
                console.log('divl');
                break;
            case 0x0f:
                console.log('');
                break;
           case 0x10:
                console.log('shla');
                this.cal(rd,rx,(v1,v2) => {return v1 << v2});
                break;
            case 0x11:
                console.log('shll');
                this.cal(rd,rx,(v1,v2) => {return v1 << v2});
                break;
            case 0x12:
                console.log('shra');
                this.cal(rd,rx,(v1,v2) => {
                        if((v1 & 0x8000)!=0){
                            v1 = v1 | ~0xffff;
                        }
                    return v1 >> v2});
                break;
            case 0x13:
                console.log('shrl');
                this.cal(rd,rx,(v1,v2) => {return v1 >>> v2});
                break;
            case 0x14:
                this.jmp(rd);
                break;
            case 0x15:
                console.log('call');
                this.call();
                break;
            case 0x16:
                if((this.flag & flagP | flagI)!== 0){
                    console.log('in');
                    this.in(rd,rx);
                }else {
                    this.interrupt.setFlag(13); //特権違反
                    this.excp = true;
                    console.log('Dont in');
                }
                break;
            case 0x17:
                if((this.flag & flagP |flagI)!== 0){
                    console.log('out');
                    this.out(rd,rx);
                }else {
                    this.interrupt.setFlag(13);  //特権違反
                    this.excp = true;
                    console.log('Dont out');
                }
                break;
            case 0x18:
                if(this.op3 == 0x00){
                    console.log('push');
                    this.push(rd);
                    break;
                }else if(this.op3 == 0x04){
                    console.log('pop');
                    this.pop(rd);
                    break;
                }
            case 0x1a:
                if(this.op3 == 0x00){
                    console.log('ret');
                    this.ret();
                    break;
                }else if(this.op3 == 0x04){
                    console.log('reti');
                    this.reti();
                    break;
                }
            case 0x1e:
                console.log('svc');
                this.svc();
                break;
            case 0x1f:
                if((this.flag & flagP) !== 0){
                    console.log('halt');
                    con.stop();
                }else {
                    this.interrup.setFlag(13);   //特権違反
                    this.excp = true;
                }
                break;
            default:
                console.log('other');
                this.interrupt.setFlag(14); //未定義違反
                this.excp = true;
            }
        }

        setReg(reg,val){
            this.register.write(reg,val);
        }

        getReg(reg){
            return this.register.read(reg);
        }

        setPC(val){
            this.pc = val;
        }

        getPC(){
            return this.pc;
        }

        setFlag(val){
            this.flag = val;
        }

        getFlag(){
            return this.flag;
        }
}