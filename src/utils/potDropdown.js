export function setupPotDropdown() {
  const button = document.getElementById('potSizeButton');
  const dropdown = document.getElementById('potSizeDropdown');
  const radioInputs = document.querySelectorAll('input[name="potSize"]');

  if (!button || !dropdown) return;

  // Toggle dropdown
  button.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('hidden');
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!button.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.add('hidden');
    }
  });

  // Handle radio selection
  radioInputs.forEach(input => {
    input.addEventListener('change', (e) => {
      const selectedInput = e.target;
      const selectedLabel = selectedInput.closest('label').textContent.trim();
      
      // Update button text
      const buttonText = button.querySelector('span');
      if (buttonText) {
        buttonText.textContent = selectedLabel;
      }

      // Close dropdown
      dropdown.classList.add('hidden');
    });
  });
}