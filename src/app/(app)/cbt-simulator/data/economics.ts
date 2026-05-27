export const economicsQuestions = [
  {
    id: 'eco-1',
    questionText: 'The basic economic problem that all societies face is:',
    options: ['Inflation', 'Unemployment', 'Scarcity', 'Overpopulation'],
    correctAnswer: 'C',
    explanation: 'Scarcity is the fundamental economic problem of having seemingly unlimited human wants in a world of limited resources.'
  },
  {
    id: 'eco-2',
    questionText: 'When the price of a good increases, the quantity demanded typically:',
    options: ['Increases', 'Decreases', 'Remains constant', 'Fluctuates unpredictably'],
    correctAnswer: 'B',
    explanation: 'According to the Law of Demand, as price increases, quantity demanded decreases, assuming other factors remain constant.'
  },
  {
    id: 'eco-3',
    questionText: 'Opportunity cost is best defined as:',
    options: [
      'The monetary cost of an item purchased',
      'The alternative forgone when a choice is made',
      'The cost of production of a commodity',
      'The loss incurred during a business transaction'
    ],
    correctAnswer: 'B',
    explanation: 'Opportunity cost represents the value of the next best alternative given up when making a decision.'
  },
  {
    id: 'eco-4',
    questionText: 'A market structure with only one seller of a unique product is called a:',
    options: ['Monopoly', 'Oligopoly', 'Perfect Competition', 'Monopolistic Competition'],
    correctAnswer: 'A',
    explanation: 'A monopoly exists when a single enterprise is the sole supplier of a particular commodity or service.'
  },
  ...Array.from({ length: 46 }, (_, i) => ({
    id: `eco-gen-${i + 5}`,
    questionText: `Which of the following is a primary factor of production (Question ${i + 5})?`,
    options: ['Land', 'Money', 'Stock', 'Consumer Goods'],
    correctAnswer: 'A',
    explanation: 'The four primary factors of production are Land, Labor, Capital, and Entrepreneurship.'
  }))
];
