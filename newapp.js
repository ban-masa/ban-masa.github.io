var Engine = Matter.Engine;
var Render = Matter.Render;
var World = Matter.World;
var Bodies = Matter.Bodies;
var Body = Matter.Body;
var Vector = Matter.Vector;
var Composite = Matter.Composite;
var Events = Matter.Events;

var canvas = document.getElementById('canvas-container');
var engine = Engine.create({
  density: 0.0005,
  frictionAir: 0.06,
  restitution: 0.3,
  friction: 1.0,
  frictionStatic: 1.0,
//  render: {
//    options: {
//      background: './food_gyouza.png',
//      showAngleIndicator: false,
//      isStatic: true,
//      wireframes: false,
//      visible: false,
//      width: 600,
//      height: 800
//    }
//  }
});
var render = Render.create({
  element: canvas,
  engine: engine,
  options: {
    width: 600,
    height: 800,
    background: './food_gyouza.png',
    showAngleIndicator: false,
    isStatic: true,
    wireframes: false,
    visible: false
  }
});
var ctime = 10;
var game_state = 0;
var ctx = render.context;
var id_num = -1;
var judge_num = -1;
var drop_id = -1;
var count_id = -1;
var stop_cnt = -1;
var cho_scale = 0.3;
var score = 0;
var cho_shape = [];
for (var i = 0; i < cho_vertices.length; i++) {
  cho_shape.push({x: cho_vertices[i].x * cho_scale, y: cho_vertices[i].y * cho_scale});
}
var current = createCho();
var ground = Bodies.rectangle(300, 600, 400, 30, {
  isStatic: true,
  render: {
    fillStyle: 'rgba(0, 120, 0, 1)'
  }
});
var gameover = Bodies.rectangle(300, 300, 1, 1, {
  isStatic: true,
    render: {
      sprite: {
        texture: './gameover.png'
      }
    }
});

World.add(engine.world, [current, ground]);
Events.on(render, 'afterRender', countTime);
Engine.run(engine);
Render.run(render);
judge_num = setInterval(function(){gameJudge()}, 500);
function Rotate() {
  if (game_state == 1) {
    return;
  }
  Body.rotate(current, 45.0 * 3.14 / 180.0);
}
function Drop() {
  if (game_state == 1) {
    return;
  }
  clearInterval(count_id);
  game_state = 1;
  Body.setStatic(current, false);
  drop_id = setInterval(function() {
    if (stateJudge()) {
      clearInterval(drop_id);
      game_state = 0;
      current = createCho();
      World.add(engine.world, [current]);
    }}, 1000);
}
function Right() {
  if (game_state == 1) {
    return;
  }
  id_num = setInterval(function(){Body.setPosition(current, Vector.add(current.position, Vector.create(2, 0)))}, 20);
}
function Left() {
  if (game_state == 1) {
    return;
  }
  id_num = setInterval(function(){Body.setPosition(current, Vector.add(current.position, Vector.create(-2, 0)))}, 20);
}
function MouseUp() {
  clearInterval(id_num);
}
function createCho() {
  score = score + 1;
  var ob = Bodies.fromVertices(300, 100, cho_shape, {
    isStatic: false,
    mass: 0.5,
    friction: 1.0,
    frictionStatic: 1.0,
    render: {
      sprite: {
        texture: 'choharuki.png',
        xScale: cho_scale,
        yScale: cho_scale
      }
    }
  });
  Body.setStatic(ob, true);
  ctime = 10;
  count_id = setInterval(function() {
    if (ctime == 0) {
      Drop();
    }
    ctime = ctime - 1;
  }, 1000);
  return ob;
}
function gameJudge() {
  var allbodies = Composite.allBodies(engine.world);
  for (var i = 0; i < allbodies.length; i++) {
    if (allbodies[i].position.y > 800) {
      console.log("GameOver");
      game_state = 2;
      Rotate = null;
      Drop = null;
      Right = null;
      Left = null;
      MouseUp = null;
      createCho = null;
      clearInterval(judge_num);
      clearInterval(drop_id);
      World.add(engine.world, [gameover]);
    }
  }
}
function stateJudge() {
  var allbodies = Composite.allBodies(engine.world);
  for (var i = 0; i < allbodies.length; i++) {
    if (allbodies[i].speed > 0.3) {
      return false;
    }
  }
  stop_cnt = stop_cnt + 1;
  if (stop_cnt > 2) {
    stop_cnt = 0;
    return true;
  } else {
    return false;
  }
}
function countTime() {
  ctx.font = "40px 'ＭＳ Ｐゴシック'";
  ctx.fillStyle = "red";
  if (game_state == 1) {
    ctx.fillText("", 50, 100);
  } else if (game_state == 0) {
    ctx.fillText(String(ctime), 50, 100);
  } else if (game_state == 2) {
    ctx.font = "bold 30px 'ＭＳ Ｐゴシック'";
    ctx.lineWidth = 10;
    ctx.fillStyle = "orange";
    ctx.strokeStyle = "white";
    ctx.strokeText("あなたのは◯き力は" + String(score - 1) + "ちょうは◯き！", 30, 100, 500);
    ctx.fillText("あなたのは◯き力は" + String(score - 1) + "ちょうは◯き！", 30, 100, 500);
  }
}
