export const literatureQuestions = [
  {
    id: 'lit-1',
    questionText: 'A play that ends on a happy note and is filled with humor is best classified as a:',
    options: ['Tragedy', 'Comedy', 'Tragicomedy', 'Melodrama'],
    correctAnswer: 'B',
    explanation: 'A comedy is a dramatic work that is light and humorous, typically ending with a happy resolution.'
  },
  {
    id: 'lit-2',
    questionText: 'What literary device is used in the phrase: "The leaves danced in the gentle breeze"?',
    options: ['Simile', 'Metaphor', 'Personification', 'Hyperbole'],
    correctAnswer: 'C',
    explanation: 'Personification gives human characteristics (dancing) to non-human things (leaves).'
  },
  {
    id: 'lit-3',
    questionText: 'A poem of fourteen lines with a strict rhyme scheme is a:',
    options: ['Ode', 'Sonnet', 'Elegy', 'Ballad'],
    correctAnswer: 'B',
    explanation: 'A sonnet is a fourteen-line poem, traditionally written in iambic pentameter with a specific rhyme scheme.'
  },
  {
    id: 'lit-4',
    questionText: 'The main character or hero of a story is called the:',
    options: ['Antagonist', 'Protagonist', 'Narrator', 'Foil'],
    correctAnswer: 'B',
    explanation: 'The protagonist is the central character in a literary work, around whom the plot revolves.'
  },
  ...Array.from({ length: 46 }, (_, i) => ({
    id: `lit-gen-${i + 5}`,
    questionText: `An address to a dead or non-living entity as if it were present and alive is called (Question ${i + 5}):`,
    options: ['Apostrophe', 'Alliteration', 'Irony', 'Sarcasm'],
    correctAnswer: 'A',
    explanation: 'Apostrophe is a figure of speech in which the speaker addresses an absent person, an abstract concept, or an inanimate object.'
  }))
];
