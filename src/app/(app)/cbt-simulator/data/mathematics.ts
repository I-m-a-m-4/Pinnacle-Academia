export const mathematicsQuestions = [
  {
    id: 'math-1',
    questionText: 'Solve for x: log₂(x + 3) + log₂(x - 3) = 4',
    options: ['x = 4', 'x = 5', 'x = 3', 'x = 7'],
    correctAnswer: 'B',
    explanation: 'Using log rules: log₂((x+3)(x-3)) = 4 => x² - 9 = 2⁴ => x² - 9 = 16 => x² = 25 => x = 5 (since log is undefined for negative arguments).'
  },
  {
    id: 'math-2',
    questionText: 'Find the derivative of f(x) = 3x³ - 5x² + 2x - 7 at x = 2.',
    options: ['18', '24', '20', '16'],
    correctAnswer: 'A',
    explanation: 'f\'(x) = 9x² - 10x + 2. Evaluating at x = 2: f\'(2) = 9(4) - 10(2) + 2 = 36 - 20 + 2 = 18.'
  },
  {
    id: 'math-3',
    questionText: 'The sum of the first ten terms of an arithmetic progression (AP) is 150. If the first term is 6, find the common difference.',
    options: ['2', '3', '4', '1.5'],
    correctAnswer: 'A',
    explanation: 'S_n = n/2 [2a + (n-1)d] => 150 = 5 [12 + 9d] => 30 = 12 + 9d => 18 = 9d => d = 2.'
  },
  {
    id: 'math-4',
    questionText: 'A bag contains 5 red balls and 3 blue balls. If two balls are drawn at random without replacement, find the probability that both are red.',
    options: ['5/14', '25/64', '5/8', '3/14'],
    correctAnswer: 'A',
    explanation: 'P(Red then Red) = (5/8) * (4/7) = 20/56 = 5/14.'
  },
  ...Array.from({ length: 46 }, (_, i) => ({
    id: `math-gen-${i + 5}`,
    questionText: `Solve the quadratic equation (Question ${i + 5}): x² - ${5 + i}x + ${6 + i * 2} = 0. Find the sum of the roots.`,
    options: [`${5 + i}`, `${-5 - i}`, `${6 + i * 2}`, `1`],
    correctAnswer: 'A',
    explanation: 'In any quadratic equation ax² + bx + c = 0, the sum of roots is given by -b/a.'
  }))
];
