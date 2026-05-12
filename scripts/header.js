globalThis.hooks = globalThis.hooks || new Object();
function hideHeaderDropdowns() {
  document.querySelectorAll('.header-menu-dropdown-content').forEach(function(element) {
    element.classList.add('hidden');
  });
}
globalThis.hooks['header-init'] = function() {
  document.querySelectorAll('.header-menu-dropdown-button').forEach(function(element) {
    element.addEventListener('click', function(evt) {
      evt.preventDefault();
      evt.target.parentElement.querySelector('.header-menu-dropdown-content').classList.remove('hidden');
    });
  });
  document.body.addEventListener('click', function(evt) {
    hideHeaderDropdowns();
  });
};
