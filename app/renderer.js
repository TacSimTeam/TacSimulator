// ここも追加
const cons = document.getElementById("console");
const ctx = cons.getContext("2d");
ctx.textAlign="center";

const sound = document.getElementById("sound"); //https://soundeffect-lab.info/sound/button/
const sound2 = document.getElementById("sound2");//https://soundeffect-lab.info/sound/button/

//クリック時の動作
cons.onclick = (e) => {
  //message.value=e.offsetX;
  //message2.value=e.offsetY;

  //ボタン
  for(let i=0; i<9; i++) {
    if (con.button[i].hit(e.offsetX,e.offsetY)){
      document.getElementById("sound").play();
    }
  }

  //スイッチ
  for(let i=0; i<10; i++) {
    if (con.switches[i].hit(e.offsetX,e.offsetY,i)){
      document.getElementById("sound2").play();
    }

  }
}

// cosole.log の無効化
window.console = {};
window.console.log = function(i){return;};

// オブジェクトを作成
const mem = new memory();
const cpu1 = new cpu(mem);
const con = new Console(ctx, cpu1, mem);
cpu1.reset();

