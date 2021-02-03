export default class ImgEffect extends Laya.Script {
    
    private myImg:Laya.Image;
    private moveSpeed:number = 5;
    private state:number =0;
    onAwake()
    {
        this.myImg = (<Laya.Image>this.owner);
        this.moveSpeed = 0.3;
        
    }
    moveX(x)
    {
        this.myImg.centerX += (x*1.5);
    }


    get centerX(){
        return this.myImg.centerX;
    }
    get centerY(){
        return this.myImg.centerY;
    }
    SetCenter(x,y)
    {
        // this.myImg.centerX = x;
        this.myImg.centerY = y;
        Laya.Tween.to(this.myImg,{centerX:x},100,null);
    }

    MoveX(x,complete)
    {
        Laya.Tween.to(this.myImg,{centerX:x},100,null,complete);
    }

    RotationAnim()
    {
        Laya.timer.frameLoop(1,this,this.onUpdata);
        this.state = 1;
    }

    onUpdata()
    {
        if(this.state == 1)
        {
            this.myImg.rotation += this.moveSpeed;
        }
    }

    

    StopRotationAnim()
    {
        Laya.timer.clearAll(this);
        this.state = 0;
    }

    scale(x,y?)
    {
        if(!y)
        {
            y = x;
        }
        this.myImg.scale(x,y);
    }

    Unlock(index:number,visible:boolean)
    {
        if(this.myImg.numChildren > index)
        {
            (<Laya.Image>this.myImg.getChildAt(index)).visible = visible;
        }
    }
}