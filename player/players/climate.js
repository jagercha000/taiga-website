globalThis.player.climateData = globalThis.player.climateData || new Object();
globalThis.player.climateData.images = globalThis.player.climateData.images || new Object();
window.addEventListener('load', async function() {
  var element = document.createElement('div');
  element.setAttribute('class', 'climate-loading');
  element.innerText = "Loading";
  document.body.appendChild(element);
  globalThis.player.climateData.images.winter = await globalThis.player.utils.downloadImage("climate/winter.jpg");
  globalThis.player.climateData.images.summer = await globalThis.player.utils.downloadImage("climate/summer.jpg");
});
