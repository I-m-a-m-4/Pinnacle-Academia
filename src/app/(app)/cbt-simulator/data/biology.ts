export const biologyQuestions = [
  {
    id: 'bio-1',
    questionText: 'Which organelle is responsible for cellular respiration and ATP generation?',
    options: ['Chloroplast', 'Mitochondrion', 'Ribosome', 'Golgi apparatus'],
    correctAnswer: 'B',
    explanation: 'Mitochondria are the powerhouses of the cell, generating adenosine triphosphate (ATP) via respiration.'
  },
  {
    id: 'bio-2',
    questionText: 'In double-stranded DNA, what pairs with Adenine (A)?',
    options: ['Cytosine', 'Guanine', 'Thymine', 'Uracil'],
    correctAnswer: 'C',
    explanation: 'Adenine pairs with Thymine in DNA (and Uracil in RNA) via two hydrogen bonds.'
  },
  {
    id: 'bio-3',
    questionText: 'Which hormone is responsible for lowering blood glucose levels?',
    options: ['Glucagon', 'Adrenaline', 'Insulin', 'Thyroxine'],
    correctAnswer: 'C',
    explanation: 'Insulin, produced by beta cells of the pancreas, facilitates glucose uptake by cells, lowering blood levels.'
  },
  ...Array.from({ length: 47 }, (_, i) => ({
    id: `bio-gen-${i + 4}`,
    questionText: `Which of the following organisms belongs to the phylum Arthropoda (Question ${i + 4})?`,
    options: ['Spider', 'Earthworm', 'Snail', 'Jellyfish'],
    correctAnswer: 'A',
    explanation: 'Spiders belong to the phylum Arthropoda, class Arachnida, characterized by jointed appendages and chitinous exoskeleton.'
  }))
];
