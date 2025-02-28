import { initializeBadges } from './mixBadges.js';

export function initializeCalculator() {
  const calculateButton = document.getElementById('calculateButton');
  
  // Initialize dropdown
  initializeMixDropdown();
  
  // Initialize badges
  initializeBadges();

  // Handle calculate button click
  if (calculateButton) {
    calculateButton.addEventListener('click', (e) => {
      e.preventDefault();
      handleCalculate();
    });
  }
}

function getMixRatios(selectedIngredients) {
  const ingredients = selectedIngredients.map(i => i.value).sort((a, b) => {
    // Custom sort order
    const order = { coco: 1, perlite: 2, vermiculite: 3, castings: 4 };
    return order[a] - order[b];
  });
  
  // If only one ingredient is selected, use 100% of that ingredient
  if (ingredients.length === 1) {
    return { [ingredients[0]]: 1.0 };
  }
  
  const ratios = {
    // Two ingredients (must include coco and perlite)
    'coco,perlite': { coco: 0.7, perlite: 0.3 },
    // Three ingredients (must include coco, perlite, and vermiculite)
    'coco,perlite,vermiculite': { coco: 0.7, perlite: 0.2, vermiculite: 0.1 },
    // Four ingredients (all ingredients)
    'coco,perlite,vermiculite,castings': { 
      coco: 0.57, 
      perlite: 0.14, 
      vermiculite: 0.14, 
      castings: 0.14 
    }
  };

  const key = ingredients.join(',');
  const mix = ratios[key];
  
  // If we have a valid combination, return it
  if (mix) {
    return mix;
  }
  
  // For any other combination, distribute evenly
  const equalShare = 1 / ingredients.length;
  return ingredients.reduce((acc, ingredient) => {
    acc[ingredient] = equalShare;
    return acc;
  }, {});
}

function handleCalculate() {
  // Get length and width in feet, height in inches
  const lengthFeet = parseFloat(document.getElementById('length').value);
  const widthFeet = parseFloat(document.getElementById('width').value);
  const heightInches = parseFloat(document.getElementById('height').value);
  const results = document.getElementById('results');

  if (isNaN(lengthFeet) || isNaN(widthFeet) || isNaN(heightInches)) {
    alert('Please enter all dimensions');
    return;
  }

  // Calculate total volume in cubic feet (length * width * height/12)
  const totalVolume = lengthFeet * widthFeet * (heightInches / 12);

  const checkedIngredients = document.querySelectorAll('input[name="ingredients[]"]:checked');
  
  if (checkedIngredients.length === 0) {
    alert('Please select at least one ingredient');
    return;
  }

  // Get predefined ratios based on selected ingredients
  const mix = getMixRatios(Array.from(checkedIngredients));
  
  if (Object.keys(mix).length === 0) {
    alert('Invalid ingredient combination');
    return;
  }

  displayResults(totalVolume, mix);
}

function displayResults(totalVolume, mix) {
  const results = document.getElementById('results');
  const CUBIC_FEET_TO_QUARTS = 25.714;
  
  const volumes = Object.entries(mix)
    .filter(([, ratio]) => ratio > 0)
    .map(([material, ratio]) => {
      const cubicFeet = totalVolume * ratio;
      return {
        material,
        cubicFeet: cubicFeet.toFixed(2),
        quarts: (cubicFeet * CUBIC_FEET_TO_QUARTS).toFixed(1)
      };
    });

  results.innerHTML = `
    <h2 class="sm:text-3xl text-2xl font-semibold mb-4 dark:text-gray-200">Results</h2>
    <div class="space-y-2">
      <h3 class="sm:text-xl dark:text-gray-200">Total Volume Needed:</h3>
      <ul class="list-disc pl-5 dark:text-gray-200">
        <li>${totalVolume.toFixed(2)} cubic feet</li>
        <li>${(totalVolume / 27).toFixed(2)} cubic yards</li>
      </ul>
    </div>
    <hr class="my-4 border-t border-gray-400">
    <div class="space-y-2">
      <h3 class="sm:text-xl dark:text-gray-200">Ingredients:</h3>
      <ul class="list-disc pl-5">
        ${volumes.map(({material, cubicFeet, quarts}) => {
          if (material === 'coco') {
            return `
              <li class="dark:text-gray-200 capitalize">
                ${material}: ${cubicFeet} cu ft (${(Number(cubicFeet) / 27).toFixed(2)} cu yd)
              </li>
            `;
          } else {
            return `
              <li class="dark:text-gray-200 capitalize">
                ${material}: ${cubicFeet} cu ft (${quarts} quarts)
              </li>
            `;
          }
        }).join('')}
      </ul>
    </div>
  `;
  results.classList.remove('hidden');
}

function initializeMixDropdown() {
  const dropdownButton = document.getElementById('mixDropdownButton');
  const dropdown = document.getElementById('mixDropdown');

  if (!dropdownButton || !dropdown) return;

  dropdownButton.addEventListener('click', () => {
    dropdown.classList.toggle('hidden');
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target) && !dropdownButton.contains(e.target)) {
      dropdown.classList.add('hidden');
    }
  });
}