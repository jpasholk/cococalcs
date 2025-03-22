export function setupClipboard() {
  function init() {
    const copyButton = document.getElementById('copyResults');
    
    if (!copyButton) {
      console.warn('Copy button not found');
      return;
    }

    // Remove existing listeners
    const newButton = copyButton.cloneNode(true) as HTMLButtonElement;
    copyButton.parentNode?.replaceChild(newButton, copyButton);

    // Get tooltip from the cloned button
    const tooltip = newButton.querySelector('#tooltip-copied');
    
    if (!tooltip) {
      console.warn('Tooltip not found in cloned button');
      return;
    }

    // Add click handler
    newButton.addEventListener('click', async (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const text = getFormattedText();

      try {
        await navigator.clipboard.writeText(text);
        
        // Show tooltip and update button style to indigo theme
        tooltip.classList.remove('hidden');
        newButton.classList.remove('text-gray-500', 'hover:text-gray-700', 'dark:text-gray-400', 'dark:hover:text-gray-200');
        newButton.classList.add('text-indigo-700', 'dark:text-indigo-400');
        
        // Reset after 2 seconds
        setTimeout(() => {
          tooltip.classList.add('hidden');
          newButton.classList.remove('text-indigo-700', 'dark:text-indigo-400');
          newButton.classList.add('text-gray-500', 'hover:text-gray-700', 'dark:text-gray-400', 'dark:hover:text-gray-200');
        }, 1800);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    });
  }

  // Initialize on first load
  init();
  
  // Re-initialize after page load complete
  document.addEventListener('astro:page-load', init);
}

function getFormattedText(): string {
  const isPots = document.querySelector('input[name="potSize"]') !== null;
  const totalVolume = document.getElementById('cubic-feet')?.textContent;
  const secondaryVolume = document.getElementById('cubic-yards')?.textContent;
  const ingredientsList = document.getElementById('ingredients-list');
  
  let text = `Garden Soil Calculator Results\n`;
  text += `========================\n\n`;

  if (isPots) {
    const potSize = document.querySelector('input[name="potSize"]:checked');
    const quantity = document.getElementById('potQuantity') as HTMLInputElement;
    const quantityValue = parseInt(quantity?.value || '0');
    const selectedPotLabel = potSize?.closest('label')?.textContent?.trim() || '';
    
    text += `To Fill [${quantityValue}] ${selectedPotLabel} Garden ${quantityValue === 1 ? 'Pot' : 'Pots'}:\n\n`;
  } else {
    const length = (document.getElementById('length') as HTMLInputElement)?.value || '0';
    const width = (document.getElementById('width') as HTMLInputElement)?.value || '0';
    const height = (document.getElementById('height') as HTMLInputElement)?.value || '0';
    
    text += `For a Garden Bed that is ${length} ft by ${width} ft by ${height} in:\n\n`;
  }
  
  text += `Volume Needed:\n`;
  text += `${totalVolume} | ${secondaryVolume}\n\n`;
  text += `Ingredients:\n`;
  
  if (ingredientsList) {
    const ingredients = ingredientsList.querySelectorAll('li');

    ingredients.forEach(ingredient => {
      let ingredientText = ingredient.textContent?.trim() || '';
      
      // Fix spacing in ingredient text
      const match = ingredientText.match(/(\d+%\s+[A-Za-z\s]+)(\d+\.\d+\s+cu\s+ft)(.+)/);
      if (match) {
        const [, percentage, cubicFeet, altMeasure] = match;
        text += `${percentage.trim()} - ${cubicFeet.trim()} | ${altMeasure.trim()}\n`;
      } else {
        text += `${ingredientText}\n`;
      }
    });
  }

  return text;
}