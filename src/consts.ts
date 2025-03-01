// Type definitions for ingredients and ratio configurations
type Ingredient = {
  id: string;
  name: string;
  defaultChecked: boolean;
};

type Ratios = {
  [key: string]: {
    [ingredient: string]: number;
  };
};

type AlternativeMedia = {
  message: string;
  factors: string[];
};

// Core ingredients configuration
// Defines the available ingredients and their default states
export const INGREDIENTS: Ingredient[] = [
  { id: 'coco', name: 'Coco Coir', defaultChecked: false },
  { id: 'perlite', name: 'Perlite', defaultChecked: false },
  { id: 'vermiculite', name: 'Vermiculite', defaultChecked: false },
  { id: 'castings', name: 'Worm Castings', defaultChecked: false }
];

// Mix ratio configurations
// Defines the percentage breakdowns for different ingredient combinations
export const RATIOS: Ratios = {
  'castings,coco,perlite,vermiculite': {
    coco: 60,
    perlite: 18,
    vermiculite: 12,
    castings: 10
  },
  'coco,perlite': {
    coco: 70,
    perlite: 30
  },
  'coco,perlite,vermiculite': {
    coco: 70,
    perlite: 20,
    vermiculite: 10
  },
  'castings,coco,perlite': {
    coco: 60,
    perlite: 30,
    castings: 10
  }
};

// Alternative media warning configuration
// Used when users select growing media other than coco coir
export const ALTERNATIVE_MEDIA = {
  message: "Using alternative growing media. While these calculations use similar ratios to coco coir mixes, you may need to adjust based on your specific media properties.",
  factors: [
    "Water retention characteristics of your chosen media",
    "Local climate and humidity levels",
    "Container type and drainage",
    "Specific plant requirements"
  ]
};

// Results warning message for alternative media
export const MEDIA_NOTE = "Note: If using alternative media instead of coco coir, these ratios are estimates and may need adjustment.";

// Badge styling configuration
// Defines the visual appearance of ingredient badges in the UI
export const BADGE_CONFIG = [
  { 
    id: 'coco', 
    name: 'Coco Coir',
    shortName: 'Coco',
    color: 'amber',
    bgClass: 'bg-amber-950',
    borderClass: 'border-amber-800',
    textClass: 'text-white'
  },
  { 
    id: 'perlite', 
    name: 'Perlite',
    shortName: 'Perlite',
    color: 'slate',
    bgClass: 'bg-slate-300',
    borderClass: 'border-slate-400',
    textClass: 'text-gray-950'
  },
  { 
    id: 'vermiculite', 
    name: 'Vermiculite',
    shortName: 'Verm',
    color: 'yellow',
    bgClass: 'bg-yellow-500',
    borderClass: 'border-yellow-400',
    textClass: 'text-white'
  },
  { 
    id: 'castings', 
    name: 'Castings',
    shortName: 'Cast',
    color: 'stone',
    bgClass: 'bg-stone-800',
    borderClass: 'border-stone-700',
    textClass: 'text-white'
  }
];