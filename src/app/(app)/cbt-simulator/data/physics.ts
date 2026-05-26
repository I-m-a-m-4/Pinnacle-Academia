export const physicsQuestions = [
  {
    id: 'phys-1',
    questionText: 'A car travelling at 20 m/s decelerates uniformly to a stop over a distance of 40m. Find the magnitude of deceleration.',
    options: ['5.0 m/s²', '2.5 m/s²', '10 m/s²', '4.0 m/s²'],
    correctAnswer: 'A',
    explanation: 'Using v² = u² - 2as => 0 = 20² - 2*a*40 => 80a = 400 => a = 5.0 m/s².'
  },
  {
    id: 'phys-2',
    questionText: 'An object of mass 2kg is suspended from a spring of force constant 200 N/m. Find the period of oscillation. (Take π = 3.14)',
    options: ['0.63s', '1.26s', '0.31s', '2.00s'],
    correctAnswer: 'A',
    explanation: 'T = 2π * √(m/k) = 2 * 3.14 * √(2/200) = 6.28 * √(0.01) = 6.28 * 0.1 = 0.628s ≈ 0.63s.'
  },
  {
    id: 'phys-3',
    questionText: 'Which of the following electromagnetic waves has the highest frequency?',
    options: ['Gamma rays', 'X-rays', 'Ultraviolet rays', 'Radio waves'],
    correctAnswer: 'A',
    explanation: 'In the EM spectrum, gamma rays have the shortest wavelength and highest frequency.'
  },
  ...Array.from({ length: 47 }, (_, i) => ({
    id: `phys-gen-${i + 4}`,
    questionText: `An electrical appliance of resistance ${10 + i} ohms is connected across a ${220}V power line. What is the current drawn (Question ${i + 4})?`,
    options: [`${(220 / (10 + i)).toFixed(2)} A`, `${(220 * (10 + i)).toFixed(2)} A`, '1.5 A', '10 A'],
    correctAnswer: 'A',
    explanation: 'Using Ohm\'s law: I = V/R.'
  }))
];
