//Switch
class Switch {
  constructor(ctx, t, x, y) {
   this.ctx = ctx;
   this.text = t;
   this.x = x;
   this.y = y;
   this.val = 0;
   this.draw();
  }

  //draw関数
  draw() {
    //指定範囲の消去
    this.ctx.clearRect(this.x-5,this.y-14,40,65);
    this.ctx.beginPath();
    this.ctx.rect(this.x,this.y, 26, 26);
    this.ctx.fillStyle = "#777777";
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.arc(this.x+13,this.y+13,10,0 * Math.PI / 180, 360 * Math.PI / 180, false ) ;
    this.ctx.fillStyle = "#000000";
    this.ctx.fill();

    this.ctx.beginPath();
    if (this.val===0) {
      this.ctx.rect(this.x+9,this.y+12, 8, 20);
      this.ctx.fillStyle = "#cccccc";
      this.ctx.fill();
      this.ctx.beginPath();
      this.ctx.rect(this.x+9,this.y+30, 8, 8);
      this.ctx.fillStyle = "#993300";
      this.ctx.fill();
      
    } else {
      this.ctx.rect(this.x+9,this.y+12, 8, -20);
      this.ctx.fillStyle = "#cccccc";
      this.ctx.fill();
      this.ctx.beginPath();
      this.ctx.rect(this.x+9,this.y-12, 8, 8);
      this.ctx.fillStyle = "#993300";
      this.ctx.fill();
    }
    this.ctx.beginPath();
    this.ctx.fillStyle = "#000080";
    this.ctx.font = "10px serif";
    this.ctx.fillText(this.text, this.x+12, this.y+50)
  }

  //hit関数
  hit(x1,y1){
    if(this.x<=x1 && x1<=this.x+26 && this.y<=y1 && y1<=this.y+26){
      this.val ^= 1;
      this.draw();
      return true;
    }
    return false;
  }

  getVal(){
    return this.val;
  }
}

