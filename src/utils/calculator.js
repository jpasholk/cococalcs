import { initializeBadges } from './mixBadges.js';
import { RATIOS, ALTERNATIVE_MEDIA, VOLUME_CONVERSIONS, POT_SIZES } from '../consts';

export function initializeCalculator() {
  // Store cleanup functions
  let cleanup = [];

  function init() {
    // Cleanup previous initializations
    cleanup.forEach(fn => fn());
    cleanup = [];

    // Initialize mix dropdown
    initializeMixDropdown();
    
    // Initialize pot size dropdown if on pots page
    const potButton = document.getElementById('potSizeButton');
    const potDropdown = document.getElementById('potSizeDropdown');
    if (potButton && potDropdown) {
      const cleanupPot = initializePotDropdown(potButton, potDropdown);
      if (cleanupPot) cleanup.push(cleanupPot);
    }
    
    initializeBadges();

    const calculateButton = document.getElementById('calculateButton');
    if (calculateButton) {
      calculateButton.addEventListener('click', (e) => {
        e.preventDefault();
        handleCalculate();
      });
    }
  }

  // Initialize on first load
  init();
  
  // Re-initialize after page load complete
  document.addEventListener('astro:page-load', init);
}

function handleCalculate() {
  const checkedIngredients = document.querySelectorAll('input[name="ingredients[]"]:checked');
  const hasCoco = Array.from(checkedIngredients).some(input => input.value === 'coco');
  
  if (checkedIngredients.length === 0) {
    alert('Please select at least one ingredient');
    return;
  }

  // Check if we're on the pots page and verify pot size is selected
  const isPots = document.querySelector('input[name="potSize"]') !== null;
  if (isPots) {
    const selectedPot = document.querySelector('input[name="potSize"]:checked');
    if (!selectedPot) {
      alert('Please select a pot size');
      return;
    }
  }

  // Continue with volume calculations
  const potSizeInput = document.querySelector('input[name="potSize"]:checked');
  const potQuantityInput = document.getElementById('potQuantity');
  let totalVolume;
  
  if (potSizeInput && potQuantityInput) {
    const selectedPot = POT_SIZES.find(pot => pot.id === potSizeInput.value);
    const quantity = parseInt(potQuantityInput.value) || 1;
    totalVolume = selectedPot.volume * quantity;
  } else {
    const lengthFeet = parseFloat(document.getElementById('length').value);
    const widthFeet = parseFloat(document.getElementById('width').value);
    const heightInches = parseFloat(document.getElementById('height').value);

    if (isNaN(lengthFeet) || isNaN(widthFeet) || isNaN(heightInches)) {
      alert('Please enter all dimensions');
      return;
    }

    totalVolume = lengthFeet * widthFeet * (heightInches / 12);
  }

  // Handle coco requirement
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

    // Change from hidden to visible
    modal.classList.add('visible');

    continueButton.onclick = () => {
      modal.classList.remove('visible');
      resolve(true);
    };

    cancelButton.onclick = () => {
      modal.classList.remove('visible');
      document.getElementById('coco').checked = true;
      const event = new Event('change');
      document.getElementById('coco').dispatchEvent(event);
      
      // Get updated ingredients and recalculate
      const checkedIngredients = document.querySelectorAll('input[name="ingredients[]"]:checked');
      const ingredients = Array.from(checkedIngredients).map(i => i.value);
      const mix = getMixRatios(ingredients);
      const totalVolume = calculateVolume();
      displayResults(totalVolume, mix);
      
      resolve(false);
    };

    modal.onclick = (e) => {
      if (e.target === modal) {
        modal.classList.remove('visible');
        resolve(false);
      }
    };
  });
}

// Helper function to calculate volume
function calculateVolume() {
  const lengthFeet = parseFloat(document.getElementById('length').value);
  const widthFeet = parseFloat(document.getElementById('width').value);
  const heightInches = parseFloat(document.getElementById('height').value);
  return lengthFeet * widthFeet * (heightInches / 12);
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

  // Check if we're on the pots page
  const isPots = document.querySelector('input[name="potSize"]') !== null;

  // Update volume display based on page type
  document.getElementById('cubic-feet').textContent = `${volume.toFixed(2)} cubic feet`;
  
  const secondaryVolume = document.getElementById('cubic-yards');
  if (isPots) {
    secondaryVolume.textContent = `${(volume * VOLUME_CONVERSIONS.CUBIC_FEET_TO_GALLONS).toFixed(2)} gallons`;
  } else {
    secondaryVolume.textContent = `${(volume / VOLUME_CONVERSIONS.CUBIC_FEET_TO_YARDS).toFixed(2)} cubic yards`;
  }

  const items = Object.entries(mix)
    .map(([ingredient, ratio]) => {
      const volume_ft = volume * ratio;
      const volume_liquid = ingredient === 'coco' ? 
        { value: volume_ft * VOLUME_CONVERSIONS.CUBIC_FEET_TO_GALLONS, unit: 'gallons' } : 
        { value: volume_ft * VOLUME_CONVERSIONS.CUBIC_FEET_TO_QUARTS, unit: 'quarts' };
      
      // Get the current state of the coco checkbox
      const currentCocoState = document.getElementById('coco').checked;
      
      const displayName = ingredient === 'coco' ? 
        (currentCocoState ? 'Coco' : 'Alternative Media') : 
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

  if (resultsDiv.classList.contains('hidden')) {
    resultsDiv.classList.remove('hidden');
  }

  mediaNote.classList.toggle('hidden', cocoChecked);
}

function initializeMixDropdown() {
  function init() {
    const dropdownButton = document.getElementById('mixDropdownButton');
    const dropdown = document.getElementById('mixDropdown');

    if (!dropdownButton || !dropdown) return;

    // Clear existing event listeners
    const newButton = dropdownButton.cloneNode(true);
    dropdownButton.parentNode.replaceChild(newButton, dropdownButton);

    newButton.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('hidden');
    });

    // Handle clicking outside
    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target) && !newButton.contains(e.target)) {
        dropdown.classList.add('hidden');
      }
    });
  }

  // Initialize on first load
  init();
  
  // Re-initialize after page load complete
  document.addEventListener('astro:page-load', init);
}

function initializePotDropdown(button, dropdown) {
  if (!button || !dropdown) return;

  // Remove any existing click listeners from document
  document.removeEventListener('click', handleOutsideClick);
  
  // Clear existing event listeners
  const newButton = button.cloneNode(true);
  button.parentNode.replaceChild(newButton, button);

  // Named function for outside clicks to allow removal
  function handleOutsideClick(e) {
    if (!dropdown.contains(e.target) && !newButton.contains(e.target)) {
      dropdown.classList.add('hidden');
    }
  }

  newButton.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('hidden');
  });

  // Add new outside click handler
  document.addEventListener('click', handleOutsideClick);

  // Handle radio selection
  const radioInputs = dropdown.querySelectorAll('input[type="radio"]');
  radioInputs.forEach(input => {
    input.addEventListener('change', (e) => {
      const selectedLabel = e.target.closest('label').textContent.trim();
      const buttonText = newButton.querySelector('span');
      if (buttonText) {
        buttonText.textContent = selectedLabel;
      }
      dropdown.classList.add('hidden');
    });
  });

  // Clean up function for removing listeners
  return () => {
    document.removeEventListener('click', handleOutsideClick);
  };
}

function setupResultsAnimation() {
  function init() {
    const results = document.getElementById('results');
    if (!results) return;
    
    results.classList.add(
      'animate-[fadeIn_0.3s_ease-in-out]',
      'transition-all',
      'opacity-0',
      'transform',
      'translate-y-4'
    );

    // Clean up any existing observer
    if (window.resultsObserver) {
      window.resultsObserver.disconnect();
    }

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.target.classList.contains('hidden')) {
          results.classList.add('opacity-0', 'translate-y-4');
        } else {
          setTimeout(() => {
            results.classList.remove('opacity-0', 'translate-y-4');
          }, 50);
        }
      });
    });

    observer.observe(results, {
      attributes: true,
      attributeFilter: ['class']
    });

    // Store observer reference for cleanup
    window.resultsObserver = observer;
  }

  // Initialize on first load
  init();
  
  // Re-initialize after page load complete
  document.addEventListener('astro:page-load', init);
}

// Initialize animations
setupResultsAnimation();