Homeworks.aufgabe = 7;
let ball, engine
let blocks = []
let kreise = []
let balls= []
let collisions = []
let band
let bandrichtung = 0.0010
let sensors = []
let rundeEcken = 15
let running = 0
let running1 = 0
let img
let img1
let constraint
// function preload() {
//   img = loadImage('assets/001.png');
//   img1 = loadImage('assets/Holzbox.png');
// }

class Block {
  constructor(type, attrs, options) {
    // this.x = attrs.x
    // this.y = attrs.y
    // this.w = attrs.w
    // this.h = attrs.h
    // this.tl = attrs.tl
    // this.stroke = attrs.stroke
    // this.strokeWeight = attrs.strokeWeight || 0
    // this.fill = attrs.fill
    // this.color = attrs.color
    // this.body = Matter.Bodies.rectangle(this.x + this.w / 2, this.y + this.h / 2, this.w, this.h, options)
    this.type = type
    this.attrs = attrs
    this.tl = attrs.tl
    this.stroke = attrs.stroke
    this.strokeWeight = attrs.strokeWeight || 0
    this.fill = attrs.fill
    this.color = attrs.color
    this.options = options
    this.options.plugin = { block: this, update: this.update }
    switch (this.type) {
      case 'rect':
        this.body = Matter.Bodies.rectangle(attrs.x, attrs.y, attrs.w, attrs.h, this.options)
        break

      case 'path':
        let path = document.getElementById(attrs.elem)
        if (null != path) {
          this.body = Matter.Bodies.fromVertices(0, 0, Matter.Vertices.scale(Matter.Svg.pathToVertices(path, 10), this.attrs.scale, this.attrs.scale), this.options)
          Matter.Body.setPosition(this.body, this.attrs)
        }
        break
      }
    Matter.World.add(engine.world, [this.body])
  }


  show() {
    if (this.color == "none") {
      noFill()
    }
    else {
          fill(this.color)
    }
    strokeWeight(this.strokeWeight)
    drawBody(this.body)
  }
}
class Kreis {
  constructor(attrs, options) {
    this.x = attrs.x
    this.y = attrs.y
    this.color = attrs.color
    this.size = attrs.size
    this.body = Matter.Bodies.circle(this.x, this.y, this.size / 2, options)
    Matter.World.add(engine.world, [this.body])
  }
  show() {
    fill(this.color)
    drawBody(this.body)
  }
}
class Ball {
  constructor(attrs, options) {
    this.x = attrs.x
    this.y = attrs.y
    this.w = attrs.w
    this.h = attrs.h
    this.tl = attrs.tl
    this.stroke = attrs.stroke
    this.strokeWeight = attrs.strokeWeight || 0
    this.fill = attrs.fill
    this.color = attrs.color
    this.body = Matter.Bodies.rectangle(this.x + this.w / 2, this.y + this.h / 2, this.w, this.h, options)
    Matter.World.add(engine.world, [this.body])
  }

  show() {
    fill(this.color)
    drawBody(this.body)
  }
}
function setup() {
  engine = Matter.Engine.create()
  Matter.Events.on(engine, 'collisionActive', function(event) {
    console.log("collision")
    var pairs = event.pairs
    pairs.forEach((pair, i) => {
      if (pair.bodyA.label === "band1" || pair.bodyB.label === "band1") {
        collide(pair.bodyA, pair.bodyB)
        console.log("1")
      }
      if (pair.bodyA.label === "band2" || pair.bodyB.label === "band2") {
        collide(pair.bodyA, pair.bodyB)
        console.log("2")
      }
      if (pair.bodyA.label === "Formänderung" || pair.bodyB.label === "Formänderung") {
        bandrichtung = 0.0032
        collide(pair.bodyA, pair.bodyA)
        console.log("Formänderung")
        Matter.World.remove(engine.world,[pair.bodyA])
        // Matter.add.add(engine.world, [ball1])
        // bandrichtung = 0.1
        running = 2
      }
      if (pair.bodyA.label === "Farbänderung" || pair.bodyB.label === "Farbänderung") {
        collide(pair.bodyA, pair.bodyA)
        console.log("Farbänderung")
        Matter.World.remove(engine.world,[pair.bodyA])
        // Matter.add.add(engine.world, [ball1])
        // bandrichtung = 0.1
        running1 = 2
      }
    })

    // pairs.forEach((pair, i) => {
    //   if (pair.bodyA.label === "sensor" || pair.bodyA.label === "ball") {
    //     collide(pair.bodyA, pair.bodyB)
    //   }
    //   if (pair.bodyB.label === "sensor"|| pair.bodyB.label === "ball") {
    //     collide(pair.bodyB, pair.bodyA)
    //   }
    // })

    // check for collision between Block and ball
    function collide(bodyBlock, bodyBall) {

        // remember the collision for processing in 'beforeUpdate'
        collisions.push({hit: bodyBlock.plugin.block, ball: bodyBall})
        // sensors.push({hit: bodyBlock.plugin.block, ball: bodyBall})
    }
  })

  Matter.Events.on(engine, 'beforeUpdate', function(event) {
    // process collisions at the right time
    collisions.forEach((collision, i) => {
        // "inform" blocks: got hit by a ball
        // collision.hit.update(collision.ball)
        Matter.Body.applyForce(collision.ball, collision.ball.position, {x: bandrichtung , y: 0})
  });

  collisions = []


// console.log("sensor")
//   sensors.forEach((sensor, i) => {
      //Matter.Body.applyForce(sensor.ball, sensor.ball.position, {x: bandrichtung , y: 0})
// });
//
//   sensors = []
})

  // Matter.Events.on(engine, 'collisionActive', function(event) {
  //     const pairs = event.pairs[0];
  //     const bodyA = pairs.bodyA;
  //     const bodyB = pairs.bodyB;
  //     if (bodyA.label === "band" || bodyB.label === "band") {
  //     console.log("treffer");
  //     if (bodyA.label === "band") {
  //       Matter.Body.applyForce (bodyB, {x: this.x, y: this.y}, {x: this.x+2, y: this.y})
  //     } else {
  //       Matter.Body.applyForce (bodyA, {x: this.x, y: this.y}, {x: this.x+1, y: this.y})
  //     }
  //     // Matter.Body.applyForce(ball.position, { x: 0.00, y: 0 })
  //     //Hier//
  //     }
  //   });

  let canvas = createCanvas(1920, 1080)

  //blocks.push(new Block('circle',{ x: 300, y: 300, s:40, color: `black`}, { isStatic: true }))


// Erste Etage
  blocks.push(new Block('rect',{ x: 340, y: 300, w: 680, h:40, tl: 20, strokeWeight: 5, color: `none` }, {isStatic: true, restitution: 0 , angle: - PI/8, chamfer:{radius:20} ,label: "band1" }))
      kreise.push(new Kreis({ x: 45, y: 422, color: `black`, size: 25}, { isStatic: true, }))
      kreise.push(new Kreis({ x: 350, y: 296, color: `black`, size: 25}, { isStatic: true, }))
      kreise.push(new Kreis({ x: 635, y: 178, color: `black`, size: 25}, { isStatic: true, }))
  blocks.push(new Block('rect',{ x: 1010, y: 300, w: 680, h:40, tl: 20, strokeWeight: 5, color: `none` }, {isStatic: true, restitution: 0 , chamfer:{radius:20} ,label: "band1" }))
      kreise.push(new Kreis({ x: 691, y: 300, color: `black`, size: 25}, { isStatic: true, }))
      kreise.push(new Kreis({ x: 1010, y: 300, color: `black`, size: 25}, { isStatic: true, }))
      kreise.push(new Kreis({ x: 1329, y: 300, color: `black`, size: 25}, { isStatic: true, }))
  blocks.push(new Block('rect',{ x: 1600, y: 400, w: 400, h:40, tl: 20, strokeWeight: 5, color: `none` }, {isStatic: true, restitution: 0 ,angle: - PI/8, chamfer:{radius:20} ,label: "band1" }))
      kreise.push(new Kreis({ x: 1435, y: 469, color: `black`, size: 25}, { isStatic: true, }))
      kreise.push(new Kreis({ x: 1766, y: 331, color: `black`, size: 25}, { isStatic: true, }))

// zweite Etage
  blocks.push(new Block('rect',{ x: 1570, y: 700, w: 680, h:40, tl: 20, strokeWeight: 5, color: `none` }, {isStatic: true, restitution: 0 , chamfer:{radius:20} ,label: "band1" }))
      kreise.push(new Kreis({ x: 1251, y: 700, color: `black`, size: 25}, { isStatic: true, }))
      kreise.push(new Kreis({ x: 1570, y: 700, color: `black`, size: 25}, { isStatic: true, }))
      kreise.push(new Kreis({ x: 1889, y: 700, color: `black`, size: 25}, { isStatic: true, }))
  blocks.push(new Block('rect',{ x: 970, y: 610, w: 550, h:40, tl: 20, strokeWeight: 5, color: `none` }, {isStatic: true, restitution: 0 , angle:  PI/06, chamfer:{radius:20} ,label: "band1" }))
      kreise.push(new Kreis({ x: 750, y: 483, color: `black`, size: 25}, { isStatic: true, }))
      kreise.push(new Kreis({ x: 972, y: 612, color: `black`, size: 25}, { isStatic: true, }))
      kreise.push(new Kreis({ x: 1190, y: 737, color: `black`, size: 25}, { isStatic: true, }))
  blocks.push(new Block('rect',{ x: 500, y: 510, w: 400, h:40, tl: 20, strokeWeight: 5, color: `none` }, {isStatic: true, restitution: 0 , chamfer:{radius:20} ,label: "band1" }))
      kreise.push(new Kreis({ x: 322, y: 510, color: `black`, size: 25}, { isStatic: true, }))
      kreise.push(new Kreis({ x: 678, y: 510, color: `black`, size: 25}, { isStatic: true, }))

//dritte Etage
  blocks.push(new Block('rect',{ x: 370, y: 860, w: 680, h:40, tl: 20, strokeWeight: 5, color: `none` }, {isStatic: true, restitution: 0 , chamfer:{radius:20} ,label: "band1" }))
      kreise.push(new Kreis({ x: 51, y: 860, color: `black`, size: 25}, { isStatic: true, }))
      kreise.push(new Kreis({ x: 370, y: 860, color: `black`, size: 25}, { isStatic: true, }))
      kreise.push(new Kreis({ x: 689, y: 860, color: `black`, size: 25}, { isStatic: true, }))

//vierte Etage
  blocks.push(new Block('rect',{ x: 1040, y: 950, w: 680, h:40, tl: 20, strokeWeight: 5, color: `none` }, {isStatic: true, restitution: 0 , chamfer:{radius:20} ,label: "band1" }))
      kreise.push(new Kreis({ x: 721, y: 950, color: `black`, size: 25}, { isStatic: true, }))
      kreise.push(new Kreis({ x: 1040, y: 950, color: `black`, size: 25}, { isStatic: true, }))
      kreise.push(new Kreis({ x: 1359, y: 950, color: `black`, size: 25}, { isStatic: true, }))

/* Abprallbalken */
  blocks.push(new Block('rect',{ x: 1910, y: 400, w: 10, h: 200, tl: 20, strokeWeight: 5, color: `white` }, {isStatic: true, angle:  PI/12, restitution: 0 ,}))
  blocks.push(new Block('rect',{ x: 30, y: 810, w: 10, h: 50, tl: 20, strokeWeight: 5, color: `white` }, {isStatic: true, angle:  - PI/12, restitution: 0 ,}))

/*Bälle*/
  ball = new Ball({ x: 200, y: 100, w: 30, h: 30, tl: 20, strokeWeight: 5, color: 'red' }, { isStatic: false, restitution: 0, frictionAir: 0, chamfer:{radius: rundeEcken}, label: "ball"})
  ball1 = new Ball({x: 1100, y: 260, w: 30, h: 30, tl: 20, strokeWeight: 5, color: 'red'}, { isStatic: false, restitution: 0, frictionAir: 0, density: 0.003, label: "quadrat"})
  ball2 = new Ball({x: 520, y: 470, w: 30, h: 30, tl: 20, strokeWeight: 5, color: 'green'}, { isStatic: false, restitution: 0, frictionAir: 0, density: 0.003, label: "quadrat"})

/*Farb- und Formänderung*/
  blocks.push(new Block('rect',{ x: 1000, y: 260, w: 10, h: 10, strokeWeight: 5, color: 'black'}, {isStatic: true, restitution: 0, label: "Formänderung"}))
  blocks.push(new Block('rect',{ x: 570, y: 470, w: 10, h: 10, strokeWeight: 5, color: 'black'}, {isStatic: true, restitution: 0, label: "Farbänderung"}))

  blocks.push(new Block('rect',{ x: 555, y: 470, w: 5, h: 10, strokeWeight: 5, color: 'black'}, {isStatic: true, restitution: 0}))
  // blocks.push(new Block({ x: 650, y: 235, w: 10, h: 10, tl: 20, strokeWeight: 5, color: `black` }, {isStatic: true, restitution: 0, label: "sensor"}))

  //blocks.push(new Block('path', { x: 1500, y: 850, elem: 'wolke', scale: 1.0, color: 'red', force: { x: 0.0, y: -1.0 } }, { isStatic: true, friction: 0.0 }))
  // blocks.push(new Block('path', { x: 1550, y: 600, elem: 'kiste', scale: 1.0, color: 'black', force: { x: 0.0, y: 0.0 } }, { isStatic: true, friction: 0.0 }))
  // blocks.push(new Block('path', { x: 350, y: 300, elem: 'zahnrad', scale: 0.3, color: 'black', force: { x: 0.0, y: 0.0 } }, { isStatic: false, frictionAir: 0.0 }))
  //blocks.push(new Block('path', { x: 500, y: 300, elem: 'band', scale: 1.2, color: 'black'}, { isStatic: true, restitution: 0, frictionAir: 0.0, label: "band1" }))

// let body = blocks[4].body
// constraint = Matter.Constraint.create({
//         bodyA: body,
//         pointB: { x: body.position.x , y: body.position.y }
//       });
//       Matter.World.add(engine.world, [constraint]);
//
//       Matter.Body.applyForce(body,{x: 0, y: 0}, {x: 0.00002, y: 0.0})

  //blocks.push(new Block('path', { x: 150, y: 200, elem: 'zahnrad', scale: 1.0, color: 'black', force: { x: 0.0, y: 0.0 } }, { isStatic: true, friction: 0.0 }))
  // Matter.World.remove(engine.world,['path'])
  // Matter.World.remove(engine.world,['path'])
  // // Process collisions - check whether ball hits a Block object
  // Matter.Events.on(engine, 'collisionStart', function(event) {
  //   var pairs = event.pairs
  //   pairs.forEach((pair, i) => {
  //     if (balls.includes(pair.bodyA)) {
  //       collide(pair.bodyB, pair.bodyA)
  //     }
  //     if (balls.includes(pair.bodyB)) {
  //       collide(pair.bodyA, pair.bodyB)
  //     }
  //   })
    // check for collision between Block and ball
  //   function collide(bodyBlock, bodyBall) {
  //     // check if bodyBlock is really a body in a Block class
  //     if (bodyBlock.plugin && bodyBlock.plugin.block) {
  //       console.log(collision.hit)
  //       // remember the collision for processing in 'beforeUpdate'
  //       collisions.push({ hit: bodyBlock.plugin.block, ball: bodyBall })
  //     }
  //   }
  // })
  // Matter.Events.on(engine, 'beforeUpdate', function(event) {
  //   // process collisions at the right time
  //   collisions.forEach((collision, i) => {
  //     // "inform" blocks: got hit by a ball
  //     collision.hit.update(collision.ball)
  //   });
  //   collisions = []
  // })

  // drawSprite(ball, img1);
  // function draw () {}
  Matter.Engine.run(engine)
}

function draw() {
  background(155, 50);
  blocks.forEach((block, i) => {
    block.show()
  });
  ball.show()
  if (running > 1) {ball1.show(), console.log('true')}
  if (running1 > 1) {ball2.show(), console.log('true')}
  kreise.forEach((kreis, i) => {
    kreis.show()
  });
  //image(img, 300, 240);
  // image(img1, 1480, 500);
  // img1.resize(120,120)

  // drawSprite(ball, img1);
  // drawSprite (ball,ballImg,scalefish)
}
function drawBody(body) {
  if (body.parts && body.parts.length > 1) {
    for (var p = 1; p < body.parts.length; p++) {
      drawVertices(body.parts[p].vertices)
    }
  } else {
    if (body.type == "composite") {
      for (let b = 0; b < body.bodies.length; b++) {
        drawVertices(body.bodies[b].vertices)
      }
    } else {
      drawVertices(body.vertices)
    }
  }
}

// function drawSprite(body, img) {
//   const pos = body.position;
//   const angle = body.angle;
//   push();
//   translate(pos.x, pos.y);
//   rotate(angle);
//   imageMode(CENTER);
//   image(img, 0, 0);
//   pop();
// }
function drawVertices(vertices) {
  beginShape()
  for (var i = 0; i < vertices.length; i++) {
    vertex(vertices[i].x, vertices[i].y)
  }
  endShape(CLOSE)
}
function keyPressed() {
  switch (keyCode) {
    case 32:
      console.log('Leertaste')
      bandrichtung = bandrichtung *-1
      break;
    default:
      console.log("KeyCode ist: " + keyCode)
  }
}
