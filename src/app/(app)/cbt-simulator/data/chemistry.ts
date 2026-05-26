export const chemistryQuestions = [
  {
    id: 'chem-1',
    questionText: 'What is the oxidation state of sulfur in H₂SO₄?',
    options: ['+4', '+6', '+2', '-2'],
    correctAnswer: 'B',
    explanation: 'H₂SO₄ is neutral: 2(+1) + S + 4(-2) = 0 => 2 + S - 8 = 0 => S - 6 = 0 => S = +6.'
  },
  {
    id: 'chem-2',
    questionText: 'Which of the following organic compounds will decolorize bromine water?',
    options: ['Ethane', 'Ethene', 'Propane', 'Butane'],
    correctAnswer: 'B',
    explanation: 'Alkenes (like ethene) are unsaturated hydrocarbons and undergo addition reactions with bromine water, decolorizing it.'
  },
  {
    id: 'chem-3',
    questionText: 'According to Le Chatelier\'s principle, what is the effect of increasing pressure on the equilibrium: N₂ (g) + 3H₂ (g) ⇌ 2NH₃ (g) ?',
    options: [
      'Equilibrium shifts to the left',
      'Equilibrium shifts to the right',
      'No effect on the equilibrium',
      'Yield of ammonia decreases'
    ],
    correctAnswer: 'B',
    explanation: 'Increasing pressure shifts equilibrium to the side with fewer gas moles. Left has 4 moles, right has 2 moles. Shift goes right.'
  },
  ...Array.from({ length: 47 }, (_, i) => ({
    id: `chem-gen-${i + 4}`,
    questionText: `What is the molecular formula of an alkane containing ${5 + i} carbon atoms (Question ${i + 4})?`,
    options: [`C${5 + i}H${12 + i * 2}`, `C${5 + i}H${10 + i * 2}`, `C${5 + i}H${8 + i * 2}`, `C${5 + i}H${6 + i * 2}`],
    correctAnswer: 'A',
    explanation: 'The general formula for alkanes is C_n H_{2n+2}.'
  }))
];
