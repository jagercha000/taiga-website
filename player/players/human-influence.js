globalThis.player.humanData = globalThis.player.humanData || new Object();
globalThis.player.humanData.hitboxes = globalThis.player.humanData.hitboxes || new Object();
globalThis.player.humanData.captions = globalThis.player.humanData.captions || new Object();
globalThis.player.humanData.captions.CAPTION = "";
globalThis.player.humanData.captionTime = 4000;
globalThis.player.humanUtil = globalThis.player.humanUtil || new Object();
async function registerImage(url) {
  globalThis.player.humanData.image = new Object();
  globalThis.player.humanData.image.url = await globalThis.player.util.downloadImage(url);
  globalThis.player.humanData.image.image = new Image();
  globalThis.player.humanData.image.image.src = globalThis.player.humanData.image.url;
}
globalThis.player.humanUtil.showCaption = function(text, duration) {
  document.querySelector('.human-caption-container').classList.remove('hidden');
  document.querySelector('.human-caption').innerText = text;
  gsap.fromTo('.human-caption-container', { opacity: 0 }, { opacity: 1, duration: 0.5, onComplete: function() {
    setTimeout(function() {
      gsap.fromTo('.human-caption-container', { opacity: 1 }, { opacity: 0, duration: 0.5, onComplete: function() {
        document.querySelector('.human-caption-container').classList.add('hidden');
      }});
    }, duration);
  }});
};
await registerImage("human-influence/human-influence.jpg");
globalThis.player.humanData.hitboxes = [];
globalThis.player.humanData.opacity = 1;
globalThis.player.humanData.animationActive = false;
function processHitboxes(click, evt) {
  if(globalThis.player.humanData.animationActive) {
    return;
  }
  var hitHitbox = false;
  globalThis.player.humanData.hitboxes.forEach((function(hitbox) {
    var calculatedHitbox = globalThis.player.humanUtil.calculateHitbox(hitbox.x, hitbox.y, hitbox.width, hitbox.height);
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
globalThis.player.humanUtil.calculateHitbox = function(x, y, width, height) {
  var image = globalThis.player.humanData.image;
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
async function humanFrame() {
  globalThis.player.util.clearCanvas();
  processHitboxes(false, null);
  globalThis.player.context.globalAlpha = globalThis.player.humanData.opacity;
  globalThis.player.util.fitImage(globalThis.player.humanData.image);
  globalThis.player.context.globalAlpha = 1;
  window.requestAnimationFrame(humanFrame);
}
window.requestAnimationFrame(humanFrame);
globalThis.player.canvas.addEventListener('click', function(evt) {
  processHitboxes(true, evt);
});
globalThis.player.stopLoading();
var captionContainerElement = document.createElement('div');
captionContainerElement.setAttribute('class', 'human-caption-container hidden');
var captionElement = document.createElement('div');
captionElement.setAttribute('class', 'human-caption');
captionContainerElement.appendChild(captionElement);
document.body.appendChild(captionContainerElement);
