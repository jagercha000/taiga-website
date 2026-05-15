globalThis.player.predatorsData = globalThis.player.predatorsData || new Object();
globalThis.player.predatorsData.background = new Object();
globalThis.player.predatorsData.background.url = await globalThis.player.util.downloadImage('predator-prey/predators.jpg');
globalThis.player.predatorsData.background.image = new Image();
globalThis.player.predatorsData.background.image.src = globalThis.player.predatorsData.background.url;
function predatorsFrame() {
  globalThis.player.util.fitImage(globalThis.player.predatorsData.background.image);
  window.requestAnimationFrmae(predatorsFrame);
}
window.requestAnimationFrame(predatorsFrame);
globalThis.player.stopLoading();
