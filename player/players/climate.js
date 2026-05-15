globalThis.player.climateData = globalThis.player.climateData || new Object();
globalThis.player.climateData.images = globalThis.player.climateData.images || new Object();
globalThis.player.climateData.hitboxes = globalThis.player.climateData.hitboxes || new Object();
globalThis.player.climateData.captions = globalThis.player.climateData.captions || new Object();
globalThis.player.climateData.captions.WINTER_TEMPERATURE = "Winter temperatures in taigas can drop to -40°F.";
globalThis.player.climateData.captions.SPRING_TEMPERATURE = "Taigas in spring has volatile temperatures and snow melts quickly.";
globalThis.player.climateData.captions.SUMMER_TEMPERATURE = "Taigas in summer is warm and humid, but not very long lasting. Temperatures can range from 20°F to 104°F.";
globalThis.player.climateData.captions.AUTUMN_TEMPERATURE = "Autumn in taigas is short and temperatures usually are 23-50°F.";
globalThis.player.climateData.captions.PERMAFROST = "Taigas have a layer of permafrost, where soil is frozen year-round. The means that nutrients are poor, making it difficult for plants to grow.";
globalThis.player.climateData.captions.ACIDIC = "Soil in taigias is acidic, which makes it hard for plants to grow.";
globalThis.player.climateData.captions.RAIN = "Taigais receive little rainfall, often only 8 to 31 inches each year.";
globalThis.player.climateUtil = globalThis.player.climateUtil || new Object();
async function registerImage(id, url) {
  globalThis.player.climateData.images[id] = new Object();
  globalThis.player.climateData.images[id].url = await globalThis.player.util.downloadImage(url);
  globalThis.player.climateData.images[id].image = new Image();
  globalThis.player.climateData.images[id].image.src = globalThis.player.climateData.images[id].url;
  globalThis.player.climateData.hitboxes[id] = [];
}
globalThis.player.climateUtil.showCaption = function(text, duration) {
  document.querySelector('.climate-caption-container').classList.remove('hidden');
  document.querySelector('.climate-caption').innerText = text;
  gsap.fromTo('.climate-caption-container', { opacity: 0 }, { opacity: 1, duration: 0.25, onComplete: function() {
    setTimeout(function() {
      gsap.fromTo('.climate-caption-container', { opacity: 1 }, { opacity: 0, duration: 0.25, onComplete: function() {
        document.querySelector('.climate-caption-container').classList.add('hidden');
      }});
    }, duration);
  }});
};
await registerImage("winter", "climate/winter.jpg");
await registerImage("spring", "climate/spring.jpg");
await registerImage("summer", "climate/summer.jpg");
await registerImage("autumn", "climate/autumn.jpg");
globalThis.player.climateData.hitboxes.spring.push({ x: 3179, y: 199, width: 270, height: 993, click: function() {
  globalThis.player.climateUtil.showCaption(globalThis.player.climateData.captions.SPRING_TEMPERATURE, 2000);
}});
globalThis.player.climateData.hitboxes.spring.push({ x: 0, y: 1551, width: 3556, height: 449, click: function() {
  globalThis.player.climateUtil.showCaption(globalThis.player.climateData.captions.PERMAFROST, 2000);
}});
globalThis.player.climateData.hitboxes.summer.push({ x: 3179, y: 199, width: 270, height: 993, click: function() {
  globalThis.player.climateUtil.showCaption(globalThis.player.climateData.captions.SUMMER_TEMPERATURE, 2000);
}});
globalThis.player.climateData.hitboxes.summer.push({ x: 373, y: 167, width: 853, height: 224, click: function() {
  globalThis.player.climateUtil.showCaption(globalThis.player.climateData.captions.RAIN, 2000);
}});
globalThis.player.climateData.hitboxes.summer.push({ x: 0, y: 1551, width: 3556, height: 449, click: function() {
  globalThis.player.climateUtil.showCaption(globalThis.player.climateData.captions.ACIDIC, 2000);
}});
globalThis.player.climateData.hitboxes.autumn.push({ x: 3179, y: 199, width: 270, height: 993, click: function() {
  globalThis.player.climateUtil.showCaption(globalThis.player.climateData.captions.AUTUMN_TEMPERATURE, 2000);
}});
globalThis.player.climateData.hitboxes.autumn.push({ x: 0, y: 1551, width: 3556, height: 449, click: function() {
  globalThis.player.climateUtil.showCaption(globalThis.player.climateData.captions.PERMAFROST, 2000);
}});
globalThis.player.climateData.hitboxes.winter.push({ x: 3179, y: 199, width: 270, height: 993, click: function() {
  globalThis.player.climateUtil.showCaption(globalThis.player.climateData.captions.WINTER_TEMPERATURE, 2000);
}});
globalThis.player.climateData.hitboxes.winter.push({ x: 0, y: 1551, width: 3556, height: 449, click: function() {
  globalThis.player.climateUtil.showCaption(globalThis.player.climateData.captions.PERMAFROST, 2000);
}});
globalThis.player.climateData.currentSeason = "winter";
globalThis.player.climateData.nextSeason = null;
globalThis.player.climateData.opacity = 1;
globalThis.player.climateData.animationActive = false;
globalThis.player.climateData.direction = -1;
globalThis.player.climateData.mod = 0.005;
globalThis.player.climateData.seasons = [ "winter", "spring", "summer", "autumn" ];
function processHitboxes(click, evt) {
  if(globalThis.player.climateData.animationActive) {
    return;
  }
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
  globalThis.player.util.fitImage(globalThis.player.climateData.images[globalThis.player.climateData.currentSeason].image);
  globalThis.player.context.globalAlpha = 1;
  window.requestAnimationFrame(climateFrame);
}
window.requestAnimationFrame(climateFrame);
globalThis.player.canvas.addEventListener('click', function(evt) {
  processHitboxes(true, evt);
});
globalThis.player.stopLoading();
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
var captionContainerElement = document.createElement('div');
captionContainerElement.setAttribute('class', 'climate-caption-container hidden');
var captionElement = document.createElement('div');
captionElement.setAttribute('class', 'climate-caption');
captionContainerElement.appendChild(captionElement);
document.body.appendChild(captionContainerElement);
