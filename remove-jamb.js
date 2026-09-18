const fs = require('fs');
const path = require('path');

const directoriesToScan = [
    path.join(__dirname, 'src', 'app', '(app)', 'cbt-simulator', 'data'),
    path.join(__dirname, 'public', 'data', 'questions')
];

// Matches (JAMB 2013), [JAMB 2018], JAMB 2003, etc.
const pattern = /\s*[\[\(]?\s*JAMB\s*,?\s*\d{4}\s*[\]\)]?/gi;

let totalReplacements = 0;

directoriesToScan.forEach(dir => {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        if (!file.endsWith('.ts') && !file.endsWith('.json')) return;
        
        const filePath = path.join(dir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        const matchCount = (content.match(pattern) || []).length;
        if (matchCount > 0) {
            content = content.replace(pattern, '');
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Replaced ${matchCount} occurrences in ${file}`);
            totalReplacements += matchCount;
        }
    });
});

console.log(`\nTotal replacements made: ${totalReplacements}`);
