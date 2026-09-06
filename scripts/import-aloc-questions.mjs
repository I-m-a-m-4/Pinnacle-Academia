import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = 'QB-729b0baa3754867da9a5';
const BASE_URL = 'https://questions.aloc.com.ng/api/v2/q/40';

const subjectsMap = [
    { aloc: 'english', file: 'use-of-english.ts', exportName: 'englishQuestions' },
    { aloc: 'mathematics', file: 'mathematics.ts', exportName: 'mathematicsQuestions' },
    { aloc: 'physics', file: 'physics.ts', exportName: 'physicsQuestions' },
    { aloc: 'chemistry', file: 'chemistry.ts', exportName: 'chemistryQuestions' },
    { aloc: 'biology', file: 'biology.ts', exportName: 'biologyQuestions' },
    { aloc: 'government', file: 'government.ts', exportName: 'governmentQuestions' },
    { aloc: 'englishlit', file: 'literature.ts', exportName: 'literatureQuestions' },
    { aloc: 'economics', file: 'economics.ts', exportName: 'economicsQuestions' },
    { aloc: 'accounting', file: 'accounting.ts', exportName: 'accountingQuestions' },
    { aloc: 'crk', file: 'crs.ts', exportName: 'crsQuestions' },
    { aloc: 'geography', file: 'geography.ts', exportName: 'geographyQuestions' },
    { aloc: 'commerce', file: 'commerce.ts', exportName: 'commerceQuestions' },
    { aloc: 'irk', file: 'irk.ts', exportName: 'irkQuestions' },
    { aloc: 'civiledu', file: 'civic-education.ts', exportName: 'civicEducationQuestions' },
    { aloc: 'insurance', file: 'insurance.ts', exportName: 'insuranceQuestions' },
    { aloc: 'currentaffairs', file: 'current-affairs.ts', exportName: 'currentAffairsQuestions' },
    { aloc: 'history', file: 'history.ts', exportName: 'historyQuestions' },
];

const DATA_DIR = path.join(__dirname, '..', 'src', 'app', '(app)', 'cbt-simulator', 'data');
const MAX_PAGES_PER_SUBJECT = 25; // 25 * 40 = 1000 questions attempted

function loadExistingQuestions(filePath, exportName) {
    if (!fs.existsSync(filePath)) return [];
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        // Look for `export const <exportName> = [...];`
        const jsonMatch = content.match(new RegExp(`export\\s+const\\s+${exportName}\\s*=\\s*(\\[[\\s\\S]*\\]);?\\s*$`));
        if (jsonMatch && jsonMatch[1]) {
            return JSON.parse(jsonMatch[1]);
        }
    } catch (e) {
        console.warn(`Could not parse JSON from ${filePath}: ${e.message}`);
    }
    return [];
}

function normalizeText(text) {
    if (!text) return '';
    return text.toLowerCase().replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').replace(/\(jamb\s*\d{4}\)/gi, '').trim();
}

async function fetchQuestionsForSubject(subject, seenKeys) {
    let newItems = [];
    let consecutiveEmptyCount = 0;

    for (let page = 0; page < MAX_PAGES_PER_SUBJECT; page++) {
        process.stdout.write(`\r  Fetching batch ${page + 1}/${MAX_PAGES_PER_SUBJECT} for ${subject}... (new so far: ${newItems.length})`);
        try {
            const response = await fetch(`${BASE_URL}?subject=${subject}`, {
                headers: {
                    'AccessToken': API_KEY,
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                console.error(`\nFailed batch ${page + 1}: ${response.status} ${response.statusText}`);
                continue;
            }

            const data = await response.json();
            const batch = data.data || [];
            let batchNew = 0;

            for (const q of batch) {
                const norm = normalizeText(q.question);
                const idKey = `aloc-${q.id}`;
                if (!seenKeys.has(idKey) && !seenKeys.has(norm)) {
                    seenKeys.add(idKey);
                    seenKeys.add(norm);
                    newItems.push(q);
                    batchNew++;
                }
            }

            if (batchNew === 0) {
                consecutiveEmptyCount++;
                if (consecutiveEmptyCount >= 4) {
                    console.log(`\n  Subject pool reached saturation after batch ${page + 1}.`);
                    break;
                }
            } else {
                consecutiveEmptyCount = 0;
            }

            await new Promise(r => setTimeout(r, 600));
        } catch (err) {
            console.error(`\nError fetching ${subject}:`, err.message);
            await new Promise(r => setTimeout(r, 1000));
        }
    }
    console.log('');
    return newItems;
}

function mapToAppFormat(alocData, subjectPrefix) {
    return alocData.map((q, index) => {
        let correctLetter = 'A';
        if (q.answer) {
            correctLetter = q.answer.trim().toUpperCase().charAt(0);
        }

        const optionsArray = [
            q.option?.a || '',
            q.option?.b || '',
            q.option?.c || '',
            q.option?.d || ''
        ].map(opt => opt.replace(/\s+/g, ' ').trim());

        let validOptions = optionsArray.filter(opt => opt !== '');
        if (validOptions.length < 4) {
            validOptions = [...validOptions, 'None of the above', 'All of the above', 'Cannot be determined'].slice(0, 4);
        }

        const yearStr = q.examyear ? ` (JAMB ${q.examyear})` : '';

        return {
            id: `${subjectPrefix}-${Date.now()}-${index}-${q.id}`,
            questionText: `${q.question}${yearStr}`,
            options: validOptions,
            correctAnswer: correctLetter,
            explanation: q.solution ? q.solution.trim() : `The correct answer is ${correctLetter}.`
        };
    });
}

async function run() {
    console.log('=== Starting ALOC Comprehensive Question Harvester ===\n');

    for (const sub of subjectsMap) {
        console.log(`\n>>> Processing subject: ${sub.aloc} (Target: ${sub.file})`);
        const filePath = path.join(DATA_DIR, sub.file);
        
        // Load existing
        const existing = loadExistingQuestions(filePath, sub.exportName);
        console.log(`  Existing questions in file: ${existing.length}`);

        const seenKeys = new Set();
        for (const item of existing) {
            if (item.id) seenKeys.add(item.id);
            const norm = normalizeText(item.questionText);
            if (norm) seenKeys.add(norm);
        }

        // Fetch fresh questions
        const rawNew = await fetchQuestionsForSubject(sub.aloc, seenKeys);
        const formattedNew = mapToAppFormat(rawNew, sub.aloc);

        const totalMerged = [...existing, ...formattedNew];
        console.log(`  Total questions now: ${totalMerged.length} (+${formattedNew.length} newly added)`);

        const fileContent = `export const ${sub.exportName} = ${JSON.stringify(totalMerged, null, 2)};\n`;
        fs.writeFileSync(filePath, fileContent);
        console.log(`  Successfully saved ${sub.file}`);
    }

    console.log('\n=== All 17 ALOC Subjects Successfully Updated! ===');
}

run();
