export const crsQuestions = [
  {
    id: 'crs-1',
    questionText: 'According to Genesis, what did God create on the first day?',
    options: ['Firmament', 'Land and vegetation', 'Light', 'Sun, moon and stars'],
    correctAnswer: 'C',
    explanation: 'Genesis 1:3-5 states that God created light and separated it from darkness on the first day.'
  },
  {
    id: 'crs-2',
    questionText: 'Who was the successor of Moses as the leader of Israel?',
    options: ['Aaron', 'Joshua', 'Caleb', 'Gideon'],
    correctAnswer: 'B',
    explanation: 'Joshua was commissioned by God to succeed Moses and lead the Israelites into the Promised Land.'
  },
  {
    id: 'crs-3',
    questionText: 'Where did Elijah challenge the prophets of Baal?',
    options: ['Mount Carmel', 'Mount Sinai', 'Mount Horeb', 'Mount Nebo'],
    correctAnswer: 'A',
    explanation: 'In 1 Kings 18, Elijah gathered the prophets of Baal at Mount Carmel for the test of fire.'
  },
  {
    id: 'crs-4',
    questionText: 'How many disciples did Jesus choose to form his inner circle of apostles?',
    options: ['7', '10', '12', '70'],
    correctAnswer: 'C',
    explanation: 'Jesus chose twelve disciples (apostles) as His primary companions and leaders of the early church.'
  },
  ...Array.from({ length: 46 }, (_, i) => ({
    id: `crs-gen-${i + 5}`,
    questionText: `The fruit of the Spirit, according to Galatians 5:22-23, includes which of the following (Question ${i + 5})?`,
    options: ['Love, joy, and peace', 'Power, wealth, and status', 'Wisdom, strength, and age', 'Fear, doubt, and pride'],
    correctAnswer: 'A',
    explanation: 'Galatians 5:22-23 lists the fruit of the Spirit as love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, and self-control.'
  }))
];
