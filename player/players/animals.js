globalThis.player.animalData = globalThis.player.animalData || new Object();
globalThis.player.animalData.background = new Image();
globalThis.player.animalData.background.src = await globalThis.player.util.downloadImage("animals/animals.jpg");
globalThis.player.animalData.animals = globalThis.player.animalData.animals || new Object();
async function registerAnimal(animal) {
  globalThis.player.animalData.animals[animal] = new Object();
  globalThis.player.animalData.animals[animal].url = await globalThis.player.util.downloadImage("animals/animals/" + animal + ".jpg");
  globalThis.player.animalData.animals[animal].image = new Image();
  globalThis.player.animalData.animals[animal].image.src = globalThis.player.animalData.animals[animal].url;
}
await registerAnimal('bear');
await registerAnimal('deer');
await registerAnimal('lingonberries');
await registerAnimal('lynx');
await registerAnimal('moose');
await registerAnimal('mushrooms');
await registerAnimal('wolf');
function animalsFrame() {
  globalThis.player.util.fitImage(globalThis.player.animalData.background);
  window.requestAnimationFrame(animalsFrame);
}
window.requestAnimationFrame(animalsFrame);
globalThis.player.canvas.addEventListener('click', function(evt) {
  processHitboxes(true, evt);
});
globalThis.player.stopLoading();
