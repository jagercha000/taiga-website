globalThis.player.foodData = globalThis.player.foodData || new Object();
globalThis.player.foodUtil = globalThis.player.foodUtil || new Object();
globalThis.player.foodData.background = new Object();
globalThis.player.foodData.background.url = await globalThis.player.util.downloadImage('food-web/images/background.jpg');
globalThis.player.foodData.background.image = new Image();
globalThis.player.foodData.background.image.src = globalThis.player.foodData.background.url;
globalThis.player.foodData.noInteract = false;
function hit(id) {
  alert(globalThis.player.foodData.relations[id].name);
}
var result = await globalThis.player.util.fetchAsset('food-web/relations.json');
globalThis.player.foodData.relations = await result.json();
globalThis.player.foodData.animals = new Object();
var keys = Object.keys(globalThis.player.foodData.relations);
for(var i=0;i<keys.length;i++) {
  var animal = keys[i];
  globalThis.player.foodData.animals[animal] = new Object();
  globalThis.player.foodData.animals[animal].url = await globalThis.player.util.downloadImage('food-web/images/animals/' + animal + '.png');
  globalThis.player.foodData.animals[animal].image = new Image();
  globalThis.player.foodData.animals[animal].image.src = globalThis.player.foodData.animals[animal].url;
}
var colorResult = await globalThis.player.util.fetchAsset('food-web/colors.json');
globalThis.player.foodData.colors = await colorResult.json();
var hitboxResult = await globalThis.player.util.fetchAsset('food-web/hitboxes.json');
globalThis.player.foodData.hitboxes = await hitboxResult.json();
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
      hit(hitbox.id);
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
  globalThis.player.context.globalAlpha = globalThis.player.foodData.colors.overlay.alpha;
  globalThis.player.context.fillStyle = globalThis.player.foodData.colors.overlay.hex;
  var canvas = globalThis.player.canvas;
  globalThis.player.context.fillRect(0, 0, canvas.width, canvas.height);
  var keys = Object.keys(globalThis.player.foodData.animals);
  for(var i=0;i<keys.length;i++) {
    var key = keys[i];
    var rawRect = globalThis.player.foodData.hitboxes.filter(hitbox => hitbox.id == key)[0];
    var rect = globalThis.player.foodUtil.calculateHitbox(rawRect.x, rawRect.y, rawRect.width, rawRect.height);
    globalThis.player.context.drawImage(globalThis.player.foodData.animals[key].image, rect.x, rect.y, rect.width, rect.height);
  }
  globalThis.player.foodUtil.highlightAnimal("deer", globalThis.player.foodData.colors.selected.hex, globalThis.player.foodData.colors.selected.alpha);
  window.requestAnimationFrame(foodWebFrame);
}
window.requestAnimationFrame(foodWebFrame);
globalThis.player.canvas.addEventListener('click', function(evt) {
  processHitboxes(true, evt);
});
globalThis.player.stopLoading();
