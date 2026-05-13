async function fetchPictureMetadata() {
  var result = await fetch('../../assets/gallery/pictures.json');
  return await result.json();
}
async function downloadPicture(pictureObject) {
  var result = await fetch('../../assets/gallery/' + pictureObject.url);
  var buf = await result.arrayBuffer();
  var blob = new Blob([buf], { 'type': pictureObject.type });
  return URL.createObjectURL(blob);
}
