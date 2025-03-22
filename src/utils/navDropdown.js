export function initializeNavDropdown() {
  function init() {
    const button = document.getElementById('navDropdownButton');
    const dropdown = document.getElementById('navDropdown');
    
    if (!button || !dropdown) return;

    // Reset state on navigation
    button.classList.remove('open');
    dropdown.classList.add('hidden');

    // Clear existing event listeners
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);

    function showDropdown() {
      dropdown.classList.remove('hidden');
      // Force a reflow to ensure transition works
      dropdown.offsetHeight;
      dropdown.classList.remove('opacity-0', 'scale-95');
      dropdown.classList.add('opacity-100', 'scale-100');
    }

    function hideDropdown() {
      dropdown.classList.add('opacity-0', 'scale-95');
      dropdown.classList.remove('opacity-100', 'scale-100');
      // Wait for transition to complete before hiding
      setTimeout(() => {
        dropdown.classList.add('hidden');
      }, 150); // Match this with your transition duration
    }

    newButton.addEventListener('click', (e) => {
      e.stopPropagation();
      newButton.classList.toggle('open');
      
      if (dropdown.classList.contains('hidden')) {
        showDropdown();
      } else {
        hideDropdown();
      }
    });

    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target) && !newButton.contains(e.target)) {
        newButton.classList.remove('open');
        hideDropdown();
      }
    });
  }

  init();
  document.addEventListener('astro:page-load', init);
}