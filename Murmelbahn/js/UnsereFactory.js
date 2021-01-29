let ball, engine
let blocks = []
let kreise = []
let balls = []
let collisions = []
let band
let bandrichtung = 0.0012
let rundeEcken = 20
let running = 0
let running1 = 0
let img
let img1
let angleGear = 0
let imgChange = 0
let gearDirectionCW = true
let formSound
let formSound1
let farbSound
let tadaaSound
let backgroundsound

function preload() {
  img = loadImage('assets/Foerderbaender.png');
  img1 = loadImage('assets/Holzbox.png');
  img2 = loadImage('assets/Perle.png');
  img3 = loadImage('assets/Deckel.png')
  img4 = loadImage('assets/BoxStempel.png')
  img5 = loadImage('assets/Zahnrad.png')
  img6 = loadImage('assets/Farbaenderung.png')
  img7 = loadImage('assets/Formaenderung2.png')
  img8 = loadImage('assets/Formaenderung1.png')
  img9 = loadImage('assets/Perle1.png')
  img10 = loadImage('assets/Perle2.png')
  img11 = loadImage('assets/Deckelhalter.png')

}

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
backgroundsound = loadSound('assets/backgroundsound.mp3')
formSound = loadSound('assets/Form.mp3')
formSound.playMode('sustain');
formSound1 = loadSound('assets/Form1.mp3')
formSound1.playMode('sustain');
farbSound = loadSound('assets/Farbe.mp3')
farbSound.playMode('sustain');
tadaaSound = loadSound('assets/Tadaa.mp3')
tadaaSound.playMode('sustain');
  engine = Matter.Engine.create()
  Matter.Events.on(engine, 'collisionActive', function(event) {
    //console.log("collision")
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
        formSound.play();
        bandrichtung = 0.003
        Matter.Body.setStatic(ball1.body, false)
        collide(pair.bodyA, pair.bodyA)
        console.log("Formänderung")
        Matter.World.remove(engine.world, [pair.bodyA])
        running = 2
      }
      if (pair.bodyA.label === "Formänderung1" || pair.bodyB.label === "Formänderung1") {
          formSound1.play();
        bandrichtung = -0.002
        Matter.Body.setStatic(ball2.body, false)
        collide(pair.bodyA, pair.bodyA)
        console.log("Formänderung1")
        Matter.World.remove(engine.world, [pair.bodyA])
        running = 2
      }
      if (pair.bodyA.label === "Farbänderung" || pair.bodyB.label === "Farbänderung") {
          farbSound.play();
        Matter.Body.setStatic(ball3.body, false)
        collide(pair.bodyA, pair.bodyA)
        console.log("Farbänderung")
        Matter.World.remove(engine.world, [pair.bodyA])
        running1 = 2
      }
      if (pair.bodyA.label === "DeckelTrigger" || pair.bodyB.label === "DeckelTrigger") {
        Matter.Body.setStatic(deckel.body, false)
        collide(pair.bodyA, pair.bodyA)
        console.log("Deckel")
        Matter.World.remove(engine.world, [pair.bodyA])
        running1 = 2
        imgChange = 2
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

  //blocks.push(new Block('circle',{ x: 300, y: 300, s:40, color: `black`}, { isStatic: true }))


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
  // kreise.push(new Kreis({
  //   x: 1214,
  //   y: 715,
  //   color: `black`,
  //   size: 10
  // }, {
  //   isStatic: true,
  // }))
  // kreise.push(new Kreis({
  //   x: 635,
  //   y: 178,
  //   color: `black`,
  //   size: 25
  // }, {
  //   isStatic: true,
  // }))
  blocks.push(new Block('rect', {
    x: 1010,
    y: 300,
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
  // kreise.push(new Kreis({
  //   x: 691,
  //   y: 300,
  //   color: `black`,
  //   size: 25
  // }, {
  //   isStatic: true,
  // }))
  // kreise.push(new Kreis({
  //   x: 1010,
  //   y: 300,
  //   color: `black`,
  //   size: 25
  // }, {
  //   isStatic: true,
  // }))
  // kreise.push(new Kreis({
  //   x: 1329,
  //   y: 300,
  //   color: `black`,
  //   size: 25
  // }, {
  //   isStatic: true,
  // }))
  blocks.push(new Block('rect', {
    x: 1600,
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
  // kreise.push(new Kreis({
  //   x: 1435,
  //   y: 469,
  //   color: `black`,
  //   size: 25
  // }, {
  //   isStatic: true,
  // }))
  // kreise.push(new Kreis({
  //   x: 1766,
  //   y: 331,
  //   color: `black`,
  //   size: 25
  // }, {
  //   isStatic: true,
  // }))

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
  // kreise.push(new Kreis({
  //   x: 1251,
  //   y: 700,
  //   color: `black`,
  //   size: 25
  // }, {
  //   isStatic: true,
  // }))
  // kreise.push(new Kreis({
  //   x: 1570,
  //   y: 700,
  //   color: `black`,
  //   size: 25
  // }, {
  //   isStatic: true,
  // }))
  // kreise.push(new Kreis({
  //   x: 1889,
  //   y: 700,
  //   color: `black`,
  //   size: 25
  // }, {
  //   isStatic: true,
  // }))
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
  // kreise.push(new Kreis({
  //   x: 750,
  //   y: 483,
  //   color: `black`,size: 25
  // }, {
  //   isStatic: true,
  // }))
  // kreise.push(new Kreis({
  //   x: 972,
  //   y: 612,
  //   color: `black`,
  //   size: 25
  // }, {
  //   isStatic: true,
  // }))
  // kreise.push(new Kreis({
  //   x: 1190,
  //   y: 737,
  //   color: `black`,
  //   size: 25
  // }, {
  //   isStatic: true,
  // }))
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
  // kreise.push(new Kreis({
  //   x: 322,
  //   y: 510,
  //   color: `black`,
  //   size: 25
  // }, {
  //   isStatic: true,
  // }))
  // kreise.push(new Kreis({
  //   x: 678,
  //   y: 510,
  //   color: `black`,
  //   size: 25
  // }, {
  //   isStatic: true,
  // }))

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
  // kreise.push(new Kreis({
  //   x: 51,
  //   y: 860,
  //   color: `black`,
  //   size: 25
  // }, {
  //   isStatic: true,
  // }))
  // kreise.push(new Kreis({
  //   x: 370,
  //   y: 860,
  //   color: `black`,
  //   size: 25
  // }, {
  //   isStatic: true,
  // }))
  // kreise.push(new Kreis({
  //   x: 689,
  //   y: 860,
  //   color: `black`,
  //   size: 25
  // }, {
  //   isStatic: true,
  // }))

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
  // kreise.push(new Kreis({
  //   x: 721,
  //   y: 950,
  //   color: `black`,
  //   size: 25
  // }, {
  //   isStatic: true,
  // }))
  // kreise.push(new Kreis({
  //   x: 1040,
  //   y: 950,
  //   color: `black`,
  //   size: 25
  // }, {
  //   isStatic: true,
  // }))
  // kreise.push(new Kreis({
  //   x: 1359,
  //   y: 950,
  //   color: `black`,
  //   size: 25
  // }, {
  //   isStatic: true,
  // }))

  /* Abprallbalken */
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

  /*Deckel*/
  deckel = new Block('rect', {
    x: 1500,
    y: 800,
    w: 120,
    h: 10,
    strokeWeight: 5,
    color: 'black'
  }, {
    isStatic: true,
    restitution: 0,
    label: "Deckel"
  })


  ball = new Ball({
    x: 100,
    y: 100,
    w: 40,
    h: 40,
    tl: 20,
    strokeWeight: 5,
    color: 'none'
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
    y: 240,
    w: 38,
    h: 38,
    tl: 20,
    strokeWeight: 5,
    color: 'none'
  }, {
    isStatic: true,
    restitution: 0,
    frictionAir: 0,
    chamfer: {
      radius: 12
    },
    density: 0.002,
    label: "quadrat"
  })
  ball2 = new Ball({
    x: 1500,
    y: 630,
    w: 40,
    h: 40,
    tl: 20,
    strokeWeight: 5,
    color: 'none'
  }, {
    isStatic: true,
    restitution: 0,
    frictionAir: 0,
    chamfer: {
      radius: rundeEcken
    },
    density: 0.002,
    label: "quadrat"
  })
  ball3 = new Ball({
    x: 340,
    y: 800,
    w: 40,
    h: 40,
    tl: 20,
    strokeWeight: 5,
    color: 'none'
  }, {
    isStatic: true,
    restitution: 0,
    frictionAir: 0,
    density: 0.002,
    chamfer: {
      radius: rundeEcken
    },
    label: "vieleck"
  })



  blocks.push(new Block('rect', {
    x: 900,
    y: 260,
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
    x: 920,
    y: 260,
    w: 10,
    h: 10,
    strokeWeight: 5,
    color: 'black'
  }, {
    isStatic: true,
    restitution: 0,
    label: "Stopper"
  }))
  blocks.push(new Block('rect', {
    x: 1600,
    y: 655,
    w: 10,
    h: 10,
    strokeWeight: 5,
    color: 'black'
  }, {
    isStatic: true,
    restitution: 0,
    label: "Formänderung1"
  }))
  blocks.push(new Block('rect', {
    x: 1580,
    y: 655,
    w: 10,
    h: 10,
    strokeWeight: 5,
    color: 'black'
  }, {
    isStatic: true,
    restitution: 0,
    label: "Stopper"
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
    label: "Farbänderung"
  }))
  blocks.push(new Block('rect', {
    x: 320,
    y: 820,
    w: 1,
    h: 1,
    strokeWeight: 5,
    color: 'black'
  }, {
    isStatic: true,
    restitution: 0,
    label: "Stopper"
  }))
  blocks.push(new Block('rect', {
    x: 1214,
    y: 715,
    w: 1,
    h: 1,
    //strokeWeight: 5,
    color: 'white'
  }, {
    isStatic: true,
    restitution: 0,
    label: "Stopper"
  }))

  blocks.push(new Block('rect', {
    x: 1500,
    y: 1040,
    w: 70,
    h: 10,
    strokeWeight: 5,
    color: 'black'
  }, {
    isStatic: true,
    restitution: 0,
    label: "DeckelTrigger"
  }))

  /*Stopper*/
  blocks.push(new Block('rect', {
    x: 40,
    y: 375,
    w: 1,
    h: 1,
    //strokeWeight: 5,
    color: 'white'
  }, {
    isStatic: true,
    restitution: 0,
    label: "Stopper"
  }))

  blocks.push(new Block('rect', {
    x: 670,
    y: 225,
    w: 1,
    h: 1,
    //strokeWeight: 5,
    color: 'white'
  }, {
    isStatic: true,
    restitution: 0,
    label: "Stopper"
  }))

  blocks.push(new Block('rect', {
    x: 680,
    y: 260,
    w: 1,
    h: 1,
    //strokeWeight: 5,
    color: 'white'
  }, {
    isStatic: true,
    restitution: 0,
    label: "Stopper"
  }))

  blocks.push(new Block('rect', {
    x: 1420,
    y: 430,
    w: 1,
    h: 1,
    //strokeWeight: 5,
    color: 'white'
  }, {
    isStatic: true,
    restitution: 0,
    label: "Stopper"
  }))

  blocks.push(new Block('rect', {
    x: 1365,
    y: 335,
    w: 1,
    h: 1,
    //strokeWeight: 5,
    color: 'white'
  }, {
    isStatic: true,
    restitution: 0,
    label: "Stopper"
  }))

  blocks.push(new Block('rect', {
    x: 1380,
    y: 385,
    w: 1,
    h: 1,
    //strokeWeight: 5,
    color: 'white'
  }, {
    isStatic: true,
    restitution: 0,
    label: "Stopper"
  }))

  blocks.push(new Block('rect', {
    x: 1900,
    y: 658,
    w: 1,
    h: 1,
    //strokeWeight: 5,
    color: 'white'
  }, {
    isStatic: true,
    restitution: 0,
    label: "Stopper"
  }))

  blocks.push(new Block('rect', {
    x: 715,
    y: 495,
    w: 1,
    h: 1,
    //strokeWeight: 5,
    color: 'white'
  }, {
    isStatic: true,
    restitution: 0,
    label: "Stopper"
  }))

  blocks.push(new Block('rect', {
    x: 710,
    y: 910,
    w: 1,
    h: 1,
    //strokeWeight: 5,
    color: 'white'
  }, {
    isStatic: true,
    restitution: 0,
    label: "Stopper"
  }))

  blocks.push(new Block('rect', {
    x: 1405,
    y: 950,
    w: 1,
    h: 1,
    //strokeWeight: 5,
    color: 'white'
  }, {
    isStatic: true,
    restitution: 0,
    label: "Stopper"
  }))

  blocks.push(new Block('rect', {
    x: 1420,
    y: 950,
    w: 1,
    h: 1,
    //strokeWeight: 5,
    color: 'white'
  }, {
    isStatic: true,
    restitution: 0,
    label: "Stopper"
  }))

  kiste = new Block('path', {
    x: 1500,
    y: 1030,
    elem: 'kiste',
    scale: 1.0,
    color: 'black',
    force: {
      x: 0.0,
      y: 0.0
    }
  }, {
    isStatic: true,
    friction: 0.0
  })
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
  //background(155, 150);
  clear()
  blocks.forEach((block, i) => {
    block.show()
  });
  //image(img,20, 156);
  ball.show()
  ball1.show()
  ball2.show()
  ball3.show()
  kreise.forEach((kreis, i) => {
    kreis.show()
  });




  drawSprite(ball.body, img2);
  drawSprite(ball1.body, img9);
  drawSprite(ball2.body, img2);
  drawSprite(ball3.body, img10);
  image(img11,1400, 714);
  deckel.show()
  drawSprite(deckel.body, img3);
  img3.resize(130, 40)

  drawGear(0, 0, 45, 422);
  drawGear(0, 0, 350, 296);
  drawGear(0, 0, 635,178);
  drawGear(0, 0, 691, 300);
  drawGear(0, 0, 1010, 300);
  drawGear(0, 0, 1330, 300);
  drawGear(0, 0, 1435, 469);
  drawGear(0, 0, 1766, 331);
  drawGear(0, 0, 1251, 700);
  drawGear(0, 0, 1570, 700);
  drawGear(0, 0, 1889, 700);
  drawGear(0, 0, 750, 483);
  drawGear(0, 0, 972, 612);
  drawGear(0, 0, 1190, 737);
  drawGear(0, 0, 322, 510);
  drawGear(0, 0, 678, 510);
  drawGear(0, 0, 51, 860);
  drawGear(0, 0, 370, 860);
  drawGear(0, 0, 689, 860);
  drawGear(0, 0, 730, 950);
  drawGear(0, 0, 1040, 950);
  drawGear(0, 0, 1359, 950);

  if (gearDirectionCW == true) {
    angleGear = angleGear + 0.1
  } else {
    angleGear = angleGear - 0.1
  }
    image(img6, 80, 530)
    image(img7, 1400, 445)
    image(img8, 780, 50)

    kiste.show()
    if (imgChange > 1) {
      img4.delay(100);
      image(img4, 1442, 950);
      // img4.resize(120, 120)
    } else {
      image(img1, 1441, 950);
      // img1.resize(120, 120)
    }

}

function drawGear(x, y, a, b) {

  push()
  translate(a, b);
  rotate(angleGear);
  imageMode(CENTER);
  image(img5, x, y);
  img5.resize(33, 33)
  pop()
}

function drawSprite(body, img) {
  const pos = body.position;
  const angle = body.angle;
  push();
  translate(pos.x, pos.y);
  rotate(angle);
  imageMode(CENTER);
  image(img, 0, 0);
  pop();
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

// function keyPressed(e) {
//   // prevent scrolling of website with SPACE key
//   if(e.keyCode == 32 && e.target == document.body) {
//     e.preventDefault();
//   }
// }

function keyPressed() {
  switch (keyCode) {
    case 32:
      bandrichtung = bandrichtung * -1
      gearDirectionCW = !gearDirectionCW
      //console.log('Leertaste', gearDirectionCW)
      break;
    default:
      //console.log("KeyCode ist: " + keyCode)
  }
}
