window.addEventListener('load', function() {
  var urlParams = new URLSearchParams(window.location.search);
  if(urlParams.get('id')) {
    var playerScript = "./players/" + urlParams.get('id') + ".js";
    import playerScript
  }
});
