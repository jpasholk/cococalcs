export function initializeTabs() {
  const tabs = document.querySelectorAll('[role="tab"]');
  const tabPanels = document.querySelectorAll('[role="tabpanel"]');

  // Add transition classes to all panels and results
  tabPanels.forEach(panel => {
    panel.classList.add('transition-opacity', 'duration-300', 'ease-in', 'opacity-0');
  });

  // Show initial panel with fade in
  const initialTab = document.querySelector('[aria-selected="true"]');
  if (initialTab) {
    const panelId = initialTab.getAttribute('data-tab').substring(1);
    const initialPanel = document.getElementById(panelId);
    if (initialPanel) {
      initialPanel.classList.remove('hidden');
      // Small delay to trigger fade in
      setTimeout(() => {
        initialPanel.classList.remove('opacity-0');
      }, 10);
    }
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Deactivate all tabs
      tabs.forEach(t => {
        t.setAttribute('aria-selected', 'false');
        t.classList.remove('bg-blue-500', 'text-white', 'hover:bg-blue-600');
        t.classList.add('text-gray-600', 'dark:text-gray-400', 'hover:bg-gray-100', 'dark:hover:bg-gray-700');
      });

      // Activate clicked tab
      tab.setAttribute('aria-selected', 'true');
      tab.classList.remove('text-gray-600', 'dark:text-gray-400', 'hover:bg-gray-100', 'dark:hover:bg-gray-700');
      tab.classList.add('bg-blue-500', 'text-white', 'hover:bg-blue-600');

      // Get current and new panels
      const newPanelId = tab.getAttribute('data-tab').substring(1);
      const newPanel = document.getElementById(newPanelId);
      const currentPanel = document.querySelector('[role="tabpanel"]:not(.hidden)');

      // Fade out current panel
      if (currentPanel) {
        currentPanel.classList.add('opacity-0');
        setTimeout(() => {
          currentPanel.classList.add('hidden');
          // Show new panel
          newPanel.classList.add('opacity-0');
          newPanel.classList.remove('hidden');
          // Trigger fade in
          setTimeout(() => {
            newPanel.classList.remove('opacity-0');
          }, 10);
        }, 300);
      }
    });
  });

  // Initialize results animation with same transition pattern
  const results = document.getElementById('results');
  if (results) {
    results.classList.add('transition-opacity', 'duration-300', 'ease-in', 'opacity-0');
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isHidden = results.classList.contains('hidden');
          if (!isHidden) {
            setTimeout(() => {
              results.classList.remove('opacity-0');
            }, 10);
          } else {
            results.classList.add('opacity-0');
          }
        }
      });
    });

    observer.observe(results, {
      attributes: true,
      attributeFilter: ['class']
    });
  }
}