globalThis.player.animalData = globalThis.player.animalData || new Object();
globalThis.player.animalUtil = globalThis.player.animalUtil || new Object();
globalThis.player.animalData.background = new Image();
globalThis.player.animalData.background.src = await globalThis.player.util.downloadImage("animals/animals.jpg");
globalThis.player.animalData.animals = globalThis.player.animalData.animals || new Object();
globalThis.player.animalData.noInteract = false;
globalThis.player.animalUtil.info = function(animal) {
  globalThis.player.animalData.noInteract = true;
  var selector = `.animal-info-dialog[data-animal="${animal}"]`;
  document.querySelector(selector).classList.remove('hidden');
  gsap.fromTo(selector, { opacity: 0 }, { opacity: 1, duration: 1, onComplete: function() {
    globalThis.player.animalData.noInteract = false;
  }});
};
globalThis.player.animalUtil.closeInfo = function(animal) {
  if(globalThis.player.animalData.noInteract) {
    return;
  }
  globalThis.player.animalData.noInteract = true;
  var selector = `.animal-info-dialog[data-animal="${animal}"]`;
  gsap.fromTo(selector, { opacity: 1 }, { opacity: 0, duration: 1, onComplete: (function() {
    globalThis.player.animalData.noInteract = false;
    document.querySelector(selector).classList.add('hidden');
  }).bind(this) });
};
globalThis.player.animalData.hitboxes = [];
globalThis.player.animalData.hitboxes.push({ x: 40, y: 349, width: 108, height: 67, click: function() { globalThis.player.animalUtil.info("wolf"); }});
globalThis.player.animalData.hitboxes.push({ x: 217, y: 334, width: 83, height: 82, click: function() { globalThis.player.animalUtil.info("deer"); }});
globalThis.player.animalData.hitboxes.push({ x: 357, y: 341, width: 30, height: 71, click: function() { globalThis.player.animalUtil.info("lynx"); }});
globalThis.player.animalData.hitboxes.push({ x: 442, y: 373, width: 77, height: 46, click: function() { globalThis.player.animalUtil.info("lingonberries"); }});
globalThis.player.animalData.hitboxes.push({ x: 553, y: 332, width: 73, height: 79, click: function() { globalThis.player.animalUtil.info("moose"); }});
globalThis.player.animalData.hitboxes.push({ x: 712, y: 385, width: 66, height: 24, click: function() { globalThis.player.animalUtil.info("mushrooms"); }});
globalThis.player.animalData.hitboxes.push({ x: 811, y: 342, width: 131, height: 70, click: function() { globalThis.player.animalUtil.info("bear"); }});
async function registerAnimal(animal) {
  var result = await globalThis.player.util.fetchAsset("animals/info.json");
  var json = await result.json();
  var animalData = json[animal];
  globalThis.player.animalData.animals[animal] = new Object();
  globalThis.player.animalData.animals[animal].url = await globalThis.player.util.downloadImage("animals/animals/" + animal + ".jpg");
  globalThis.player.animalData.animals[animal].image = new Image();
  globalThis.player.animalData.animals[animal].image.src = globalThis.player.animalData.animals[animal].url;
  var element = document.createElement('div');
  element.setAttribute('class', 'animal-info-dialog hidden');
  element.setAttribute('data-animal', animal);
  var closeElement = document.createElement('button');
  closeElement.setAttribute('class', 'animal-info-close');
  closeElement.innerText = 'Close';
  closeElement.addEventListener('click', (function(evt) {
    globalThis.player.animalUtil.closeInfo(animal);
  }).bind(this));
  element.appendChild(closeElement);
  var leftElement = document.createElement('div');
  leftElement.setAttribute('class', 'animal-info-sidebar');
  var animalImage = new Image();
  animalImage.src = globalThis.player.animalData.animals[animal].url;
  animalImage.setAttribute('class', 'animal-image');
  leftElement.appendChild(animalImage);
  var animalName = document.createElement('p');
  animalName.innerHTML = animalData.name;
  animalName.setAttribute('class', 'animal-info-name');
  leftElement.appendChild(animalName);
  var animalSidebarInfo = document.createElement('p');
  animalSidebarInfo.setAttribute('class', 'animal-sidebar-info');
  animalSidebarInfo.innerHTML = animalData.sidebar;
  leftElement.appendChild(animalSidebarInfo);
  element.appendChild(leftElement);
  var infoElement = document.createElement('p');
  infoElement.setAttribute('class', 'animal-info');
  infoElement.innerHTML = animalData.info;
  element.appendChild(infoElement);
  document.body.appendChild(element);
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
  globalThis.player.util.clearCanvas();
  globalThis.player.util.fitImage(globalThis.player.animalData.background);
  processHitboxes(false, null);
  window.requestAnimationFrame(animalsFrame);
}
window.requestAnimationFrame(animalsFrame);
globalThis.player.canvas.addEventListener('click', function(evt) {
  processHitboxes(true, evt);
});
globalThis.player.stopLoading();
