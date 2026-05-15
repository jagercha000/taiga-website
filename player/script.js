globalThis.player = globalThis.player || new Object();
globalThis.player.util = globalThis.player.util || new Object();
globalThis.player._pageLoaded = false;
globalThis.player._playerLoaded = false;
globalThis.player._loadedCallback = null;
window.onmessage = function(evt) {
  var message = evt.data;
  if(message.type == 'LOAD') {
    globalThis.player._pageLoaded = true;
    globalThis.player.checkLoadState();
  }
};
globalThis.player.checkLoadState = function() {
  if(globalThis.player._playerLoaded && globalThis.player._pageLoaded) {
    setTimeout(function() {
      gsap.fromTo('.player-loading', { opacity: 1 }, { opacity: 0, duration: 1, onComplete: function() {
        document.querySelector('.player-loading').classList.add('hidden');
        if(globalThis.player._loadedCallback) {
          globalThis.player._loadedCallback();
        }
      }});
    }, 4000);
  }
};
globalThis.player.stopLoading = function(callback=null) {
  globalThis.player._loadedCallback = callback;
  globalThis.player._playerLoaded = true;
  globalThis.player.checkLoadState();
};
globalThis.player.util.downloadImage = async function(url) {
  var result = await fetch('../assets/' + url);
  var blob = await result.blob();
  return URL.createObjectURL(blob);
};
globalThis.player.util.collision = function(x1, y1, w1, h1, x2, y2, w2, h2) {
  var collideX = (x1 + w1) >= x2 && x1 <= (x2 + w2);
  var collideY = (y1 + h1) >= y2 && y1 <= (y2 + h2);
  return collideX && collideY;
};
globalThis.player.util.fitImage = function(image) {
    var canvasWidth = globalThis.player.canvas.width;
    var canvasHeight = globalThis.player.canvas.height;
    var scale = Math.min(canvasWidth / image.width, canvasHeight / image.height);
    var newWidth = image.width * scale;
    var newHeight = image.height * scale;
    var x = (canvasWidth - newWidth) / 2;
    var y = (canvasHeight - newHeight) / 2;
    globalThis.player.context.drawImage(image, x, y, newWidth, newHeight);
};
globalThis.player.util.clearCanvas = function() {
  globalThis.player.context.clearRect(0, 0, globalThis.player.canvas.width, globalThis.player.canvas.height);
};
globalThis.player.util.setCursor = function(cursor) {
  globalThis.player.canvas.style.cursor = cursor;
};
globalThis.player._mouseCoords = { x: -1, y: -1 };
globalThis.player.util.getMouseCoords = function() {
  return globalThis.player._mouseCoords;
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
  playerCanvas.addEventListener('mousemove', function(evt) {
    var canvasHitbox = globalThis.player.canvas.getBoundingClientRect();
    var calcX = evt.clientX - canvasHitbox.left;
    var calcY = evt.clientY - canvasHitbox.top;
    globalThis.player._mouseCoords = { x: calcX, y: calcY };
  });
  function canvasMouseOut() {
    globalThis.player._mouseCoords = { x: -1, y: -1 };
  }
  playerCanvas.addEventListener('mouseout', canvasMouseOut);
  playerCanvas.addEventListener('mouseleave', canvasMouseOut);
  updatePlayerCanvasSize();
  window.addEventListener('resize', updatePlayerCanvasSize.bind(this));
  globalThis.player.canvas = playerCanvas;
  globalThis.player.context = playerCanvas.getContext('2d');
  window.addEventListener('contextmenu', function(evt) {
    evt.preventDefault();
  });
});
