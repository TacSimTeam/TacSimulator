//Button
class  Button{
  constructor(ctx, t,x, y, f) {
   this.ctx = ctx;
   this.text = t;
   this.x = x;
   this.y = y;
   this.f = f;
   this.draw();
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.rect(this.x,this.y, 26, 26);
    this.ctx.fillStyle = "#777777";
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.arc(this.x+13,this.y+13,8,0 * Math.PI / 180, 360 * Math.PI / 180, false ) ;
    this.ctx.fillStyle = "#cccccc";
    this.ctx.fill();
    this.ctx.fillStyle = "#000080";
    this.ctx.font = "10px serif";
    this.ctx.fillText(this.text, this.x+12, this.y+38);   
  }

  //hit関数
  hit(x1,y1){
    if(this.x<=x1 && x1<=this.x+26 &&this.y<=y1 && y1<=this.y+26){
      this.f();
      return true;
    }
    return false;
  }
}

