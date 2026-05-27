export const governmentQuestions = [
  {
    id: 'gov-1',
    questionText: 'A constitution is said to be rigid if it:',
    options: [
      'Can be amended by a simple majority vote',
      'Requires special and difficult procedures to amend',
      'Is not written down in a single document',
      'Can only be suspended by the judiciary'
    ],
    correctAnswer: 'B',
    explanation: 'A rigid constitution requires a complicated or special amendment process, unlike a flexible one which can be amended by a simple majority.'
  },
  {
    id: 'gov-2',
    questionText: 'The primary function of the judiciary is to:',
    options: [
      'Make laws',
      'Enforce laws',
      'Interpret laws',
      'Execute laws'
    ],
    correctAnswer: 'C',
    explanation: 'The judiciary interprets the laws and settles disputes, while the legislature makes laws and the executive enforces/executes them.'
  },
  {
    id: 'gov-3',
    questionText: 'A system of government where power is shared between a central authority and component units is called:',
    options: [
      'Unitary system',
      'Federal system',
      'Confederal system',
      'Monarchical system'
    ],
    correctAnswer: 'B',
    explanation: 'A federal system of government distributes power between the central government and the constituent units (states or provinces).'
  },
  {
    id: 'gov-4',
    questionText: 'Which of the following is a major feature of democracy?',
    options: [
      'Rule by decree',
      'One-party system',
      'Periodic free and fair elections',
      'Absence of a constitution'
    ],
    correctAnswer: 'C',
    explanation: 'A key pillar of democracy is regular, free, and fair elections allowing citizens to choose their leaders.'
  },
  ...Array.from({ length: 46 }, (_, i) => ({
    id: `gov-gen-${i + 5}`,
    questionText: `Which organ of government is responsible for passing bills into law (Question ${i + 5})?`,
    options: ['The Executive', 'The Legislature', 'The Judiciary', 'The Civil Service'],
    correctAnswer: 'B',
    explanation: 'The legislature is the law-making organ of government.'
  }))
];
