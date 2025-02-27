export function initializeCalculator() {
  const form = document.getElementById('calculatorForm');
  const results = document.getElementById('results');
  const mixTypeSelect = document.getElementById('mixType');
  const customMixInputs = document.getElementById('customMixInputs');
  const totalPctDisplay = document.getElementById('totalPct');
  
  // Custom mix input elements
  const customInputs = ['cocoPct', 'perlitePct', 'vermiculitePct', 'castingsPct']
    .map(id => document.getElementById(id));

  // Show/hide custom mix inputs based on selection
  mixTypeSelect.addEventListener('change', () => {
    customMixInputs.classList.toggle('hidden', mixTypeSelect.value !== 'custom');
  });

  // Update total percentage
  customInputs.forEach(input => {
    input.addEventListener('input', () => {
      const total = customInputs.reduce((sum, input) => sum + (Number(input.value) || 0), 0);
      totalPctDisplay.textContent = `Total: ${total}%`;
      totalPctDisplay.classList.toggle('text-red-500', total !== 100);
    });
  });

  form.addEventListener('submit', handleSubmit);
}

function handleSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  const results = document.getElementById('results');
  const mixTypeSelect = document.getElementById('mixType');
  const customInputs = ['cocoPct', 'perlitePct', 'vermiculitePct', 'castingsPct']
    .map(id => document.getElementById(id));

  // Get dimensions and validate
  const length = parseFloat(form.length.value);
  const width = parseFloat(form.width.value);
  const heightInches = parseFloat(form.height.value);

  // Validate inputs
  if (isNaN(length) || isNaN(width) || isNaN(heightInches)) {
    alert('Please fill in all dimensions');
    return;
  }

  // Convert height from inches to feet
  const heightFeet = heightInches / 12;

  // Calculate total volume in cubic feet
  const totalVolume = length * width * heightFeet;

  console.log('Dimensions:', {
    length: `${length} ft`,
    width: `${width} ft`,
    heightInches: `${heightInches} inches`,
    heightFeet: `${heightFeet} ft`,
    totalVolume: `${totalVolume.toFixed(2)} cu ft`
  });

  // Get mix ratios based on selection
  let mix;
  if (mixTypeSelect.value === 'custom') {
    const total = customInputs.reduce((sum, input) => sum + (Number(input.value) || 0), 0);
    if (total !== 100) {
      alert('Custom mix percentages must total 100%');
      return;
    }
    mix = {
      coco: Number(document.getElementById('cocoPct').value) / 100,
      perlite: Number(document.getElementById('perlitePct').value) / 100,
      vermiculite: Number(document.getElementById('vermiculitePct').value) / 100,
      castings: Number(document.getElementById('castingsPct').value) / 100
    };
  } else {
    mix = mixTypeSelect.value === 'basic' ? 
      { coco: 0.7, perlite: 0.3 } : 
      { coco: 0.6, perlite: 0.2, vermiculite: 0.1, castings: 0.1 };
  }
  
  // Calculate individual volumes
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
  
  // Display results
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