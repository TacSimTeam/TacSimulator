//コンソールクラス
class Console{
  constructor(ctx){
   this.ctx = ctx;
   this.pos = 0;
   this.addr = 0;
   this.data = 0;
   this.run = 0;
   this.count = 0;
   this.switchdata = 0;
   this.switchchange = [];

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

   //LED 
   this.addrLeds = [];
   for (let i=0; i<8; i++) {
     let x = 370 - i * 40;
     if (i>3) {
       x = x - 20;
     }
     this.addrLeds.push(new Led(this.ctx, "A"+i, x, 30, "#400000", "#ff0000"," "," "," "));
   } 
   
   this.dataLeds = [];
   this.dataLeds.push(new Led(this.ctx, "D0", 370, 90, "#004000", "#00ff00","(Z)"," "," "));
   this.dataLeds.push(new Led(this.ctx, "D1", 330, 90, "#004000", "#00ff00","(S)"," "," "));
   this.dataLeds.push(new Led(this.ctx, "D2", 290, 90, "#004000", "#00ff00","(C)"," "," "));
   this.dataLeds.push(new Led(this.ctx, "D3", 250, 90, "#004000", "#00ff00","(V)"," "," "));
   this.dataLeds.push(new Led(this.ctx, "D4", 190, 90, "#004000", "#00ff00"," "," "," "));
   this.dataLeds.push(new Led(this.ctx, "D5", 150, 90, "#004000", "#00ff00","(I)"," "," "));
   this.dataLeds.push(new Led(this.ctx, "D6", 110, 90, "#004000", "#00ff00","(P)"," "," "));
   this.dataLeds.push(new Led(this.ctx, "D7", 70, 90, "#004000", "#00ff00","(E)"," "," ",));

   this.registerLeds = [];
   this.registerLeds.push(new Led(this.ctx, "G0", 105, 160, "#DAA520", "#FFFF00", "(G0)", "(G6)", "(FP)"));
   this.registerLeds.push(new Led(this.ctx, "G1", 139, 160, "#DAA520", "#FFFF00","(G1)","(G7)","(SP)"));
   this.registerLeds.push(new Led(this.ctx, "G2", 173, 160, "#DAA520", "#FFFF00","(G2)","(G8)","(PC)"));
   this.registerLeds.push(new Led(this.ctx, "SP", 207, 160, "#DAA520", "#FFFF00","(G3)","(G9)","(FLAG)"));
   this.registerLeds.push(new Led(this.ctx, "PC", 241, 160, "#DAA520", "#FFFF00","(G4)","(G10)","(MD)"));
   this.registerLeds.push(new Led(this.ctx, "MM", 275, 160, "#DAA520", "#FFFF00","(G5)","(G11)","(MA)"));

   this.flagLeds = [];
   this.flagLeds.push(new Led(this.ctx, "C", 350, 160, "#DAA520", "#FFFF00"," "," "," "));
   this.flagLeds.push(new Led(this.ctx, "S", 380, 160, "#DAA520", "#FFFF00"," "," "," "));
   this.flagLeds.push(new Led(this.ctx, "Z", 410, 160, "#DAA520", "#FFFF00"," "," "," "));

   this.runLed = new Led(this.ctx, "RUN", 400, 60, "#400000", "#ff0000"," "," "," "); 

   //Button
   this.button = [];
   this.button.push(new Button(this.ctx, "ー＞",295, 150, ()=>{this.countUp();}));
   this.button.push(new Button(this.ctx, "＜ー",60, 150, ()=>{this.countDown();}));
   this.button.push(new Button(this.ctx, "WRITE",360, 330, ()=>{this.pos=getReg(this.count);this.drawAddressDataLeds(this.pos,3)}));
   this.button.push(new Button(this.ctx, "DECA",320, 330, ()=>{this.addr-=2;this.drawAddressDataLeds(this.addr,0);}));
   this.button.push(new Button(this.ctx, "INCA",280, 330, ()=>{this.addr+=2;this.drawAddressDataLeds(this.addr,0);}));
   this.button.push(new Button(this.ctx, "SETA",240, 330,()=>{this.drawAddressDataLeds(this.addr,1);}));
   this.button.push(new Button(this.ctx, "STOP",180, 330, ()=>{this.run=0; this.runLed.set(this.run);}));
   this.button.push(new Button(this.ctx, "RUN",140, 330, ()=>{this.run=1; this.runLed.set(this.run);}));
   this.button.push(new Button(this.ctx, "RESET",20, 330, ()=>{this.drawAddressDataLeds(this.data,2)}));

   //Switch
   this.switches = [];
   for (let i=0; i<8; i++) {
    let x = 360 - i * 40;
    if (i>3) {
     x = x - 20;
    }
    this.switches.push(new Switch(this.ctx, "D"+i, x, 250));
   }
   this.switches.push(new Switch(this.ctx, "STEP", 100, 330));
   this.switches.push(new Switch(this.ctx, "BREAK", 60, 330));

   this.drawRegisterLeds();
   this.drawAddressDataLeds();
   this.readDataswitch();
  }

  readDataswitch(){
    let v = 0;
    for(let i=7;i>=0;i--){
      v<<=1;
      v+=this.switches[i].getVal();
    }
    return v;
  }

  drawAddressDataLeds(v,q){
    if(this.count>=0 && this.count<=15){
      if(q==3){
        for(let i=7;i>=0;i--){
          this.dataLeds[i].set(((this.readDataswitch())&(1<<i))==0?0:1);
        }
        setReg(this.count,this.readDataswitch());
      }
    }
    if(this.count==16 || this.count==17){
      for(let i=7;i>=0;i--){
        if(q==0){
          if(i==0){
            this.dataLeds[i].set(0);
          }else{
            this.dataLeds[i].set((v&(1<<i))==0?0:1);
          }
        }
        if(q==1){
          this.addrLeds[i].set((v&(1<<(i)))==0?0:1);
          this.dataLeds[i].set(0);
          this.addr = this.readDataswitch();
          if(i==0){
            this.dataLeds[i].set(0);
          }else{
            this.dataLeds[i].set((this.addr&(1<<i))==0?0:1);
          }
        }
        if(q==2){
          this.addrLeds[i].set(0);
          this.dataLeds[i].set(0);
          this.runLed.set(1);
        }
      }
      
    }
  }

  drawRegisterLeds(){
    let c = Math.floor(this.count/6);
    let r = this.count%6;
    console.log(c);
    for(let i=0;i<3;i++){
      let v=(c==i)?1:0;
      this.flagLeds[i].set(v);
      console.log(v);
    }
    for(let i=0;i<6;i++){
      let v=(r==i)?1:0;
      this.registerLeds[i].set(v);
    }
  }

  countUp(){
    if(this.count<17){
      this.count++;
      this.drawRegisterLeds();
    }
  }
  
  countDown(){
    if(this.count>0){
      this.count--;
      this.drawRegisterLeds();
    }
  }
}


//クリック時の動作
/*
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

