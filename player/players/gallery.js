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
globalThis.player.galleryPicture = 0;
globalThis.player.galleryAnimating = true;
function selectPicture(index) {
  globalThis.player.galleryAnimating = true;
  var pictures = document.querySelectorAll('.gallery-picture');
  var currentPicture = document.querySelector('.gallery-picture:not(.hidden)');
  var newPicture = pictures[index];
  function showNewPicture() {
    newPicture.classList.remove('hidden');
    document.querySelector('.gallery-caption').innerText = globalThis.player.galleryData[index].caption;
    gsap.fromTo(newPicture, { opacity: 0 }, { opacity: 1, duration: 0.5, onComplete: (function() {
      globalThis.player.galleryAnimating = false;
    }).bind(this) });
  }
  if(currentPicture) {
    gsap.fromTo(currentPicture, { opacity: 1 }, { opacity: 0, duration: 0.5, onComplete: (function() {
      currentPicture.classList.add('hidden');
      showNewPicture();
    }).bind(this) });
  } else {
    showNewPicture();
  }
}
function previousPicture() {
  if(globalThis.player.galleryAnimating) { return; }
  globalThis.player.galleryPicture -= 1;
  if(globalThis.player.galleryPicture < 0) {
    globalThis.player.galleryPicture = globalThis.player.galleryData.length - 1;
  }
  selectPicture(globalThis.player.galleryPicture);
}
function nextPicture() {
  if(globalThis.player.galleryAnimating) { return; }
  globalThis.player.galleryPicture += 1;
  if(globalThis.player.galleryPicture >= globalThis.player.galleryData.length) {
    globalThis.player.galleryPicture = 0;
  }
  selectPicture(globalThis.player.galleryPicture);
}
function createGalleryButtons() {
  var prevBtn = document.createElement('button');
  var nextBtn = document.createElement('button');
  prevBtn.innerHTML = `<span class="gallery-prev-arrow"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/></svg></span>`;
  nextBtn.innerHTML = `<span class="gallery-next-arrow"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"/></svg></span>`;
  prevBtn.onclick = previousPicture;
  nextBtn.onclick = nextPicture;
  prevBtn.setAttribute('class', 'gallery-previous-button');
  nextBtn.setAttribute('class', 'gallery-next-button');
  document.body.appendChild(prevBtn);
  document.body.appendChild(nextBtn);
}
function createGalleryCaption() {
  var element = document.createElement('p');
  element.setAttribute('class', 'gallery-caption');
  document.body.appendChild(element);
}
function createGalleryPicture(picture, parent) {
  var element = document.createElement('div');
  element.setAttribute('class', 'gallery-picture hidden');
  element.style.backgroundImage = 'url("' + picture.blob + '")';
  parent.appendChild(element);
}
function createGalleryPictures() {
  var parent = document.createElement('div');
  parent.setAttribute('class', 'gallery-picture-container');
  document.body.appendChild(parent);
  globalThis.player.galleryData.forEach((function(picture) {
    createGalleryPicture(picture, parent);
  }).bind(this));
}
globalThis.player.galleryData = globalThis.player.galleryData || [];
(async function() {
  var element = document.createElement('div');
  element.setAttribute('class', 'gallery-loading');
  element.innerHTML = "<p>Loading</p>";
  document.body.appendChild(element);
  globalThis.player.galleryData = await fetchPictureMetadata();
  for(var i=0;i<globalThis.player.galleryData.length;i++) {
    globalThis.player.galleryData[i].blob = await downloadPicture(globalThis.player.galleryData[i]);
  }
  createGalleryButtons();
  createGalleryCaption();
  createGalleryPictures();
  setTimeout(function() {
    gsap.fromTo('.gallery-loading', { opacity: 0 }, { opacity: 1, duration: 1, onComplete: function() {
      document.querySelector('.gallery-loading').classList.add('hidden');
      selectPicture(0);
    }));
  }, 10000);
})();
