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

  // Get dimensions
  const length = parseFloat(form.length.value);
  const width = parseFloat(form.width.value);
  const height = parseFloat(form.height.value);
  
  // Calculate total volume in cubic feet
  const totalVolume = length * width * height;
  
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
  const volumes = Object.entries(mix)
    .filter(([, ratio]) => ratio > 0)
    .map(([material, ratio]) => ({
      material,
      volume: (totalVolume * ratio).toFixed(2)
    }));
  
  // Display results
  results.innerHTML = `
    <h2 class="font-bold mb-2">Results</h2>
    <p>Total Volume Needed: ${totalVolume.toFixed(2)} cubic feet</p>
    <ul class="mt-2">
      ${volumes.map(({material, volume}) => 
        `<li class="capitalize">${material}: ${volume} cubic feet</li>`
      ).join('')}
    </ul>
  `;
  results.classList.remove('hidden');
}