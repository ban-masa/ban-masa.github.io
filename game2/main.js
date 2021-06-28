phina.globalize();

var ASSETS = {
  image: {
    'cho': "./choharuki.png",
    'bg' : "./rabbit3.png",
    'inu' : "./inu.png",
    'uma' : "./uma.png",
    'jinkatsu' : "./jinkatsu.png",
    'gameover' : "./gameover.png",
    'retry' : "./retry.png",
    'touch' : "./touch.png",
    'bakuha' : "./war_bakuha_switch_off.png",
  },
};

var SCREEN_WIDTH = 640;
var SCREEN_HEIGHT = 960;

window.onload = function() {
  window.addEventListener('keydown', keydownfunc, true);
}
var keydownfunc = function (event) {
  var code = event.keyCode;
  switch (code) {
    case 37:
    case 38:
    case 39:
    case 40:
      event.preventDefault();
  }
}

phina.define('TitleScene', {
  superClass: 'DisplayScene',
  init: function() {
    this.superInit();
    var bg = DisplayElement().addChildTo(this);
    Sprite('bg').addChildTo(bg).setPosition(this.gridX.center(), this.gridY.center()).setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    var cho = Sprite('cho');
    this.cho = cho;
    cho.addChildTo(this).setPosition(this.gridX.center(), this.gridY.center() + 250);
    this.labelscale = 0.5;
    this.labelscalediff = 0.05;
    this.touchlabel = Sprite('touch').addChildTo(this).setPosition(this.gridX.center(), this.gridY.center() - 100).setScale(this.labelscale, this.labelscale);
    //Label({
    //  text: 'Touch to start',
    //  fontWeight: "bold",
    //  fontFamile: "'Monaco', 'Consolas', 'MS 明朝'",
    //  fontSize: 48,
    //  fill: 'black',
    //}).addChildTo(this).setPosition(this.gridX.center(), this.gridY.center());

    this.on('pointend', function() {
      this.exit();
    });
  },
  update: function() {
    this.cho.rotation++;
    if (this.labelscale >= 0.7) {
      this.labelscalediff = -0.01;
    } else if (this.labelscale<= 0.5) {
      this.labelscalediff = 0.01;
    }
    this.labelscale += this.labelscalediff;
    this.touchlabel.setScale(this.labelscale, this.labelscale);
  },
});

phina.define('MainScene', {
    superClass: 'DisplayScene',
    init: function() {
      this.superInit();

      //var canvas = document.getElementById('mycanvas');
      //this.canvas_width = canvas.width;
      //this.canvas_height = canvas.height;
      this.canvasToSceneXscale = 2.0;//this.width / this.canvas_width;
      this.canvasToSceneYscale = 2.0;//this.height / this.canvas_height;
      //Background config
      var bg = DisplayElement().addChildTo(this);
      Sprite('bg').addChildTo(bg).setPosition(this.gridX.center(), this.gridY.center()).setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

      var timelabel = Label({
        text: 10,
        fontWeight: "bold",
        fontFamile: "'Monaco', 'Consolas', 'MS 明朝'",
        fontSize: 64,
        fill: 'red',
        stroke: 'white',
        strokeWidth: 6,
      });
      this.timelabel = timelabel;
      timelabel.addChildTo(this).setPosition(50, 50);

      var engine = GameEngine();
      this.engine = engine;
      this.ground = RectObject(300, 700, 400, 30, 0, 'green', true, engine).addChildTo(this);
      this.obj_generated_time = 0.0;
      this.start_flag = -1;
      this.engine.startsim();
      this.game_state = 0;
      this.score = -1;
      var scorelabel = Label({
        text: "Score: " + String(this.score),
        fontWeight: "bold",
        fontFamile: "'Monaco', 'Consolas', 'MS 明朝'",
        fontSize: 32,
        fill: 'red',
        stroke: 'white',
        strokeWidth: 6,
      });
      this.scorelabel = scorelabel;
      scorelabel.addChildTo(this).setPosition(80, 120);
      this.touchMoveDirection = 'none';
      this.retry = Sprite('retry').setScale(0.5, 0.5);
      this.bakuha = Sprite('bakuha').addChildTo(this).setPosition(this.gridX.center(), this.gridY.center() + 330).setScale(0.25, 0.25);
      //this.rect = RectangleShape({
      //  width: 100,
      //  height: 100,
      //}).addChildTo(this).setPosition(this.gridX.center(), this.gridY.center() + 300);
    },

    decideObjType: function() {
      var val = Math.floor(Math.random() * 1000);
      var type = 'none';
      if (val < 100) {
        type = 'inu';
      } else if (val < 200) {
        type = 'uma';
      } else {
        type = 'cho';
      }
      return type;
    },

    update: function(app) {
      if (this.game_state == 0) {
        this.current = DropObject(300, 100, 0, this.decideObjType(), this.engine).addChildTo(this);
        this.game_state++;
        this.score++;
        this.scorelabel.text = "スコア: " + String(this.score);
        this.obj_generated_time = app.elapsedTime / 1000.0;
      } else if (this.game_state == 1) {
        current_time = app.elapsedTime / 1000.0;
        elapsed_time = (current_time - this.obj_generated_time);
        this.timelabel.text = 10 - Math.floor(elapsed_time);
        var key = app.keyboard;
        var command = 'none';
        if (key.getKey('left')) { command = 'left'; }
        if (key.getKey('right')) { command = 'right'; }
        if (key.getKey('up') || this.touchMoveDirection == 'up') { command = 'up'; }
        if (key.getKey('down') || this.touchMoveDirection == 'down' || elapsed_time > 10.0) {
          command = 'down';
          this.game_state++;
        }
        this.current.moveObj(command);
        this.touchMoveDirection = 'none';
      } else if (this.game_state == 2) {
        var state = this.engine.gamestateJudge();
        if (state == 'stop') {
          this.game_state = 0;
        } else if (state == 'moving') {
        } else if (state == 'gameover') {
          this.game_state++;
        }
      } else if (this.game_state == 3) {
        this.engine.stopsim();
        //Sprite('gameover').addChildTo(this).setPosition(this.gridX.center(), this.gridY.center() - 350).setScale(0.7, 0.7);
        this.scorelabel.hide();
        this.timelabel.hide();
        var finalscorelabel = Label({
          text: "あなたのは◯き力は" + String(this.score) + "ちょうは◯き！",
          fontWeight: "bold",
          fontFamile: "'Monaco', 'Consolas', 'MS 明朝'",
          fontSize: 36,
          fill: 'red',
          stroke: 'white',
          strokeWidth: 6,
        }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.center() - 350);
        this.retry.addChildTo(this).setPosition(this.gridX.center(), this.gridY.center() - 170);
        //this.exit({
        //  score: this.score,
        //});
      }
    },

    meteor_or_storm: function() {
      for (let i = 0; i < 10; i++) {
        var d = DropObject(i * 50 + 50, 100 + 50 * (i % 2), 0, this.decideObjType(), this.engine).addChildTo(this);
        d.moveObj('down')
      }
    },

    onpointstart: function(e) {
      this.touchPx = e.pointer.x * this.canvasToSceneXscale;
      this.touchPy = e.pointer.y * this.canvasToSceneYscale;
      this.touchPx_start = this.touchPx;
      this.touchPy_start = this.touchPy;
    },

    onpointend: function(e) {
      this.touchPx = e.pointer.x * this.canvasToSceneXscale;
      this.touchPy = e.pointer.y * this.canvasToSceneYscale;
      this.touchPx_end = this.touchPx;
      this.touchPy_end = this.touchPy;
      if (this.game_state == 1) {
        var xdiff = this.touchPx_end - this.touchPx_start;
        var ydiff = this.touchPy_end - this.touchPy_start;
        if (Math.abs(xdiff) < Math.abs(ydiff)) {
          if (ydiff > 0) {
            this.touchMoveDirection = 'down';
          } else {
            this.touchMoveDirection = 'up';
          }
        }
      }
      if (this.game_state == 3) {
        var difx = this.touchPx - this.retry.position.x;
        var dify = this.touchPy - this.retry.position.y;
        if (difx < 100 && difx > -100 && dify < 100 & dify > -100) {
          this.exit();
        }
      }
      if ((this.game_state == 1) || (this.game_state == 2)) {
        var difx = this.touchPx - this.bakuha.position.x;
        var dify = this.touchPy - (this.bakuha.position.y - 30);
        if (difx < 50 && difx > -50 && dify < 50 & dify > -50) {
          this.meteor_or_storm();
          this.game_state = 2
          this.current.moveObj('down')
        }
      }
    },

    onpointmove: function(e) {
      if (this.game_state == 1) {
        this.pre_touchPx = this.touchPx;
        this.pre_touchPy = this.touchPy;
        this.touchPx = e.pointer.x * this.canvasToSceneXscale;
        this.touchPy = e.pointer.y * this.canvasToSceneYscale;
        if (Math.abs(this.touchPx - this.pre_touchPx) > Math.abs(this.touchPy - this.pre_touchPy)) {
          this.current.moveObjXpos(this.touchPx - this.pre_touchPx);
        }
      }
    },
});

phina.main(function() {
    var app = GameApp({
        query: '#mycanvas',
        fit: false,
        assets: ASSETS,
        startLabel: 'title',
        scenes: [
        {
          className: 'TitleScene',
          label: 'title',
          nextLabel: 'game',
        },
        {
          className: 'MainScene',
          label: 'game',
          nextLabel: 'title',
        },
        ]
    });
    app.run();
});
