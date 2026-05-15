window.addEventListener('load', function() {
  createPlayer('gallery', document.querySelector('.gallery-player'), 600, 375);
  document.querySelector('.abiotic-factors-button').addEventListener('click', function() {
    window.location.href = 'abiotic-factors.html';
  });
  document.querySelector('.biotic-factors-button').addEventListener('click', function() {
    window.location.href = 'biotic-factors.html';
  });
  document.querySelector('.predator-prey-button').addEventListener('click', function() {
    window.location.href = 'predator-prey.html';
  });
  document.querySelector('.food-web-button').addEventListener('click', function() {
    window.location.href = 'food-web.html';
  });
});
