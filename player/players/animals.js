globalThis.player.animalData = globalThis.player.animalData || new Object();
globalThis.player.animalUtil = globalThis.player.animalUtil || new Object();
globalThis.player.animalData.background = new Image();
globalThis.player.animalData.background.src = await globalThis.player.util.downloadImage("animals/animals.jpg");
globalThis.player.animalData.animals = globalThis.player.animalData.animals || new Object();
globalThis.player.animalData.noInteract = false;
globalThis.player.animalData.hitboxes = [];
globalThis.player.animalData.hitboxes.push({ x: 0, y: 0, width: 50, height: 50, click: function() { alert("Click!"); });
async function registerAnimal(animal) {
  globalThis.player.animalData.animals[animal] = new Object();
  globalThis.player.animalData.animals[animal].url = await globalThis.player.util.downloadImage("animals/animals/" + animal + ".jpg");
  globalThis.player.animalData.animals[animal].image = new Image();
  globalThis.player.animalData.animals[animal].image.src = globalThis.player.animalData.animals[animal].url;
}
await registerAnimal('bear');
await registerAnimal('deer');
await registerAnimal('lingonberries');
await registerAnimal('lynx');
await registerAnimal('moose');
await registerAnimal('mushrooms');
await registerAnimal('wolf');
function processHitboxes(click, evt) {
  if(globalThis.player.animalData.noInteract) {
    return;
  }
  var hitHitbox = false;
  globalThis.player.animalData.hitboxes.forEach((function(hitbox) {
    var calculatedHitbox = globalThis.player.animalUtil.calculateHitbox(hitbox.x, hitbox.y, hitbox.width, hitbox.height);
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
globalThis.player.animalUtil.calculateHitbox = function(x, y, width, height) {
  var image = globalThis.player.animalData.background;
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
function animalsFrame() {
  globalThis.player.util.fitImage(globalThis.player.animalData.background);
  processHitboxes(false, null);
  window.requestAnimationFrame(animalsFrame);
}
window.requestAnimationFrame(animalsFrame);
globalThis.player.canvas.addEventListener('click', function(evt) {
  processHitboxes(true, evt);
});
globalThis.player.stopLoading();
