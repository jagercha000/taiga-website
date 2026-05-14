import "./constants.js"
globalThis.hooks = globalThis.hooks || new Object();
globalThis.hooks['notify-player-loaded'] = function() {
  document.querySelectorAll('.player-frame').forEach(function(frame) {
    frame.contentWindow.postMessage({ 'type': 'LOAD' }, '*');
  });
};
globalThis.createPlayer = function(id, target, width, height) {
  var element = document.createElement('iframe');
  var playerURL = sitePath + "player/index.html?id=" + id;
  element.setAttribute('src', playerURL);
  element.setAttribute('class', 'player-frame');
  element.setAttribute('width', width);
  element.setAttribute('height', height);
  target.appendChild(element);
}
