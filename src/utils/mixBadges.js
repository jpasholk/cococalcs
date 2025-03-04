import { RATIOS } from '../consts';

export function updateBadges() {
  const checkedInputs = document.querySelectorAll('input[name="ingredients[]"]:checked');
  const cocoChecked = Array.from(checkedInputs).some(input => input.value === 'coco');
  
  const ingredients = Array.from(checkedInputs)
    .map(input => input.value)
    .sort();
  
  // Always include coco in the ratio calculation
  const ratioIngredients = [...ingredients];
  if (!cocoChecked) {
    ratioIngredients.push('coco');
    ratioIngredients.sort();
  }
  
  const key = ratioIngredients.join(',');
  const currentRatios = RATIOS[key] || getEqualRatios(ratioIngredients);

  // Update all badges
  document.querySelectorAll('[id^="badge-"]').forEach(badge => {
    const ingredientId = badge.id.replace('badge-', '');
    const percentageSpan = badge.querySelector('.badge-percentage');
    const nameSpans = badge.querySelectorAll('.badge-name');
    
    if (currentRatios[ingredientId]) {
      badge.classList.remove('invisible');
      
      if (ingredientId === 'coco') {
        nameSpans.forEach(span => {
          span.textContent = cocoChecked ? 'Coco' : 'Alt. Media';
        });
      }
      
      percentageSpan.textContent = ` ${currentRatios[ingredientId]}%`;
    } else {
      badge.classList.add('invisible');
      percentageSpan.textContent = '';
    }
  });
}

function getEqualRatios(ingredients) {
  const equalShare = Math.round(100 / ingredients.length);
  return ingredients.reduce((acc, curr) => {
    acc[curr] = equalShare;
    return acc;
  }, {});
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