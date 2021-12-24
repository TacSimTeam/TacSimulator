class interrupt{
    constructor(){
        this.flag=0;
    }

    reset(){
        this.flag=0;
    }

    setFlag(num){
        this.flag = this.flag | (1<<num);
        console.log(this.flag);
    }
    
    testFlag(){
        if(this.flag !== 0){
            for(let i=15;i>=0;i--){
                if((this.flag & (1<<i)) !== 0){
                    this.flag = this.flag & ~(1<<i);
                    return i;
                }
            }
        }
        return -1;
    }
}    