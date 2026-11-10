(function() {
  "use strict";

  var isLoaded = false;

  function loadMainScript() {
    if (isLoaded) return;
    isLoaded = true;

    var xhr = new XMLHttpRequest();
    xhr.open("GET", browser.runtime.getURL("main.js"), false);
    xhr.send(null);

    var script = document.createElement("script");
    script.textContent = xhr.responseText;
    (document.head || document.documentElement).appendChild(script);
    script.remove();
  }

  function unloadMainScript() {
    location.reload();
  }

  browser.storage.local.get({ enabled: true }, function(result) {
    if (result.enabled !== false) {
      loadMainScript();
    }
  });

  browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'toggle') {
      if (request.enabled) {
        loadMainScript();
      } else {
        unloadMainScript();
      }
    }
  });
})();
