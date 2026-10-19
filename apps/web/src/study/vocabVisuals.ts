/** Original app-authored SVG artwork. No textbook or third-party images. */
export interface VocabularyVisual{ id:string; lexemeId:string; file:string; alt:string; rights:"Original THIEPN illustration"; }
export const VOCABULARY_VISUALS:readonly VocabularyVisual[]=[
  {
    "id": "apple",
    "lexemeId": "lex-ringo",
    "file": "apple.svg",
    "alt": "Illustration of a red apple",
    "rights": "Original THIEPN illustration"
  },
  {
    "id": "water",
    "lexemeId": "lex-mizu",
    "file": "water.svg",
    "alt": "Illustration of a glass of water",
    "rights": "Original THIEPN illustration"
  },
  {
    "id": "tea",
    "lexemeId": "lex-ocha",
    "file": "tea.svg",
    "alt": "Illustration of a cup of green tea",
    "rights": "Original THIEPN illustration"
  },
  {
    "id": "book",
    "lexemeId": "lex-hon",
    "file": "book.svg",
    "alt": "Illustration of a closed book",
    "rights": "Original THIEPN illustration"
  },
  {
    "id": "car",
    "lexemeId": "lex-kuruma",
    "file": "car.svg",
    "alt": "Illustration of a compact car",
    "rights": "Original THIEPN illustration"
  },
  {
    "id": "bread",
    "lexemeId": "lex-pan",
    "file": "bread.svg",
    "alt": "Illustration of a loaf and slice of bread",
    "rights": "Original THIEPN illustration"
  },
  {
    "id": "fish",
    "lexemeId": "lex-sakana",
    "file": "fish.svg",
    "alt": "Illustration of a whole fish",
    "rights": "Original THIEPN illustration"
  },
  {
    "id": "coffee",
    "lexemeId": "lex-koohii",
    "file": "coffee.svg",
    "alt": "Illustration of a cup of coffee",
    "rights": "Original THIEPN illustration"
  }
];
const byLexeme=new Map(VOCABULARY_VISUALS.map(visual=>[visual.lexemeId,visual] as const));
/** Purely optional cue; never used by scoring, stored events, or review scheduling. */
export function vocabularyVisualForLexeme(lexemeId:string):VocabularyVisual|null{return byLexeme.get(lexemeId)??null;}
export function validateVocabularyVisuals(lexemes:ReadonlySet<string>,records:readonly VocabularyVisual[]=VOCABULARY_VISUALS):string[]{
  const errors:string[]=[];const ids=new Set<string>();const usedLexemes=new Set<string>();const files=new Set<string>();
  for(const visual of records){
    if(ids.has(visual.id))errors.push("Duplicate image ID: "+visual.id);
    if(usedLexemes.has(visual.lexemeId))errors.push("Duplicate lexeme mapping: "+visual.lexemeId);
    if(files.has(visual.file))errors.push("Duplicate image file: "+visual.file);
    ids.add(visual.id);usedLexemes.add(visual.lexemeId);files.add(visual.file);
    if(!lexemes.has(visual.lexemeId))errors.push("Unknown canonical lexeme: "+visual.lexemeId);
    if(!/^[a-z0-9-]+\.svg$/.test(visual.file))errors.push("Unsafe image filename: "+visual.file);
    if(!visual.alt.trim())errors.push("Missing accessible description: "+visual.id);
    if(visual.rights!=="Original THIEPN illustration")errors.push("Unverified visual rights: "+visual.id);
  }
  return errors;
}
