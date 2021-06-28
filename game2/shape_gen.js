phina.globalize();

var ASSETS = {
  image: {
    'uma': './uma.png',
  },
};

phina.define('MainScene', {
  superClass: 'DisplayScene',
  init: function() {
    this.superInit();
    var img = Sprite('uma');
    img.addChildTo(this).setPosition(this.gridX.center(), this.gridY.center()).setSize(400, 400);
    this.pointlist = [];
  },
  onpointstart: function(e) {
    var px = e.pointer.x - this.gridX.center() + 200;
    var py = e.pointer.y - this.gridY.center() + 200;
    this.pointlist.push({x: px, y: py});
    CircleShape({
      x: e.pointer.x, 
      y: e.pointer.y, 
      radius: 2}).addChildTo(this);
  },
  update: function(app) {
    var key = app.keyboard;
    if (key.getKey('d')) {
      this.pointlist.pop();
    } else if (key.getKey('o')) {
      var str = "[";
      for (var i = 0; i < this.pointlist.length; i++) {
        str += "{x: " + String(this.pointlist[i].x) + ", y: " + String(this.pointlist[i].y) + "},\n";
      }
      str += "]";
      console.log(str);
    }
  },
});

phina.main(function() {
    var app = GameApp({
        fit: false,
        assets: ASSETS,
    });
    app.run();
});
