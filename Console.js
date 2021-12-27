//コンソールクラス
class Console{
  // コンストラクタ
  constructor(ctx,cpu,mem){
   this.ctx = ctx;
   this.cpu = cpu;
   this.mem = mem;
   this.addr = 0;
   this.runFF = 0;
   this.count = 0;
   this.cpuid = null;

   ctx.beginPath();
   ctx.moveTo(285,145);
   ctx.lineTo(350,145);
   ctx.moveTo(350,145);
   ctx.lineTo(350,150);

   ctx.moveTo(285,137);
   ctx.lineTo(380,137);
   ctx.moveTo(380,137);
   ctx.lineTo(380,150);
   
   ctx.moveTo(285,129);
   ctx.lineTo(410,129);
   ctx.moveTo(410,129);
   ctx.lineTo(410,150);
   ctx.strokeStyle = "#cccccc";
   ctx.stroke();    

   // アドレスLED 
   this.addrLeds = [];
   for (let i=0; i<8; i++) {
     let x = 370 - i * 40;
     if (i>3) {
       x = x - 20;
     }
     this.addrLeds.push(
       new Led(this.ctx,"A"+i,x,30,"#400000","#ff0000"," "," "," "));
   } 
   
   // データLED 
   this.dataLeds = [];
   this.dataLeds.push(
     new Led(this.ctx,"D0",370,90,"#004000","#00ff00","(Z)"," "," "));
   this.dataLeds.push(
     new Led(this.ctx,"D1",330,90,"#004000","#00ff00","(S)"," "," "));
   this.dataLeds.push(
     new Led(this.ctx,"D2",290,90,"#004000","#00ff00","(C)"," "," "));
   this.dataLeds.push(
     new Led(this.ctx,"D3",250,90,"#004000","#00ff00","(V)"," "," "));
   this.dataLeds.push(
     new Led(this.ctx,"D4",190,90,"#004000","#00ff00"," "," "," "));
   this.dataLeds.push(
     new Led(this.ctx,"D5",150,90,"#004000","#00ff00","(I)"," "," "));
   this.dataLeds.push(
     new Led(this.ctx,"D6",110,90,"#004000","#00ff00","(P)"," "," "));
   this.dataLeds.push(
     new Led(this.ctx,"D7",70,90,"#004000","#00ff00","(E)"," "," ",));

   // ロータリースイッチのLED
   this.registerLeds = [];
   this.registerLeds.push(
     new Led(this.ctx,"G0",105,160,"#DAA520","#FFFF00","(G0)","(G6)","(FP)"));
   this.registerLeds.push(
     new Led(this.ctx,"G1",139,160,"#DAA520","#FFFF00","(G1)","(G7)","(SP)"));
   this.registerLeds.push(
     new Led(this.ctx,"G2",173,160,"#DAA520","#FFFF00","(G2)","(G8)","(PC)"));
   this.registerLeds.push(
     new Led(this.ctx,"SP",207,160,"#DAA520","#FFFF00","(G3)","(G9)","(FLAG)"));
   this.registerLeds.push(
     new Led(this.ctx,"PC",241,160,"#DAA520","#FFFF00","(G4)","(G10)","(MD)"));
   this.registerLeds.push(
     new Led(this.ctx,"MM",275,160,"#DAA520","#FFFF00","(G5)","(G11)","(MA)"));
   this.flagLeds = [];
   this.flagLeds.push(
     new Led(this.ctx,"C",350,160,"#DAA520","#FFFF00"," "," "," "));
   this.flagLeds.push(
     new Led(this.ctx,"S",380,160,"#DAA520","#FFFF00"," "," "," "));
   this.flagLeds.push(
     new Led(this.ctx,"Z",410,160,"#DAA520","#FFFF00"," "," "," "));
   this.drawRegisterLeds();

   // RUN LED
   this.runLed =
      new Led(this.ctx,"RUN",400,60,"#400000","#ff0000"," "," "," ");

   // 押しボタン
   this.button = [];
   this.button.push(
     new Button(this.ctx,"ー＞",295,150,()=>{this.countUp();}));
   this.button.push(
     new Button(this.ctx,"＜ー",60,150,()=>{this.countDown();}));
   this.button.push(
     new Button(this.ctx,"WRITE",360,330,()=>{this.writeButton()}));
   this.button.push(
     new Button(this.ctx,"DECA",320,330,()=>{this.decaButton()}));
   this.button.push(
     new Button(this.ctx,"INCA",280,330,()=>{this.incaButton()}));
   this.button.push(
     new Button(this.ctx,"SETA",240,330,()=>{this.setaButton()}));
   this.button.push(
     new Button(this.ctx,"STOP",180,330,()=>{this.stopButton()}));
   this.button.push(
     new Button(this.ctx,"RUN",140,330,()=>{this.runButton()}));
   this.button.push(
     new Button(this.ctx,"RESET",20,330,()=>{this.resetButton()}));

   // データスイッチ
   this.switches = [];
   for (let i=0; i<8; i++) {
    let x = 360 - i * 40;
    if (i>3) {
     x = x - 20;
    }
    this.switches.push(new Switch(this.ctx,"D"+i,x,250));
   }

   // BREK スイッチと STEP スイッチ
   this.stepSw = new Switch(this.ctx,"STEP",100,330);
   this.switches.push(this.stepSw);
   this.breakSw = new Switch(this.ctx,"BREAK",60,330);
   this.switches.push(this.breakSw);

  } // コンストラクタ終わり

  // 現在の値を8ビットシフトしたものに data sw の値を合成する
  readAndShift(val) {
      return ((val << 8) | this.readDataswitch()) & 0xffff;
  }

  // WRITE ボタンが押された
  writeButton() {
    if (this.runFF==1) return;
    if (0<=this.count && this.count<=13) {     // CPU レジスタ
      var val = this.cpu.getReg(this.count);
      val = this.readAndShift(val);
      this.cpu.setReg(this.count,val);
      this.drawAddressDataLeds();
    } else if (this.count==14) {               // PC
      var val = this.cpu.getPC();
      val = this.readAndShift(val);
      this.cpu.setPC(val);
      this.drawAddressDataLeds();
    } else if (this.count==15) {               // Flag
      var val = this.cpu.getFlag();
      val = this.readAndShift(val);
      this.cpu.setFlag(val);
      this.drawAddressDataLeds();
    } else {                                  // メモリ
      var val = this.mem.read(this.addr);
      val = this.readAndShift(val);
      this.mem.write(val,this.addr);
      this.drawAddressDataLeds();
    } 
  }

  // DECA ボタンが押された
  decaButton() {
    if (this.runFF==1) return;
    if (this.count==16 || this.count==17) {   // MD, MA なら反応する
      this.addr = (this.addr - 2) & 0xffff;
      this.drawAddressDataLeds();
    }
  };

  // INCA ボタンが押された
  incaButton() {
    if (this.runFF==1) return;
    if (this.count==16 || this.count==17) {   // MD, MA なら反応する
      this.addr = (this.addr + 2) & 0xffff;
      this.drawAddressDataLeds();
    }
  };

  // SETA ボタンが押された
  setaButton() {
    if (this.runFF==1) return;
    if (this.count==16 || this.count==17) {   // MD, MA なら反応する
      this.addr = this.readAndShift(this.addr);
      this.drawAddressDataLeds();
    }
  };

  // STOP ボタンが押された
  stopButton() {
    if (this.runFF==0) return;
    clearTimeout(this.cpuid);
    this.runFF = 0;
    this.runLed.set(this.runFF);
    this.drawAddressDataLeds();
  };

  // cpu の命令実行関係
  // 命令の連続実行
  run() {
    let start = new Date();                    // 開始時刻
    while (this.runFF==1) {
      this.cpu.exec(this);
      let stop = new Date();                   // 現在時刻
      if (stop.getTime()-start.getTime()>10){  // 10ms以上実行した
        this.cpuid = setTimeout(()=>{this.run();},0);
        return;                                // 他のイベント処理のため戻る
      }
    };
    this.runLed.set(this.runFF);               // halt 命令が実行された
    this.drawAddressDataLeds();
  }

  // cpu が HALT 命令を実行した時，呼び出す
  stop() {
    this.runFF = 0;
  }

  // RUN ボタンが押された
  runButton() {
    if (this.runFF==1) return;
    this.runFF = 1;
    this.runLed.set(this.runFF);
    if (this.stepSw.getVal()==0) {             // 通常実行
      this.run();
    } else {                                   // STEP実行
      this.cpu.exec(this);                     // 1命令実行
      this.runFF = 0;
      this.runLed.set(this.runFF);
      this.drawAddressDataLeds();
    }
  };

  // RESET ボタンが押された
  resetButton() {
    if (this.runFF==1) {
      clearTimeout(this.cpuid);
      this.runFF = 0;
    }
    this.cpu.reset();
    this.runLed.set(this.runFF);
    this.drawAddressDataLeds();
  };

  // データスイッチを読んで8ビットのデータを返す
  readDataswitch(){
    let v = 0;
    for(let i=7;i>=0;i--){
      v<<=1;
      v+=this.switches[i].getVal();
    }
    return v;
  }

  // 8個のLEDに8ビットのデータを表示する
  drawLeds(leds, val) {
    for(let i=7;i>=0;i--){
      leds[i].set((val>>i)&1);
    }
  }

  // 現在のロータリースイッチの値で判断してA0-A7,D0-D7を表示する
  drawAddressDataLeds(){
    var val;
    if (0<=this.count && this.count<=13) {
      val = this.cpu.getReg(this.count);
    } else if (this.count==14) {
      val = this.cpu.getPC();
    } else if (this.count==15) {
      val = this.cpu.getFlag();
    } else if (this.count==16) {
      val = this.mem.read(this.addr);
    } else {
      val = this.addr & 0xfffe;
    }
    this.drawLeds(this.addrLeds,val>>8);
    this.drawLeds(this.dataLeds,val);
  }

  // ロータリースイッチ関係
  // ロータリースイッチのランプを描画する
  drawRegisterLeds(){
    let c = Math.floor(this.count/6);
    let r = this.count%6;
    console.log(c);
    for(let i=0;i<3;i++){
      let v = (c==i)?1:0;
      this.flagLeds[i].set(v);
      console.log(v);
    }
    for(let i=0;i<6;i++){
      let v = (r==i)?1:0;
      this.registerLeds[i].set(v);
    }
  }

  // 右矢印ボタンが押された
  countUp(){
    if (this.runFF==1) return;
    if(this.count<17){
      this.count++;
      this.drawRegisterLeds();
      this.drawAddressDataLeds();
    }
  }
  
  // 左矢印ボタンが押された
  countDown(){
    if (this.runFF==1) return;
    if(this.count>0){
      this.count--;
      this.drawRegisterLeds();
      this.drawAddressDataLeds();
    }
  }
}

/*
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
*/

