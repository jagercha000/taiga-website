window.addEventListener('load', function() {
  var urlParams = new URLSearchParams(window.location.search);
  if(urlParams.get('id')) {
    var playerScript = "./players/" + urlParams.get('id') + ".js";
    var element = document.createElement('script');
    element.setAttribute('type', 'module');
    element.setAttribute('src', playerScript);
    document.head.appendChild(element);
  }
  var playerCanvas = document.querySelector('.player-canvas');
  function updatePlayerCanvasSize() {
    playerCanvas.width = window.innerWidth;
    playerCanvas.height = window.innerHeight;
  }
  updatePlayerCanvasSize();
  window.addEventListener('resize', updatePlayerCanvasSize.bind(this));
});
