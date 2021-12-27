'use strict'
{
    console.log("do")
    //textarea2 = sio
    const textarea2=document.getElementById("textarea2");

    textarea2.onkeydown = event =>{
        cpu1.io.sio.input(event);
    };

    textarea2.onkeyup = event =>{
        cpu1.io.sio.ctrl(event);
    };

    let mem1 = new memory();
    let cpu1 = new cpu(mem1.mem);
    cpu1.reset();

    //以下よりdisp()までconsole関係
    let ma = 0;
    let md = mem1.mem[ma];
    let MA = document.getElementById("MA");
    let MD = document.getElementById("MD");
    let DATA = document.getElementById("DATA");
    let FLAG = document.getElementById("FLAG");
    let PC = document.getElementById("PC");
    let G = [14] ;
        for(let i=0;i<12;i++){
            let k = "G" + i;
            console.log(k);
            G[i] = document.getElementById(k);
        }
    G[12] = document.getElementById("FP");
    G[13] = document.getElementById("SP");

    // 整数から16進文字列に変換する関数
    function toBinStr(val) {
        return ('0000'+val.toString(16).toUpperCase()).slice(-4);
    }

    // コンソールに必要な準備
    function disp() {
        MA.value = toBinStr(ma);
        MD.value = toBinStr(md);
        DATA.value = toBinStr(md);
        for(let i=0;i<14;i++){
            G[i].value = toBinStr(cpu1.register.read(i));
        }
        FLAG.value = toBinStr(cpu1.flag);
        PC.value = toBinStr(cpu1.pc);
    }

    function instraction(inst){
        let len = inst.length;
        let data =0;
        if(inst[0]!=="***"){
            ma = parseInt(inst[0],16) & 0xffff;     //& 0xffffをしないとtoString()でエラーになる
        }
        for(let j=1;j<len;j++){
            data = parseInt(inst[j],16);
            if(data >=0x0000){
                if(inst[j].length === 4){           //１命令１６ビット時
                    //mem1.mem[ma/2] = data;
                    mem1.write(data,ma);
                }/*else if(inst[j].length === 2){       //８ビット時
                    mem1.mem[ma/2] = data << 8 + parseInt(inst[j+1],16);
                    j++;
                    } */
                ma = ma+2;
            }
        }
    }

    class con{
        constructor(){
            this.cpuflag = true;
        }
        reset(){
            this.cpuflag = true;
        }

        stop(){
            this.cpuflag = false;
        }

        CPU(){
            //console.log(this.cpuflag);
            return this.cpuflag;
        }
    }

    let con1 = new con();
    let cpuid,conid;

    /*function exec(){
        return new Promise((resolve)=>{
            if(con1.CPU()){
                cpuid = setTimeout(() =>{
                    cpu1.exec(con1);
                    resolve();
                },0);
            }else{
                clearTimeout(cpuid);
            }
        });
    }*/

    function run(){
        let start = new Date();     //開始時刻
        while(con1.CPU()){
            cpu1.exec(con1);
            let stop = new Date();  //終了時刻
            if(stop.getTime()-start.getTime()>10){  //getTime()->ms単位で取得
                console.log("10ms経過");
                break;
            }
        }
        cpuid = setTimeout(run,0);
        disp();
    }

     /*function run(){      //非同期的処理(再帰)
        if(con1.CPU()){
            //cpuid = setInterval(function(){cpu1.exec(con1,cpuid)},0);  //setInterval使用時
            cpu1.exec(con1);        //setTimeout使用時
            cpuid = setTimeout(run,0);
        }else{
            clearTimeout(cpuid);
        }
    }*/

    con1.reset();
    disp();

    document.getElementById("seta").onclick = function() {
        console.log("seta");
        ma = cpu1.normAddr(parseInt(DATA.value,16));
        //md = mem1.mem[ma/2];
        md = mem1.read(ma);
        disp();
    };

    document.getElementById("inc").onclick = function() {
        console.log("inc")
        ma = cpu1.normAddr(ma + 2);
        //md = mem1.mem[ma/2];
        md = mem1.read(ma);
        disp();
    };

    document.getElementById("dec").onclick = function() {
        console.log("dec")
        ma = cpu1.normAddr(ma - 2);
        //md = mem1.mem[ma/2];
        md = mem1.read(ma);
        disp();
    };

    document.getElementById("write").onclick = function() {
        console.log("write");
        md = parseInt(DATA.value,16);
        //mem1.mem[ma/2] = md;
        mem1.write(md,ma);
        ma = ma + 2;
        //md = mem1.mem[ma/2];
        md = mem1.read(ma);
        disp();
    };

    document.getElementById("step").onclick = function() {
        console.log("step");
        cpu1.mem = mem1.mem;        //入力されたプログラムを実行用のメモリに入力
        cpu1.exec();
        mem1.mem = cpu1.mem;
        disp();
    };

    document.getElementById("reset").onclick = function() {
        console.log("reset");
        con1.reset();
        cpu1.reset();
        clearTimeout(cpuid);
        disp();
    };

    document.getElementById("writep").onclick = function() {
        ma=0;
        let pl = document.getElementById("textarea").value;
        let word=pl.split(/\n/);
        let inst;
        for(let i=0;i<word.length;i++){
            inst=word[i].split(/\s/,3);
            console.log(inst);
            instraction(inst);
        }
        //md = mem1.mem[ma/2];
        md = mem1.read(ma);
        console.log(mem1.mem);
        disp();
    }

    document.getElementById("resetp").onclick = function(){
        ma=0;
        mem1.mem.fill(0);
        clearTimeout(cpuid);
        disp();
    };

    document.getElementById("read").onclick = function(){
        console.log("read");
        read(0);
    };
    let n=0;
    document.getElementById("writef").onclick = function(){
        write(n);
        n=n+4;
        console.log("writef");
    }

    document.getElementById("run").onclick = function(){
        cpu1.mem = mem1.mem;
        run();
        mem1.mem = cpu1.mem;
        console.log("run");
    }

    document.getElementById("stop").onclick = function(){
        con1.stop();
        clearTimeout(cpuid);
    }
}