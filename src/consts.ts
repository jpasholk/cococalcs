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

export interface CalcPanelConfig {
  id: string;
  title: string;
  formId: string;
  isHidden?: boolean;
  isComingSoon?: boolean;
  comingSoonMessage?: string;
  component?: 'DimensionsCard' | 'PotSizeSelector';
  components?: string[];
}

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
  // Four ingredients
  'castings,coco,perlite,vermiculite': {
    coco: 60,
    perlite: 18,
    vermiculite: 12,
    castings: 10
  },
  // Three ingredients
  'coco,perlite,vermiculite': {
    coco: 70,
    perlite: 20,
    vermiculite: 10
  },
  'castings,coco,perlite': {
    coco: 60,
    perlite: 30,
    castings: 10
  },
  'castings,coco,vermiculite': {
    coco: 70,
    vermiculite: 20,
    castings: 10
  },
  'castings,perlite,vermiculite': {
    perlite: 40,
    vermiculite: 40,
    castings: 20
  },
  // Two ingredients
  'coco,perlite': {
    coco: 70,
    perlite: 30
  },
  'coco,vermiculite': {
    coco: 80,
    vermiculite: 20
  },
  'castings,coco': {
    coco: 85,
    castings: 15
  },
  'perlite,vermiculite': {
    perlite: 50,
    vermiculite: 50
  },
  'castings,perlite': {
    perlite: 75,
    castings: 25
  },
  'castings,vermiculite': {
    vermiculite: 75,
    castings: 25
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

// Volume conversion constants
// Defines conversion factors for different volume units
export const VOLUME_CONVERSIONS = {
  CUBIC_FEET_TO_GALLONS: 7.48052,
  CUBIC_FEET_TO_QUARTS: 25.71429,
  CUBIC_FEET_TO_YARDS: 27,
};


export const SITE_TITLE = "Garden Soil Calculator";
export const SITE_DESCRIPTION = "Calculate how much soil you need";

export const BUTTON_STYLES = {
  base: "px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800",
  variants: {
    primary: "bg-indigo-800 text-white hover:bg-indigo-700 focus:ring-indigo-800",
    secondary: "bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-300",
    warning: "bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-300"
  },
  width: {
    full: "w-full",
    default: ""
  }
};

// Define type for variant keys
export type ButtonVariant = keyof typeof BUTTON_STYLES.variants;

export const CARD_STYLES = {
  default: "bg-white/80 dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-400 dark:border-gray-700"
};