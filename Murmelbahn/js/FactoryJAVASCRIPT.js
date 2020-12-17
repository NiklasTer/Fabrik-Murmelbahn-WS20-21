Homeworks.aufgabe = 8;
// Benedikt Groß
// Example is based on examples from: http://brm.io/matter-js/, https://github.com/shiffman/p5-matter
// Benno Stäbler: kopiert vom 02-mouse Beispiel, erweitert um komplexe Bodies und in die bekannte Struktur gebracht
// Hier ist alles mit Classes codiert
// Hier ist alles Gut!!
// Hier auch!!
let engine
let polySynth
let mouseConstraint
// blocks are Block class instances/objects, which can react to balls and have attributes together with a Matter body
let blocks = []
// balls are just plain Matter bodys right now
let balls = []
// collisions are needed to save
let collisions = []

class Block {
  constructor(type, attrs, options) {
    this.type = type
    this.attrs = attrs
    this.options = options
    this.options.plugin = { block: this, update: this.update }
    switch (this.type) {
      case 'rect':
        this.body = Matter.Bodies.rectangle(attrs.x, attrs.y, attrs.w, attrs.h, this.options)
        break
      case 'circle':
        this.body = Matter.Bodies.circle(attrs.x, attrs.y, attrs.s)
        break
      case 'parts':
        this.body = Matter.Body.create(this.options)
        Matter.Body.setPosition(this.body, this.attrs)
        break
      case 'points':
        let shape = Matter.Vertices.create(attrs.points, Matter.Body.create({}))
        this.body = Matter.Bodies.fromVertices(0, 0, shape, this.options)
        Matter.Body.setPosition(this.body, this.attrs)
        break
      case 'path':
        let path = document.getElementById(attrs.elem)
        if (null != path) {
          this.body = Matter.Bodies.fromVertices(0, 0, Matter.Vertices.scale(Matter.Svg.pathToVertices(path, 10), this.attrs.scale, this.attrs.scale), this.options)
          Matter.Body.setPosition(this.body, this.attrs)
        }
        break
      case 'group':
        this.body = Matter.Composites.stack(this.attrs.x, this.attrs.y, this.attrs.cols, this.attrs.rows, this.attrs.colGap, this.attrs.rowGap, this.attrs.create)
        break
    }
    Matter.World.add(engine.world, [this.body])
  }

  constrainTo(block) {
    let constraint
    if (block) {
      constraint = Matter.Constraint.create({
        bodyA: this.body,
        bodyB: block.body
      })
    } else {
      constraint = Matter.Constraint.create({
        bodyA: this.body,
        pointB: { x: this.body.position.x, y: this.body.position.y }
      })
    }
    Matter.World.add(engine.world, [constraint])
    constraints.push(constraint)
  }

  update(ball) {
    polySynth.play('C4', 0.1, 0, 0.3);
    if (this.attrs.force) {
      Matter.Body.applyForce(ball, ball.position, this.attrs.force)
    }
  }

  show() {
    fill(this.attrs.color)
    drawBody(this.body)
  }
}

function setup() {
  // enable sound
  polySynth = new p5.PolySynth()
  let canvas = createCanvas(windowWidth, windowHeight)

  // create an engine
  engine = Matter.Engine.create()

  // create three boxes, two circles and a slope
  blocks.push(new Block('rect', { x: 200, y: 200, w: 10, h: 10, color: 'blue' }, { isStatic: false }))
  blocks.push(new Block('rect', { x: 270, y: 50, w: 160, h: 80, color: 'green' }, { isStatic: false }))
  blocks.push(new Block('rect', { x: 170, y: 50, w: 30, h: 30, color: 'blue', force: { x: 5.0, y: 0.0 } }, { isStatic: false }))
  blocks.push(new Block('circle', { x: 10, y: 20, s: 10, color: 'blue' }, { isStatic: false }))
  blocks.push(new Block('circle', { x: 100, y: 50, s: 40, color: 'blue' }, { isStatic: false }))
  blocks.push(new Block('rect', { x: 400, y: 400, w: 810, h: 10, color: 'grey' }, { isStatic: true, angle: Math.PI * 0.06 }))

  // create a body from multiple parts
  let options = { parts: [], isStatic: true, friction: 0.0 }
  let w = 4
  options.parts.push(Matter.Bodies.rectangle(w, 20, 5, 20))
  options.parts.push(Matter.Bodies.rectangle(40 - w, 20, 5, 20))
  options.parts.push(Matter.Bodies.rectangle(20, +40 - w, 50, 5))
  blocks.push(new Block('parts', { x: 220, y: 130, color: 'red' }, options))

  // create a body from points
  let pts = [{ x: 0, y: 0 }, { x: 20, y: 10 }, { x: 200, y: 30 }, { x: 220, y: 50 }, { x: 10, y: 20 }]
  blocks.push(new Block('points', { x: 400, y: 100, points: pts, color: 'red' }, { isStatic: true }))

  // create a body from a SVG path
  blocks.push(new Block('path', { x: 970, y: 850, elem: 'ramp', scale: 1.0, color: 'red', force: { x: 0.0, y: -1.0 } }, { isStatic: true, friction: 0.0 }))

  // create a group of identical bodies
  blocks.push(new Block('group', { x: 550, y: 100, cols: 10, rows: 10, colGap: 5, rowGap: 5, color: 'red', create: (bx, by) => Matter.Bodies.circle(bx, by, 10, { restitution: 0.9 }) }, {}))

  // setup mouse
  let mouse = Matter.Mouse.create(canvas.elt)
  let mouseParams = {
    mouse: mouse,
    constraint: { stiffness: 0.05, angularStiffness: 0 }
  }
  mouseConstraint = Matter.MouseConstraint.create(engine, mouseParams)
  mouseConstraint.mouse.pixelRatio = pixelDensity()
  Matter.World.add(engine.world, mouseConstraint)

  // react on mouseup: create new balls
  Matter.Events.on(mouseConstraint, 'mouseup', function(event) {
    let ball = Matter.Bodies.circle(event.mouse.position.x, event.mouse.position.y, 16, {
      density: 0.1,
      //restitution: 0.9,
      friction: 0.0
    })
    Matter.World.add(engine.world, ball)
    balls.push(ball)
    Matter.Body.applyForce(ball, ball.position, { x: 0.5, y: -1.5 })
  })

  // Process collisions - check whether ball hits a Block object
  Matter.Events.on(engine, 'collisionStart', function(event) {
    var pairs = event.pairs
    pairs.forEach((pair, i) => {
      if (balls.includes(pair.bodyA)) {
        collide(pair.bodyB, pair.bodyA)
      }
      if (balls.includes(pair.bodyB)) {
        collide(pair.bodyA, pair.bodyB)
      }
    })
    // check for collision between Block and ball
    function collide(bodyBlock, bodyBall) {
      // check if bodyBlock is really a body in a Block class
      if (bodyBlock.plugin && bodyBlock.plugin.block) {
        // remember the collision for processing in 'beforeUpdate'
        collisions.push({ hit: bodyBlock.plugin.block, ball: bodyBall })
      }
    }
  })

  Matter.Events.on(engine, 'beforeUpdate', function(event) {
    // process collisions at the right time
    collisions.forEach((collision, i) => {
      // "inform" blocks: got hit by a ball
      collision.hit.update(collision.ball)
    });
    collisions = []
  })

  // double the gravity
  // engine.world.gravity.y = 2
  // run the engine automatically
  // Matter.Engine.run(engine)
  // start the engine on mouse click
  canvas.mousePressed(startEngine);

  document.addEventListener('keyup', onKeyUp)
}

function onKeyUp(evt) {
  switch (evt.key) {
    case ' ':
      startEngine()
      evt.preventDefault()
      break
  }
}

function startEngine() {
  if (0 == engine.timing.timestamp) {
    Matter.Engine.run(engine)
    userStartAudio()
  }
}

function draw() {
  background(0, 20)
  noStroke()

  blocks.forEach(block => block.show())
  fill(255, 0, 255)
  balls.forEach(ball => drawBody(ball))

  stroke('green')
  engine.world.constraints.forEach((constraint, i) => {
    if (constraint.label == "Mouse Constraint") {
      drawMouse(mouseConstraint)
    } else {
      drawConstraint(constraint)
    }
  })
}

function drawMouse(mouseConstraint) {
  if (mouseConstraint.body) {
    let pos = mouseConstraint.body.position
    let offset = mouseConstraint.constraint.pointB
    let m = mouseConstraint.mouse.position
    stroke(0, 255, 0)
    strokeWeight(2)
    line(pos.x + offset.x, pos.y + offset.y, m.x, m.y)
  }
}

function drawConstraint(constraint) {
  let posA = { x: 0, y: 0 }
  if (constraint.bodyA) {
    posA = constraint.bodyA.position
  }
  let posB = { x: 0, y: 0 }
  if (constraint.bodyB) {
    posB = constraint.bodyB.position
  }
  line(
    posA.x + constraint.pointA.x,
    posA.y + constraint.pointA.y,
    posB.x + constraint.pointB.x,
    posB.y + constraint.pointB.y
  )
}

function drawBody(body) {
  if (body.parts && body.parts.length > 1) {
    body.parts.filter((part, i) => i > 0).forEach((part, i) => {
      drawVertices(part.vertices)
    })
  } else {
    if (body.type == "composite") {
      body.bodies.forEach((body, i) => {
        drawVertices(body.vertices)
      })
    } else {
      drawVertices(body.vertices)
    }
  }
}

function drawVertices(vertices) {
  beginShape()
  vertices.forEach((vert, i) => {
    vertex(vert.x, vert.y)
  })
  endShape(CLOSE)
}
//Test2kjhk
