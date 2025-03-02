import { RATIOS } from '../consts';

const COLORS = {
  coco: 'orange',
  perlite: 'blue',
  vermiculite: 'yellow',
  castings: 'gray'
};

export function updateBadges() {
  const checkedInputs = document.querySelectorAll('input[name="ingredients[]"]:checked');
  
  // Sort ingredients alphabetically to match RATIOS keys format
  const ingredients = Array.from(checkedInputs)
    .map(input => input.value)
    .sort();
  
  const key = ingredients.join(',');
  
  // Get the correct ratio object
  let currentRatios;
  if (RATIOS[key]) {
    currentRatios = RATIOS[key];
  } else {
    // Fall back to equal distribution
    const equalShare = Math.round(100 / ingredients.length);
    currentRatios = ingredients.reduce((acc, curr) => {
      acc[curr] = equalShare;
      return acc;
    }, {});
  }

  // Update all badges
  document.querySelectorAll('[id^="badge-"]').forEach(badge => {
    const ingredientId = badge.id.replace('badge-', '');
    const percentageSpan = badge.querySelector('.badge-percentage');
    
    if (currentRatios[ingredientId]) {
      badge.classList.remove('invisible');
      percentageSpan.textContent = ` ${currentRatios[ingredientId]}%`;
    } else {
      badge.classList.add('invisible');
      percentageSpan.textContent = '';
    }
  });
}

export function initializeBadges() {
  const mixBadgesContainer = document.getElementById('mixBadges');
  if (!mixBadgesContainer) return;

  // Make container visible
  mixBadgesContainer.classList.remove('opacity-0');
  
  // Initialize all badges as invisible
  document.querySelectorAll('[id^="badge-"]').forEach(badge => {
    badge.classList.add('invisible');
  });
  
  // Add change event listeners
  document.querySelectorAll('input[name="ingredients[]"]').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      updateBadges();
    });
  });
}