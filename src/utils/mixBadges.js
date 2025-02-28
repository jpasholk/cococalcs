const COLORS = {
  coco: 'orange',
  perlite: 'blue',
  vermiculite: 'yellow',
  castings: 'gray'
};

const RATIOS = {
  'castings,coco,perlite,vermiculite': {  // Note: alphabetical order is important
    coco: 60,
    perlite: 18,
    vermiculite: 12,
    castings: 10
  },
  'coco,perlite': {
    coco: 70,
    perlite: 30
  },
  'coco,perlite,vermiculite': {
    coco: 70,
    perlite: 20,
    vermiculite: 10
  }
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
  const inputs = document.querySelectorAll('input[name="ingredients[]"]');
  inputs.forEach(input => {
    input.addEventListener('change', updateBadges);
  });
  // Initial update
  updateBadges();
}