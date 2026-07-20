import fs from 'fs';
const txt = fs.readFileSync('models.json', 'utf16le');
const match = txt.match(/"name":\s*"([^"]+)"/g);
if (match) {
    match.forEach(m => console.log(m));
}
