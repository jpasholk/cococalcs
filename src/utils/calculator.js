import { initializeBadges } from './mixBadges.js';
import { RATIOS, ALTERNATIVE_MEDIA } from '../consts';

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

  // Get dimensions and calculate regardless of ingredients
  const lengthFeet = parseFloat(document.getElementById('length').value);
  const widthFeet = parseFloat(document.getElementById('width').value);
  const heightInches = parseFloat(document.getElementById('height').value);

  if (isNaN(lengthFeet) || isNaN(widthFeet) || isNaN(heightInches)) {
    alert('Please enter all dimensions');
    return;
  }

  const totalVolume = lengthFeet * widthFeet * (heightInches / 12);

  if (!hasCoco) {
    showWarningModal().then(shouldContinue => {
      if (shouldContinue) {
        // Add coco to ingredients but keep it unchecked
        const ingredients = [...checkedIngredients].map(i => i.value);
        ingredients.push('coco');
        ingredients.sort();
        const key = ingredients.join(',');
        const mix = RATIOS[key] ? 
          Object.fromEntries(Object.entries(RATIOS[key]).map(([k, v]) => [k, v / 100])) : 
          {};
        displayResults(totalVolume, mix);
      } else {
        document.getElementById('coco').checked = true;
        const event = new Event('change');
        document.getElementById('coco').dispatchEvent(event);
      }
    });
    return;
  }

  const mix = getMixRatios(Array.from(checkedIngredients));
  displayResults(totalVolume, mix);
}

function showWarningModal() {
  return new Promise((resolve) => {
    const modal = document.getElementById('warning');
    if (!modal) {
      console.error('Warning modal not found');
      return;
    }

    const messageEl = document.getElementById('warningMessage');
    const factorsEl = document.getElementById('warningFactors');
    const continueButton = document.getElementById('continueButton');
    const cancelButton = document.getElementById('cancelButton');

    // Add debug logging
    console.log('Modal elements:', { modal, messageEl, factorsEl, continueButton, cancelButton });
    console.log('Alternative media content:', ALTERNATIVE_MEDIA);

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

    // Close on outside click
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

function getMixRatios(selectedIngredients) {
  const ingredients = selectedIngredients.map(i => i.value).sort();
  
  // If only one ingredient is selected, use 100% of that ingredient
  if (ingredients.length === 1) {
    return { [ingredients[0]]: 1.0 };
  }
  
  const key = ingredients.join(',');
  
  // If we have a predefined ratio, convert percentages to decimals
  if (RATIOS[key]) {
    return Object.entries(RATIOS[key]).reduce((acc, [ingredient, percentage]) => {
      acc[ingredient] = percentage / 100;
      return acc;
    }, {});
  }
  
  // For any other combination, distribute evenly
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
  
  // Clear and update displays
  document.getElementById('cubic-feet').textContent = `${volume.toFixed(1)} cubic feet`;
  document.getElementById('cubic-yards').textContent = `${(volume / 27).toFixed(2)} cubic yards`;
  ingredientsList.innerHTML = '';
  
  // Create and sort ingredient items
  const items = Object.entries(mix).map(([ingredient, ratio]) => {
    const volume_ft = volume * ratio;
    const volume_qt = volume_ft * 25.71429;
    
    const displayName = ingredient === 'coco' ? (cocoChecked ? 'Coco' : 'Alternative Media') : 
                       ingredient.charAt(0).toUpperCase() + ingredient.slice(1);
    
    // Determine if this ingredient should show quarts
    const showQuarts = !['coco', 'alternative'].includes(ingredient);
    
    return { 
      name: displayName, 
      volume_ft, 
      volume_qt, 
      ratio,
      showQuarts 
    };
  }).sort((a, b) => b.ratio - a.ratio);
  
  // Add items to list
  items.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item.showQuarts ?
      `${item.name}: ${item.volume_ft.toFixed(2)} cu ft (${item.volume_qt.toFixed(1)} quarts)` :
      `${item.name}: ${item.volume_ft.toFixed(2)} cu ft`;
    li.className = 'dark:text-gray-200';
    ingredientsList.appendChild(li);
  });
  
  // Toggle media note
  mediaNote.classList.toggle('hidden', cocoChecked);
  resultsDiv.classList.remove('hidden');
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