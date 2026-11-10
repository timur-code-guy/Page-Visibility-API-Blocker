document.addEventListener('DOMContentLoaded', function() {
  const toggleBtn = document.getElementById('toggleBtn');
  const domain = document.getElementById('domain');

  function updateUI(enabled) {
    if (enabled) {
      toggleBtn.className = 'toggle-btn on';
    } else {
      toggleBtn.className = 'toggle-btn off';
    }
  }

  browser.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    if (tabs && tabs[0] && tabs[0].url) {
      try {
        const url = new URL(tabs[0].url);
        if (url.hostname) {
          domain.textContent = url.hostname;
        } else {
          domain.textContent = 'No active site';
        }
      } catch (e) {
        domain.textContent = 'No active site';
      }
    } else {
      domain.textContent = 'No active site';
    }
  });

  browser.storage.local.get('enabled', function(result) {
    const enabled = result.enabled !== false;
    updateUI(enabled);
  });

  toggleBtn.addEventListener('click', function() {
    browser.storage.local.get('enabled', function(result) {
      const current = result.enabled !== false;
      const newState = !current;
      browser.storage.local.set({ enabled: newState }, function() {
        updateUI(newState);
        browser.tabs.query({}, function(tabs) {
          tabs.forEach(function(tab) {
            browser.tabs.sendMessage(tab.id, { action: 'toggle', enabled: newState });
            browser.tabs.reload(tab.id);
          });
        });
      });
    });
  });
});

