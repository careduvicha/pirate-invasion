const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;

let engine, world

var ground;
var tower, towerImg
var bgImg
var cannon
var angle=20

function preload() {
  bgImg = loadImage("./assets/background.gif")
  towerImg = loadImage("./assets/tower.png")
}

function setup() {

  canvas = createCanvas(1200, 600);
  engine = Engine.create();
  world = engine.world;
  ground = Bodies.rectangle(0, height - 1, width * 2, 1, { isStatic: true })

  World.add(world, ground)

  tower = Bodies.rectangle(160, 350, 160, 310, { isStatic: true })
  World.add(world, tower)

  cannon=new Cannon(180,110,130,100,angle)
}

function draw() {
  background(189);

  image(bgImg, 0, 0, width, height)
  Engine.update(engine);
  rect(ground.position.x, ground.position.y, width * 2, 1)

  push()
  imageMode(CENTER)
  image(towerImg, tower.position.x, tower.position.y, 160, 310)
  pop()
  
  cannon.display()
}
