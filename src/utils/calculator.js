import { initializeBadges } from './mixBadges.js';
import { RATIOS, ALTERNATIVE_MEDIA, VOLUME_CONVERSIONS } from '../consts';

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

function handleCalculate() {
  const checkedIngredients = document.querySelectorAll('input[name="ingredients[]"]:checked');
  const hasCoco = Array.from(checkedIngredients).some(input => input.value === 'coco');
  
  if (checkedIngredients.length === 0) {
    alert('Please select at least one ingredient');
    return;
  }

  const lengthFeet = parseFloat(document.getElementById('length').value);
  const widthFeet = parseFloat(document.getElementById('width').value);
  const heightInches = parseFloat(document.getElementById('height').value);

  if (isNaN(lengthFeet) || isNaN(widthFeet) || isNaN(heightInches)) {
    alert('Please enter all dimensions');
    return;
  }

  const totalVolume = lengthFeet * widthFeet * (heightInches / 12);

  // Simplify the logic for mix calculation
  if (!hasCoco) {
    showWarningModal().then(shouldContinue => {
      if (shouldContinue) {
        const ingredients = [...checkedIngredients].map(i => i.value);
        ingredients.push('coco');
        const mix = getMixRatios(ingredients);
        displayResults(totalVolume, mix);
      } else {
        document.getElementById('coco').checked = true;
        const event = new Event('change');
        document.getElementById('coco').dispatchEvent(event);
      }
    });
    return;
  }

  const ingredients = Array.from(checkedIngredients).map(i => i.value);
  const mix = getMixRatios(ingredients);
  displayResults(totalVolume, mix);
}

function showWarningModal() {
  return new Promise((resolve) => {
    const modal = document.getElementById('warning');
    if (!modal) return;

    const messageEl = document.getElementById('warningMessage');
    const factorsEl = document.getElementById('warningFactors');
    const continueButton = document.getElementById('continueButton');
    const cancelButton = document.getElementById('cancelButton');

    if (messageEl && factorsEl) {
      messageEl.textContent = ALTERNATIVE_MEDIA.message;
      factorsEl.innerHTML = ALTERNATIVE_MEDIA.factors
        .map(factor => `<li>${factor}</li>`)
        .join('');
    }

    modal.classList.remove('hidden');

    continueButton.onclick = () => {
      modal.classList.add('hidden');
      resolve(true);
    };

    cancelButton.onclick = () => {
      modal.classList.add('hidden');
      resolve(false);
    };

    modal.onclick = (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
        resolve(false);
      }
    };
  });
}

function proceedWithCalculation(checkedIngredients, useAlternative) {
  const lengthFeet = parseFloat(document.getElementById('length').value);
  const widthFeet = parseFloat(document.getElementById('width').value);
  const heightInches = parseFloat(document.getElementById('height').value);

  if (isNaN(lengthFeet) || isNaN(widthFeet) || isNaN(heightInches)) {
    alert('Please enter all dimensions');
    return;
  }

  const totalVolume = lengthFeet * widthFeet * (heightInches / 12);
  let mix = getMixRatios(Array.from(checkedIngredients));
  
  // Transform the mix for alternative media
  if (useAlternative && mix.coco) {
    mix = {
      'alternative': mix.coco,
      ...Object.fromEntries(Object.entries(mix).filter(([k]) => k !== 'coco'))
    };
  }

  displayResults(totalVolume, mix, useAlternative);
}

function getMixRatios(ingredients) {
  // Sort ingredients for consistent key lookup
  ingredients.sort();
  const key = ingredients.join(',');
  
  // If we have a predefined ratio, use it
  if (RATIOS[key]) {
    return Object.fromEntries(
      Object.entries(RATIOS[key]).map(([k, v]) => [k, v / 100])
    );
  }
  
  // Otherwise, distribute evenly
  const equalShare = 1 / ingredients.length;
  return ingredients.reduce((acc, ingredient) => {
    acc[ingredient] = equalShare;
    return acc;
  }, {});
}

function displayResults(volume, mix) {
  const resultsDiv = document.getElementById('results');
  const ingredientsList = document.getElementById('ingredients-list');
  const mediaNote = document.getElementById('mediaNote');
  const cocoChecked = document.getElementById('coco').checked;

  document.getElementById('cubic-feet').textContent = `${volume.toFixed(1)} cubic feet`;
  document.getElementById('cubic-yards').textContent = 
    `${(volume / VOLUME_CONVERSIONS.CUBIC_FEET_TO_YARDS).toFixed(2)} cubic yards`;
  
  const items = Object.entries(mix)
    .map(([ingredient, ratio]) => {
      const volume_ft = volume * ratio;
      const volume_liquid = ingredient === 'coco' ? 
        { value: volume_ft * VOLUME_CONVERSIONS.CUBIC_FEET_TO_GALLONS, unit: 'gallons' } : 
        { value: volume_ft * VOLUME_CONVERSIONS.CUBIC_FEET_TO_QUARTS, unit: 'quarts' };
      
      const displayName = ingredient === 'coco' ? 
        (cocoChecked ? 'Coco' : 'Alternative Media') : 
        ingredient.charAt(0).toUpperCase() + ingredient.slice(1);
      
      return { 
        name: displayName, 
        volume_ft,
        volume_liquid,
        ratio,
        percentage: Math.round(ratio * 100)
      };
    })
    .sort((a, b) => b.ratio - a.ratio);

  ingredientsList.innerHTML = '';
  
  items.forEach((item, index) => {
    const li = document.createElement('li');
    li.className = 'py-3 sm:py-4';
    
    if (index !== items.length - 1) {
      li.className += ' border-b border-gray-200 dark:border-gray-700';
    }
    
    const container = document.createElement('div');
    container.className = 'flex items-center justify-between';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'flex-1 min-w-0';
    
    const nameHeading = document.createElement('h4');
    nameHeading.className = 'text-base font-medium text-gray-900 dark:text-white';
    nameHeading.textContent = `${item.percentage}% ${item.name}`;
    
    const volumePara = document.createElement('p');
    volumePara.className = 'text-sm text-gray-500 dark:text-gray-400';
    volumePara.textContent = `${item.volume_ft.toFixed(2)} cu ft`;
    
    const liquidDiv = document.createElement('div');
    liquidDiv.className = 'inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-300';
    liquidDiv.textContent = `${item.volume_liquid.value.toFixed(1)} ${item.volume_liquid.unit}`;
    
    contentDiv.appendChild(nameHeading);
    contentDiv.appendChild(volumePara);
    
    container.appendChild(contentDiv);
    container.appendChild(liquidDiv);
    
    li.appendChild(container);
    ingredientsList.appendChild(li);
  });

  resultsDiv.classList.remove('hidden');
  mediaNote.classList.toggle('hidden', cocoChecked);
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