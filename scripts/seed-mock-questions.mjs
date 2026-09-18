import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin (assuming a service account or default credentials)
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });
dotenv.config({ path: path.join(__dirname, '..', '.env') });

try {
  initializeApp(); // Use default config which reads GOOGLE_APPLICATION_CREDENTIALS
} catch (error) {
  if (!/already exists/.test(error.message)) {
    console.error('Firebase initialization error', error.stack);
  }
}

const db = getFirestore();

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substring(2, 15);

const questions = [
  // Quantitative Reasoning
  {
    id: 'quant',
    name: 'Quantitative Reasoning',
    questions: [
      { id: generateId(), questionText: 'Find the missing number: 3, 8, 18, 38, 78, ?', options: ['156', '158', '160', '162'], correctAnswer: 'B' },
      { id: generateId(), questionText: 'A car travels 120 km at 60 km/h and another 180 km at 90 km/h. What is its average speed for the entire journey?', options: ['72 km/h', '75 km/h', '80 km/h', '84 km/h'], correctAnswer: 'B' },
      { id: generateId(), questionText: 'A price is increased by 25% and then reduced by 20%. What is the overall percentage change?', options: ['0%', '5% increase', '5% decrease', '10% increase'], correctAnswer: 'A' },
      { id: generateId(), questionText: 'A man completes a journey in 6 hours. If his speed is increased by 25%, how long will the same journey take?', options: ['4 hours 30 minutes', '4 hours 48 minutes', '5 hours', '5 hours 15 minutes'], correctAnswer: 'B' },
      { id: generateId(), questionText: 'The average of five numbers is 18. If one number is removed, the average of the remaining four is 16. What is the removed number?', options: ['24', '25', '26', '28'], correctAnswer: 'C' },
      { id: generateId(), questionText: 'A sum of money amounts to ₦13,200 in 2 years at simple interest. If the principal is ₦12,000, what is the annual rate?', options: ['4%', '5%', '6%', '8%'], correctAnswer: 'B' },
      { id: generateId(), questionText: 'A bag contains 4 red, 3 blue, and 5 green balls. What is the probability of selecting a ball that is not green?', options: ['5/12', '7/12', '3/7', '1/2'], correctAnswer: 'B' },
      { id: generateId(), questionText: 'If 8 workers complete a task in 15 days, how many days will 12 workers take, assuming the same rate of work?', options: ['8', '10', '12', '15'], correctAnswer: 'B' }
    ]
  },
  // Verbal Reasoning
  {
    id: 'verbal',
    name: 'Verbal Reasoning and English',
    questions: [
      { id: generateId(), questionText: 'Choose the word nearest in meaning to PRAGMATIC.', options: ['Idealistic', 'Practical', 'Emotional', 'Theoretical'], correctAnswer: 'B' },
      { id: generateId(), questionText: 'Choose the word opposite in meaning to OBSCURE.', options: ['Hidden', 'Uncertain', 'Famous', 'Complicated'], correctAnswer: 'C' },
      { id: generateId(), questionText: 'Select the grammatically correct sentence.', options: ['Neither the lecturer nor the students was present.', 'Neither the lecturer nor the students were present.', 'Neither the lecturer or the students were present.', 'Neither the lecturer and the students was present.'], correctAnswer: 'B' },
      { id: generateId(), questionText: 'Identify the part containing the error: The committee have submitted its report to the vice-chancellor.', options: ['The committee', 'have submitted', 'its report', 'to the vice-chancellor'], correctAnswer: 'B' },
      { id: generateId(), questionText: 'Choose the option that best completes the sentence: Had I known about the examination earlier, I __ better prepared.', options: ['will be', 'would be', 'would have been', 'shall have been'], correctAnswer: 'C' },
      { id: generateId(), questionText: 'In the sentence, “The manager’s response was equivocal,” the word equivocal most nearly means:', options: ['Very clear', 'Open to more than one interpretation', 'Extremely harsh', 'Completely false'], correctAnswer: 'B' },
      { id: generateId(), questionText: 'Choose the correctly punctuated sentence.', options: ['The lecturer said “Read the question carefully.”', 'The lecturer said, “Read the question carefully.”', 'The lecturer said “Read the question carefully”.', 'The lecturer, said, “Read the question carefully.”'], correctAnswer: 'B' },
      { id: generateId(), questionText: 'Which of the following is an example of a paradox?', options: ['The wind whispered through the trees.', 'The room was as cold as ice.', 'The more he learned, the less he realized he knew.', 'The sun smiled upon the village.'], correctAnswer: 'C' }
    ]
  },
  // Logical Reasoning
  {
    id: 'logical',
    name: 'Logical and Analytical Reasoning',
    questions: [
      { id: generateId(), questionText: 'All economists are researchers. Some researchers are lecturers. Which conclusion necessarily follows?', options: ['All economists are lecturers.', 'Some economists are lecturers.', 'All economists are researchers.', 'No lecturer is an economist.'], correctAnswer: 'C' },
      { id: generateId(), questionText: 'All metals conduct electricity. Copper is a metal. Therefore:', options: ['Copper may conduct electricity.', 'Copper conducts electricity.', 'Everything that conducts electricity is copper.', 'No non-metal conducts electricity.'], correctAnswer: 'B' },
      { id: generateId(), questionText: 'If BOOK is coded as CPPL, how is READ coded using the same rule?', options: ['SFBE', 'S F C E', 'Q D Z C', 'T G F E'], correctAnswer: 'A' },
      { id: generateId(), questionText: 'Find the odd one out.', options: ['16', '25', '36', '63'], correctAnswer: 'D' },
      { id: generateId(), questionText: 'A is taller than B. C is taller than A. D is shorter than B. Who is the tallest?', options: ['A', 'B', 'C', 'D'], correctAnswer: 'C' },
      { id: generateId(), questionText: 'If all the statements below are true, which conclusion must be true?\nEvery candidate who passes the mock examination studies consistently.\nTunde passed the mock examination.', options: ['Tunde studies consistently.', 'Everyone who studies consistently passes.', 'Tunde is the best candidate.', 'No candidate fails the mock examination.'], correctAnswer: 'A' },
      { id: generateId(), questionText: 'A man walks 5 km north, turns right and walks 3 km, then turns right and walks 5 km. In which direction is he from the starting point?', options: ['North', 'South', 'East', 'West'], correctAnswer: 'C' }
    ]
  },
  // General Knowledge (Literature)
  {
    id: 'general',
    name: 'General Knowledge (Literature)',
    questions: [
      { id: generateId(), questionText: 'A literary work in which a character’s apparently virtuous action produces disastrous consequences mainly illustrates the difference between', options: ['intention and consequence', 'theme and subject matter', 'plot and subplot', 'exposition and denouement'], correctAnswer: 'A' },
      { id: generateId(), questionText: 'When a writer deliberately presents an apparently minor detail that later becomes crucial to the plot, the technique is best described as', options: ['bathos', 'foreshadowing', 'anticlimax', 'flashback'], correctAnswer: 'B' },
      { id: generateId(), questionText: 'A character who serves as a contrast to another character in order to highlight the latter’s qualities is called a', options: ['confidant', 'foil', 'chorus', 'stock character'], correctAnswer: 'B' },
      { id: generateId(), questionText: 'In tragedy, hamartia is best understood as', options: ['an unavoidable flaw', 'poetic justice', 'comic relief', 'the hero\'s reward'], correctAnswer: 'A' }
    ]
  }
];

async function run() {
  try {
    // 1. Get first academy (assuming 1 academy for this platform)
    const academiesSnap = await db.collection('academies').limit(1).get();
    if (academiesSnap.empty) {
      console.log('No academies found');
      return;
    }
    const academyId = academiesSnap.docs[0].id;
    console.log(`Using Academy: ${academyId}`);

    // 2. Find the most recent mock exam
    const examsSnap = await db.collection('academies').doc(academyId).collection('mockExams')
      .orderBy('createdAt', 'desc')
      .limit(1)
      .get();
      
    let examId;
    if (examsSnap.empty) {
      console.log('No mock exams found. Creating one...');
      const newExam = await db.collection('academies').doc(academyId).collection('mockExams').add({
        academyId,
        title: 'Final Mock CBT Exam',
        startTime: Date.now(),
        durationMinutes: 60,
        status: 'pending',
        subjects: [],
        bannedEmails: [],
        createdAt: FieldValue.serverTimestamp(),
        createdBy: 'admin'
      });
      examId = newExam.id;
    } else {
      examId = examsSnap.docs[0].id;
    }
    
    console.log(`Updating Mock Exam Event: ${examId}`);

    // 3. Update the event with the generated subjects
    await db.collection('academies').doc(academyId).collection('mockExams').doc(examId).update({
      subjects: questions
    });
    
    console.log('Successfully seeded questions into the mock exam event!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding questions:', error);
    process.exit(1);
  }
}

run();
