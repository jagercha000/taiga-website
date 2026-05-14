globalThis.player.climateData = globalThis.player.climateData || new Object();
globalThis.player.climateData.images = globalThis.player.climateData.images || new Object();
globalThis.player.climateData.hitboxes = globalThis.player.climateData.hitboxes || new Object();
globalThis.player.climateUtil = globalThis.player.climateUtil || new Object();
var element = document.createElement('div');
element.setAttribute('class', 'climate-loading');
element.innerText = "Loading";
document.body.appendChild(element);
async function registerImage(id, url) {
  globalThis.player.climateData.images[id] = new Object();
  globalThis.player.climateData.images[id].url = await globalThis.player.util.downloadImage(url);
  globalThis.player.climateData.images[id].image = new Image();
  globalThis.player.climateData.images[id].image.src = globalThis.player.climateData.images[id].url;
  globalThis.player.climateData.hitboxes[id] = [];
}
await registerImage("winter", "climate/winter.jpg");
await registerImage("summer", "climate/summer.jpg");
globalThis.player.climateData.hitboxes.summer.push({ x: 2676, y: 252, width: 222, height: 690, click: function() { alert("Temp!"); });
globalThis.player.climateData.hitboxes.summer.push({ x: 312, y: 147, width: 729, height: 204, click: function() { alert("Rain!"); });
globalThis.player.climateData.hitboxes.summer.push({ x: 0, y: 1311, width: 3000, height: 376, click: function() { alert("Acid!"); });
globalThis.player.climateData.hitboxes.winter.push({ x: 2676, y: 252, width: 222, height: 690, click: function() { alert("Low Temp!"); });
globalThis.player.climateData.hitboxes.winter.push({ x: 0, y: 1311, width: 3000, height: 376, click: function() { alert("Permafrost!"); });
globalThis.player.climateData.currentSeason = "winter";
globalThis.player.climateData.nextSeason = null;
globalThis.player.climateData.opacity = 1;
globalThis.player.climateData.animationActive = false;
globalThis.player.climateData.direction = -1;
globalThis.player.climateData.mod = 0.005;
globalThis.player.climateData.seasons = [ "winter", "summer" ];
function processHitboxes(click, evt) {
  var hitHitbox = false;
  globalThis.player.climateData.hitboxes[globalThis.player.climateData.currentSeason].forEach((function(hitbox) {
    var calculatedHitbox = globalThis.player.climateUtil.calculateHitbox(hitbox.x, hitbox.y, hitbox.width, hitbox.height);
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
globalThis.player.climateUtil.calculateHitbox = function(x, y, width, height) {
  var image = globalThis.player.climateData.images[globalThis.player.climateData.currentSeason].image;
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
function processFade() {
  if(globalThis.player.climateData.nextSeason != null) {
    globalThis.player.climateData.animationActive = true;
    globalThis.player.climateData.opacity += (globalThis.player.climateData.direction * globalThis.player.climateData.mod);
    if(globalThis.player.climateData.direction < 0 && globalThis.player.climateData.opacity <= 0) {
      globalThis.player.climateData.opacity = 0;
      globalThis.player.climateData.direction = 1;
      globalThis.player.climateData.currentSeason = globalThis.player.climateData.nextSeason;
    }
    if(globalThis.player.climateData.direction > 0 && globalThis.player.climateData.opacity >= 1) {
      globalThis.player.climateData.opacity = 1;
      globalThis.player.climateData.direction = -1;
      globalThis.player.climateData.nextSeason = null;
      globalThis.player.climateData.animatonActive = false;
    }
  } else {
    globalThis.player.climateData.animationActive = false;
  }
}
globalThis.player.climateUtil.changeSeason = function(newSeason) {
  if(globalThis.player.climateData.animationActive) {
    return;
  }
  globalThis.player.climateData.nextSeason = newSeason;
};
async function climateFrame() {
  globalThis.player.util.clearCanvas();
  processFade();
  processHitboxes(false, null);
  globalThis.player.context.globalAlpha = globalThis.player.climateData.opacity;
  if(globalThis.player.climateData.currentSeason == "winter") {
    globalThis.player.util.fitImage(globalThis.player.climateData.images.winter.image);
  } else if(globalThis.player.climateData.currentSeason == "summer") {
    globalThis.player.util.fitImage(globalThis.player.climateData.images.summer.image);
  }
  globalThis.player.context.globalAlpha = 1;
  window.requestAnimationFrame(climateFrame);
}
window.requestAnimationFrame(climateFrame);
globalThis.player.canvas.addEventListener('click', function(evt) {
  processHitboxes(true, evt);
});
setTimeout(function() {
  gsap.fromTo('.climate-loading', { opacity: 1 }, { opacity: 0, duration: 1, onComplete: function() {
    document.querySelector('.climate-loading').classList.add('hidden');
  }});
}, 15000);
var element = document.createElement('button');
element.setAttribute('class', 'climate-season-button');
element.innerText = "Change Season";
element.addEventListener('click', function() {
  if(globalThis.player.climateData.animationActive) {
    return;
  }
  var seasonIndex = globalThis.player.climateData.seasons.indexOf(globalThis.player.climateData.currentSeason);
  seasonIndex += 1;
  if(seasonIndex >= globalThis.player.climateData.seasons.length) {
    seasonIndex = 0;
  }
  var newSeason = globalThis.player.climateData.seasons[seasonIndex];
  globalThis.player.climateUtil.changeSeason(newSeason);
});
document.body.appendChild(element);
