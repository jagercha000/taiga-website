globalThis.player.foodData = globalThis.player.foodData || new Object();
globalThis.player.foodUtil = globalThis.player.foodUtil || new Object();
globalThis.player.foodData.background = new Object();
globalThis.player.foodData.background.url = await globalThis.player.util.downloadImage('food-web/food-web.jpg');
globalThis.player.foodData.background.image = new Image();
globalThis.player.foodData.background.image.src = globalThis.player.foodData.background.url;
globalThis.player.foodData.noInteract = false;
globalThis.player.foodData.hitboxes = [];
globalThis.player.foodData.hitboxes.push({ x: 0, y: 0, width: 50, height: 50, click: function() { alert("Click!"); }});
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
  var image = globalThis.player.foodData.background;
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
  window.requestAnimationFrame(foodWebFrame);
}
window.requestAnimationFrame(foodWebFrame);
globalThis.player.canvas.addEventListener('click', function(evt) {
  processHitboxes(true, evt);
});
globalThis.player.stopLoading();
