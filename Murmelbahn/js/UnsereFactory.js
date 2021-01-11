Homeworks.aufgabe = 7;
let ball, engine
let blocks = []
let kreise = []
let balls= []
let collisions = []
let band
let bandrichtung = 0.0003
let sensors = []

class Block {
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
    this.color = attrs.color
    this.size = attrs.size
    this.body = Matter.Bodies.circle(this.x, this.y, this.size / 2, options)
    Matter.World.add(engine.world, [this.body])
  }

  // update(ball) {
  //   if (this.attrs.force) {
  //     Matter.Body.applyForce(ball, ball.position, this.attrs.force)
  //   }
  // }

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
      if (pair.bodyA.label === "band" || pair.bodyB.label === "band") {
        collide(pair.bodyA, pair.bodyB)
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
console.log("treffer")
    collisions.forEach((collision, i) => {
        // "inform" blocks: got hit by a ball
        // collision.hit.update(collision.ball)
        Matter.Body.applyForce(collision.ball, collision.ball.position, {x: bandrichtung , y: 0})
  });

  collisions = []


console.log("sensor")
  sensors.forEach((sensor, i) => {
      //Matter.Body.applyForce(sensor.ball, sensor.ball.position, {x: bandrichtung , y: 0})
});

  sensors = []
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

  let canvas = createCanvas(windowWidth, windowHeight)
  kreise.push(new Kreis({ x: 500, y: 500, color: `black`, size: 40}, { isStatic: true, }))
  kreise.push(new Kreis({ x: 800, y: 500, color: `black`, size: 40}, { isStatic: true, }))
  kreise.push(new Kreis({ x: 1100, y: 500, color: `black`, size: 40}, { isStatic: true, }))
  blocks.push(new Block({ x: 460, y: 460, w: 680, h: 80, tl: 20, strokeWeight: 5, color: `none` }, {isStatic: true, restitution: 0 , chamfer:{radius: 40} ,label: "band" }))
  ball = new Ball({ x: 700, y: 300, color: 'red', size: 20 }, { isStatic: false, restitution: 0, frictionAir: 0, label: "ball"})

  blocks.push(new Block({ x: 850, y: 435, w: 10, h: 10, tl: 20, strokeWeight: 5, color: `black` }, {isStatic: true, restitution: 0, label: "sensor"}))
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
  Matter.Engine.run(engine)
}

function draw() {
  background(255, 50);
  blocks.forEach((block, i) => {
    block.show()
  });
  ball.show()
  kreise.forEach((kreis, i) => {
    kreis.show()
  });
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
