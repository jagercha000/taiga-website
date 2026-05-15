globalThis.player.foodData = globalThis.player.foodData || new Object();
globalThis.player.foodUtil = globalThis.player.foodUtil || new Object();
globalThis.player.foodData.background = new Object();
globalThis.player.foodData.background.url = await globalThis.player.util.downloadImage('food-web/food-web.jpg');
globalThis.player.foodData.background.image = new Image();
globalThis.player.foodData.background.image.src = globalThis.player.foodData.background.url;
globalThis.player.foodData.noInteract = false;
globalThis.player.foodData.hitboxes = [];
function hit(id) {
  alert(id);
}
globalThis.player.foodData.hitboxes.push({ id: "grass", x: 576, y: 451, width: 86, height: 39, click: function() { hit("grass"); }});
globalThis.player.foodData.hitboxes.push({ id: "lingonberries", x: 461, y: 438, width: 77, height: 49, click: function() { hit("lingonberries"); }});
globalThis.player.foodData.hitboxes.push({ id: "tree", x: 320, y: 414, width: 78, height: 85, click: function() { hit("tree"); }});
globalThis.player.foodData.hitboxes.push({ id: "mouse", x: 665, y: 281, width: 81, height: 44, click: function() { hit("mouse"); }});
globalThis.player.foodData.hitboxes.push({ id: "moose", x: 531, y: 262, width: 78, height: 70, click: function() { hit("moose"); }});
globalThis.player.foodData.hitboxes.push({ id: "deer", x: 357, y: 242, width: 85, height: 99, click: function() { hit("deer"); }});
globalThis.player.foodData.hitboxes.push({ id: "mushrooms", x: 238, y: 285, width: 84, height: 27, click: function() { hit("mushrooms"); }});
globalThis.player.foodData.hitboxes.push({ id: "fish", x: 121, y: 261, width: 65, height: 75, click: function() { hit("fish"); }});
globalThis.player.foodData.hitboxes.push({ id: "bear", x: 514, y: 71, width: 119, height: 65, click: function() { hit("bear"); }});
globalThis.player.foodData.hitboxes.push({ id: "lynx", x: 399, y: 68, width: 43, height: 71, click: function() { hit("lynx"); }});
globalThis.player.foodData.hitboxes.push({ id: "wolf", x: 223, y: 69, width: 110, height: 67, click: function() { hit("wolf"); }});
globalThis.player.foodUtil.highlightAnimal = function(animal, fill, alpha) {
  var rawRect = globalThis.player.foodData.hitboxes.filter(hitbox => hitbox.id == animal)[0];
  var rect = globalThis.player.foodUtil.calculateHitbox(rawRect.x, rawRect.y, rawRect.width, rawRect.height);
  globalThis.player.foodUtil.fillEllipseRect(rect.x, rect.y, rect.width, rect.height, fill, alpha);
};
globalThis.player.foodUtil.fillEllipseRect = function(x, y, width, height, fill, alpha) {
  globalThis.player.context.fillStyle = fill;
  globalThis.player.context.globalAlpha = alpha;
  globalThis.player.context.beginPath();
  var centerX = x + (width / 2);
  var centerY = y + (height / 2);
  var radiusX = width / 2;
  var radiusY = height / 2;
  var rotation = 0;
  var startAngle = 0;
  var endAngle = 2 * Math.PI;
  globalThis.player.context.ellipse(centerX, centerY, radiusX, radiusY, rotation, startAngle, endAngle);
  globalThis.player.context.fill();
  globalThis.player.context.globalAlpha = 1;
};
function processHitboxes(click, evt) {
  if(globalThis.player.foodData.noInteract) {
    return;
  }
  var hitHitbox = false;
  globalThis.player.foodData.hitboxes.forEach((function(hitbox) {
    var calculatedHitbox = globalThis.player.foodUtil.calculateHitbox(hitbox.x, hitbox.y, hitbox.width, hitbox.height);
    var mousePos = null;
    mousePos = globalThis.player.util.getMouseCoords();
    if(globalThis.player.util.collision(mousePos.x, mousePos.y, 0, 0, calculatedHitbox.x, calculatedHitbox.y, calculatedHitbox.width, calculatedHitbox.height)) {
      hitHitbox = hitbox;
    }
  }).bind(this));
  if(hitHitbox) {
    globalThis.player.util.setCursor("pointer");
    if(click) {
      hitHitbox.click(evt);
    }
  } else {
    globalThis.player.util.setCursor("default");
  }
}
globalThis.player.foodUtil.calculateHitbox = function(x, y, width, height) {
  var image = globalThis.player.foodData.background.image;
  var canvas = globalThis.player.canvas;
  var hRatio = canvas.width / image.width;
  var vRatio = canvas.height / image.height;
  var ratio = Math.min(hRatio, vRatio);
  var centerX = (canvas.width - image.width * ratio) / 2;
  var centerY = (canvas.height - image.height * ratio) / 2;
  var scaledWidth = image.width * ratio;
  var scaledHeight = image.height * ratio;
  var newX = (x * ratio) + centerX;
  var newY = (y * ratio) + centerY;
  var newWidth = width * ratio;
  var newHeight = height * ratio;
  return { x: newX, y: newY, width: newWidth, height: newHeight };
};
function foodWebFrame() {
  processHitboxes(false, null);
  globalThis.player.util.fitImage(globalThis.player.foodData.background.image);
  globalThis.player.foodUtil.highlightAnimal("deer", "#ffff00", 0.5);
  window.requestAnimationFrame(foodWebFrame);
}
window.requestAnimationFrame(foodWebFrame);
globalThis.player.canvas.addEventListener('click', function(evt) {
  processHitboxes(true, evt);
});
globalThis.player.stopLoading();
