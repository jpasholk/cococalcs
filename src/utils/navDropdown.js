export function initializeNavDropdown() {
  function init() {
    const button = document.getElementById('navDropdownButton');
    const dropdown = document.getElementById('navDropdown');
    
    if (!button || !dropdown) return;

    // Reset state on navigation
    button.classList.remove('open');
    dropdown.classList.add('hidden');

    // Add group class for nested styling
    button.classList.add('group');

    // Clear existing event listeners
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);

    newButton.addEventListener('click', (e) => {
      e.stopPropagation();
      newButton.classList.toggle('open');
      dropdown.classList.toggle('hidden');
    });

    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target) && !newButton.contains(e.target)) {
        newButton.classList.remove('open');
        dropdown.classList.add('hidden');
      }
    });
  }

  // Initialize on first load
  init();
  
  // Re-initialize after client-side navigation
  document.addEventListener('astro:page-load', init);
}