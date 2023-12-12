class CannonBall {
    constructor(x, y) {
        var options = {
            isStatic: true
        }
        this.trajectory=[]
        this.r = 30
        this.body = Bodies.circle(x, y, this.r, options)
        this.image = loadImage("../assets/cannonball.png")
        this.isSink=false
        this.speed = 0.05
        this.animation=waterSplashAnimation
        World.add(world, this.body)
    }
    shoot() {

        var newAngle = cannon.angle - 28//extraindo angulo do canhao

        newAngle = newAngle * (3.14 / 180)//grau para radianos
        var velocity = p5.Vector.fromAngle(newAngle)//extraindo x e y do angulo do canhao     
        velocity.mult(0.5)//diminuindo a velocidade pela metade

        Matter.Body.setStatic(this.body, false)//mudando o estado da bola
        Matter.Body.setVelocity(this.body, {
            x: velocity.x * (180 / 3.14), //adicionando velocidade x a bola e convertendo para graus
            y: velocity.y * (180 / 3.14)//adicionando velocidade y a bola e convertendo para graus
        })

    }
    display() {
        var pos = this.body.position
        var index = floor(this.speed % this.animation.length)
        if (this.isSink) {
            push()
            imageMode(CENTER)
            image(this.animation[index], pos.x, pos.y, this.r, this.r)
            pop()
        } else {
            push()
        imageMode(CENTER)
        image(this.image, pos.x, pos.y, this.r, this.r)
        pop()
        }
        
        if(this.body.velocity.x>0&&this.body.position.x>250){
            var position=[this.body.position.x,this.body.position.y]
            this.trajectory.push(position)
        }
        for(var j=0;j<this.trajectory.length;j++){
            image(this.image, this.trajectory[j][0], this.trajectory[j][1], 5, 5)

        }
        
        
    }
    animate() {
        this.speed += 0.05
        
    }
    removeBall(index){
        Body.setVelocity(this.body,{x:0,y:0})
        //this.speed=0.05
        this.r=150
        
        this.isSink=true
        setTimeout(() => {
            World.remove(world,this.body)
            delete balls[index]
        }, 1000);
    }
}