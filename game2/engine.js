var Engine = Matter.Engine;
var Render = Matter.Render;
var World = Matter.World;
var Bodies = Matter.Bodies;
var Body = Matter.Body;
var Vector = Matter.Vector;
var Composite = Matter.Composite;
var Events = Matter.Events;
var Runner= Matter.Runner;

phina.globalize();

function get_typeinfo(type) {
  var image_name = 'none';
  var scale = 1.0;
  var size = 400;
  var shape = [];
  if (type == 'cho') {
    image_name = 'cho';
    scale = 0.3;
    size = 400;
    for (var i = 0; i < cho_vertices.length; i++) {
      shape.push({x: cho_vertices[i].x * scale, y: cho_vertices[i].y * scale});
    }
  } else if (type == 'inu') {
    image_name = 'inu';
    scale = 0.3;
    size = 400;
    for (var i = 0; i < inu_vertices.length; i++) {
      shape.push({x: inu_vertices[i].x * scale, y: inu_vertices[i].y * scale});
    }
  } else if (type == 'jinkatsu') {
    image_name = 'jinkatsu';
    scale = 0.3;
    size = 400;
    for (var i = 0; i < jinkatsu_vertices.length; i++) {
      shape.push({x: jinkatsu_vertices[i].x * scale, y: jinkatsu_vertices[i].y * scale});
    }
  } else if (type == 'uma') {
    image_name = 'uma';
    scale = 0.3;
    size = 400;
    for (var i = 0; i < uma_vertices.length; i++) {
      shape.push({x: uma_vertices[i].x * scale, y: uma_vertices[i].y * scale});
    }
  }
  var info = {image: image_name, scale: scale, shape: shape, size: size};
  return info;
};

phina.define("DropObject", {
  superClass: 'Sprite',
  init: function (x, y, theta, type, engine) {
    var info = get_typeinfo(type);
    this.superInit(info.image);
    this.x = x;
    this.y = y;
    this.rotation = theta;
    this.setScale(info.scale, info.scale);

    var obj = engine.createObj(x, y, theta, info.shape, info.scale, info.image);
    this.obj = obj;
    var size = info.size * info.scale;
    var xoffset = size * (0.5 - obj.render.sprite.xOffset);
    var yoffset = size * (0.5 - obj.render.sprite.yOffset);
    this.xoffset = xoffset;
    this.yoffset = yoffset;
    this.engine = engine;
    var pre_command = 'none';
    this.pre_command = pre_command;
  },
  update: function() {
    this.rotation = this.obj.angle / 3.14159 * 180.0;
    var theta = this.obj.angle;
    var x = Math.cos(theta) * this.xoffset - Math.sin(theta) * this.yoffset + this.obj.position.x;
    var y = Math.sin(theta) * this.xoffset + Math.cos(theta) * this.yoffset + this.obj.position.y;
    this.x = x + this.engine.xoffset;
    this.y = y + this.engine.yoffset;
  },
  setStatic: function(is_static) {
    Body.setStatic(this.obj, is_static);
  },
  moveObj: function(command) {
    if (command != this.pre_command) {
      if (command == 'left') {
        Body.translate(this.obj, Vector.create(-6, 0));
      } else if (command == 'right') {
        Body.translate(this.obj, Vector.create(6, 0));
      } else if (command == 'up') {
        Body.rotate(this.obj, 45.0 / 180.0 * 3.14159);
      } else if (command == 'down') {
        this.setStatic(false);
      }
    } else {
      if (command == 'left') {
        Body.translate(this.obj, Vector.create(-2, 0));
      } else if (command == 'right') {
        Body.translate(this.obj, Vector.create(2, 0));
      }
    }
    this.pre_command = command;
  },
  moveObjXpos: function(x) {
    Body.translate(this.obj, Vector.create(x, 0));
  }

});

phina.define("RectObject", {
  superClass: 'Shape',
  init: function (x, y, w, h, theta, color, isStatic, engine) {
    this.superInit();
    this.x = x;
    this.y = y;
    this.rotation = theta;
    this.width = w;
    this.height = h;
    this.padding = 0;
    this.strokeWidth = 0;
    this.backgroundColor = color;
    var obj = engine.createRect(x, y, w, h, theta, isStatic);
    this.obj = obj;
    this.engine = engine;
  },
  update: function() {
    this.x = this.obj.position.x + this.engine.xoffset;
    this.y = this.obj.position.y + this.engine.yoffset;
    this.rotation = this.obj.angle / 3.14159 * 180.0;
  },
});

phina.define("GameEngine", {
  init: function () {
    var engine = Engine.create({
      density: 0.0005,
      frictionAir: 0.06,
      restitution: 0.3,
      friction: 1.0,
      frictionStatic: 1.0,
    });
    this.engine = engine;
    this.runner = Runner.create();
    this.xoffset = 0;
    this.yoffset = 0;
    this.stop_count = 0;
  },

  startsim: function() {
    Runner.run(this.runner, this.engine);
  },
  stopsim: function() {
    Runner.stop(this.runner);
  },

  createObj: function (x, y, theta, shape, scale, image) {
    var obj = Bodies.fromVertices(x, y, shape, {
      isStatic: false,
      mass: 0.5,
      friction: 1.0,
      frictionStatic: 1.0,
    render: {
      sprite: {
        texture: image,
        xScale: scale,
        yScale: scale
      }
    }
    });
    Body.setStatic(obj, true);
    Body.rotate(obj, theta * 3.14159 / 180.0);
    World.add(this.engine.world, [obj]);
    return obj;
  },

  createRect: function (x, y, w, h, theta, is_static) {
    var obj = Bodies.rectangle(x, y, w, h, {
      isStatic: is_static,
      friction: 1.0,
      frictionStatic: 1.0,
    });
    Body.rotate(obj, theta * 3.14159 / 180.0);
    World.add(this.engine.world, [obj]);
    return obj;
  },

  moveWorld: function (x, y) {
    this.xoffset += x;
    this.yoffset += y;
  },

  gamestateJudge: function() {
    var allbodies = Composite.allBodies(this.engine.world);
    for (var i = 0; i < allbodies.length; i++) {
      if (allbodies[i].speed > 0.3) {
        this.stop_count = 0;
        if (allbodies[i].position.y > 800) {
          return 'gameover';
        }
        return 'moving';
      }
    }
    if (this.stop_count > 120) {
      return 'stop';
    } else {
      this.stop_count++;
      return 'moving';
    }
  },
});
