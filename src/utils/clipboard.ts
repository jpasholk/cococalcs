export function setupClipboard() {
  const copyButton = document.getElementById('copyResults');
  const tooltip = document.getElementById('tooltip-copied');
  
  if (!copyButton || !tooltip) return;

  copyButton.addEventListener('click', async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Get active calculator type and make it singular
    const activeTab = document.querySelector('[role="tab"][aria-selected="true"]');
    let calculatorType = activeTab?.textContent?.trim().replace('Beds', 'Bed') || "Garden Bed";

    const text = getFormattedText(calculatorType);

    try {
      await navigator.clipboard.writeText(text);
      
      // Show tooltip and update button style to indigo theme
      tooltip.classList.remove('hidden');
      copyButton.classList.remove('text-gray-500', 'hover:text-gray-700', 'dark:text-gray-400', 'dark:hover:text-gray-200');
      copyButton.classList.add('text-indigo-700', 'dark:text-indigo-400');
      
      // Reset after 2 seconds
      setTimeout(() => {
        tooltip.classList.add('hidden');
        copyButton.classList.remove('text-indigo-700', 'dark:text-indigo-400');
        copyButton.classList.add('text-gray-500', 'hover:text-gray-700', 'dark:text-gray-400', 'dark:hover:text-gray-200');
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  });
}

function getFormattedText(calculatorType: string): string {
  // Get dimensions
  const length = (document.getElementById('length') as HTMLInputElement)?.value || '0';
  const width = (document.getElementById('width') as HTMLInputElement)?.value || '0';
  const height = (document.getElementById('height') as HTMLInputElement)?.value || '0';

  const totalVolume = document.getElementById('cubic-feet')?.textContent;
  const totalYards = document.getElementById('cubic-yards')?.textContent;
  const ingredientsList = document.getElementById('ingredients-list');
  
  let text = `Garden Soil Calculator Results\n`;
  text += `========================\n\n`;
  text += `For a ${calculatorType} that is ${length} ft by ${width} ft by ${height} in:\n\n`;
  text += `Volume Needed:\n`;
  text += `${totalVolume} | ${totalYards}\n\n`;
  text += `Ingredients:\n`;
  
  if (ingredientsList) {
    const ingredients = ingredientsList.querySelectorAll('li');
    ingredients.forEach(ingredient => {
      let ingredientText = ingredient.textContent || '';
      ingredientText = ingredientText.replace(/\s+/g, ' ').trim();
      
      const match = ingredientText.match(/(\d+%\s+[A-Za-z]+)\s*([\d.]+)\s*cu\s*ft\s*(.+)/);
      if (match) {
        const [, namePercent, cuFt, altMeasure] = match;
        text += `${namePercent.trim()} - ${cuFt} cu ft | ${altMeasure.trim()}\n`;
      }
    });
  }

  return text;
}