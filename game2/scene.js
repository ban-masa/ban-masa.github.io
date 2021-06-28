phina.globalize();

phina.define("Scene01", {
  superClass: 'DisplayScene',
  init: function() {
    this.superInit();
    this.backgroundColor = 'black';
    Label({
      text: 'Scene01',
      fontSize: 48,
      fill: 'yellow',
    }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.center());
  },

  onpointstart: function() {
    this.exit();
  },
});

phina.define("Scene02", {
  superClass: 'DisplayScene',
  init: function() {
    this.superInit();
    this.backgroundColor = 'blue';
    Label({
      text: 'Scene02',
      fontSize: 48,
      fill: 'white',
    }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.center());
  },
  onpointstart: function() {
    this.exit();
  },
});

phina.define("Scene03", {
  superClass: 'DisplayScene',
  init: function() {
    this.superInit();
    this.backgroundColor = 'green';
    Label({
      text: 'Scene03',
      fontSize: 48,
    }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.center());
  },
  onpointstart: function() {
    this.exit();
  },
});


phina.main(function() {
  var app = GameApp({
    query: '#mycanvas',
    fit: false,
    startLabel: 'scene01',
    scenes: [
    {
      className: 'Scene01',
      label: 'scene01',
      nextLabel: 'scene02',
    },
    {
      className: 'Scene02',
      label: 'scene02',
      nextLabel: 'scene03',
    },
    {
      className: 'Scene03',
      label: 'scene03',
      nextLabel: 'scene01',
    },
    ]
  });
  app.run();
});
