import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = 'QB-729b0baa3754867da9a5';
const BASE_URL = 'https://questions.aloc.com.ng/api/v2/q/40';

const subjectsMap = [
    { aloc: 'biology', file: 'biology.ts', exportName: 'biologyQuestions' },
    { aloc: 'chemistry', file: 'chemistry.ts', exportName: 'chemistryQuestions' },
    { aloc: 'physics', file: 'physics.ts', exportName: 'physicsQuestions' },
    { aloc: 'mathematics', file: 'mathematics.ts', exportName: 'mathematicsQuestions' },
    { aloc: 'english', file: 'use-of-english.ts', exportName: 'englishQuestions' },
    { aloc: 'englishlit', file: 'literature.ts', exportName: 'literatureQuestions' },
    { aloc: 'economics', file: 'economics.ts', exportName: 'economicsQuestions' },
    { aloc: 'government', file: 'government.ts', exportName: 'governmentQuestions' },
    { aloc: 'geography', file: 'geography.ts', exportName: 'geographyQuestions' },
    { aloc: 'accounting', file: 'accounting.ts', exportName: 'accountingQuestions' },
    { aloc: 'commerce', file: 'commerce.ts', exportName: 'commerceQuestions' },
    { aloc: 'crk', file: 'crs.ts', exportName: 'crsQuestions' },
    { aloc: 'civiledu', file: 'civic-education.ts', exportName: 'civicEducationQuestions' },
    { aloc: 'insurance', file: 'insurance.ts', exportName: 'insuranceQuestions' },
    { aloc: 'history', file: 'history.ts', exportName: 'historyQuestions' },
    { aloc: 'irk', file: 'irk.ts', exportName: 'irkQuestions' },
    { aloc: 'currentaffairs', file: 'current-affairs.ts', exportName: 'currentAffairsQuestions' },
];

const DATA_DIR = path.join(__dirname, '..', 'src', 'app', '(app)', 'cbt-simulator', 'data');

// Years to scan
const SCAN_YEARS = [
    2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009,
    2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019,
    2020, 2021, 2022, 2023, 1995, 1996, 1997, 1998, 1999
];

function loadExistingQuestions(filePath, exportName) {
    if (!fs.existsSync(filePath)) return [];
    try {
        const content = fs.readFileSync(filePath, 'utf8');
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
    return text.toLowerCase()
        .replace(/<[^>]+>/g, '')
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

async function fetchBatch(url) {
    try {
        const res = await fetch(url, {
            headers: {
                'AccessToken': API_KEY,
                'Accept': 'application/json'
            }
        });
        if (!res.ok) return [];
        const data = await res.json();
        return data.data || [];
    } catch (err) {
        return [];
    }
}

function processBatch(batch, seenKeys, newItems) {
    let added = 0;
    for (const q of batch) {
        if (!q.question || !q.option) continue;
        const norm = normalizeText(q.question);
        const idKey = `aloc-${q.id}`;
        if (!seenKeys.has(idKey) && !seenKeys.has(norm)) {
            seenKeys.add(idKey);
            seenKeys.add(norm);
            newItems.push(q);
            added++;
        }
    }
    return added;
}

function mapToAppFormat(alocData, subjectPrefix) {
    return alocData.map((q, index) => {
        let correctLetter = 'A';
        if (q.answer) {
            correctLetter = q.answer.trim().toUpperCase().charAt(0);
            if (!['A', 'B', 'C', 'D'].includes(correctLetter)) {
                correctLetter = 'A';
            }
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
            explanation: q.solution && q.solution.trim().length > 0 
                ? q.solution.trim() 
                : `The correct option is (${correctLetter}).`
        };
    });
}

async function run() {
    console.log('=====================================================');
    console.log('  ALOC Comprehensive Multi-Year Question Harvester  ');
    console.log('=====================================================\n');

    let grandTotalNew = 0;

    for (const sub of subjectsMap) {
        console.log(`\n=====================================================`);
        console.log(`>>> Subject: ${sub.aloc.toUpperCase()} (Target: ${sub.file})`);
        const filePath = path.join(DATA_DIR, sub.file);

        // 1. Load existing
        const existing = loadExistingQuestions(filePath, sub.exportName);
        console.log(`  Initial existing questions: ${existing.length}`);

        const seenKeys = new Set();
        for (const item of existing) {
            if (item.id) seenKeys.add(item.id);
            const norm = normalizeText(item.questionText);
            if (norm) seenKeys.add(norm);
        }

        const newItems = [];

        // 2. Scan year-by-year
        console.log(`  Scanning 29 exam years...`);
        for (const yr of SCAN_YEARS) {
            const url = `${BASE_URL}?subject=${sub.aloc}&year=${yr}`;
            const batch = await fetchBatch(url);
            const added = processBatch(batch, seenKeys, newItems);
            if (added > 0) {
                process.stdout.write(`+${added}[${yr}] `);
            }
            await new Promise(r => setTimeout(r, 200));
        }
        console.log(`\n  After year scan: +${newItems.length} unique questions.`);

        // 3. Scan Post-UTME pool
        console.log(`  Scanning Post-UTME pool...`);
        for (let i = 0; i < 6; i++) {
            const url = `${BASE_URL}?subject=${sub.aloc}&type=post-utme`;
            const batch = await fetchBatch(url);
            processBatch(batch, seenKeys, newItems);
            await new Promise(r => setTimeout(r, 200));
        }

        // 4. Scan WAEC pool (great for all core subjects, history, irk, civiledu, current affairs)
        console.log(`  Scanning WAEC/WASSCE pool...`);
        for (let i = 0; i < 6; i++) {
            const url = `${BASE_URL}?subject=${sub.aloc}&type=waec`;
            const batch = await fetchBatch(url);
            processBatch(batch, seenKeys, newItems);
            await new Promise(r => setTimeout(r, 200));
        }

        // 5. Scan random batches
        for (let i = 0; i < 4; i++) {
            const url = `${BASE_URL}?subject=${sub.aloc}`;
            const batch = await fetchBatch(url);
            processBatch(batch, seenKeys, newItems);
            await new Promise(r => setTimeout(r, 200));
        }

        // Format and merge
        const formattedNew = mapToAppFormat(newItems, sub.aloc);
        const totalMerged = [...existing, ...formattedNew];
        grandTotalNew += formattedNew.length;

        console.log(`  Final count for ${sub.file}: ${totalMerged.length} (+${formattedNew.length} new)`);

        // Save immediately to disk
        const fileContent = `export const ${sub.exportName} = ${JSON.stringify(totalMerged, null, 2)};\n`;
        fs.writeFileSync(filePath, fileContent);
        console.log(`  Saved to ${sub.file}`);
    }

    console.log('\n=====================================================');
    console.log(`  COMPLETE! Added a total of ${grandTotalNew} NEW questions!`);
    console.log('=====================================================\n');
}

run();
