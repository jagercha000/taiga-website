async function fetchPictureMetadata() {
  var result = await fetch('../assets/gallery/pictures.json');
  return await result.json();
}
async function downloadPicture(pictureObject) {
  var result = await fetch('../assets/gallery/' + pictureObject.url);
  var buf = await result.arrayBuffer();
  var blob = new Blob([buf], { 'type': pictureObject.type });
  return URL.createObjectURL(blob);
}
function createGalleryButtons() {}
function createGalleryPictures() {}
globalThis.player.galleryData = globalThis.player.galleryData || [];
(async function() {
  globalThis.player.galleryData = await fetchPictureMetadata();
  for(var i=0;i<globalThis.player.galleryData.length;i++) {
    globalThis.player.galleryData[i].blob = await downloadPicture(globalThis.player.galleryData[i].url);
  }
  createGalleryButtons();
  createGalleryPictures();
})();
