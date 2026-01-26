
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { characters } from './characters.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, 'public');

const missingFiles = [];
const existingFiles = [];

function checkPath(relativePath) {
    if (!relativePath) return;
    const fullPath = path.join(PUBLIC_DIR, relativePath);
    if (fs.existsSync(fullPath)) {
        existingFiles.push(relativePath);
    } else {
        missingFiles.push(relativePath);
    }
}

characters.forEach(char => {
    checkPath(char.infoImage);
    // Explicitly check new keys
    const newKeys = ['agente', 'transmision', 'prevencion_ciudadana', 'prevencion_hospitalaria', 'sistema_afectado'];

    newKeys.forEach(key => {
        const cat = char.categories[key];
        if (cat) {
            if (cat.image) checkPath(cat.image);
            if (cat.images) cat.images.forEach(img => checkPath(img));
        }
    });
});

const uniqueMissing = [...new Set(missingFiles)].sort();
console.log('--- MISSING FILES ---');
console.log(uniqueMissing.join('\n'));
console.log('--- END REPORT ---');
