const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;

let engine, world;

var balls = [];
var ground;
var tower, towerImg;
var bgImg;
var cannon, cannonBall;
var boats = [];
var angle = 20;
var backGroundMusic;
var cannonExplosionSound;
var cannonWaterSound;
var pirateLaughSound;
var isGameOver = false;
var isSinking = false;
var isLaughing = false;
var score = 0;

var boatAnimation = [];
var boatJson, boatImages;

var brokenBoatAnimation = [];
var brokenBoatJson, brokenBoatImg;

var waterSplashAnimation = [];
var waterSplashJson, waterSplashImg;

function preload() {
  bgImg = loadImage("./assets/background.gif");
  towerImg = loadImage("./assets/tower.png");

  boatJson = loadJSON("./assets/boat/boat.json");
  boatImages = loadImage("./assets/boat/boat.png");
  brokenBoatJson = loadJSON("./assets/boat/broken_boat.json");
  brokenBoatImg = loadImage("./assets/boat/broken_boat.png");
  waterSplashJson = loadJSON("./assets/water_splash/water_splash.json");
  waterSplashImg = loadImage("./assets/water_splash/water_splash.png");
  backGroundMusic = loadSound("./assets/background_music.mp3");
  cannonExplosionSound = loadSound("./assets/cannon_explosion.mp3");
  cannonWaterSound = loadSound("./assets/cannon_water.mp3");
  pirateLaughSound = loadSound("./assets/pirate_laugh.mp3");
}

function setup() {
  canvas = createCanvas(1200, 600);
  engine = Engine.create();
  world = engine.world;
  ground = Bodies.rectangle(0, height - 1, width * 2, 1, { isStatic: true });

  World.add(world, ground);

  tower = Bodies.rectangle(160, 350, 160, 310, { isStatic: true });
  World.add(world, tower);
  angleMode(DEGREES);
  cannon = new Cannon(180, 110, 130, 100, angle);

  var boatFrames = boatJson.frames;
  for (var i = 0; i < boatFrames.length; i++) {
    var pos = boatFrames[i].position;
    var img = boatImages.get(pos.x, pos.y, pos.w, pos.h);
    boatAnimation.push(img);
  }
  var brokenBoatFrames = brokenBoatJson.frames;
  for (var i = 0; i < brokenBoatFrames.length; i++) {
    var pos = brokenBoatFrames[i].position;
    var img = brokenBoatImg.get(pos.x, pos.y, pos.w, pos.h);
    brokenBoatAnimation.push(img);
  }
  var waterSplashFrames = waterSplashJson.frames;
  for (var i = 0; i < waterSplashFrames.length; i++) {
    var pos = waterSplashFrames[i].position;
    var img = waterSplashImg.get(pos.x, pos.y, pos.w, pos.h);
    waterSplashAnimation.push(img);
  }
}

function draw() {
  background(189);

  image(bgImg, 0, 0, width, height);
  if (!backGroundMusic.isPlaying()) {
    backGroundMusic.play()
    backGroundMusic.setVolume(0.3)
  }
  Engine.update(engine);
  rect(ground.position.x, ground.position.y, width * 2, 1);

  push();
  imageMode(CENTER);
  image(towerImg, tower.position.x, tower.position.y, 160, 310);
  pop();

  for (var i = 0; i < balls.length; i++) {
    showCannonBalls(balls[i], i);
    colisionWithBoat(i);
  }

  cannon.display();
  showBoats();
  textSize(40)
  textAlign(CENTER)
  fill ("#6d4c41")
  text("Score: "+score,width-200,50)
}
function keyReleased() {
  if (keyCode == DOWN_ARROW) {
    balls[balls.length - 1].shoot();
    cannonExplosionSound.play();
    cannonExplosionSound.setVolume(0.2);
  }
}
function keyPressed() {
  if (keyCode == DOWN_ARROW) {
    var cannonBall = new CannonBall(cannon.x, cannon.y);
    balls.push(cannonBall);
  }
}
function showCannonBalls(ball, i) {
  if (ball) {
    ball.display();

    if (ball.body.position.x >= width) {
      World.remove(world, ball.body);
      balls.splice(i, 1);
    }
    if (ball.body.position.y >= height - 50) {
      if (!ball.isSink) {
        cannonWaterSound.play();
        cannonWaterSound.setVolume(0.3);
        ball.removeBall(i);
        ball.animate();
      }
    }
  }
}
function showBoats() {
  if (boats.length > 0) {
    if (
      boats[boats.length - 1] == undefined ||
      boats[boats.length - 1].body.position.x < width - 300
    ) {
      var positions = [-40, -60, -70, -80, -20];
      var position = random(positions);
      var boat = new Boat(
        width,
        height - 60,
        170,
        170,
        position,
        boatAnimation
      );
      boats.push(boat);
    }
    for (var i = 0; i < boats.length; i++) {
      if (boats[i]) {
        Body.setVelocity(boats[i].body, { x: -1, y: 0 });
        boats[i].display();
        boats[i].animate();
        var collision = Matter.SAT.collides(tower, boats[i].body);
        if (collision.collided && !boats[i].isBroken) {
          if (!isLaughing && !pirateLaughSound.isPlaying()) {
            pirateLaughSound.play();
            pirateLaughSound.setVolume(0.7);
            isLaughing = true;
          }
          isGameOver = true;
          gameOver();
        }
      }
    }
  } else {
    var boat = new Boat(width, height - 60, 170, 170, -80, boatAnimation);
    boats.push(boat);
  }
}
function colisionWithBoat(index) {
  for (var i = 0; i < boats.length; i++) {
    if (balls[index] != undefined && boats[i] != undefined) {
      var collision = Matter.SAT.collides(balls[index].body, boats[i].body);
      if (collision.collided) {
        if (!boats[i].isBroken && !balls[index].isSink) {
          boats[i].removeBoat(i);
          World.remove(world, balls[index].body);
          balls.splice(index, 1);
          score+=5
        }
      }
    }
  }
}
function gameOver() {
  swal(
    {
      title: `Fim de Jogo!!!`,
      text: "Obrigada por jogar!!",
      imageUrl:
        "https://raw.githubusercontent.com/whitehatjr/PiratesInvasion/main/assets/boat.png",
      imageSize: "150x150",
      confirmButtonText: "Jogar Novamente",
    },
    function (isConfirm) {
      if (isConfirm) {
        location.reload();
      }
    }
  );
}
