class Boat {
    constructor(x, y, w, h, boatPos, boatAnimation) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.boatAnimation = boatAnimation
        this.speed = 0.05
        this.boatPos = boatPos
        this.body = Bodies.rectangle(x, y, w, h)
        this.image = loadImage("../assets/boat.png")
        this.isBroken=false
        World.add(world, this.body)
    }
    animate() {
        this.speed += 0.05
    }

    display() {
        var pos = this.body.position
        var angle = this.body.angle
        var index = floor(this.speed % this.boatAnimation.length)

        push()
        translate (pos.x,pos.y)
        rotate (angle)
        imageMode (CENTER)
        image (this.boatAnimation[index],0,this.boatPos,this.w,this.h)
        pop ()
    }
    removeBoat(i){
        this.boatAnimation=brokenBoatAnimation
        this.speed=0.05
        this.w=300
        this.h=300
        this.isBroken=true
        setTimeout(() => {
            World.remove(world,boats[i].body)
            delete boats[i]
        }, 2000);
    }
}