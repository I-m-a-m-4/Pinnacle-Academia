export const aptitudeQuestions = [
  {
    id: 'apt-1',
    questionText: 'If 5 workers can build a wall in 12 days, how many days would it take 6 workers to build the same wall, assuming they all work at the same rate?',
    options: ['10 days', '8 days', '14 days', '9 days'],
    correctAnswer: 'A',
    explanation: 'This is an inverse proportion. Workers × Days = Constant. 5 × 12 = 60. So, 6 workers × Days = 60 => Days = 10.'
  },
  {
    id: 'apt-2',
    questionText: 'Which number should come next in the pattern: 2, 6, 12, 20, 30, ___?',
    options: ['40', '42', '44', '36'],
    correctAnswer: 'B',
    explanation: 'The differences between consecutive terms are +4, +6, +8, +10. The next difference should be +12. 30 + 12 = 42.'
  },
  {
    id: 'apt-3',
    questionText: 'Find the odd one out from the following options:',
    options: ['Lagos', 'Abuja', 'Kano', 'Nairobi'],
    correctAnswer: 'D',
    explanation: 'Lagos, Abuja, and Kano are major cities in Nigeria, whereas Nairobi is the capital of Kenya.'
  },
  {
    id: 'apt-4',
    questionText: 'In a certain code language, "PINNACLE" is written as "ELCANNIP". How would "ACADEMIA" be written in that code?',
    options: ['AIMEDACA', 'ACADEMIA', 'MAIEDACA', 'AIMEADAC'],
    correctAnswer: 'A',
    explanation: 'The code simply reverses the letters of the word. Reversing "ACADEMIA" yields "AIMEDACA".'
  },
  ...Array.from({ length: 46 }, (_, i) => {
    const qNum = i + 5;
    return {
      id: `apt-gen-${qNum}`,
      questionText: `Logical Reasoning Question ${qNum}: If all students in Pinnacle Academia are excellent, and Tobi is a student of Pinnacle Academia, then:`,
      options: ['Tobi might be excellent', 'Tobi is excellent', 'Tobi is not excellent', 'Tobi is average'],
      correctAnswer: 'B',
      explanation: 'Since Tobi is a member of the set of students, and all members of that set are excellent, Tobi must be excellent.'
    };
  })
];
