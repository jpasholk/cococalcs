import { RATIOS } from '../consts';

const COLORS = {
  coco: 'orange',
  perlite: 'blue',
  vermiculite: 'yellow',
  castings: 'gray'
};

export function updateBadges() {
  const checkedInputs = document.querySelectorAll('input[name="ingredients[]"]:checked');
  
  // Hide all badges first
  document.querySelectorAll('[id^="badge-"]').forEach(badge => {
    badge.classList.add('hidden');
  });
  
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
    // Fall back to equal distribution only if no ratio is defined
    const equalShare = Math.round(100 / ingredients.length);
    currentRatios = ingredients.reduce((acc, curr) => {
      acc[curr] = equalShare;
      return acc;
    }, {});
  }

  // Update badges with correct percentages
  checkedInputs.forEach(input => {
    const badge = document.getElementById(`badge-${input.value}`);
    if (badge) {
      const percentageSpan = badge.querySelector('.badge-percentage');
      const percentage = currentRatios[input.value];
      percentageSpan.textContent = ` ${percentage}%`;
      badge.classList.remove('hidden');
      console.log(`Setting ${input.value} to ${percentage}%`); // Debug log
    }
  });
}

export function initializeBadges() {
  const mixBadgesContainer = document.getElementById('mixBadges');
  if (!mixBadgesContainer) return;

  // Make container visible
  mixBadgesContainer.classList.remove('opacity-0');
  
  document.querySelectorAll('input[name="ingredients[]"]').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      const badge = document.getElementById(`badge-${this.value}`);
      if (badge) {
        // Show/hide badge
        badge.classList.toggle('invisible', !this.checked);
        
        // Update percentages
        const checkedBoxes = document.querySelectorAll('input[name="ingredients[]"]:checked');
        const totalChecked = checkedBoxes.length;
        
        if (this.checked && totalChecked > 0) {
          const percentage = Math.round(100 / totalChecked);
          const percentageSpan = badge.querySelector('.badge-percentage');
          if (percentageSpan) {
            percentageSpan.textContent = `${percentage}%`;
          }
        }
        
        // Update all badge percentages
        checkedBoxes.forEach(box => {
          const otherBadge = document.getElementById(`badge-${box.value}`);
          const percentageSpan = otherBadge?.querySelector('.badge-percentage');
          if (percentageSpan) {
            percentageSpan.textContent = `${Math.round(100 / totalChecked)}%`;
          }
        });
      }
    });
  });
}