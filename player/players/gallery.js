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
function previousPicture() {}
function nextPicture() {}
function createGalleryButtons() {
  var prevBtn = document.createElement('button');
  var nextBtn = document.createElement('button');
  prevBtn.innerHTML = `<span class="gallery-prev-arrow">&#xF12F;</span>`;
  nextBtn.innerHTML = `<span class="gallery-next-arrow">&#xF138;</span>`;
  prevBtn.onclick = previousPicture;
  nextBtn.onclick = nextPicture;
  prevBtn.setAttribute('class', 'gallery-previous-button outline-button');
  nextBtn.setAttribute('class', 'gallery-next-button outline-button');
  document.body.appendChild(prevBtn);
  document.body.appendChild(nextBtn);
}
function createGalleryCaption() {}
function createGalleryPicture(picture) {}
function createGalleryPictures() {
  globalThis.player.galleryData.forEach(function(picture) {
    createGalleryPicture(picture);
  });
}
globalThis.player.galleryData = globalThis.player.galleryData || [];
(async function() {
  globalThis.player.galleryData = await fetchPictureMetadata();
  for(var i=0;i<globalThis.player.galleryData.length;i++) {
    globalThis.player.galleryData[i].blob = await downloadPicture(globalThis.player.galleryData[i]);
  }
  createGalleryButtons();
  createGalleryCaption();
  createGalleryPictures();
})();
