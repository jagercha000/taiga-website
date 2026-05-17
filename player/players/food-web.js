globalThis.player.foodData = globalThis.player.foodData || new Object();
globalThis.player.foodUtil = globalThis.player.foodUtil || new Object();
globalThis.player.foodData.background = new Object();
globalThis.player.foodData.background.url = await globalThis.player.util.downloadImage('food-web/images/background.jpg');
globalThis.player.foodData.background.image = new Image();
globalThis.player.foodData.background.image.src = globalThis.player.foodData.background.url;
globalThis.player.foodData.noInteract = false;
globalThis.player.foodData.selectedAnimal = null;
function hit(id) {
  if(globalThis.player.foodData.selectedAnimal == id) {
    globalThis.player.foodData.selectedAnimal = null;
  } else {
    globalThis.player.foodData.selectedAnimal = id;
  }
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
globalThis.player.foodUtil.highlightAnimal = function(animal, color) {
  if(!animal) {
    return;
  }
  var fill = color.hex;
  var alpha = color.alpha;
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
      hit(hitHitbox.id);
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
globalThis.player.foodUtil.drawArrowBetweenRects = function(r1, r2, color, alpha, headLength = 15) {
  var startX = Math.max(r1.x, Math.min(r2.x + r2.width / 2, r1.x + r1.width));
  var startY = Math.max(r1.y, Math.min(r2.y + r2.height / 2, r1.y + r1.height));
  var endX = Math.max(r2.x, Math.min(r1.x + r1.width / 2, r2.x + r2.width));
  var endY = Math.max(r2.y, Math.min(r1.y + r1.height / 2, r2.y + r2.height));
  if (r1.x + r1.width < r2.x) {
    startX = r1.x + r1.width;
    endX = r2.x;
  } else if (r2.x + r2.width < r1.x) {
    startX = r1.x;
    endX = r2.x + r2.width;
  }
  if (r1.y + r1.height < r2.y) {
    startY = r1.y + r1.height;
    endY = r2.y;
  } else if (r2.y + r2.height < r1.y) {
    startY = r1.y;
    endY = r2.y + r2.height;
  }
  var angle = Math.atan2(endY - startY, endX - startX);
  var lineEndX = endX - (headLength - 5) * Math.cos(angle);
  var lineEndY = endY - (headLength - 5) * Math.sin(angle);
  globalThis.player.context.save();
  globalThis.player.context.globalAlpha = alpha;
  globalThis.player.context.beginPath();
  globalThis.player.context.strokeStyle = color;
  globalThis.player.context.fillStyle = color;
  globalThis.player.context.lineWidth = 4;
  globalThis.player.context.setLineDash([8, 8]);
  globalThis.player.context.moveTo(startX, startY);
  globalThis.player.context.lineTo(lineEndX, lineEndY);
  globalThis.player.context.stroke();
  globalThis.player.context.setLineDash([]);
  globalThis.player.context.beginPath();
  globalThis.player.context.moveTo(endX, endY);
  globalThis.player.context.lineTo(endX - headLength * Math.cos(angle - Math.PI / 6), endY - headLength * Math.sin(angle - Math.PI / 6));
  globalThis.player.context.lineTo(endX - headLength * Math.cos(angle + Math.PI / 6), endY - headLength * Math.sin(angle + Math.PI / 6));
  globalThis.player.context.closePath();
  globalThis.player.context.fill();
  globalThis.player.context.restore();
};
function foodWebFrame() {
  globalThis.player.util.clearCanvas();
  processHitboxes(false, null);
  globalThis.player.util.fitImage(globalThis.player.foodData.background.image);
  globalThis.player.context.globalAlpha = globalThis.player.foodData.colors.overlay.alpha;
  globalThis.player.context.fillStyle = globalThis.player.foodData.colors.overlay.hex;
  var canvas = globalThis.player.canvas;
  globalThis.player.context.fillRect(0, 0, canvas.width, canvas.height);
  globalThis.player.context.globalAlpha = 1;
  var keys = Object.keys(globalThis.player.foodData.animals);
  for(var i=0;i<keys.length;i++) {
    var key = keys[i];
    var rawRect = globalThis.player.foodData.hitboxes.filter(hitbox => hitbox.id == key)[0];
    var rect = globalThis.player.foodUtil.calculateHitbox(rawRect.x, rawRect.y, rawRect.width, rawRect.height);
    globalThis.player.context.drawImage(globalThis.player.foodData.animals[key].image, rect.x, rect.y, rect.width, rect.height);
    var relation = globalThis.player.foodData.relations[key];
    for(var j=0;j<relation.predators.length;j++) {
      var predator = relation.predators[j];
      var predatorRawRect = globalThis.player.foodData.hitboxes.filter(hitbox => hitbox.id == predator)[0];
      var predatorRect = globalThis.player.foodUtil.calculateHitbox(predatorRawRect.x, predatorRawRect.y, predatorRawRect.width, predatorRawRect.height);
      var color = globalThis.player.foodData.colors.arrow;
      globalThis.player.foodUtil.drawArrowBetweenRects(predatorRect, rect, color.hex, color.alpha, 15);
    }
    for(var k=0;k<relation.prey.length;k++) {
      var prey = relation.prey[k];
      var preyRawRect = globalThis.player.foodData.hitboxes.filter(hitbox => hitbox.id == prey)[0];
      var preyRect = globalThis.player.foodUtil.calculateHitbox(preyRawRect.x, preyRawRect.y, preyRawRect.width, preyRawRect.height);
      var color = globalThis.player.foodData.colors.arrow;
      globalThis.player.foodUtil.drawArrowBetweenRects(rect, preyRect, color.hex, color.alpha, 15);
    }
  }
  globalThis.player.foodUtil.highlightAnimal(globalThis.player.foodData.selectedAnimal, globalThis.player.foodData.colors.selected);
  if(globalThis.player.foodData.selectedAnimal) {
    var relation = globalThis.player.foodData.relations[globalThis.player.foodData.selectedAnimal];
    for(var i=0;i<relation.prey.length;i++) {
      globalThis.player.foodUtil.highlightAnimal(relation.prey[i], globalThis.player.foodData.colors.prey);
    }
    for(var j=0;j<relation.predators.length;j++) {
      globalThis.player.foodUtil.highlightAnimal(relation.predators[j], globalThis.player.foodData.colors.predator);
    }
  }
  window.requestAnimationFrame(foodWebFrame);
}
window.requestAnimationFrame(foodWebFrame);
globalThis.player.canvas.addEventListener('click', function(evt) {
  processHitboxes(true, evt);
});
globalThis.player.stopLoading();
