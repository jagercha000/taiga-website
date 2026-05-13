globalThis.hooks = globalThis.hooks || new Object();
function hideHeaderDropdowns() {
  document.body.classList.remove('dropdown-active');
  document.querySelectorAll('.header-menu-dropdown-content').forEach(function(element) {
    element.classList.add('hidden');
  });
}
globalThis.hooks['header-init'] = function() {
  document.querySelectorAll('.header-menu-dropdown-button').forEach(function(element) {
    element.addEventListener('click', function(evt) {
      var targetDropdown = evt.target.closest('.header-menu-dropdown-button').parentElement.querySelector('.header-menu-dropdown-content');
      evt.preventDefault();
      if(targetDropdown.classList.contains('hidden')) {
        targetDropdown.classList.remove('hidden');
        var buttonBox = evt.target.closest('.header-menu-dropdown-button').getBoundingClientRect();
        var dropdownBox = targetDropdown.getBoundingClientRect();
        var buttonCenter = buttonBox.left - (buttonBox.width / 2);
        var offset = dropdownBox.width / 2;
        var newLeft = buttonCenter - offset;
        targetDropdown.style.left = newLeft + 'px';
        document.body.classList.add('dropdown-active');
      } else {
        hideHeaderDropdowns();
      }
    });
  });
  document.body.addEventListener('click', function(evt) {
    var allowedClasses = [ 'header-menu-dropdown-content', 'header-menu-dropdown-button' ];
    var shouldHide = true;
    allowedClasses.forEach((function(allowedClass) {
      var allowedElement = evt.target.closest('.' + allowedClass);
      if(allowedElement) {
        shouldHide = false;
      }
    }).bind(this));
    if(shouldHide) {
      hideHeaderDropdowns();
    }
  });
};
