(function render(canvas, engine) {
  var Engine = Matter.Engine;
  var Render = Matter.Render;
  var World = Matter.World;
  var Bodies = Matter.Bodies;
  var Body = Matter.Body;
  var Vector = Matter.Vector;
  var context = canvas.getContext('2d');
  var bodies = Composite.allBodies(engine.world);
  window.requestAnimationFrame(render);
  context.beginPath();
