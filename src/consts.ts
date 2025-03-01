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

export const INGREDIENTS: Ingredient[] = [
  { id: 'coco', name: 'Coco Coir', defaultChecked: false },
  { id: 'perlite', name: 'Perlite', defaultChecked: false },
  { id: 'vermiculite', name: 'Vermiculite', defaultChecked: false },
  { id: 'castings', name: 'Worm Castings', defaultChecked: false }
];

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

export const ALTERNATIVE_MEDIA = {
  message: "Using alternative growing media. While these calculations use similar ratios to coco coir mixes, you may need to adjust based on your specific media properties.",
  factors: [
    "Water retention characteristics of your chosen media",
    "Local climate and humidity levels",
    "Container type and drainage",
    "Specific plant requirements"
  ]
};

// Add a new note for the results
export const MEDIA_NOTE = "Note: If using alternative media instead of coco coir, these ratios are estimates and may need adjustment.";

type AlternativeMedia = {
  message: string;
  factors: string[];
};