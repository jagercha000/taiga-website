globalThis.player = globalThis.player || new Object();
globalThis.player.util = globalThis.player.util || new Object();
globalThis.player.util.downloadImage = function(url) {
  var result = await fetch('../assets/' + url);
  var blob = await result.blob();
  return URL.createObjectURL(blob);
};
window.addEventListener('load', async function() {
  var urlParams = new URLSearchParams(window.location.search);
  if(urlParams.get('id')) {
    var playerScript = "./players/" + urlParams.get('id') + ".js";
    var playerStyle = "./players/" + urlParams.get('id') + ".css";
    var element = document.createElement('script');
    element.setAttribute('type', 'module');
    element.setAttribute('src', playerScript);
    document.head.appendChild(element);
    var response = await fetch(playerStyle);
    var responseText = await response.text();
    var element2 = document.createElement('style');
    element2.setAttribute('type', 'text/css');
    element2.textContent = responseText;
    document.head.appendChild(element2);
  }
  var playerCanvas = document.querySelector('.player-canvas');
  function updatePlayerCanvasSize() {
    playerCanvas.width = window.innerWidth;
    playerCanvas.height = window.innerHeight;
  }
  updatePlayerCanvasSize();
  window.addEventListener('resize', updatePlayerCanvasSize.bind(this));
  globalThis.player.canvas = playerCanvas;
});
