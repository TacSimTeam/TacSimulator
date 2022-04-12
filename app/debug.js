'use strict'
{
    console.log("do")
    //terminal = sio
    const terminal = document.getElementById("terminal");

    terminal.onkeydown = event => {
        cpu1.io.sio.input(event);
    };

    terminal.onkeyup = event => {
        cpu1.io.sio.ctrl(event);
    };

    function instraction(inst) {
        let len = inst.length;
        let ma = 0;
        let data = 0;
        if (inst[0] !== "***") {
            ma = parseInt(inst[0], 16) & 0xffff;     //& 0xffffをしないとtoString()でエラーになる
        }
        for (let j = 1; j < len; j++) {
            data = parseInt(inst[j], 16);            //文字列を１６進数に変換
            if (data >= 0x0000) {
                if (inst[j].length === 4) {           //１命令１６ビット時
                    mem.write(data, ma);
                }
                ma = ma + 2;
            }
        }
    }

    document.getElementById("writep").onclick = function () {
        let pl = document.getElementById("order").value;
        let word = pl.split(/\n/);    //１行毎に区切って配列に格納
        let inst;
        for (let i = 0; i < word.length; i++) {
            inst = word[i].split(/\s/, 3); //先頭から3つ目までの文字列
            console.log(inst);
            instraction(inst);      //メモリに格納
        }
    }
}