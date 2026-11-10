(function() {
  "use strict";

  if (window.__pvb) return;
  window.__pvb = true;

  var VISIBILITY_PROPS = ['hidden', 'visibilityState', 'webkitHidden', 'webkitVisibilityState', 'mozHidden', 'mozVisibilityState', 'msHidden', 'msVisibilityState'];
  var BLOCKED_EVENTS = ['visibilitychange', 'webkitvisibilitychange', 'mozvisibilitychange', 'msvisibilitychange', 'blur', 'focus', 'focusin', 'focusout', 'pagehide', 'pageshow', 'mouseleave', 'mouseenter'];

  function defineProperty(obj, prop, descriptor) {
    try {
      Object.defineProperty(obj, prop, descriptor);
    } catch (e) {}
  }

  function defineGetter(obj, prop, getter) {
    defineProperty(obj, prop, { configurable: true, get: getter });
  }

  function defineNoopSetter(obj, prop) {
    defineProperty(obj, prop, { configurable: true, set: function() {}, get: function() { return null; } });
  }

  VISIBILITY_PROPS.forEach(function(prop) {
    defineGetter(Document.prototype, prop, function() {
      return prop.includes('Hidden') ? false : 'visible';
    });
  });

  defineGetter(Document.prototype, 'hasFocus', function() { return true; });

  function stopEvent(evt) {
    evt.stopImmediatePropagation();
    evt.stopPropagation();
    evt.preventDefault();
  }

  BLOCKED_EVENTS.forEach(function(eventName) {
    window.addEventListener(eventName, stopEvent, true);
    document.addEventListener(eventName, stopEvent, true);
  });

  var nativeAddEventListener = EventTarget.prototype.addEventListener;
  var nativeRemoveEventListener = EventTarget.prototype.removeEventListener;

  EventTarget.prototype.addEventListener = function(type, listener, options) {
    if (BLOCKED_EVENTS.includes(type)) return;
    return nativeAddEventListener.call(this, type, listener, options);
  };

  EventTarget.prototype.removeEventListener = function(type, listener, options) {
    if (BLOCKED_EVENTS.includes(type)) return;
    return nativeRemoveEventListener.call(this, type, listener, options);
  };

  defineNoopSetter(window, 'onblur');
  defineNoopSetter(window, 'onfocus');
  defineNoopSetter(document, 'onvisibilitychange');
  defineNoopSetter(document, 'onblur');
  defineNoopSetter(document, 'onfocus');

  if (window.BroadcastChannel) {
    var nativeBroadcastChannel = window.BroadcastChannel;
    window.BroadcastChannel = function(name) {
      return { name: name, postMessage: function() {}, close: function() {}, addEventListener: function() {}, removeEventListener: function() {}, onmessage: null };
    };
    window.BroadcastChannel.prototype = nativeBroadcastChannel.prototype;
  }

  if (window.PerformanceObserver) {
    var nativeObserve = PerformanceObserver.prototype.observe;
    PerformanceObserver.prototype.observe = function(options) {
      if (options.entryTypes) {
        options.entryTypes = options.entryTypes.filter(function(type) { return type !== 'visibility-state'; });
      }
      if (options.type === 'visibility-state') return;
      return nativeObserve.call(this, options);
    };
  }

  var rafCallbacks = [];
  var rafIdCounter = 0;
  var rafInterval = 16.67;

  window.requestAnimationFrame = function(callback) {
    var id = ++rafIdCounter;
    rafCallbacks.push({ id: id, callback: callback });
    return id;
  };

  window.cancelAnimationFrame = function(id) {
    rafCallbacks = rafCallbacks.filter(function(cb) { return cb.id !== id; });
  };

  function rafLoop() {
    var now = performance.now();
    rafCallbacks.forEach(function(cb) {
      try { cb.callback(now); } catch (e) {}
    });
    setTimeout(rafLoop, rafInterval);
  }
  setTimeout(rafLoop, rafInterval);

  function proxyAudioContext(nativeCtx) {
    var ProxyCtx = function() {
      var ctx = new (Function.prototype.bind.apply(nativeCtx, [null].concat(Array.prototype.slice.call(arguments))))();
      var realState = ctx.state;
      defineGetter(ctx, 'state', function() {
        return (realState === 'interrupted' || realState === 'suspended') ? 'running' : realState;
      });
      ctx.addEventListener('statechange', function() { realState = ctx.state; });
      return ctx;
    };
    ProxyCtx.prototype = nativeCtx.prototype;
    return ProxyCtx;
  }

  if (window.AudioContext) window.AudioContext = proxyAudioContext(window.AudioContext);
  if (window.webkitAudioContext) window.webkitAudioContext = proxyAudioContext(window.webkitAudioContext);

  function patchWindow(win) {
    if (win.__pvb) return;
    win.__pvb = true;
    try {
      win.eval('(' + (function() {
        if (window.__pvb) return;
        window.__pvb = true;
        var VISIBILITY_PROPS = ['hidden', 'visibilityState', 'webkitHidden', 'webkitVisibilityState', 'mozHidden', 'mozVisibilityState', 'msHidden', 'msVisibilityState'];
        var BLOCKED_EVENTS = ['visibilitychange', 'webkitvisibilitychange', 'mozvisibilitychange', 'msvisibilitychange', 'blur', 'focus', 'focusin', 'focusout', 'pagehide', 'pageshow', 'mouseleave', 'mouseenter'];
        function defineProperty(obj, prop, descriptor) { try { Object.defineProperty(obj, prop, descriptor); } catch (e) {} }
        function defineGetter(obj, prop, getter) { defineProperty(obj, prop, { configurable: true, get: getter }); }
        function defineNoopSetter(obj, prop) { defineProperty(obj, prop, { configurable: true, set: function() {}, get: function() { return null; } }); }
        VISIBILITY_PROPS.forEach(function(prop) { defineGetter(Document.prototype, prop, function() { return prop.includes('Hidden') ? false : 'visible'; }); });
        defineGetter(Document.prototype, 'hasFocus', function() { return true; });
        function stopEvent(evt) { evt.stopImmediatePropagation(); evt.stopPropagation(); evt.preventDefault(); }
        BLOCKED_EVENTS.forEach(function(eventName) { window.addEventListener(eventName, stopEvent, true); document.addEventListener(eventName, stopEvent, true); });
        var nativeAddEventListener = EventTarget.prototype.addEventListener;
        var nativeRemoveEventListener = EventTarget.prototype.removeEventListener;
        EventTarget.prototype.addEventListener = function(type, listener, options) { if (BLOCKED_EVENTS.includes(type)) return; return nativeAddEventListener.call(this, type, listener, options); };
        EventTarget.prototype.removeEventListener = function(type, listener, options) { if (BLOCKED_EVENTS.includes(type)) return; return nativeRemoveEventListener.call(this, type, listener, options); };
        defineNoopSetter(window, 'onblur');
        defineNoopSetter(window, 'onfocus');
        defineNoopSetter(document, 'onvisibilitychange');
        defineNoopSetter(document, 'onblur');
        defineNoopSetter(document, 'onfocus');
        if (window.BroadcastChannel) { var nativeBroadcastChannel = window.BroadcastChannel; window.BroadcastChannel = function(name) { return { name: name, postMessage: function() {}, close: function() {}, addEventListener: function() {}, removeEventListener: function() {}, onmessage: null }; }; window.BroadcastChannel.prototype = nativeBroadcastChannel.prototype; }
        if (window.PerformanceObserver) { var nativeObserve = PerformanceObserver.prototype.observe; PerformanceObserver.prototype.observe = function(options) { if (options.entryTypes) { options.entryTypes = options.entryTypes.filter(function(type) { return type !== 'visibility-state'; }); } if (options.type === 'visibility-state') return; return nativeObserve.call(this, options); }; }
        var rafCallbacks = []; var rafIdCounter = 0; var rafInterval = 16.67;
        window.requestAnimationFrame = function(callback) { var id = ++rafIdCounter; rafCallbacks.push({ id: id, callback: callback }); return id; };
        window.cancelAnimationFrame = function(id) { rafCallbacks = rafCallbacks.filter(function(cb) { return cb.id !== id; }); };
        function rafLoop() { var now = performance.now(); rafCallbacks.forEach(function(cb) { try { cb.callback(now); } catch (e) {} }); setTimeout(rafLoop, rafInterval); }
        setTimeout(rafLoop, rafInterval);
        function proxyAudioContext(nativeCtx) { var ProxyCtx = function() { var ctx = new (Function.prototype.bind.apply(nativeCtx, [null].concat(Array.prototype.slice.call(arguments))))(); var realState = ctx.state; defineGetter(ctx, 'state', function() { return (realState === 'interrupted' || realState === 'suspended') ? 'running' : realState; }); ctx.addEventListener('statechange', function() { realState = ctx.state; }); return ctx; }; ProxyCtx.prototype = nativeCtx.prototype; return ProxyCtx; }
        if (window.AudioContext) window.AudioContext = proxyAudioContext(window.AudioContext);
        if (window.webkitAudioContext) window.webkitAudioContext = proxyAudioContext(window.webkitAudioContext);
      }).toString() + ')()');
    } catch (e) {}
  }

  function patchIframes() {
    var iframes = document.getElementsByTagName('iframe');
    for (var i = 0; i < iframes.length; i++) {
      try {
        var win = iframes[i].contentWindow;
        if (win) patchWindow(win);
      } catch (e) {}
    }
  }

  patchIframes();

  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      mutation.addedNodes.forEach(function(node) {
        if (node.nodeName === 'IFRAME') {
          try {
            var win = node.contentWindow;
            if (win) patchWindow(win);
          } catch (e) {}
        }
      });
    });
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });

})();
