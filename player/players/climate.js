globalThis.player.climateData = globalThis.player.climateData || new Object();
globalThis.player.climateData.images = globalThis.player.climateData.images || new Object();
var element = document.createElement('div');
element.setAttribute('class', 'climate-loading');
element.innerText = "Loading";
document.body.appendChild(element);
async function registerImage(id, url) {
  globalThis.player.climateData.images[id] = new Object();
  globalThis.player.climateData.images[id].url = await globalThis.player.util.downloadImage(url);
  globalThis.player.climateData.images[id].image = new Image();
  globalThis.player.climateData.images[id].image.src = globalThis.player.climateData.images[id].url;
}
await registerImage("winter", "climate/winter.jpg");
await registerImage("summer", "climate/summer.jpg");
globalThis.player.climateData.currentSeason = "winter";
globalThis.player.climateData.nextSeason = null;
globalThis.player.climateData.opacity = 1;
globalThis.player.climateData.animationActive = false;
globalThis.player.climateData.direction = -1;
globalThis.player.climateData.mod = 0.05;
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
function changeSeason(newSeason) {
  if(globalThis.player.climateData.animationActive) {
    return;
  }
  globalThis.player.climateData.nextSeason = newSeason;
}
async function climateFrame() {
  globalThis.player.util.clearCanvas();
  processFade();
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
setTimeout(function() {
  gsap.fromTo('.climate-loading', { opacity: 1 }, { opacity: 0, duration: 1, onComplete: function() {
    document.querySelector('.climate-loading').classList.add('hidden');
  }});
}, 15000);
