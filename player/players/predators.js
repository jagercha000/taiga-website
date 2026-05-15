globalThis.player.predatorsData = globalThis.player.predatorsData || new Object();
globalThis.player.predatorsData.background = new Object();
globalThis.player.predatorsData.background.url = await globalThis.player.util.downloadImage('predator-prey/predators.jpg');
globalThis.player.predatorsData.background.image = new Image();
globalThis.player.predatorsData.background.image.src = globalThis.player.predatorsData.background.url;
globalThis.player.predatorsData.noInteract = false;
globalThis.player.predatorsData.hitboxes = [];
function processHitboxes(click, evt) {
  if(globalThis.player.predatorsData.noInteract) {
    return;
  }
  var hitHitbox = false;
  globalThis.player.predatorsData.hitboxes.forEach((function(hitbox) {
    var calculatedHitbox = globalThis.player.predatorsUtil.calculateHitbox(hitbox.x, hitbox.y, hitbox.width, hitbox.height);
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
globalThis.player.predatorsUtil.calculateHitbox = function(x, y, width, height) {
  var image = globalThis.player.predatorsData.background;
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
function predatorsFrame() {
  processHitboxes(false, null);
  globalThis.player.util.fitImage(globalThis.player.predatorsData.background.image);
  window.requestAnimationFrame(predatorsFrame);
}
window.requestAnimationFrame(predatorsFrame);
globalThis.player.canvas.addEventListener('click', function(evt) {
  processHitboxes(true, evt);
});
globalThis.player.stopLoading();
