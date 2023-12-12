class Cannon{
    constructor(x,y,w,h,angle) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.angle = angle
        this.cannonImg=loadImage("../assets/canon.png")
        this.baseImg=loadImage("../assets/cannonBase.png")
    }

    display(){
        
        if(keyIsDown(RIGHT_ARROW)&&this.angle<65){
            this.angle+=1
        }
        if(keyIsDown(LEFT_ARROW)&&this.angle>-43){
            this.angle-=1
        }
        push ()
        translate (this.x,this.y)
        rotate (this.angle)
        imageMode(CENTER)
        image(this.cannonImg,0,0,this.w,this.h)
        pop ()
        image(this.baseImg,70,20,200,200)
        
    }
}