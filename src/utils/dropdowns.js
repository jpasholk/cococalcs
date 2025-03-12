/**
 * Initialize a dropdown component
 */
export function initializeDropdown(buttonId, dropdownId, isRadio = false) {
  const button = document.getElementById(buttonId);
  const dropdown = document.getElementById(dropdownId);
  
  if (!button || !dropdown) {
    console.warn(`Dropdown elements not found: ${buttonId}, ${dropdownId}`);
    return;
  }

  // Setup click handler for the dropdown button
  button.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropdown.classList.toggle('hidden');
  });

  // Update button text when selection changes (for radio buttons)
  if (isRadio) {
    const radioInputs = dropdown.querySelectorAll('input[type="radio"]');
    radioInputs.forEach(input => {
      input.addEventListener('change', () => {
        const label = input.closest('label')?.querySelector('span')?.textContent;
        if (label) {
          const span = button.querySelector('span');
          if (span) span.textContent = label;
        }
        dropdown.classList.add('hidden');
      });
    });
  }
}

/**
 * Close dropdowns when clicking outside
 */
export function setupGlobalDropdownClosing() {
  document.addEventListener('click', (e) => {
    const dropdowns = document.querySelectorAll('.dropdown-content');
    dropdowns.forEach(dropdown => {
      const button = document.querySelector(`[data-dropdown="${dropdown.id}"]`);
      if (button && !dropdown.contains(e.target) && !button.contains(e.target)) {
        dropdown.classList.add('hidden');
      }
    });
  });
}