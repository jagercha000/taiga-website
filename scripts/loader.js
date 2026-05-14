import "../lib/loading-bar.js"
globalThis.hooks = globalThis.hooks || new Object();
globalThis.hooks['loader-init'] = function() {
  globalThis.loadingBar = new ldBar('.loader', { 'preset': 'circle', 'value': 0, 'stroke': '#ffffff', 'stroke-width': 3 });
};
globalThis.hooks['loader-update'] = function(percent) {
  globalThis.loadingBar.set(percent, true);
};
globalThis.hooks['loader-hide'] = function() {
  globalThis.loadingBar.set(100, true);
  setTimeout(function() {
    gsap.fromTo('.loader-overlay', { opacity: 1 }, { opacity: 0, duration: 1, onComplete: function() {
      document.querySelector('.loader-overlay').classList.add('hidden');
    }});
  }, 2500);
};
