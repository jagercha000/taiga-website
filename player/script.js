globalThis.player = globalThis.player || new Object();
window.addEventListener('load', function() {
  var urlParams = new URLSearchParams(window.location.search);
  if(urlParams.get('id')) {
    var playerScript = "./players/" + urlParams.get('id') + ".js";
    var playerStyle = "./players/" + urlParams.get('id') + ".css";
    var element = document.createElement('script');
    element.setAttribute('type', 'module');
    element.setAttribute('src', playerScript);
    document.head.appendChild(element);
    var element2 = document.createElement('link');
    element2.setAttribute('rel', 'stylesheet');
    element2.setAttribute('type', 'text/css');
    element2.setAttribute('src', playerStyle);
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
