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
async function climateFrame() {
  if(globalThis.player.climateData.currentSeason == "winter") {
    globalThis.player.util.fitImage(globalThis.player.climateData.images.winter.image);
  } else if(globalThis.player.climateData.currentSeason == "summer") {
    globalThis.player.util.fitImage(globalThis.player.climateData.images.summer.image);
  }
  window.requestAnimationFrame(climateFrame);
}
window.requestAnimationFrame(climateFrame);
setTimeout(function() {
  gsap.fromTo('.climate-loading', { opacity: 1 }, { opacity: 0, duration: 1, onComplete: function() {
    document.querySelector('.climate-loading').classList.add('hidden');
  }});
}, 15000);
