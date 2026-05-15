globalThis.player.foodData = globalThis.player.foodData || new Object();
globalThis.player.foodData.background = new Object();
globalThis.player.foodData.background.url = await globalThis.player.util.downloadImage('food-web/food-web.jpg');
globalThis.player.foodData.background.image = new Image();
globalThis.player.foodData.background.image.src = globalThis.player.foodData.background.url;
function foodWebFrame() {
  globalThis.player.util.fitImage(globalThis.player.foodData.background);
  window.requestAnimationFrame(foodWebFrame);
}
window.requestAnimationFrame(foodWebFrame);
globalThis.player.stopLoading();
