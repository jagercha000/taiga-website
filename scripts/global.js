globalThis.hooks = globalThis.hooks || new Object();
function callHook(hookId, ...args) {
  return globalThis.hooks[hookId](...args);
}
import "./header.js"
import "./footer.js"
import "./loader.js"
import "./constants.js"
import "./player.js"
function processComponent(componentContent) {
  componentContent = componentContent.replaceAll('%SITENAME%', siteName);
  componentContent = componentContent.replaceAll('%SITE%', sitePath);
  componentContent = componentContent.replaceAll('%AUTHORS%', authors);
  componentContent = componentContent.replaceAll('%YEAR%', currentYear);
  return componentContent;
}
async function loadComponents() {
  var headerResponse = await fetch(sitePath + "components/header.html");
  var footerResponse = await fetch(sitePath + "components/footer.html");
  var headerContent = await headerResponse.text();
  var footerContent = await footerResponse.text();
  document.querySelector('header').innerHTML = processComponent(headerContent);
  callHook('header-init');
  document.querySelector('footer').innerHTML = processComponent(footerContent);
  callHook('footer-init');
}
function injectIcon() {
  var iconURL = sitePath + "assets/favicon.png";
  var element = document.createElement('link');
  element.setAttribute('rel', 'icon');
  element.setAttribute('type', 'image/png');
  element.setAttribute('href', iconURL);
  document.head.appendChild(element);
}
function modifyTitles() {
  document.title = document.title + " | " + siteName;
}
function hideLoader() {
  callHook('loader-hide');
  callHook('notify-player-load');
}
async function init() {
  callHook('loader-init');
  await loadComponents();
  callHook('loader-update', 5);
  setTimeout(function() {
    injectIcon();
    callHook('loader-update', 6);
    modifyTitles();
    callHook('loader-update', 7);
    setTimeout(hideLoader, 1000);
  }, 1000);
}
window.addEventListener('load', init);
