var Engine = Matter.Engine;
var Render = Matter.Render;
var World = Matter.World;
var Bodies = Matter.Bodies;
var Body = Matter.Body;
var Vector = Matter.Vector;
var Composite = Matter.Composite;

var body = document.getElementById('canvas-container');
var engine = Engine.create(body, {
  density: 0.0005,
  frictionAir: 0.06,
  restitution: 0.3,
  friction: 0.06,
    render: {
      options: {
        showAngleIndicator: false,
        isStatic: true,
        wireframes: false,
        visible: false,
        width: 600,
        height: 800
      }
    }
});
var scale = 0.5;
var shape = [];
for (i = 0; i < cho_vertices.length; i++) {
  shape.push({x: cho_vertices[i].x * scale, y: cho_vertices[i].y * scale});
}
var obj2 = Bodies.fromVertices(400, 200, shape, {
  render: {
    sprite: {
      texture: 'choharuki.png',
      xScale: 0.5,
      yScale: 0.5
    }
  }
});
console.log(obj2.render.sprite.texture);
var ground = Bodies.rectangle(300, 600, 400, 30, {
  isStatic: true,
  render: {
    fillStyle: 'rgba(0, 120, 0, 1)'
  }
});
World.add(engine.world, [obj2, ground]);
Engine.run(engine);
