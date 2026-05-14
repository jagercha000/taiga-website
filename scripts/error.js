import "./constants.js"
window.addEventListener('load', function() {
  document.querySelector('.error-back-button').addEventListener('click', function() {
    window.history.go(-1);
  });
  document.querySelector('.error-home-button').addEventListener('click', function() {
    window.location.href = sitePath;
  });
});
