let ball, engine
let blocks = []
let kreise = []
let balls = []
let collisions = []
let band
let bandrichtung = 0.0010
let rundeEcken = 15
let running = 0
let running1 = 0
let img
let img1
//let constraint
// function preload() {
//   img = loadImage('assets/001.png');
//   img1 = loadImage('assets/Holzbox.png');
// }

class Block {
  constructor(type, attrs, options) {
    this.type = type
    this.attrs = attrs
    this.tl = attrs.tl
    this.stroke = attrs.stroke
    this.strokeWeight = attrs.strokeWeight || 0
    this.fill = attrs.fill
    this.color = attrs.color
    this.options = options
    this.options.plugin = {
      block: this,
      update: this.update
    }
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
    } else {
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
        bandrichtung = 0.0022
        collide(pair.bodyA, pair.bodyA)
        console.log("Formänderung")
        Matter.World.remove(engine.world, [pair.bodyA])
        running = 2
      }
      if (pair.bodyA.label === "Farbänderung" || pair.bodyB.label === "Farbänderung") {
        collide(pair.bodyA, pair.bodyA)
        console.log("Farbänderung")
        Matter.World.remove(engine.world, [pair.bodyA])
        running1 = 2
      }
    })

    function collide(bodyBlock, bodyBall) {

      collisions.push({
        hit: bodyBlock.plugin.block,
        ball: bodyBall
      })
    }
  })

  Matter.Events.on(engine, 'beforeUpdate', function(event) {
    collisions.forEach((collision, i) => {
      Matter.Body.applyForce(collision.ball, collision.ball.position, {
        x: bandrichtung,
        y: 0
      })
    });

    collisions = []
  })

  let canvas = createCanvas(1920, 1080)
  
  // Erste Etage
  blocks.push(new Block('rect', {
    x: 340,
    y: 300,
    w: 680,
    h: 40,
    tl: 20,
    strokeWeight: 5,
    color: `none`
  }, {
    isStatic: true,
    restitution: 0,
    angle: -PI / 8,
    chamfer: {
      radius: 20
    },
    label: "band1"
  }))
  blocks.push(new Block('rect', {
    x: 1010,
    y: 340,
    w: 680,
    h: 40,
    tl: 20,
    strokeWeight: 5,
    color: `none`
  }, {
    isStatic: true,
    restitution: 0,
    chamfer: {
      radius: 20
    },
    label: "band1"
  }))
  blocks.push(new Block('rect', {
    x: 1550,
    y: 400,
    w: 400,
    h: 40,
    tl: 20,
    strokeWeight: 5,
    color: `none`
  }, {
    isStatic: true,
    restitution: 0,
    angle: -PI / 8,
    chamfer: {
      radius: 20
    },
    label: "band1"
  }))
  // zweite Etage
  blocks.push(new Block('rect', {
    x: 1570,
    y: 700,
    w: 680,
    h: 40,
    tl: 20,
    strokeWeight: 5,
    color: `none`
  }, {
    isStatic: true,
    restitution: 0,
    chamfer: {
      radius: 20
    },
    label: "band1"
  }))
  blocks.push(new Block('rect', {
    x: 1910,
    y: 400,
    w: 10,
    h: 200,
    tl: 20,
    strokeWeight: 5,
    color: `white`
  }, {
    isStatic: true,
    angle: PI / 12,
    restitution: 0,
  }))
  blocks.push(new Block('rect', {
    x: 970,
    y: 610,
    w: 550,
    h: 40,
    tl: 20,
    strokeWeight: 5,
    color: `none`
  }, {
    isStatic: true,
    restitution: 0,
    angle: PI / 06,
    chamfer: {
      radius: 20
    },
    label: "band1"
  }))
  blocks.push(new Block('rect', {
    x: 500,
    y: 510,
    w: 400,
    h: 40,
    tl: 20,
    strokeWeight: 5,
    color: `none`
  }, {
    isStatic: true,
    restitution: 0,
    chamfer: {
      radius: 20
    },
    label: "band1"
  }))

  //dritte Etage
  blocks.push(new Block('rect', {
    x: 370,
    y: 860,
    w: 680,
    h: 40,
    tl: 20,
    strokeWeight: 5,
    color: `none`
  }, {
    isStatic: true,
    restitution: 0,
    chamfer: {
      radius: 20
    },
    label: "band1"
  }))
  blocks.push(new Block('rect', {
    x: 30,
    y: 810,
    w: 10,
    h: 50,
    tl: 20,
    strokeWeight: 5,
    color: `white`
  }, {
    isStatic: true,
    angle: -PI / 12,
    restitution: 0,
  }))

  //vierte Etage
  blocks.push(new Block('rect', {
    x: 1040,
    y: 950,
    w: 680,
    h: 40,
    tl: 20,
    strokeWeight: 5,
    color: `none`
  }, {
    isStatic: true,
    restitution: 0,
    chamfer: {
      radius: 20
    },
    label: "band1"
  }))


  ball = new Ball({
    x: 100,
    y: 100,
    w: 30,
    h: 30,
    tl: 20,
    strokeWeight: 5,
    color: 'red'
  }, {
    isStatic: false,
    restitution: 0,
    frictionAir: 0,
    chamfer: {
      radius: rundeEcken
    },
    label: "ball"
  })
  ball1 = new Ball({
    x: 940,
    y: 300,
    w: 30,
    h: 30,
    tl: 20,
    strokeWeight: 5,
    color: 'red'
  }, {
    isStatic: false,
    restitution: 0,
    frictionAir: 0,
    density: 0.002,
    label: "quadrat"
  })
  ball2 = new Ball({
    x: 1400,
    y: 605,
    w: 30,
    h: 30,
    tl: 20,
    strokeWeight: 5,
    color: 'green'
  }, {
    isStatic: false,
    restitution: 0,
    frictionAir: 0,
    density: 0.003,
    label: "quadrat"
  })
  ball3 = new Ball({
    x: 320,
    y: 800,
    w: 30,
    h: 30,
    tl: 20,
    strokeWeight: 5,
    color: 'red'
  }, {
    isStatic: false,
    restitution: 0,
    frictionAir: 0,
    chamfer: {
      radius: rundeEcken
    },
    label: "vieleck"
  })


  blocks.push(new Block('rect', {
    x: 900,
    y: 300,
    w: 10,
    h: 10,
    strokeWeight: 5,
    color: 'black'
  }, {
    isStatic: true,
    restitution: 0,
    label: "Formänderung"
  }))
  blocks.push(new Block('rect', {
    x: 1780,
    y: 655,
    w: 10,
    h: 10,
    strokeWeight: 5,
    color: 'black'
  }, {
    isStatic: true,
    restitution: 0,
    label: "Farbänderung"
  }))
  blocks.push(new Block('rect', {
    x: 300,
    y: 820,
    w: 10,
    h: 10,
    strokeWeight: 5,
    color: 'black'
  }, {
    isStatic: true,
    restitution: 0,
    label: "Formänderung1"
  }))

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

  Matter.Engine.run(engine)
}

function draw() {
  background(155, 50);
  blocks.forEach((block, i) => {
    block.show()
  });
  ball.show()
  if (running > 1) {
    ball1.show(), console.log('true')
  }
  if (running1 > 1) {
    ball2.show(), console.log('true')
  }
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
      bandrichtung = bandrichtung * -1
      break;
    default:
      console.log("KeyCode ist: " + keyCode)
  }
}
