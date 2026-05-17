globalThis.player.predatorsData = globalThis.player.predatorsData || new Object();
globalThis.player.predatorsUtil = globalThis.player.predatorsUtil || new Object();
globalThis.player.predatorsData.background = new Object();
globalThis.player.predatorsData.background.url = await globalThis.player.util.downloadImage('predator-prey/predators.jpg');
globalThis.player.predatorsData.background.image = new Image();
globalThis.player.predatorsData.background.image.src = globalThis.player.predatorsData.background.url;
globalThis.player.predatorsData.noInteract = false;
globalThis.player.predatorsData.hitboxes = [];
var contentResult = await globalThis.player.util.fetchAsset('predator-prey/predators.json');
globalThis.player.predatorsData.content = await contentResult.json();
var contentKeys = Object.keys(globalThis.player.predatorsData.content);
globalThis.player.predatorsData.preyImages = new Object();
for(var i=0;i<contentKeys.length;i++) {
  var key = contentKeys[i];
  var content = globalThis.player.predatorsData.content[key];
  var wrapperElement = document.createElement('div');
  wrapperElement.setAttribute('class', 'predator-info hidden');
  wrapperElement.setAttribute('data-id', key);
  var button = document.createElement('button');
  button.setAttribute('class', 'predator-close');
  button.innerText = 'Close';
  button.addEventListener('click', closeHit);
  wrapperElement.appendChild(button);
  var element = document.createElement('div');
  element.setAttribute('class', 'predator-info-container');
  var titleElement = document.createElement('p');
  titleElement.setAttribute('class', 'predator-name');
  titleElement.innerText = content.name;
  element.appendChild(titleElement);
  var preyElement = document.createElement('div');
  preyElement.setAttribute('class', 'predator-prey');
  for(var j=0;j<content.prey.length;j++) {
    var preyId = content.prey[j].id;
    globalThis.player.predatorsData.preyImages[preyId] = new Object();
    globalThis.player.predatorsData.preyImages[preyId].url = await globalThis.player.util.downloadImage('predator-prey/prey/' + preyId + '.png');
    globalThis.player.predatorsData.preyImages[preyId].image = new Image();
    globalThis.player.predatorsData.preyImages[preyId].image.src = globalThis.player.predatorsData.preyImages[preyId].url;
    var preyContentElement = document.createElement('div');
    preyContentElement.setAttribute('class', 'prey-info');
    var preyName = document.createElement('p');
    preyName.setAttribute('class', 'prey-name');
    preyName.innerText = content.prey[j].name;
    preyContentElement.appendChild(preyName);
    var preyImage = document.createElement('img');
    preyImage.setAttribute('class', 'prey-image');
    preyImage.setAttribute('src', globalThis.player.predatorsData.preyImages[preyId].url);
    preyContentElement.appendChild(preyImage);
    var preyInfo = document.createElement('p');
    preyInfo.setAttribute('class', 'prey-content');
    preyInfo.innerText = content.prey[j].content;
    preyContentElement.appendChild(preyInfo);
    preyElement.appendChild(preyContentElement);
  }
  element.appendChild(preyElement);
  wrapperElement.appendChild(element);
  document.body.appendChild(wrapperElement);
}
function closeHit(evt) {
  if(globalThis.player.predatorsData.noInteract) {
    return;
  }
  var wrapper = evt.target.closest('.predator-info');
  globalThis.player.predatorsData.noInteract = true;
  gsap.fromTo(wrapper, { opacity: 1 }, { opacity: 0, duration: 1, onComplete: (function() {
    globalThis.player.predatorsData.noInteract = false;
    wrapper.classList.add('hidden');
  }).bind(this) });
}
function hit(id) {
  var wrapper = document.querySelector('.predator-info[data-id="' + id + '"]');
  globalThis.player.predatorsData.noInteract = true;
  wrapper.classList.remove('hidden');
  gsap.fromTo(wrapper, { opacity: 0 }, { opacity: 1, duration: 1, onComplete: function() {
    globalThis.player.predatorsData.noInteract = false;
  }});
}
globalThis.player.predatorsData.hitboxes.push({ x: 53, y: 351, width: 95, height: 60, click: function() { hit("wolf"); }});
globalThis.player.predatorsData.hitboxes.push({ x: 357, y: 344, width: 30, height: 70, click: function() { hit("lynx"); }});
globalThis.player.predatorsData.hitboxes.push({ x: 819, y: 346, width: 125, height: 72, click: function() { hit("bear"); }});
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
  var image = globalThis.player.predatorsData.background.image;
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
  globalThis.player.util.clearCanvas();
  processHitboxes(false, null);
  globalThis.player.util.fitImage(globalThis.player.predatorsData.background.image);
  window.requestAnimationFrame(predatorsFrame);
}
window.requestAnimationFrame(predatorsFrame);
globalThis.player.canvas.addEventListener('click', function(evt) {
  processHitboxes(true, evt);
});
globalThis.player.stopLoading();
