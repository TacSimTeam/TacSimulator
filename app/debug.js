'use strict'
{
    console.log("do")
    //terminal = sio
    const terminal=document.getElementById("terminal");

    terminal.onkeydown = event =>{
        cpu1.io.sio.input(event);
    };

    terminal.onkeyup = event =>{
        cpu1.io.sio.ctrl(event);
    };

    function instraction(inst){
        let len = inst.length;
        let ma=0;
        let data =0;
        if(inst[0]!=="***"){
            ma = parseInt(inst[0],16) & 0xffff;     //& 0xffffをしないとtoString()でエラーになる
        }
        for(let j=1;j<len;j++){
            data = parseInt(inst[j],16);
            if(data >=0x0000){
                if(inst[j].length === 4){           //１命令１６ビット時
                    mem.write(data,ma);
                }/*else if(inst[j].length === 2){       //８ビット時
                    mem1.mem[ma/2] = data << 8 + parseInt(inst[j+1],16);
                    j++;
                    } */
                ma = ma+2;
            }
        }
    }

    document.getElementById("writep").onclick = function() {
        let pl = document.getElementById("order").value;
        let word=pl.split(/\n/);
        let inst;
        for(let i=0;i<word.length;i++){
            inst=word[i].split(/\s/,3);
            console.log(inst);
            instraction(inst);
        }
    }
}