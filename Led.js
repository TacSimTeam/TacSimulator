//LED
class Led {
  constructor(ctx, t1, x, y, c0, c1 ,t2, t3, t4) {
   this.ctx   = ctx;
   this.text1 = t1;
   this.text2 = t2;
   this.text3 = t3;
   this.text4 = t4; 
   this.color = [c0,c1];
   this.x = x;
   this.y = y;
   this.val = 0;
   this.draw();
  }

  draw(){
    
    //指定範囲の消去
    //if(this.line==0){
    //  this.ctx.clearRect(this.x-15,this.y-34,30,60);
    //}else{
    //  this.ctx.clearRect(this.x-15,this.y-11,30,40);
    //}
    
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, 10, 0, Math.PI*2, 0);
    this.ctx.fillStyle = this.color[this.val];
    this.ctx.fill();    
    this.ctx.stroke();
    this.ctx.fillStyle = "#000080";
    this.ctx.beginPath();
    this.ctx.font = "10px serif";
    this.ctx.fillText(this.text1, this.x, this.y+25);
    this.ctx.beginPath();
    this.ctx.font = "7px serif";
    this.ctx.fillText(this.text2, this.x, this.y-12);
    this.ctx.fillText(this.text3, this.x, this.y-20);
    this.ctx.fillText(this.text4, this.x, this.y-28);    
  }
  
  set(v){
    this.val = v;
    this.draw();
  }
}

