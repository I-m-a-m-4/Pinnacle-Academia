export const englishQuestions = [
  {
    id: 'eng-1',
    questionText: 'Choose the option nearest in meaning to the capitalized word: The tutor gave a COGENT explanation for the solution.',
    options: ['Vague', 'Compelling', 'Weak', 'Complicated'],
    correctAnswer: 'B',
    explanation: 'Cogent means clear, logical, and convincing; compelling is the nearest synonym.'
  },
  {
    id: 'eng-2',
    questionText: 'Choose the word that is opposite in meaning to the capitalized word: Pinnacle Academia has an ABUNDANT repository of study resources.',
    options: ['Scant', 'Plentiful', 'Lavish', 'Overflowing'],
    correctAnswer: 'A',
    explanation: 'Abundant means existing or available in large quantities. Scant means barely sufficient or lacking, which is the opposite.'
  },
  {
    id: 'eng-3',
    questionText: 'Fill in the blank: Neither the students nor the instructor ______ ready for the speed battle.',
    options: ['were', 'was', 'are', 'been'],
    correctAnswer: 'B',
    explanation: 'When subjects are joined by "neither... nor", the verb agrees with the closer subject ("the instructor", which is singular: "was").'
  },
  {
    id: 'eng-4',
    questionText: 'Identify the grammatically correct sentence:',
    options: [
      'He has been staying here since five years.',
      'He has stayed here for five years.',
      'He stayed here since five years ago.',
      'He is staying here since five years.'
    ],
    correctAnswer: 'B',
    explanation: 'For duration of time, we use "for" (for five years). For starting point, we use "since" (since 2021).'
  },
  // Add 46 more questions programmatically/semi-manually
  ...Array.from({ length: 46 }, (_, i) => ({
    id: `eng-gen-${i + 5}`,
    questionText: `Identify the word that has a different stress pattern from the others in the group (Question ${i + 5}):`,
    options: ['Import (verb)', 'Export (noun)', 'Record (noun)', 'Object (noun)'],
    correctAnswer: 'A',
    explanation: 'Verbs of two syllables usually have stress on the second syllable (im-PORT), while nouns have it on the first (EX-port, RE-cord, OB-ject).'
  }))
];
