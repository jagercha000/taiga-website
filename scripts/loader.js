globalThis.hooks = globalThis.hooks || new Object();
globalThis.hooks['loader-init'] = function() {};
globalThis.hooks['loader-hide'] = function() {
  setTimeout(function() {
    gsap.fromTo('.loader-overlay', { opacity: 0 }, { opacity: 1, duration: 2, onComplete: function() {
      document.querySelector('.loader-overlay').classList.add('hidden');
    }});
  }, 2500);
);};
