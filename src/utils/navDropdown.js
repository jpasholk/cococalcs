export function initializeNavDropdown() {
  const button = document.getElementById('navDropdownButton');
  const dropdown = document.getElementById('navDropdown');
  
  if (!button || !dropdown) return;

  // Add group class for nested styling
  button.classList.add('group');

  button.addEventListener('click', (e) => {
    e.stopPropagation();
    button.classList.toggle('open');
    dropdown.classList.toggle('hidden');
  });

  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target) && !button.contains(e.target)) {
      button.classList.remove('open');
      dropdown.classList.add('hidden');
    }
  });
}