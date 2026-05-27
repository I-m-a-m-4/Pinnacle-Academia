export const accountingQuestions = [
  {
    id: 'acc-1',
    questionText: 'Which of the following describes the basic accounting equation?',
    options: [
      'Assets = Liabilities - Capital',
      'Assets = Liabilities + Capital',
      'Capital = Assets + Liabilities',
      'Liabilities = Assets + Capital'
    ],
    correctAnswer: 'B',
    explanation: 'The balance sheet equation (accounting equation) is Assets = Liabilities + Capital.'
  },
  {
    id: 'acc-2',
    questionText: 'A debit entry in a ledger account represents:',
    options: [
      'An increase in assets or expenses',
      'An increase in liabilities or capital',
      'A decrease in assets',
      'An increase in revenue'
    ],
    correctAnswer: 'A',
    explanation: 'Under double-entry bookkeeping, a debit entry increases asset and expense accounts, or decreases liability, capital, and revenue accounts.'
  },
  {
    id: 'acc-3',
    questionText: 'The process of transferring journal entries to the ledger accounts is called:',
    options: ['Balancing', 'Posting', 'Extracting', 'Auditing'],
    correctAnswer: 'B',
    explanation: 'Posting is the term used to describe the transfer of information from the books of original entry (journals) to the ledger.'
  },
  {
    id: 'acc-4',
    questionText: 'Which book of original entry is used to record credit purchases of goods?',
    options: [
      'Cash Book',
      'Purchases Journal',
      'Sales Journal',
      'General Journal'
    ],
    correctAnswer: 'B',
    explanation: 'The Purchases Journal (or Purchases Day Book) is specifically used to record credit purchases of inventory/goods.'
  },
  ...Array.from({ length: 46 }, (_, i) => ({
    id: `acc-gen-${i + 5}`,
    questionText: `A statement showing the list of ledger balances at a given date is called a (Question ${i + 5}):`,
    options: ['Trial Balance', 'Balance Sheet', 'Income Statement', 'Cash Flow Statement'],
    correctAnswer: 'A',
    explanation: 'A Trial Balance is a list of all closing ledger balances compiled to test the arithmetical accuracy of the double-entry records.'
  }))
];
