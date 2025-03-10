export function setupClipboard() {
  const copyButton = document.getElementById('copyResults');
  
  copyButton?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Get active calculator type and make it singular
    const activeTab = document.querySelector('[role="tab"][aria-selected="true"]');
    let calculatorType = activeTab?.textContent?.trim().replace('Beds', 'Bed') || "Garden Bed";

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
        
        // Updated regex pattern to better match the parts
        const match = ingredientText.match(/(\d+%\s+[A-Za-z]+)\s*([\d.]+)\s*cu\s*ft\s*(.+)/);
        if (match) {
          const [, namePercent, cuFt, altMeasure] = match;
          text += `${namePercent.trim()} - ${cuFt} cu ft | ${altMeasure.trim()}\n`;
        }
      });
    }

    navigator.clipboard.writeText(text)
      .then(() => {
        const icon = copyButton.querySelector('svg');
        icon?.classList.add('text-indigo-800');
        setTimeout(() => {
          icon?.classList.remove('text-indigo-600');
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  });
}